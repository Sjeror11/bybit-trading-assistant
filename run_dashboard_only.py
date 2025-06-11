#!/usr/bin/env python3
"""
Streamlit dashboard pro monitoring Bybit Trading Assistant.
"""
import sys
from pathlib import Path
import asyncio

sys.path.insert(0, str(Path(__file__).parent))

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

from src.config.settings import get_settings
from src.infrastructure.external.bybit.bybit_client import BybitClient
from src.infrastructure.persistence.database.sqlite_trade_repository import SqliteTradeRepository

settings = get_settings()

st.title("Bybit Trading Assistant – Dashboard")
st.markdown("Monitorování stavu bota, otevřených pozic a performance.")
# Sidebar: auto-refresh interval for real-time monitoring (seconds)
refresh_interval = st.sidebar.number_input(
    "Interval obnovování (s)", min_value=5, max_value=3600, value=10, step=5
)
# Automatic rerun when interval elapses
if "last_refresh" not in st.session_state:
    st.session_state.last_refresh = datetime.now()
if (datetime.now() - st.session_state.last_refresh).seconds >= refresh_interval:
    st.session_state.last_refresh = datetime.now()
    st.experimental_rerun()

async def fetch_account_data():
    async with BybitClient(
        settings.api.bybit_api_key,
        settings.api.bybit_api_secret,
        settings.api.bybit_testnet
    ) as client:
        assets = await client.get_account_assets()
        balance = await client.get_account_balance()
        positions = await client.get_positions()
    return assets, balance, positions

assets, balance, positions = asyncio.run(fetch_account_data())

st.subheader("Zůstatek účtu")
if assets:
    df_assets = pd.DataFrame(assets)
    for col in ("walletBalance", "availableBalance", "equity"):
        if col not in df_assets.columns:
            df_assets[col] = 0.0
        df_assets[col] = df_assets[col].astype(float)
    usdt = df_assets[df_assets["coin"] == "USDT"]
    if not usdt.empty:
        w = usdt["walletBalance"].iloc[0]
        a = usdt["availableBalance"].iloc[0]
        e = usdt["equity"].iloc[0]
        c1, c2, c3 = st.columns(3)
        c1.metric("USDT WalletBalance", f"{w:.2f}")
        c2.metric("USDT Available", f"{a:.2f}")
        c3.metric("USDT Equity", f"{e:.2f}")
    total_eq = df_assets["equity"].sum()
    st.metric("Total Asset (Equity)", f"{total_eq:.2f}")
    df_hold = df_assets[df_assets["equity"] > 0][["coin", "walletBalance", "availableBalance", "equity"]]
    st.dataframe(df_hold)
else:
    st.metric(label="USDT Balance", value=f"{balance:.2f}")

st.subheader("Otevřené pozice")
if positions:
    df_pos = pd.DataFrame([{
        "symbol": p.symbol,
        "side": p.side.name,
        "size": float(p.size),
        "entry_price": float(p.entry_price),
        "current_price": float(p.current_price),
        "unrealized_pnl": float(p.unrealized_pnl),
        "leverage": p.leverage
    } for p in positions])
    total_positions = len(df_pos)
    total_unrealized = df_pos["unrealized_pnl"].sum()
    col_count, col_unrealized = st.columns(2)
    col_count.metric("Počet pozic", total_positions)
    col_unrealized.metric("Celkové neuskutečněné PnL (USDT)", f"{total_unrealized:.2f}")
    st.dataframe(df_pos)
else:
    st.info("Žádné aktivní pozice")

st.subheader("Historie obchodů")
col1, col2 = st.columns(2)
with col1:
    start_date = st.date_input("Počáteční datum", value=datetime.now() - timedelta(days=7))
with col2:
    end_date = st.date_input("Koncové datum", value=datetime.now())

trade_repo = SqliteTradeRepository(settings.database.path)
trades = asyncio.run(trade_repo.get_trades_by_date_range(
    datetime.combine(start_date, datetime.min.time()),
    datetime.combine(end_date, datetime.max.time())
))

if trades:
    df_trades = pd.DataFrame([{
        "timestamp": t.created_at,
        "symbol": t.symbol,
        "pnl": float(t.pnl or 0)
    } for t in trades])
    fig = px.bar(df_trades, x="timestamp", y="pnl", color="symbol", title="PnL podle obchodů")
    st.plotly_chart(fig, use_container_width=True)
else:
    st.info("Žádné obchody v zadaném intervalu")

st.subheader("Performance analytics")
if trades:
    total_pnl = df_trades["pnl"].sum()
    st.metric("Celkový realizovaný PnL (USDT)", f"{total_pnl:.2f}")
    pnl_by_symbol = df_trades.groupby("symbol")["pnl"].sum().reset_index()
    fig_sym = px.bar(pnl_by_symbol, x="symbol", y="pnl", title="PnL podle symbolů")
    st.plotly_chart(fig_sym, use_container_width=True)
    df_trades["date"] = pd.to_datetime(df_trades["timestamp"]).dt.date
    daily_pnl = df_trades.groupby("date")["pnl"].sum().reset_index()
    fig_daily = px.line(daily_pnl, x="date", y="pnl", title="Denní PnL")
    st.plotly_chart(fig_daily, use_container_width=True)

st.subheader("Tržní data")
symbol = st.selectbox("Symbol", settings.trading.default_symbols)
interval = st.selectbox("Interval (minuty)", ["1", "3", "5", "15", "60", "240", "D"])

async def fetch_klines(sym, interval, limit=100):
    async with BybitClient(
        settings.api.bybit_api_key,
        settings.api.bybit_api_secret,
        settings.api.bybit_testnet
    ) as client:
        candles = await client.get_klines(sym, interval, limit)
    return candles

candles = asyncio.run(fetch_klines(symbol, interval))
if candles:
    df_candle = pd.DataFrame([{
        "timestamp": c.timestamp,
        "open": float(c.open),
        "high": float(c.high),
        "low": float(c.low),
        "close": float(c.close)
    } for c in candles])
    fig2 = go.Figure(data=[go.Candlestick(
        x=df_candle["timestamp"],
        open=df_candle["open"],
        high=df_candle["high"],
        low=df_candle["low"],
        close=df_candle["close"]
    )])
    fig2.update_layout(title=f"Candlestick {symbol}", xaxis_title="Čas", yaxis_title="Cena")
    st.plotly_chart(fig2, use_container_width=True)
else:
    st.info("Nenalezena tržní data")