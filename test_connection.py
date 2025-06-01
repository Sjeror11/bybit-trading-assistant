#!/usr/bin/env python3
"""
Test připojení k Bybit API
"""

import sys
import asyncio
from pathlib import Path

# Přidej src složku do Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.config.settings import get_settings
from src.infrastructure.external.bybit.bybit_client import BybitClient


async def test_connection():
    """Testuje připojení k Bybit API"""
    print("🔗 Testuji připojení k Bybit API...")
    
    # Načti konfiguraci
    settings = get_settings()
    
    if not settings.api.bybit_api_key or not settings.api.bybit_api_secret:
        print("❌ Chybí API klíče v konfiguraci!")
        print("📝 Zkontroluj soubor config/config.json nebo environment proměnné")
        return False
    
    print(f"🔑 API Key: {settings.api.bybit_api_key[:8]}...")
    print(f"🌐 Testnet: {settings.api.bybit_testnet}")
    print(f"⚙️ Trading Enabled: {settings.api.trading_enabled}")
    
    try:
        # Vytvoř klienta
        client = BybitClient(
            api_key=settings.api.bybit_api_key,
            api_secret=settings.api.bybit_api_secret,
            testnet=settings.api.bybit_testnet
        )
        
        async with client:
            # Test připojení
            print("📡 Testuji připojení...")
            balance = await client.get_account_balance()
            print(f"✅ Připojení úspěšné!")
            print(f"💰 Zůstatek: {balance} USDT")
            
            # Test market data
            print("\n📊 Testuji tržní data...")
            ticker = await client.get_ticker("BTCUSDT")
            if ticker:
                print(f"✅ BTC cena: ${ticker.last_price}")
            
            # Test klines
            candles = await client.get_klines("BTCUSDT", limit=5)
            if candles:
                print(f"✅ Získáno {len(candles)} svíček")
                latest = candles[-1]
                print(f"   Poslední svíčka: O:{latest.open} H:{latest.high} L:{latest.low} C:{latest.close}")
            
            print("\n🎉 Všechny testy proběhly úspěšně!")
            return True
            
    except Exception as e:
        print(f"❌ Chyba při testování: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)