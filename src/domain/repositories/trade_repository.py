from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import datetime
from ..models import Trade, Position


class ITradeRepository(ABC):
    """Interface pro trade repository"""
    
    @abstractmethod
    async def save_trade(self, trade: Trade) -> Trade:
        """Uloží obchod do databáze"""
        pass
    
    @abstractmethod
    async def get_trade_by_id(self, trade_id: str) -> Optional[Trade]:
        """Najde obchod podle ID"""
        pass
    
    @abstractmethod
    async def get_trades_by_symbol(self, symbol: str) -> List[Trade]:
        """Najde všechny obchody pro daný symbol"""
        pass
    
    @abstractmethod
    async def get_trades_by_strategy(self, strategy_name: str) -> List[Trade]:
        """Najde všechny obchody pro danou strategii"""
        pass
    
    @abstractmethod
    async def get_trades_by_date_range(
        self, 
        start_date: datetime, 
        end_date: datetime
    ) -> List[Trade]:
        """Najde obchody v daném časovém rozmezí"""
        pass
    
    @abstractmethod
    async def get_open_trades(self) -> List[Trade]:
        """Najde všechny otevřené obchody"""
        pass
    
    @abstractmethod
    async def update_trade(self, trade: Trade) -> Trade:
        """Aktualizuje existující obchod"""
        pass
    
    @abstractmethod
    async def delete_trade(self, trade_id: str) -> bool:
        """Smaže obchod"""
        pass


class IPositionRepository(ABC):
    """Interface pro position repository"""
    
    @abstractmethod
    async def save_position(self, position: Position) -> Position:
        """Uloží pozici"""
        pass
    
    @abstractmethod
    async def get_position_by_symbol(self, symbol: str) -> Optional[Position]:
        """Najde pozici pro symbol"""
        pass
    
    @abstractmethod
    async def get_all_positions(self) -> List[Position]:
        """Najde všechny aktivní pozice"""
        pass
    
    @abstractmethod
    async def update_position(self, position: Position) -> Position:
        """Aktualizuje pozici"""
        pass
    
    @abstractmethod
    async def close_position(self, symbol: str) -> bool:
        """Uzavře pozici"""
        pass