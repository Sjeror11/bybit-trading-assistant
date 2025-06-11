from typing import List, Optional
from decimal import Decimal
from datetime import datetime

from .base_strategy import BaseStrategy
from ..domain.models import Candle, TradingSignal, SignalType


class BreakoutStrategy(BaseStrategy):
    """Strategie detekující průlomy nad/pod lokálními maximy a minimy"""

    def get_required_candles_count(self) -> int:
        lookback = self.parameters.get('lookback_period', 20)
        confirmation = self.parameters.get('confirmation_candles', 2)
        return lookback + confirmation

    async def analyze(self, candles: List[Candle], symbol: str) -> Optional[TradingSignal]:
        if not self.enabled:
            return None
        lookback = self.parameters.get('lookback_period', 20)
        threshold = self.parameters.get('threshold', 0.003)
        min_touches = self.parameters.get('min_touchpoints', 3)
        confirmation = self.parameters.get('confirmation_candles', 2)
        if len(candles) < self.get_required_candles_count():
            return None

        hist = candles[-(lookback + confirmation):-confirmation]
        confirm = candles[-confirmation:]
        highs = [c.high for c in hist]
        lows = [c.low for c in hist]
        highest = max(highs)
        lowest = min(lows)

        touch_high = sum(1 for c in hist if c.high >= highest * (Decimal('1') - Decimal(str(threshold))))
        touch_low = sum(1 for c in hist if c.low <= lowest * (Decimal('1') + Decimal(str(threshold))))
        if touch_high < min_touches and touch_low < min_touches:
            return None

        current_price = candles[-1].close
        signal_type = None
        confidence = 0.0
        reason = ''
        for c in confirm:
            if c.close > highest * (Decimal('1') + Decimal(str(threshold))):
                signal_type = SignalType.BUY
                confidence = min(0.9, 0.5 + (touch_high / min_touches) * 0.1)
                reason = f"Breakout nad lokálním max {highest:.4f}"
                break
            if c.close < lowest * (Decimal('1') - Decimal(str(threshold))):
                signal_type = SignalType.SELL
                confidence = min(0.9, 0.5 + (touch_low / min_touches) * 0.1)
                reason = f"Breakout pod lokálním min {lowest:.4f}"
                break
        if not signal_type or confidence < 0.5:
            return None

        signal = TradingSignal(
            strategy_name=self.name,
            symbol=symbol,
            signal_type=signal_type,
            strength=self._get_signal_strength(confidence),
            confidence=confidence,
            price=current_price,
            timestamp=datetime.now(),
            indicators={
                'highest_high': float(highest),
                'lowest_low': float(lowest),
                'touch_high': touch_high,
                'touch_low': touch_low,
            },
            reason=reason,
            suggested_stop_loss=self._calculate_stop_loss(signal_type, current_price),
            suggested_take_profit=self._calculate_take_profit(signal_type, current_price)
        )
        return signal