#!/usr/bin/env python3
"""
Bybit Trading Assistant - Hlavní aplikace
"""

import asyncio
import logging
import signal
import sys
from pathlib import Path

# Přidej src do cesty
sys.path.append(str(Path(__file__).parent))

from src.config.settings import get_settings
from src.infrastructure.external.bybit.bybit_client import BybitClient
from src.infrastructure.persistence.database.sqlite_trade_repository import (
    SqliteTradeRepository, SqlitePositionRepository
)
from src.infrastructure.persistence.database.sqlite_market_data_repository import SqliteMarketDataRepository
from src.domain.services.trading_engine import TradingEngine
from src.application.services.trading_orchestrator import TradingOrchestrator


# Konfigurace loggingu
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/trading_assistant.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


class TradingApplication:
    """Hlavní třída aplikace"""
    
    def __init__(self):
        self.settings = get_settings()
        self.orchestrator: TradingOrchestrator = None
        self.bybit_client: BybitClient = None
        
        # Vytvoř potřebné složky
        Path("logs").mkdir(exist_ok=True)
        Path("data").mkdir(exist_ok=True)
    
    async def initialize(self):
        """Inicializuje aplikaci"""
        logger.info("Inicializuji Trading Assistant...")
        
        try:
            # Zkontroluj API klíče
            if not self.settings.api.bybit_api_key or not self.settings.api.bybit_api_secret:
                logger.error("Chybí Bybit API klíče! Zkontroluj konfiguraci.")
                return False
            
            # Inicializuj Bybit klienta
            self.bybit_client = BybitClient(
                api_key=self.settings.api.bybit_api_key,
                api_secret=self.settings.api.bybit_api_secret,
                testnet=self.settings.api.bybit_testnet
            )
            
            # Test připojení
            async with self.bybit_client:
                balance = await self.bybit_client.get_account_balance()
                logger.info(f"Připojení k Bybit úspěšné. Zůstatek: {balance} USDT")
            
            # Inicializuj repository
            db_path = self.settings.database.path
            trade_repository = SqliteTradeRepository(db_path)
            position_repository = SqlitePositionRepository(db_path)
            market_data_repository = SqliteMarketDataRepository(db_path)
            
            # Inicializuj trading engine
            trading_engine = TradingEngine(trade_repository, position_repository)
            
            # Inicializuj orchestrator
            self.orchestrator = TradingOrchestrator(
                settings=self.settings,
                bybit_client=self.bybit_client,
                trading_engine=trading_engine,
                trade_repository=trade_repository,
                position_repository=position_repository,
                market_data_repository=market_data_repository
            )
            
            logger.info("Aplikace úspěšně inicializována")
            return True
            
        except Exception as e:
            logger.error(f"Chyba při inicializaci: {e}")
            return False
    
    async def run(self):
        """Spustí aplikaci"""
        if not await self.initialize():
            return
        
        logger.info("Spouštím Trading Assistant...")
        
        # Nastav signal handlery pro graceful shutdown
        def signal_handler(signum, frame):
            logger.info(f"Přijat signál {signum}, ukončuji aplikaci...")
            asyncio.create_task(self.shutdown())
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        try:
            # Spusť orchestrator
            async with self.bybit_client:
                await self.orchestrator.start()
                
        except KeyboardInterrupt:
            logger.info("Ukončuji na požádání uživatele...")
        except Exception as e:
            logger.error(f"Neočekávaná chyba: {e}")
        finally:
            await self.shutdown()
    
    async def shutdown(self):
        """Ukončí aplikaci"""
        logger.info("Ukončuji Trading Assistant...")
        
        if self.orchestrator:
            await self.orchestrator.stop()
        
        if self.bybit_client and self.bybit_client.session:
            await self.bybit_client.session.close()
        
        logger.info("Aplikace ukončena")


async def main():
    """Hlavní funkce"""
    app = TradingApplication()
    await app.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nUkončuji...")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Kritická chyba: {e}")
        sys.exit(1)