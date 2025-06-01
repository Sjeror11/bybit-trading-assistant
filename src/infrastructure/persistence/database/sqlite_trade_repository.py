import sqlite3
import asyncio
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
import json

from ....domain.models import Trade, Position, TradeType, TradeStatus, OrderType
from ....domain.repositories import ITradeRepository, IPositionRepository


class SqliteTradeRepository(ITradeRepository):
    """SQLite implementace trade repository"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._ensure_tables()
    
    def _get_connection(self) -> sqlite3.Connection:
        """Vytvoří databázové připojení"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def _ensure_tables(self):
        """Vytvoří tabulky pokud neexistují"""
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS trades (
                    id TEXT PRIMARY KEY,
                    symbol TEXT NOT NULL,
                    side TEXT NOT NULL,
                    quantity REAL NOT NULL,
                    price REAL NOT NULL,
                    order_type TEXT NOT NULL,
                    status TEXT NOT NULL,
                    strategy_name TEXT,
                    created_at TIMESTAMP,
                    executed_at TIMESTAMP,
                    closed_at TIMESTAMP,
                    stop_loss REAL,
                    take_profit REAL,
                    entry_price REAL,
                    exit_price REAL,
                    pnl REAL,
                    commission REAL,
                    exchange_order_id TEXT,
                    notes TEXT
                )
            """)
            conn.commit()
    
    async def save_trade(self, trade: Trade) -> Trade:
        """Uloží obchod do databáze"""
        def _save():
            with self._get_connection() as conn:
                if not trade.id:
                    # Vygeneruj ID
                    trade.id = f"trade_{int(datetime.now().timestamp() * 1000)}"
                
                if not trade.created_at:
                    trade.created_at = datetime.now()
                
                conn.execute("""
                    INSERT OR REPLACE INTO trades (
                        id, symbol, side, quantity, price, order_type, status,
                        strategy_name, created_at, executed_at, closed_at,
                        stop_loss, take_profit, entry_price, exit_price,
                        pnl, commission, exchange_order_id, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    trade.id, trade.symbol, trade.side.value, float(trade.quantity),
                    float(trade.price), trade.order_type.value, trade.status.value,
                    trade.strategy_name, trade.created_at, trade.executed_at,
                    trade.closed_at, float(trade.stop_loss) if trade.stop_loss else None,
                    float(trade.take_profit) if trade.take_profit else None,
                    float(trade.entry_price) if trade.entry_price else None,
                    float(trade.exit_price) if trade.exit_price else None,
                    float(trade.pnl) if trade.pnl else None,
                    float(trade.commission) if trade.commission else None,
                    trade.exchange_order_id, trade.notes
                ))
                conn.commit()
                return trade
        
        return await asyncio.get_event_loop().run_in_executor(None, _save)
    
    async def get_trade_by_id(self, trade_id: str) -> Optional[Trade]:
        """Najde obchod podle ID"""
        def _get():
            with self._get_connection() as conn:
                row = conn.execute("SELECT * FROM trades WHERE id = ?", (trade_id,)).fetchone()
                if row:
                    return self._row_to_trade(row)
                return None
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def get_trades_by_symbol(self, symbol: str) -> List[Trade]:
        """Najde všechny obchody pro daný symbol"""
        def _get():
            with self._get_connection() as conn:
                rows = conn.execute("SELECT * FROM trades WHERE symbol = ? ORDER BY created_at DESC", (symbol,)).fetchall()
                return [self._row_to_trade(row) for row in rows]
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def get_trades_by_strategy(self, strategy_name: str) -> List[Trade]:
        """Najde všechny obchody pro danou strategii"""
        def _get():
            with self._get_connection() as conn:
                rows = conn.execute("SELECT * FROM trades WHERE strategy_name = ? ORDER BY created_at DESC", (strategy_name,)).fetchall()
                return [self._row_to_trade(row) for row in rows]
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def get_trades_by_date_range(self, start_date: datetime, end_date: datetime) -> List[Trade]:
        """Najde obchody v daném časovém rozmezí"""
        def _get():
            with self._get_connection() as conn:
                rows = conn.execute(
                    "SELECT * FROM trades WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC",
                    (start_date, end_date)
                ).fetchall()
                return [self._row_to_trade(row) for row in rows]
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def get_open_trades(self) -> List[Trade]:
        """Najde všechny otevřené obchody"""
        def _get():
            with self._get_connection() as conn:
                rows = conn.execute("SELECT * FROM trades WHERE status = ? ORDER BY created_at DESC", (TradeStatus.OPEN.value,)).fetchall()
                return [self._row_to_trade(row) for row in rows]
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def update_trade(self, trade: Trade) -> Trade:
        """Aktualizuje existující obchod"""
        return await self.save_trade(trade)
    
    async def delete_trade(self, trade_id: str) -> bool:
        """Smaže obchod"""
        def _delete():
            with self._get_connection() as conn:
                cursor = conn.execute("DELETE FROM trades WHERE id = ?", (trade_id,))
                conn.commit()
                return cursor.rowcount > 0
        
        return await asyncio.get_event_loop().run_in_executor(None, _delete)
    
    def _row_to_trade(self, row: sqlite3.Row) -> Trade:
        """Převede databázový řádek na Trade objekt"""
        return Trade(
            id=row['id'],
            symbol=row['symbol'],
            side=TradeType(row['side']),
            quantity=Decimal(str(row['quantity'])),
            price=Decimal(str(row['price'])),
            order_type=OrderType(row['order_type']),
            status=TradeStatus(row['status']),
            strategy_name=row['strategy_name'],
            created_at=datetime.fromisoformat(row['created_at']) if row['created_at'] else None,
            executed_at=datetime.fromisoformat(row['executed_at']) if row['executed_at'] else None,
            closed_at=datetime.fromisoformat(row['closed_at']) if row['closed_at'] else None,
            stop_loss=Decimal(str(row['stop_loss'])) if row['stop_loss'] else None,
            take_profit=Decimal(str(row['take_profit'])) if row['take_profit'] else None,
            entry_price=Decimal(str(row['entry_price'])) if row['entry_price'] else None,
            exit_price=Decimal(str(row['exit_price'])) if row['exit_price'] else None,
            pnl=Decimal(str(row['pnl'])) if row['pnl'] else None,
            commission=Decimal(str(row['commission'])) if row['commission'] else None,
            exchange_order_id=row['exchange_order_id'],
            notes=row['notes']
        )


class SqlitePositionRepository(IPositionRepository):
    """SQLite implementace position repository"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._ensure_tables()
    
    def _get_connection(self) -> sqlite3.Connection:
        """Vytvoří databázové připojení"""
        conn = sqlite3.Connection(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def _ensure_tables(self):
        """Vytvoří tabulky pokud neexistují"""
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS positions (
                    symbol TEXT PRIMARY KEY,
                    side TEXT NOT NULL,
                    size REAL NOT NULL,
                    entry_price REAL NOT NULL,
                    current_price REAL NOT NULL,
                    unrealized_pnl REAL NOT NULL,
                    margin REAL NOT NULL,
                    leverage INTEGER DEFAULT 1,
                    created_at TIMESTAMP NOT NULL
                )
            """)
            conn.commit()
    
    async def save_position(self, position: Position) -> Position:
        """Uloží pozici"""
        def _save():
            with self._get_connection() as conn:
                conn.execute("""
                    INSERT OR REPLACE INTO positions (
                        symbol, side, size, entry_price, current_price,
                        unrealized_pnl, margin, leverage, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    position.symbol, position.side.value, float(position.size),
                    float(position.entry_price), float(position.current_price),
                    float(position.unrealized_pnl), float(position.margin),
                    position.leverage, position.created_at
                ))
                conn.commit()
                return position
        
        return await asyncio.get_event_loop().run_in_executor(None, _save)
    
    async def get_position_by_symbol(self, symbol: str) -> Optional[Position]:
        """Najde pozici pro symbol"""
        def _get():
            with self._get_connection() as conn:
                row = conn.execute("SELECT * FROM positions WHERE symbol = ?", (symbol,)).fetchone()
                if row:
                    return self._row_to_position(row)
                return None
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def get_all_positions(self) -> List[Position]:
        """Najde všechny aktivní pozice"""
        def _get():
            with self._get_connection() as conn:
                rows = conn.execute("SELECT * FROM positions ORDER BY created_at DESC").fetchall()
                return [self._row_to_position(row) for row in rows]
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def update_position(self, position: Position) -> Position:
        """Aktualizuje pozici"""
        return await self.save_position(position)
    
    async def close_position(self, symbol: str) -> bool:
        """Uzavře pozici"""
        def _close():
            with self._get_connection() as conn:
                cursor = conn.execute("DELETE FROM positions WHERE symbol = ?", (symbol,))
                conn.commit()
                return cursor.rowcount > 0
        
        return await asyncio.get_event_loop().run_in_executor(None, _close)
    
    def _row_to_position(self, row: sqlite3.Row) -> Position:
        """Převede databázový řádek na Position objekt"""
        return Position(
            symbol=row['symbol'],
            side=TradeType(row['side']),
            size=Decimal(str(row['size'])),
            entry_price=Decimal(str(row['entry_price'])),
            current_price=Decimal(str(row['current_price'])),
            unrealized_pnl=Decimal(str(row['unrealized_pnl'])),
            margin=Decimal(str(row['margin'])),
            leverage=row['leverage'],
            created_at=datetime.fromisoformat(row['created_at'])
        )