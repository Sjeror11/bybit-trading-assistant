from typing import List, Optional
from decimal import Decimal
from datetime import datetime

from .base_strategy import BaseStrategy
from ..domain.models import Candle, TradingSignal, SignalType, SignalStrength


class RsiMacdStrategy(BaseStrategy):
    """RSI + MACD kombinovaná strategie"""
    
    def get_required_candles_count(self) -> int:
        """Potřebuje dostatek svíček pro MACD a RSI"""
        rsi_period = self.parameters.get('rsi_period', 14)
        macd_slow = self.parameters.get('macd_slow', 26)
        macd_signal = self.parameters.get('macd_signal', 9)
        
        return max(rsi_period, macd_slow + macd_signal) + 10
    
    async def analyze(self, candles: List[Candle], symbol: str) -> Optional[TradingSignal]:
        """Analyzuje pomocí RSI a MACD indikátorů"""
        if not self.enabled:
            return None
            
        if len(candles) < self.get_required_candles_count():
            return None
        
        # Parametry strategie
        rsi_period = self.parameters.get('rsi_period', 14)
        rsi_overbought = self.parameters.get('rsi_overbought', 70)
        rsi_oversold = self.parameters.get('rsi_oversold', 30)
        macd_fast = self.parameters.get('macd_fast', 12)
        macd_slow = self.parameters.get('macd_slow', 26)
        macd_signal = self.parameters.get('macd_signal', 9)
        
        try:
            # Vypočítej indikátory
            rsi_values = self._calculate_rsi(candles, rsi_period)
            macd_line, signal_line, histogram = self._calculate_macd(
                candles, macd_fast, macd_slow, macd_signal
            )
            
            if (len(rsi_values) < 2 or len(macd_line) < 2 or 
                len(signal_line) < 2 or len(histogram) < 2):
                return None
            
            # Aktuální hodnoty
            rsi_current = rsi_values[-1]
            rsi_previous = rsi_values[-2]
            macd_current = macd_line[-1]
            macd_previous = macd_line[-2]
            signal_current = signal_line[-1]
            signal_previous = signal_line[-2]
            histogram_current = histogram[-1]
            histogram_previous = histogram[-2]
            
            current_price = candles[-1].close
            
            # Analýza signálů
            signal_type = None
            confidence = 0.0
            reason_parts = []
            
            # BULLISH signály
            bullish_signals = 0
            bullish_reasons = []
            
            # RSI opouští oversold zónu
            if rsi_previous <= rsi_oversold and rsi_current > rsi_oversold:
                bullish_signals += 1
                bullish_reasons.append(f"RSI opouští oversold ({rsi_current:.1f})")
            
            # MACD bullish crossover
            if macd_previous <= signal_previous and macd_current > signal_current:
                bullish_signals += 1
                bullish_reasons.append("MACD bullish crossover")
            
            # MACD histogram roste
            if histogram_current > histogram_previous and histogram_current > 0:
                bullish_signals += 1
                bullish_reasons.append("MACD histogram roste")
            
            # RSI momentum (roste ze dna)
            if rsi_current < 50 and rsi_current > rsi_previous:
                bullish_signals += 0.5
                bullish_reasons.append("RSI momentum nahoru")
            
            # BEARISH signály
            bearish_signals = 0
            bearish_reasons = []
            
            # RSI vstupuje do overbought
            if rsi_previous >= rsi_overbought and rsi_current < rsi_overbought:
                bearish_signals += 1
                bearish_reasons.append(f"RSI opouští overbought ({rsi_current:.1f})")
            
            # MACD bearish crossover
            if macd_previous >= signal_previous and macd_current < signal_current:
                bearish_signals += 1
                bearish_reasons.append("MACD bearish crossover")
            
            # MACD histogram klesá
            if histogram_current < histogram_previous and histogram_current < 0:
                bearish_signals += 1
                bearish_reasons.append("MACD histogram klesá")
            
            # RSI momentum (klesá z vrcholu)
            if rsi_current > 50 and rsi_current < rsi_previous:
                bearish_signals += 0.5
                bearish_reasons.append("RSI momentum dolů")
            
            # Rozhodnutí o signálu
            if bullish_signals >= 2 and bullish_signals > bearish_signals:
                signal_type = SignalType.BUY
                confidence = min(0.9, 0.4 + (bullish_signals * 0.15))
                reason_parts = bullish_reasons
                
            elif bearish_signals >= 2 and bearish_signals > bullish_signals:
                signal_type = SignalType.SELL
                confidence = min(0.9, 0.4 + (bearish_signals * 0.15))
                reason_parts = bearish_reasons
            
            # Pokud není dostatečně silný signál
            if not signal_type or confidence < 0.5:
                return None
            
            # Dodatečné filtry
            # Neobchoduj v extrémních RSI zónách opačně
            if signal_type == SignalType.BUY and rsi_current > rsi_overbought:
                return None
            if signal_type == SignalType.SELL and rsi_current < rsi_oversold:
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
                    'rsi': rsi_current,
                    'rsi_previous': rsi_previous,
                    'macd': float(macd_current),
                    'macd_signal': float(signal_current),
                    'macd_histogram': float(histogram_current),
                    'bullish_signals': bullish_signals,
                    'bearish_signals': bearish_signals
                },
                reason="; ".join(reason_parts),
                suggested_stop_loss=self._calculate_stop_loss(signal_type, current_price),
                suggested_take_profit=self._calculate_take_profit(signal_type, current_price)
            )
            
            return signal
            
        except Exception as e:
            print(f"Chyba v RsiMacdStrategy pro {symbol}: {e}")
            return None