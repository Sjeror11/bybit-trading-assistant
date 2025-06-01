import sqlite3
import asyncio
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from ....domain.models import Candle, Ticker, OrderBook
from ....domain.repositories import IMarketDataRepository


class SqliteMarketDataRepository(IMarketDataRepository):
    """SQLite implementace market data repository"""
    
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
            # Tabulka pro svíčky
            conn.execute("""
                CREATE TABLE IF NOT EXISTS candles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    symbol TEXT NOT NULL,
                    timestamp TIMESTAMP NOT NULL,
                    open_price REAL NOT NULL,
                    high_price REAL NOT NULL,
                    low_price REAL NOT NULL,
                    close_price REAL NOT NULL,
                    volume REAL NOT NULL,
                    UNIQUE(symbol, timestamp)
                )
            """)
            
            # Index pro rychlejší vyhledávání
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_candles_symbol_timestamp 
                ON candles(symbol, timestamp)
            """)
            
            # Tabulka pro ticker data
            conn.execute("""
                CREATE TABLE IF NOT EXISTS tickers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    symbol TEXT NOT NULL,
                    last_price REAL NOT NULL,
                    bid_price REAL NOT NULL,
                    ask_price REAL NOT NULL,
                    volume_24h REAL NOT NULL,
                    price_change_24h REAL NOT NULL,
                    price_change_percent_24h REAL NOT NULL,
                    timestamp TIMESTAMP NOT NULL
                )
            """)
            
            # Tabulka pro order book (zjednodušená verze)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS order_books (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    symbol TEXT NOT NULL,
                    best_bid REAL,
                    best_ask REAL,
                    spread REAL,
                    timestamp TIMESTAMP NOT NULL
                )
            """)
            
            conn.commit()
    
    async def save_candle(self, candle: Candle) -> None:
        """Uloží svíčku do databáze"""
        def _save():
            with self._get_connection() as conn:
                conn.execute("""
                    INSERT OR REPLACE INTO candles (
                        symbol, timestamp, open_price, high_price, 
                        low_price, close_price, volume
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    candle.symbol, candle.timestamp, float(candle.open),
                    float(candle.high), float(candle.low), float(candle.close),
                    float(candle.volume)
                ))
                conn.commit()
        
        await asyncio.get_event_loop().run_in_executor(None, _save)
    
    async def get_candles(
        self, 
        symbol: str, 
        start_time: datetime, 
        end_time: datetime,
        limit: Optional[int] = None
    ) -> List[Candle]:
        """Získá historická OHLCV data"""
        def _get():
            with self._get_connection() as conn:
                query = """
                    SELECT * FROM candles 
                    WHERE symbol = ? AND timestamp BETWEEN ? AND ?
                    ORDER BY timestamp ASC
                """
                params = [symbol, start_time, end_time]
                
                if limit:
                    query += " LIMIT ?"
                    params.append(limit)
                
                rows = conn.execute(query, params).fetchall()
                return [self._row_to_candle(row) for row in rows]
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def get_latest_candles(self, symbol: str, count: int = 100) -> List[Candle]:
        """Získá posledních N svíček"""
        def _get():
            with self._get_connection() as conn:
                rows = conn.execute("""
                    SELECT * FROM candles 
                    WHERE symbol = ?
                    ORDER BY timestamp DESC
                    LIMIT ?
                """, (symbol, count)).fetchall()
                
                # Vrať v chronologickém pořadí
                candles = [self._row_to_candle(row) for row in reversed(rows)]
                return candles
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def save_ticker(self, ticker: Ticker) -> None:
        """Uloží ticker data"""
        def _save():
            with self._get_connection() as conn:
                conn.execute("""
                    INSERT INTO tickers (
                        symbol, last_price, bid_price, ask_price,
                        volume_24h, price_change_24h, price_change_percent_24h, timestamp
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    ticker.symbol, float(ticker.last_price), float(ticker.bid_price),
                    float(ticker.ask_price), float(ticker.volume_24h),
                    float(ticker.price_change_24h), ticker.price_change_percent_24h,
                    ticker.timestamp
                ))
                conn.commit()
        
        await asyncio.get_event_loop().run_in_executor(None, _save)
    
    async def get_latest_ticker(self, symbol: str) -> Optional[Ticker]:
        """Získá nejnovější ticker pro symbol"""
        def _get():
            with self._get_connection() as conn:
                row = conn.execute("""
                    SELECT * FROM tickers 
                    WHERE symbol = ?
                    ORDER BY timestamp DESC
                    LIMIT 1
                """, (symbol,)).fetchone()
                
                if row:
                    return self._row_to_ticker(row)
                return None
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    async def save_order_book(self, order_book: OrderBook) -> None:
        """Uloží order book"""
        def _save():
            with self._get_connection() as conn:
                best_bid = order_book.best_bid
                best_ask = order_book.best_ask
                spread = order_book.spread
                
                conn.execute("""
                    INSERT INTO order_books (
                        symbol, best_bid, best_ask, spread, timestamp
                    ) VALUES (?, ?, ?, ?, ?)
                """, (
                    order_book.symbol,
                    float(best_bid) if best_bid else None,
                    float(best_ask) if best_ask else None,
                    float(spread) if spread else None,
                    order_book.timestamp
                ))
                conn.commit()
        
        await asyncio.get_event_loop().run_in_executor(None, _save)
    
    async def get_latest_order_book(self, symbol: str) -> Optional[OrderBook]:
        """Získá nejnovější order book"""
        def _get():
            with self._get_connection() as conn:
                row = conn.execute("""
                    SELECT * FROM order_books 
                    WHERE symbol = ?
                    ORDER BY timestamp DESC
                    LIMIT 1
                """, (symbol,)).fetchone()
                
                if row:
                    # Jednoduché order book pouze s best bid/ask
                    best_bid = Decimal(str(row['best_bid'])) if row['best_bid'] else None
                    best_ask = Decimal(str(row['best_ask'])) if row['best_ask'] else None
                    
                    bids = [(best_bid, Decimal('0'))] if best_bid else []
                    asks = [(best_ask, Decimal('0'))] if best_ask else []
                    
                    return OrderBook(
                        symbol=row['symbol'],
                        bids=bids,
                        asks=asks,
                        timestamp=datetime.fromisoformat(row['timestamp'])
                    )
                return None
        
        return await asyncio.get_event_loop().run_in_executor(None, _get)
    
    def _row_to_candle(self, row: sqlite3.Row) -> Candle:
        """Převede databázový řádek na Candle objekt"""
        return Candle(
            symbol=row['symbol'],
            timestamp=datetime.fromisoformat(row['timestamp']),
            open=Decimal(str(row['open_price'])),
            high=Decimal(str(row['high_price'])),
            low=Decimal(str(row['low_price'])),
            close=Decimal(str(row['close_price'])),
            volume=Decimal(str(row['volume']))
        )
    
    def _row_to_ticker(self, row: sqlite3.Row) -> Ticker:
        """Převede databázový řádek na Ticker objekt"""
        return Ticker(
            symbol=row['symbol'],
            last_price=Decimal(str(row['last_price'])),
            bid_price=Decimal(str(row['bid_price'])),
            ask_price=Decimal(str(row['ask_price'])),
            volume_24h=Decimal(str(row['volume_24h'])),
            price_change_24h=Decimal(str(row['price_change_24h'])),
            price_change_percent_24h=row['price_change_percent_24h'],
            timestamp=datetime.fromisoformat(row['timestamp'])
        )