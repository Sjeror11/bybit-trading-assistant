from typing import List, Optional
from decimal import Decimal
from datetime import datetime

from .base_strategy import BaseStrategy
from ..domain.models import Candle, TradingSignal, SignalType, SignalStrength


class TrendFollowingStrategy(BaseStrategy):
    """Trend Following strategie založená na moving averages"""
    
    def get_required_candles_count(self) -> int:
        """Potřebuje dostatek svíček pro slow MA"""
        slow_period = self.parameters.get('slow_period', 21)
        return slow_period + 10  # Přidáme rezervu
    
    async def analyze(self, candles: List[Candle], symbol: str) -> Optional[TradingSignal]:
        """Analyzuje trend pomocí fast a slow MA"""
        if not self.enabled:
            return None
            
        if len(candles) < self.get_required_candles_count():
            return None
        
        # Parametry strategie
        fast_period = self.parameters.get('fast_period', 9)
        slow_period = self.parameters.get('slow_period', 21)
        
        try:
            # Vypočítej moving averages
            fast_ma = self._calculate_ema(candles, fast_period)
            slow_ma = self._calculate_ema(candles, slow_period)
            
            if len(fast_ma) < 2 or len(slow_ma) < 2:
                return None
            
            # Aktuální a předchozí hodnoty
            fast_current = fast_ma[-1]
            fast_previous = fast_ma[-2]
            slow_current = slow_ma[-1]
            slow_previous = slow_ma[-2]
            
            current_price = candles[-1].close
            
            # Detekce crossover
            signal_type = None
            confidence = 0.0
            reason = ""
            
            # Bullish crossover: fast MA protíná slow MA zdola nahoru
            if (fast_previous <= slow_previous and fast_current > slow_current):
                signal_type = SignalType.BUY
                
                # Vypočítej confidence na základě síly trendu
                price_momentum = self._calculate_price_momentum(candles[-10:])
                volume_confirmation = self._check_volume_confirmation(candles[-3:])
                
                confidence = 0.6  # Základní confidence
                if price_momentum > 0:
                    confidence += 0.2
                if volume_confirmation:
                    confidence += 0.1
                    
                reason = f"Fast MA ({fast_current:.4f}) protíná slow MA ({slow_current:.4f}) nahoru"
            
            # Bearish crossover: fast MA protíná slow MA shora dolů  
            elif (fast_previous >= slow_previous and fast_current < slow_current):
                signal_type = SignalType.SELL
                
                # Vypočítej confidence
                price_momentum = self._calculate_price_momentum(candles[-10:])
                volume_confirmation = self._check_volume_confirmation(candles[-3:])
                
                confidence = 0.6
                if price_momentum < 0:
                    confidence += 0.2
                if volume_confirmation:
                    confidence += 0.1
                    
                reason = f"Fast MA ({fast_current:.4f}) protíná slow MA ({slow_current:.4f}) dolů"
            
            # Pokud není signál, vrať None
            if not signal_type:
                return None
            
            # Minimální confidence threshold
            if confidence < 0.5:
                return None
            
            # Vytvoř signál
            signal = TradingSignal(
                strategy_name=self.name,
                symbol=symbol,
                signal_type=signal_type,
                strength=self._get_signal_strength(confidence),
                confidence=confidence,
                price=current_price,
                timestamp=datetime.now(),
                indicators={
                    'fast_ma': float(fast_current),
                    'slow_ma': float(slow_current),
                    'fast_period': fast_period,
                    'slow_period': slow_period,
                    'price_momentum': price_momentum,
                    'volume_confirmation': volume_confirmation
                },
                reason=reason,
                suggested_stop_loss=self._calculate_stop_loss(signal_type, current_price),
                suggested_take_profit=self._calculate_take_profit(signal_type, current_price)
            )
            
            return signal
            
        except Exception as e:
            print(f"Chyba v TrendFollowingStrategy pro {symbol}: {e}")
            return None
    
    def _calculate_price_momentum(self, candles: List[Candle]) -> float:
        """Vypočítá cenové momentum (kladné = rostoucí trend)"""
        if len(candles) < 2:
            return 0.0
        
        start_price = candles[0].close
        end_price = candles[-1].close
        
        return float((end_price - start_price) / start_price)
    
    def _check_volume_confirmation(self, candles: List[Candle]) -> bool:
        """Zkontroluje, zda volume potvrzuje pohyb"""
        if len(candles) < 3:
            return False
        
        # Průměrný volume z předchozích svíček
        avg_volume = sum(c.volume for c in candles[:-1]) / (len(candles) - 1)
        current_volume = candles[-1].volume
        
        # Volume je vyšší než průměr
        return current_volume > avg_volume * Decimal('1.2')