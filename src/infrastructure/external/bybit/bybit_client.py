import asyncio
import aiohttp
import hashlib
import hmac
import time
from typing import Dict, List, Optional, Any
from decimal import Decimal
from datetime import datetime
import json
import logging

from ....domain.models import Candle, Ticker, Trade, Position, TradeType, OrderBook


logger = logging.getLogger(__name__)


class BybitApiError(Exception):
    """Bybit API chyba"""
    pass


class BybitClient:
    """Asynchronní Bybit API klient"""
    
    def __init__(self, api_key: str, api_secret: str, testnet: bool = True):
        self.api_key = api_key
        self.api_secret = api_secret
        self.testnet = testnet
        
        if testnet:
            self.base_url = "https://api-testnet.bybit.com"
        else:
            self.base_url = "https://api.bybit.com"
        
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        """Async context manager vstup"""
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager výstup"""
        if self.session:
            await self.session.close()
    
    def _generate_signature(self, timestamp: str, params: str) -> str:
        """Generuje API podpis"""
        param_str = f"{timestamp}{self.api_key}{params}"
        return hmac.new(
            self.api_secret.encode('utf-8'),
            param_str.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
    
    async def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        params: Optional[Dict] = None,
        authenticated: bool = False
    ) -> Dict:
        """Vytvoří HTTP request na Bybit API"""
        if not self.session:
            raise BybitApiError("Session není inicializována")
        
        url = f"{self.base_url}{endpoint}"
        headers = {
            "Content-Type": "application/json"
        }
        
        if authenticated:
            timestamp = str(int(time.time() * 1000))
            
            if method.upper() == "GET":
                query_string = "&".join([f"{k}={v}" for k, v in (params or {}).items()])
                signature = self._generate_signature(timestamp, query_string)
                headers.update({
                    "X-BAPI-API-KEY": self.api_key,
                    "X-BAPI-TIMESTAMP": timestamp,
                    "X-BAPI-SIGN": signature
                })
            else:
                json_params = json.dumps(params or {})
                signature = self._generate_signature(timestamp, json_params)
                headers.update({
                    "X-BAPI-API-KEY": self.api_key,
                    "X-BAPI-TIMESTAMP": timestamp,
                    "X-BAPI-SIGN": signature
                })
        
        try:
            if method.upper() == "GET":
                async with self.session.get(url, params=params, headers=headers) as response:
                    data = await response.json()
            else:
                async with self.session.post(url, json=params, headers=headers) as response:
                    data = await response.json()
            
            if data.get("retCode") != 0:
                raise BybitApiError(f"API chyba: {data.get('retMsg', 'Neznámá chyba')}")
            
            return data.get("result", {})
            
        except aiohttp.ClientError as e:
            raise BybitApiError(f"HTTP chyba: {e}")
        except Exception as e:
            raise BybitApiError(f"Neočekávaná chyba: {e}")
    
    # Market Data metody
    async def get_klines(
        self, 
        symbol: str, 
        interval: str = "1", 
        limit: int = 200,
        start_time: Optional[int] = None,
        end_time: Optional[int] = None
    ) -> List[Candle]:
        """Získá historická OHLCV data"""
        params = {
            "category": "linear",
            "symbol": symbol,
            "interval": interval,
            "limit": limit
        }
        
        if start_time:
            params["start"] = start_time
        if end_time:
            params["end"] = end_time
        
        try:
            data = await self._make_request("GET", "/v5/market/kline", params)
            candles = []
            
            for item in data.get("list", []):
                candle = Candle(
                    symbol=symbol,
                    timestamp=datetime.fromtimestamp(int(item[0]) / 1000),
                    open=Decimal(item[1]),
                    high=Decimal(item[2]),
                    low=Decimal(item[3]),
                    close=Decimal(item[4]),
                    volume=Decimal(item[5])
                )
                candles.append(candle)
            
            return sorted(candles, key=lambda x: x.timestamp)
            
        except Exception as e:
            logger.error(f"Chyba při získávání klines pro {symbol}: {e}")
            return []
    
    async def get_ticker(self, symbol: str) -> Optional[Ticker]:
        """Získá aktuální ticker data"""
        params = {
            "category": "linear",
            "symbol": symbol
        }
        
        try:
            data = await self._make_request("GET", "/v5/market/tickers", params)
            ticker_data = data.get("list", [])
            
            if not ticker_data:
                return None
            
            item = ticker_data[0]
            return Ticker(
                symbol=symbol,
                last_price=Decimal(item.get("lastPrice", "0")),
                bid_price=Decimal(item.get("bid1Price", "0")),
                ask_price=Decimal(item.get("ask1Price", "0")),
                volume_24h=Decimal(item.get("volume24h", "0")),
                price_change_24h=Decimal(item.get("price24hPcnt", "0")),
                price_change_percent_24h=float(item.get("price24hPcnt", "0")) * 100,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error(f"Chyba při získávání ticker pro {symbol}: {e}")
            return None
    
    async def get_orderbook(self, symbol: str, limit: int = 25) -> Optional[OrderBook]:
        """Získá order book"""
        params = {
            "category": "linear",
            "symbol": symbol,
            "limit": limit
        }
        
        try:
            data = await self._make_request("GET", "/v5/market/orderbook", params)
            
            bids = [(Decimal(bid[0]), Decimal(bid[1])) for bid in data.get("b", [])]
            asks = [(Decimal(ask[0]), Decimal(ask[1])) for ask in data.get("a", [])]
            
            return OrderBook(
                symbol=symbol,
                bids=bids,
                asks=asks,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error(f"Chyba při získávání orderbook pro {symbol}: {e}")
            return None
    
    # Trading metody
    async def place_order(
        self,
        symbol: str,
        side: str,
        qty: Decimal,
        order_type: str = "Market",
        price: Optional[Decimal] = None,
        stop_loss: Optional[Decimal] = None,
        take_profit: Optional[Decimal] = None
    ) -> Optional[str]:
        """Zadá objednávku na burzu"""
        params = {
            "category": "linear",
            "symbol": symbol,
            "side": side.capitalize(),
            "orderType": order_type,
            "qty": str(qty)
        }
        
        if price and order_type != "Market":
            params["price"] = str(price)
        
        if stop_loss:
            params["stopLoss"] = str(stop_loss)
            
        if take_profit:
            params["takeProfit"] = str(take_profit)
        
        try:
            data = await self._make_request("POST", "/v5/order/create", params, authenticated=True)
            return data.get("orderId")
            
        except Exception as e:
            logger.error(f"Chyba při zadávání objednávky: {e}")
            return None
    
    async def get_positions(self) -> List[Position]:
        """Získá aktivní pozice"""
        params = {
            "category": "linear",
            "settleCoin": "USDT"
        }
        
        try:
            data = await self._make_request("GET", "/v5/position/list", params, authenticated=True)
            positions = []
            
            for item in data.get("list", []):
                if Decimal(item.get("size", "0")) > 0:
                    position = Position(
                        symbol=item.get("symbol"),
                        side=TradeType.BUY if item.get("side") == "Buy" else TradeType.SELL,
                        size=Decimal(item.get("size", "0")),
                        entry_price=Decimal(item.get("avgPrice", "0")),
                        current_price=Decimal(item.get("markPrice", "0")),
                        unrealized_pnl=Decimal(item.get("unrealisedPnl", "0")),
                        margin=Decimal(item.get("positionIM", "0")),
                        leverage=int(item.get("leverage", "1"))
                    )
                    positions.append(position)
            
            return positions
            
        except Exception as e:
            logger.error(f"Chyba při získávání pozic: {e}")
            return []
    
    async def get_account_balance(self) -> Decimal:
        """Získá zůstatek účtu"""
        params = {
            "accountType": "UNIFIED",
            "coin": "USDT"
        }
        
        try:
            data = await self._make_request("GET", "/v5/account/wallet-balance", params, authenticated=True)
            accounts = data.get("list", [])
            
            if accounts:
                coins = accounts[0].get("coin", [])
                for coin in coins:
                    if coin.get("coin") == "USDT":
                        return Decimal(coin.get("walletBalance", "0"))
            
            return Decimal("0")
            
        except Exception as e:
            logger.error(f"Chyba při získávání zůstatku: {e}")
            return Decimal("0")