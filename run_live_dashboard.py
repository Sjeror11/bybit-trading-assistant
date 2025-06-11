#!/usr/bin/env python3
"""
Streamlit dashboard pro LIVE režim Bybit Trading Assistant - s ověřením hesla.
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

# Heslo pro LIVE režim
LIVE_PASSWORD = "LIVE"

def check_password():
    """Funkce pro ověření hesla"""
    def password_entered():
        """Callbacks když je heslo zadáno"""
        if st.session_state["password"] == LIVE_PASSWORD:
            st.session_state["password_correct"] = True
            del st.session_state["password"]  # smaž heslo ze session state
        else:
            st.session_state["password_correct"] = False

    if "password_correct" not in st.session_state:
        # První návštěva, zobraz políčko pro heslo
        st.text_input(
            "🔒 Zadej heslo pro LIVE režim:", 
            type="password", 
            on_change=password_entered, 
            key="password"
        )
        st.warning("⚠️ Toto je LIVE režim s reálným obchodováním! Zadej heslo pro pokračování.")
        return False
    elif not st.session_state["password_correct"]:
        # Heslo není správné
        st.text_input(
            "🔒 Zadej heslo pro LIVE režim:", 
            type="password", 
            on_change=password_entered, 
            key="password"
        )
        st.error("❌ Nesprávné heslo. Zkus to znovu.")
        return False
    else:
        # Heslo je správné
        return True

# Ověř heslo před spuštěním dashboardu
if not check_password():
    st.stop()

# Pokud je heslo správné, pokračuj s dashboardem
settings = get_settings()

st.title("🔴 Bybit Trading Assistant – LIVE Dashboard")
st.markdown("**⚠️ POZOR: Toto je LIVE režim s reálným obchodováním!**")
st.markdown("Monitorování stavu bota, otevřených pozic a performance.")

# Sidebar: auto-refresh interval for real-time monitoring (seconds)
refresh_interval = st.sidebar.number_input(
    "Interval obnovování (s)", min_value=5, max_value=3600, value=10, step=5
)

# Automatic rerun when interval elapses
if "last_refresh" not in st.session_state:
    st.session_state.last_refresh = datetime.now()

current_time = datetime.now()
if (current_time - st.session_state.last_refresh).seconds >= refresh_interval:
    st.session_state.last_refresh = current_time
    st.rerun()

# Zobraz upozornění o LIVE režimu
st.sidebar.markdown("---")
st.sidebar.markdown("**🔴 LIVE REŽIM**")
st.sidebar.markdown("Reálné obchodování aktivní!")
st.sidebar.markdown("---")

# Zbytek dashboardu - stejný jako DEMO ale s červenými upozorněními
try:
    # Načítání dat - použij stejný přístup jako DEMO
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

    # Zůstatek účtu
    st.header("💰 Zůstatek účtu (LIVE)")
    try:
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
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("💼 Wallet Balance", f"{w:.2f} USDT")
                with col2:
                    st.metric("💵 Available Balance", f"{a:.2f} USDT")
                with col3:
                    st.metric("📊 Equity", f"{e:.2f} USDT")
            total_eq = df_assets["equity"].sum()
            st.metric("📊 Total Asset (Equity)", f"{total_eq:.2f}")
            df_hold = df_assets[df_assets["equity"] > 0][["coin", "walletBalance", "availableBalance", "equity"]]
            st.dataframe(df_hold, use_container_width=True)
        else:
            st.metric(label="💵 USDT Balance", value=f"{balance:.2f}")
    except Exception as e:
        st.error(f"❌ Chyba při načítání zůstatku: {e}")
    
    # Otevřené pozice
    st.header("📈 Otevřené pozice (LIVE)")
    try:
        if positions:
            df_pos = pd.DataFrame([{
                "symbol": p.symbol,
                "side": p.side.name,
                "size": float(p.size),
                "entry_price": float(p.entry_price),
                "current_price": float(p.current_price),
                "unrealized_pnl": float(p.unrealized_pnl),
            } for p in positions])
            st.dataframe(df_pos, use_container_width=True)
        else:
            st.info("ℹ️ Žádné otevřené pozice")
    except Exception as e:
        st.error(f"❌ Chyba při načítání pozic: {e}")

    # Historie obchodů
    st.header("📊 Historie obchodů")
    col1, col2 = st.columns(2)
    with col1:
        start_date = st.date_input("Počáteční datum", value=datetime.now() - timedelta(days=7))
    with col2:
        end_date = st.date_input("Koncové datum", value=datetime.now())

    try:
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
            
            if not df_trades.empty:
                # Performance grafy
                fig = px.line(df_trades, x="timestamp", y="pnl", 
                            title="PnL v čase", line_shape="linear")
                st.plotly_chart(fig, use_container_width=True)
                
                cumulative_pnl = df_trades["pnl"].cumsum()
                df_trades["cumulative_pnl"] = cumulative_pnl
                fig_cum = px.line(df_trades, x="timestamp", y="cumulative_pnl",
                                title="Kumulativní PnL")
                st.plotly_chart(fig_cum, use_container_width=True)
                
                # PnL podle symbolů
                pnl_by_symbol = df_trades.groupby("symbol")["pnl"].sum().reset_index()
                fig_symbol = px.bar(pnl_by_symbol, x="symbol", y="pnl",
                                  title="PnL podle symbolů")
                st.plotly_chart(fig_symbol, use_container_width=True)
                
                # Tabulka obchodů
                st.dataframe(df_trades.tail(20), use_container_width=True)
        else:
            st.info("ℹ️ Žádné obchody v daném období")
    except Exception as e:
        st.error(f"❌ Chyba při načítání historie: {e}")

except Exception as e:
    st.error(f"❌ Chyba při inicializaci: {e}")

# Footer upozornění
st.markdown("---")
st.markdown("**🔴 POZOR: Toto je LIVE režim s reálnými penězi!**")
st.markdown("Dashboard se automaticky obnovuje každých {} sekund.".format(refresh_interval))