from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import List, Optional


@dataclass
class Candle:
    """Doménový model pro svíčku (OHLCV data)"""
    symbol: str
    timestamp: datetime
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: Decimal
    
    @property
    def is_bullish(self) -> bool:
        """Je svíčka býčí (close > open)?"""
        return self.close > self.open
    
    @property
    def body_size(self) -> Decimal:
        """Velikost těla svíčky"""
        return abs(self.close - self.open)
    
    @property
    def upper_shadow(self) -> Decimal:
        """Velikost horního knotu"""
        return self.high - max(self.open, self.close)
    
    @property
    def lower_shadow(self) -> Decimal:
        """Velikost dolního knotu"""
        return min(self.open, self.close) - self.low


@dataclass
class Ticker:
    """Aktuální tržní data pro symbol"""
    symbol: str
    last_price: Decimal
    bid_price: Decimal
    ask_price: Decimal
    volume_24h: Decimal
    price_change_24h: Decimal
    price_change_percent_24h: Decimal
    timestamp: datetime
    
    @property
    def spread(self) -> Decimal:
        """Spread mezi bid a ask"""
        return self.ask_price - self.bid_price


@dataclass
class OrderBook:
    """Order book data"""
    symbol: str
    bids: List[tuple[Decimal, Decimal]]  # [(price, quantity)]
    asks: List[tuple[Decimal, Decimal]]  # [(price, quantity)]
    timestamp: datetime
    
    @property
    def best_bid(self) -> Optional[Decimal]:
        """Nejlepší bid cena"""
        return self.bids[0][0] if self.bids else None
    
    @property
    def best_ask(self) -> Optional[Decimal]:
        """Nejlepší ask cena"""
        return self.asks[0][0] if self.asks else None
    
    @property
    def spread(self) -> Optional[Decimal]:
        """Spread mezi nejlepším bid a ask"""
        if self.best_bid and self.best_ask:
            return self.best_ask - self.best_bid
        return None