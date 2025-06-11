import asyncio
import logging
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from decimal import Decimal

from ...domain.models import TradingSignal, SignalType, Trade
from ...domain.repositories import ITradeRepository, IPositionRepository, IMarketDataRepository
from ...domain.services.trading_engine import ITradingEngine
from ...infrastructure.external.bybit.bybit_client import BybitClient
from ...strategies.base_strategy import BaseStrategy
from ...strategies.trend_following_strategy import TrendFollowingStrategy
from ...strategies.rsi_macd_strategy import RsiMacdStrategy
from ...strategies.breakout_strategy import BreakoutStrategy
from ...strategies.volume_strategy import VolumeStrategy
from ...config.settings import Settings


logger = logging.getLogger(__name__)


class TradingOrchestrator:
    """Hlavní orchestrator pro řízení obchodování"""
    
    def __init__(
        self,
        settings: Settings,
        bybit_client: BybitClient,
        trading_engine: ITradingEngine,
        trade_repository: ITradeRepository,
        position_repository: IPositionRepository,
        market_data_repository: IMarketDataRepository
    ):
        self.settings = settings
        self.bybit_client = bybit_client
        self.trading_engine = trading_engine
        self.trade_repository = trade_repository
        self.position_repository = position_repository
        self.market_data_repository = market_data_repository
        
        # Inicializace strategií
        self.strategies: List[BaseStrategy] = []
        self._init_strategies()
        
        # Kontrolní proměnné
        self.is_running = False
        self.last_analysis_time: Dict[str, datetime] = {}
    
    def _init_strategies(self):
        """Inicializuje obchodní strategie"""
        for name, config in self.settings.strategies.items():
            if not config.enabled:
                continue
                
            try:
                if name == "trend_following":
                    strategy = TrendFollowingStrategy(config)
                elif name == "rsi_macd":
                    strategy = RsiMacdStrategy(config)
                elif name == "breakout":
                    strategy = BreakoutStrategy(config)
                elif name == "volume":
                    strategy = VolumeStrategy(config)
                else:
                    logger.warning(f"Neznámá strategie: {name}")
                    continue
                
                self.strategies.append(strategy)
                logger.info(f"Inicializována strategie: {name}")
                
            except Exception as e:
                logger.error(f"Chyba při inicializaci strategie {name}: {e}")
    
    async def start(self):
        """Spustí trading orchestrator"""
        logger.info("Spouštím Trading Orchestrator...")
        self.is_running = True
        
        try:
            while self.is_running:
                await self._run_trading_cycle()
                await asyncio.sleep(self.settings.trading.refresh_interval)
                
        except Exception as e:
            logger.error(f"Chyba v trading cyklu: {e}")
            self.is_running = False
    
    async def stop(self):
        """Zastaví trading orchestrator"""
        logger.info("Zastavuji Trading Orchestrator...")
        self.is_running = False
    
    async def _run_trading_cycle(self):
        """Spustí jeden cyklus analýzy a obchodování"""
        logger.info("Spouštím trading cyklus...")
        
        try:
            # Projdi všechny symboly
            for symbol in self.settings.trading.default_symbols:
                await self._analyze_symbol(symbol)
                
        except Exception as e:
            logger.error(f"Chyba v trading cyklu: {e}")
    
    async def _analyze_symbol(self, symbol: str):
        """Analyzuje jeden symbol všemi strategiemi"""
        try:
            # Zkontroluj, zda už nebyl symbol nedávno analyzován
            if self._should_skip_analysis(symbol):
                return
            
            logger.info(f"Analyzuji symbol: {symbol}")
            
            # Získej tržní data
            candles = await self.bybit_client.get_klines(
                symbol=symbol,
                interval="15",  # 15-minutové svíčky
                limit=200
            )
            
            if not candles:
                logger.warning(f"Nepodařilo se získat data pro {symbol}")
                return
            
            # Uložit data do cache/databáze
            for candle in candles[-10:]:  # Ulož posledních 10 svíček
                await self.market_data_repository.save_candle(candle)
            
            # Spusť analýzu všemi strategiemi
            signals = []
            for strategy in self.strategies:
                try:
                    signal = await strategy.analyze(candles, symbol)
                    if signal:
                        signals.append(signal)
                        logger.info(f"Signál od {strategy.name}: {signal.signal_type.value} pro {symbol}")
                        
                except Exception as e:
                    logger.error(f"Chyba ve strategii {strategy.name}: {e}")
            
            # Vyhodnoť signály a rozhodni o obchodu
            if signals:
                await self._process_signals(signals, symbol)
            
            # Aktualizuj čas poslední analýzy
            self.last_analysis_time[symbol] = datetime.now()
            
        except Exception as e:
            logger.error(f"Chyba při analýze symbolu {symbol}: {e}")
    
    def _should_skip_analysis(self, symbol: str) -> bool:
        """Zkontroluje, zda přeskočit analýzu symbolu"""
        if symbol not in self.last_analysis_time:
            return False
        
        # Minimální interval mezi analýzami (5 minut)
        min_interval = timedelta(minutes=5)
        time_diff = datetime.now() - self.last_analysis_time[symbol]
        
        return time_diff < min_interval
    
    async def _process_signals(self, signals: List[TradingSignal], symbol: str):
        """Zpracuje signály a rozhodne o obchodu"""
        try:
            # Zkontroluj, zda už nemáme pozici pro tento symbol
            existing_position = await self.position_repository.get_position_by_symbol(symbol)
            
            # Kombinuj signály podle váhy strategií
            buy_strength = 0.0
            sell_strength = 0.0
            
            for signal in signals:
                strategy_weight = self._get_strategy_weight(signal.strategy_name)
                signal_strength = signal.confidence * strategy_weight
                
                if signal.signal_type == SignalType.BUY:
                    buy_strength += signal_strength
                elif signal.signal_type == SignalType.SELL:
                    sell_strength += signal_strength
            
            # Rozhodnutí o obchodu
            min_strength = 0.8  # Minimální síla pro obchod
            
            if buy_strength > sell_strength and buy_strength > min_strength:
                if not existing_position or existing_position.side.value != "buy":
                    await self._execute_buy_signal(signals, symbol, buy_strength)
                    
            elif sell_strength > buy_strength and sell_strength > min_strength:
                if not existing_position or existing_position.side.value != "sell":
                    await self._execute_sell_signal(signals, symbol, sell_strength)
            
            # Zkontroluj risk management
            await self._check_risk_management()
            
        except Exception as e:
            logger.error(f"Chyba při zpracování signálů pro {symbol}: {e}")
    
    def _get_strategy_weight(self, strategy_name: str) -> float:
        """Získá váhu strategie"""
        for strategy in self.strategies:
            if strategy.name == strategy_name:
                return strategy.weight
        return 1.0
    
    async def _execute_buy_signal(self, signals: List[TradingSignal], symbol: str, strength: float):
        """Vykoná BUY signál"""
        try:
            # Najdi nejsilnější BUY signál
            best_signal = max(
                [s for s in signals if s.signal_type == SignalType.BUY],
                key=lambda x: x.confidence
            )
            
            logger.info(f"Vykonávám BUY pro {symbol} se silou {strength:.2f}")
            
            # Vypočítej velikost pozice
            account_balance = await self.bybit_client.get_account_balance()
            position_size = await self.trading_engine.calculate_position_size(
                best_signal, account_balance, 0.02  # 2% risk
            )
            
            # Omeň velikost pozice podle konfigurace
            max_position_usd = self.settings.trading.risk_management.max_position_size_usd
            if position_size * best_signal.price > max_position_usd:
                position_size = max_position_usd / best_signal.price
            
            best_signal.suggested_position_size = position_size
            
            # Vykonej obchod
            trade = await self.trading_engine.execute_trade(best_signal)
            if trade:
                logger.info(f"BUY obchod vykonán: {trade.id}")
                
                # Pošli objednávku na burzu
                order_id = await self.bybit_client.place_order(
                    symbol=symbol,
                    side="buy",
                    qty=position_size,
                    order_type="Market",
                    stop_loss=best_signal.suggested_stop_loss,
                    take_profit=best_signal.suggested_take_profit
                )
                
                if order_id:
                    trade.exchange_order_id = order_id
                    trade.status = "executed"
                    await self.trade_repository.update_trade(trade)
            
        except Exception as e:
            logger.error(f"Chyba při vykonávání BUY signálu: {e}")
    
    async def _execute_sell_signal(self, signals: List[TradingSignal], symbol: str, strength: float):
        """Vykoná SELL signál"""
        try:
            # Najdi nejsilnější SELL signál
            best_signal = max(
                [s for s in signals if s.signal_type == SignalType.SELL],
                key=lambda x: x.confidence
            )
            
            logger.info(f"Vykonávám SELL pro {symbol} se silou {strength:.2f}")
            
            # Pro SELL nejdříve uzavři existující pozici
            await self.trading_engine.close_position(symbol)
            
            # Pak případně otevři short pozici (pokud je povoleno)
            # TODO: Implementace short pozic
            
        except Exception as e:
            logger.error(f"Chyba při vykonávání SELL signálu: {e}")
    
    async def _check_risk_management(self):
        """Zkontroluje risk management pravidla"""
        try:
            # Zkontroluj počet otevřených pozic
            positions = await self.position_repository.get_all_positions()
            max_positions = self.settings.trading.risk_management.max_positions
            
            if len(positions) > max_positions:
                logger.warning(f"Překročen maximální počet pozic: {len(positions)}/{max_positions}")
            
            # Zkontroluj denní ztráty
            today = datetime.now().date()
            today_start = datetime.combine(today, datetime.min.time())
            today_end = datetime.combine(today, datetime.max.time())
            
            today_trades = await self.trade_repository.get_trades_by_date_range(
                today_start, today_end
            )
            
            daily_pnl = sum(trade.pnl for trade in today_trades if trade.pnl)
            max_daily_loss = self.settings.trading.risk_management.max_daily_loss_usd
            
            if daily_pnl < -max_daily_loss:
                logger.error(f"Překročena maximální denní ztráta: {daily_pnl}")
                await self.stop()  # Zastaví obchodování
            
        except Exception as e:
            logger.error(f"Chyba v risk managementu: {e}")
    
    async def get_status(self) -> Dict:
        """Vrátí status orchestratoru"""
        try:
            positions = await self.position_repository.get_all_positions()
            open_trades = await self.trade_repository.get_open_trades()
            
            return {
                "is_running": self.is_running,
                "strategies_count": len(self.strategies),
                "active_strategies": [s.name for s in self.strategies if s.enabled],
                "positions_count": len(positions),
                "open_trades_count": len(open_trades),
                "last_analysis": self.last_analysis_time,
                "symbols": self.settings.trading.default_symbols
            }
            
        except Exception as e:
            logger.error(f"Chyba při získávání statusu: {e}")
            return {"error": str(e)}