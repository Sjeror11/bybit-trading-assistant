from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from decimal import Decimal
from ..domain.models import Candle, TradingSignal, SignalType, SignalStrength
from ..config.settings import StrategyConfig


class BaseStrategy(ABC):
    """Základní třída pro všechny obchodní strategie"""
    
    def __init__(self, config: StrategyConfig):
        self.config = config
        self.name = self.__class__.__name__
        self.enabled = config.enabled
        self.weight = config.weight
        self.parameters = config.parameters
        self.risk_management = config.risk_management
    
    @abstractmethod
    async def analyze(self, candles: List[Candle], symbol: str) -> Optional[TradingSignal]:
        """Analyzuje tržní data a vrátí obchodní signál"""
        pass
    
    @abstractmethod
    def get_required_candles_count(self) -> int:
        """Vrátí počet svíček potřebných pro analýzu"""
        pass
    
    def _calculate_stop_loss(self, signal_type: SignalType, current_price: Decimal) -> Decimal:
        """Vypočítá stop loss podle konfigurace"""
        stop_loss_pct = self.risk_management.get('stop_loss_percentage', 2.0) / 100
        
        if signal_type == SignalType.BUY:
            return current_price * (1 - Decimal(str(stop_loss_pct)))
        else:
            return current_price * (1 + Decimal(str(stop_loss_pct)))
    
    def _calculate_take_profit(self, signal_type: SignalType, current_price: Decimal) -> Decimal:
        """Vypočítá take profit podle konfigurace"""
        take_profit_pct = self.risk_management.get('take_profit_percentage', 5.0) / 100
        
        if signal_type == SignalType.BUY:
            return current_price * (1 + Decimal(str(take_profit_pct)))
        else:
            return current_price * (1 - Decimal(str(take_profit_pct)))
    
    def _get_signal_strength(self, confidence: float) -> SignalStrength:
        """Převede confidence na signal strength"""
        if confidence >= 0.8:
            return SignalStrength.STRONG
        elif confidence >= 0.6:
            return SignalStrength.MODERATE
        else:
            return SignalStrength.WEAK
    
    def _calculate_sma(self, candles: List[Candle], period: int) -> List[Decimal]:
        """Vypočítá Simple Moving Average"""
        if len(candles) < period:
            return []
        
        sma_values = []
        for i in range(period - 1, len(candles)):
            sum_close = sum(candles[j].close for j in range(i - period + 1, i + 1))
            sma_values.append(sum_close / period)
        
        return sma_values
    
    def _calculate_ema(self, candles: List[Candle], period: int) -> List[Decimal]:
        """Vypočítá Exponential Moving Average"""
        if len(candles) < period:
            return []
        
        multiplier = Decimal('2') / (period + 1)
        ema_values = []
        
        # První EMA je SMA
        first_sma = sum(candles[i].close for i in range(period)) / period
        ema_values.append(first_sma)
        
        # Další EMA hodnoty
        for i in range(period, len(candles)):
            ema = (candles[i].close * multiplier) + (ema_values[-1] * (1 - multiplier))
            ema_values.append(ema)
        
        return ema_values
    
    def _calculate_rsi(self, candles: List[Candle], period: int = 14) -> List[float]:
        """Vypočítá Relative Strength Index"""
        if len(candles) < period + 1:
            return []
        
        gains = []
        losses = []
        
        # Vypočítej změny cen
        for i in range(1, len(candles)):
            change = candles[i].close - candles[i-1].close
            if change > 0:
                gains.append(float(change))
                losses.append(0)
            else:
                gains.append(0)
                losses.append(float(abs(change)))
        
        if len(gains) < period:
            return []
        
        rsi_values = []
        
        # První průměrné zisky a ztráty
        avg_gain = sum(gains[:period]) / period
        avg_loss = sum(losses[:period]) / period
        
        # První RSI
        if avg_loss == 0:
            rsi_values.append(100.0)
        else:
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))
            rsi_values.append(rsi)
        
        # Další RSI hodnoty
        for i in range(period, len(gains)):
            avg_gain = (avg_gain * (period - 1) + gains[i]) / period
            avg_loss = (avg_loss * (period - 1) + losses[i]) / period
            
            if avg_loss == 0:
                rsi_values.append(100.0)
            else:
                rs = avg_gain / avg_loss
                rsi = 100 - (100 / (1 + rs))
                rsi_values.append(rsi)
        
        return rsi_values
    
    def _calculate_macd(
        self, 
        candles: List[Candle], 
        fast_period: int = 12, 
        slow_period: int = 26, 
        signal_period: int = 9
    ) -> tuple[List[Decimal], List[Decimal], List[Decimal]]:
        """Vypočítá MACD indikátor"""
        if len(candles) < slow_period:
            return [], [], []
        
        # Vypočítej EMA
        fast_ema = self._calculate_ema(candles, fast_period)
        slow_ema = self._calculate_ema(candles, slow_period)
        
        if not fast_ema or not slow_ema:
            return [], [], []
        
        # MACD line = fast EMA - slow EMA
        macd_line = []
        start_idx = slow_period - fast_period
        for i in range(len(slow_ema)):
            macd_value = fast_ema[i + start_idx] - slow_ema[i]
            macd_line.append(macd_value)
        
        # Signal line = EMA of MACD line
        if len(macd_line) < signal_period:
            return macd_line, [], []
        
        # Vytvoř dočasné candles pro signal EMA
        temp_candles = []
        for value in macd_line:
            temp_candle = Candle(
                symbol="TEMP",
                timestamp=candles[0].timestamp,
                open=value, high=value, low=value, close=value, volume=Decimal('0')
            )
            temp_candles.append(temp_candle)
        
        signal_line = self._calculate_ema(temp_candles, signal_period)
        
        # Histogram = MACD - Signal
        histogram = []
        if signal_line:
            start_idx = len(macd_line) - len(signal_line)
            for i in range(len(signal_line)):
                hist_value = macd_line[i + start_idx] - signal_line[i]
                histogram.append(hist_value)
        
        return macd_line, signal_line, histogram