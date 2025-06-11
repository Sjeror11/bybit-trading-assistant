from typing import List, Optional
from decimal import Decimal
from datetime import datetime

from .base_strategy import BaseStrategy
from ..domain.models import Candle, TradingSignal, SignalType


class VolumeStrategy(BaseStrategy):
    """Strategie detekující objemové spike s potvrzením pohybu ceny"""

    def get_required_candles_count(self) -> int:
        period = self.parameters.get('volume_period', 20)
        return period + 1

    async def analyze(self, candles: List[Candle], symbol: str) -> Optional[TradingSignal]:
        if not self.enabled:
            return None
        period = self.parameters.get('volume_period', 20)
        vol_thresh = self.parameters.get('volume_threshold', 2.0)
        price_thresh = self.parameters.get('price_change_threshold', 0.01)
        if len(candles) < self.get_required_candles_count():
            return None

        hist = candles[-(period + 1):-1]
        current = candles[-1]
        avg_vol = sum(c.volume for c in hist) / Decimal(str(period))
        if current.volume <= avg_vol * Decimal(str(vol_thresh)):
            return None

        price_change = (current.close - current.open) / current.open
        signal_type = None
        confidence = 0.0
        reason = ''
        if price_change >= Decimal(str(price_thresh)):
            signal_type = SignalType.BUY
            confidence = min(0.9, 0.5 + float(price_change) * 5)
            reason = f"Objem spike {float(current.volume):.2f} > avg {float(avg_vol):.2f}"  
        elif price_change <= Decimal(str(-price_thresh)):
            signal_type = SignalType.SELL
            confidence = min(0.9, 0.5 + float(-price_change) * 5)
            reason = f"Objem spike {float(current.volume):.2f} > avg {float(avg_vol):.2f}"  
        else:
            return None
        if confidence < 0.5:
            return None

        current_price = current.close
        signal = TradingSignal(
            strategy_name=self.name,
            symbol=symbol,
            signal_type=signal_type,
            strength=self._get_signal_strength(confidence),
            confidence=confidence,
            price=current_price,
            timestamp=datetime.now(),
            indicators={
                'avg_volume': float(avg_vol),
                'current_volume': float(current.volume),
                'price_change': float(price_change),
            },
            reason=reason,
            suggested_stop_loss=self._calculate_stop_loss(signal_type, current_price),
            suggested_take_profit=self._calculate_take_profit(signal_type, current_price)
        )
        return signal