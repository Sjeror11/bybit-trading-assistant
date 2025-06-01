from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Dict, Any, Optional, List
from .trade import Trade, TradeType
from .market_data import Candle


class SignalType(Enum):
    BUY = "buy"
    SELL = "sell"
    HOLD = "hold"


class SignalStrength(Enum):
    WEAK = "weak"
    MODERATE = "moderate"
    STRONG = "strong"


@dataclass
class TradingSignal:
    """Obchodní signál generovaný strategií"""
    strategy_name: str
    symbol: str
    signal_type: SignalType
    strength: SignalStrength
    confidence: float  # 0-1
    price: Decimal
    timestamp: datetime
    
    # Metadata
    indicators: Dict[str, Any]
    reason: str
    
    # Risk management
    suggested_stop_loss: Optional[Decimal] = None
    suggested_take_profit: Optional[Decimal] = None
    suggested_position_size: Optional[Decimal] = None


@dataclass
class StrategyConfig:
    """Konfigurace strategie"""
    name: str
    enabled: bool
    weight: float
    parameters: Dict[str, Any]
    risk_management: Dict[str, Any]


@dataclass
class StrategyMetrics:
    """Metriky výkonnosti strategie"""
    strategy_name: str
    total_trades: int = 0
    winning_trades: int = 0
    losing_trades: int = 0
    total_pnl: Decimal = Decimal('0')
    max_drawdown: Decimal = Decimal('0')
    win_rate: float = 0.0
    avg_win: Decimal = Decimal('0')
    avg_loss: Decimal = Decimal('0')
    profit_factor: float = 0.0
    sharpe_ratio: float = 0.0
    
    # Časové údaje
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    
    def update_metrics(self, trades: List[Trade]) -> None:
        """Aktualizuje metriky na základě seznamu obchodů"""
        self.total_trades = len(trades)
        winning = [t for t in trades if t.pnl and t.pnl > 0]
        losing = [t for t in trades if t.pnl and t.pnl < 0]
        
        self.winning_trades = len(winning)
        self.losing_trades = len(losing)
        self.total_pnl = sum(t.pnl for t in trades if t.pnl)
        
        if self.total_trades > 0:
            self.win_rate = self.winning_trades / self.total_trades
            
        if winning:
            self.avg_win = sum(t.pnl for t in winning) / len(winning)
            
        if losing:
            self.avg_loss = sum(abs(t.pnl) for t in losing) / len(losing)
            
        # Profit factor: celkový zisk / celková ztráta
        total_wins = sum(t.pnl for t in winning)
        total_losses = sum(abs(t.pnl) for t in losing)
        
        if total_losses > 0:
            self.profit_factor = float(total_wins / total_losses)
            
        self.updated_at = datetime.now()