from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import datetime
from ..models import Candle, Ticker, OrderBook


class IMarketDataRepository(ABC):
    """Interface pro market data repository"""
    
    @abstractmethod
    async def save_candle(self, candle: Candle) -> None:
        """Uloží svíčku do databáze"""
        pass
    
    @abstractmethod
    async def get_candles(
        self, 
        symbol: str, 
        start_time: datetime, 
        end_time: datetime,
        limit: Optional[int] = None
    ) -> List[Candle]:
        """Získá historická OHLCV data"""
        pass
    
    @abstractmethod
    async def get_latest_candles(
        self, 
        symbol: str, 
        count: int = 100
    ) -> List[Candle]:
        """Získá posledních N svíček"""
        pass
    
    @abstractmethod
    async def save_ticker(self, ticker: Ticker) -> None:
        """Uloží ticker data"""
        pass
    
    @abstractmethod
    async def get_latest_ticker(self, symbol: str) -> Optional[Ticker]:
        """Získá nejnovější ticker pro symbol"""
        pass
    
    @abstractmethod
    async def save_order_book(self, order_book: OrderBook) -> None:
        """Uloží order book"""
        pass
    
    @abstractmethod
    async def get_latest_order_book(self, symbol: str) -> Optional[OrderBook]:
        """Získá nejnovější order book"""
        pass