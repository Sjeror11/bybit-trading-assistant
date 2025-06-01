from abc import ABC, abstractmethod
from typing import List, Optional
from decimal import Decimal
from ..models import Trade, TradingSignal, Position
from ..repositories import ITradeRepository, IPositionRepository


class ITradingEngine(ABC):
    """Interface pro trading engine"""
    
    @abstractmethod
    async def execute_trade(self, signal: TradingSignal) -> Optional[Trade]:
        """Vykoná obchod na základě signálu"""
        pass
    
    @abstractmethod
    async def close_position(self, symbol: str) -> Optional[Trade]:
        """Uzavře pozici pro daný symbol"""
        pass
    
    @abstractmethod
    async def calculate_position_size(
        self, 
        signal: TradingSignal, 
        account_balance: Decimal,
        risk_percentage: float = 0.02
    ) -> Decimal:
        """Vypočítá velikost pozice podle risk managementu"""
        pass


class TradingEngine(ITradingEngine):
    """Implementace trading engine"""
    
    def __init__(
        self, 
        trade_repository: ITradeRepository,
        position_repository: IPositionRepository
    ):
        self.trade_repository = trade_repository
        self.position_repository = position_repository
    
    async def execute_trade(self, signal: TradingSignal) -> Optional[Trade]:
        """Vykoná obchod na základě signálu"""
        try:
            # Zkontroluj existující pozici
            existing_position = await self.position_repository.get_position_by_symbol(
                signal.symbol
            )
            
            # Pokud je signál opačný než stávající pozice, uzavři ji
            if existing_position:
                if (existing_position.side.value != signal.signal_type.value):
                    await self.close_position(signal.symbol)
            
            # Vytvoř nový obchod
            from ..models.trade import TradeType
            
            # Konverze SignalType na TradeType
            trade_side = TradeType.BUY if signal.signal_type.value == "buy" else TradeType.SELL
            
            trade = Trade(
                symbol=signal.symbol,
                side=trade_side,
                price=signal.price,
                strategy_name=signal.strategy_name,
                stop_loss=signal.suggested_stop_loss,
                take_profit=signal.suggested_take_profit
            )
            
            if signal.suggested_position_size:
                trade.quantity = signal.suggested_position_size
            
            # Ulož obchod
            saved_trade = await self.trade_repository.save_trade(trade)
            return saved_trade
            
        except Exception as e:
            # Logování chyby
            print(f"Chyba při vykonávání obchodu: {e}")
            return None
    
    async def close_position(self, symbol: str) -> Optional[Trade]:
        """Uzavře pozici pro daný symbol"""
        try:
            position = await self.position_repository.get_position_by_symbol(symbol)
            if not position:
                return None
            
            # Vytvoř uzavírací obchod
            from ..models.trade import TradeType
            close_side = TradeType.SELL if position.side.value == "buy" else TradeType.BUY
            
            close_trade = Trade(
                symbol=symbol,
                side=close_side,
                quantity=position.size,
                price=position.current_price
            )
            
            # Uzavři pozici
            await self.position_repository.close_position(symbol)
            
            # Ulož uzavírací obchod
            return await self.trade_repository.save_trade(close_trade)
            
        except Exception as e:
            print(f"Chyba při uzavírání pozice: {e}")
            return None
    
    async def calculate_position_size(
        self, 
        signal: TradingSignal, 
        account_balance: Decimal,
        risk_percentage: float = 0.02
    ) -> Decimal:
        """Vypočítá velikost pozice podle risk managementu"""
        try:
            # Riziko na obchod (2% z account balance)
            risk_amount = account_balance * Decimal(str(risk_percentage))
            
            # Pokud máme stop loss, vypočítej velikost pozice
            if signal.suggested_stop_loss:
                price_diff = abs(signal.price - signal.suggested_stop_loss)
                if price_diff > 0:
                    position_size = risk_amount / price_diff
                    return position_size
            
            # Fallback: použij 1% z balance
            return account_balance * Decimal('0.01') / signal.price
            
        except Exception as e:
            print(f"Chyba při výpočtu velikosti pozice: {e}")
            return Decimal('0')