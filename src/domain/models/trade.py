from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional
from decimal import Decimal


class TradeType(Enum):
    BUY = "buy"
    SELL = "sell"


class TradeStatus(Enum):
    PENDING = "pending"
    OPEN = "open"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class OrderType(Enum):
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"


@dataclass
class Trade:
    """Doménový model pro obchod"""
    id: Optional[str] = None
    symbol: str = ""
    side: TradeType = TradeType.BUY
    quantity: Decimal = Decimal('0')
    price: Decimal = Decimal('0')
    order_type: OrderType = OrderType.MARKET
    status: TradeStatus = TradeStatus.PENDING
    strategy_name: str = ""
    
    # Časové údaje
    created_at: Optional[datetime] = None
    executed_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    
    # Risk management
    stop_loss: Optional[Decimal] = None
    take_profit: Optional[Decimal] = None
    
    # Výsledky
    entry_price: Optional[Decimal] = None
    exit_price: Optional[Decimal] = None
    pnl: Optional[Decimal] = None
    commission: Optional[Decimal] = None
    
    # Metadata
    exchange_order_id: Optional[str] = None
    notes: Optional[str] = None


@dataclass
class Position:
    """Doménový model pro pozici"""
    symbol: str
    side: TradeType
    size: Decimal
    entry_price: Decimal
    current_price: Decimal
    unrealized_pnl: Decimal
    margin: Decimal
    leverage: int = 1
    created_at: datetime = datetime.now()
    
    @property
    def market_value(self) -> Decimal:
        """Tržní hodnota pozice"""
        return self.size * self.current_price