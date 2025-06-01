# DASHBOARD – Streamlit Dashboard

Tento dokument popisuje, jak spustit a používat Streamlit dashboard pro monitorování Bybit Trading Assistant.

## Spuštění

1. Aktivujte virtuální prostředí:
   ```bash
   source activate_env.sh
   ```
2. Ujistěte se, že máte nainstalované závislosti:
   ```bash
   pip install -r requirements.txt
   ```
3. Spusťte dashboard:
   ```bash
   bash run_dashboard_only.sh
   ```
4. V dashboardu můžete v sidebaru nastavit interval obnovování dat (výchozí 10 s) pro real-time monitoring.

## Popis sekcí dashboardu

- **Zůstatek účtu**: aktuální zůstatek USDT načtený z Bybit API.
- **Otevřené pozice**: tabulka všech aktivních pozic s informacemi o velikosti, entry/current price a unrealized PnL.
- **Historie obchodů**: interaktivní graf PnL jednotlivých obchodů za vybrané období.
- **Tržní data**: výběr symbolu a interval, vykreslení candlestick grafu z historických dat.
- **Real-time monitoring**: automatické obnovování zůstatku a otevřených pozic dle nastaveného intervalu.
- **Performance analytics**: metriky celkového a denního PnL a rozdělení PnL podle symbolů.

## Konfigurace

Dashboard využívá nastavení z konfiguračního souboru (`config/config.json`) nebo proměnných prostředí. Přes API klíče a flag `trading_enabled` se určuje, zda se používá testnet či mainnet.

> Poznámka: V případě potřeby rozšířit dashboard o další metriky či grafy, upravte soubor `run_dashboard_only.py`.