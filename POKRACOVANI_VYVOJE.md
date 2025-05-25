# Plán pro pokračování vývoje

## Klíčové dokumenty pro pochopení projektu

Pro rychlé a efektivní pokračování ve vývoji jsou nejdůležitější tyto dokumenty:

1. **[GUIDE.md](/home/tv/bybit-trading-assistant/docs/GUIDE.md)**
   - Kompletní přehled aplikace
   - Popis architektury a klíčových komponent
   - Návod na instalaci a používání

2. **[ROADMAP.md](/home/tv/bybit-trading-assistant/ROADMAP.md)**
   - Plán budoucího vývoje rozdělený do 5 fází
   - Prioritizace úkolů
   - Odhady časové náročnosti

3. **[STRATEGIES.md](/home/tv/bybit-trading-assistant/docs/STRATEGIES.md)**
   - Detailní popis implementovaných obchodních strategií
   - Parametry jednotlivých strategií
   - Testování a vyhodnocování

## Aktuální stav a opravy k dokončení

Pro úspěšné dokončení projektu je třeba věnovat pozornost těmto opravám:

1. **Oprava asynchronního kódu** - viz [OPRAVA_ASYNC.md](/home/tv/bybit-trading-assistant/OPRAVA_ASYNC.md)
   - Komplexní revize asynchronního zpracování
   - Oprava problémů s `async/await`
   - Implementace paralelního zpracování

2. **API integrace** - viz [BYBIT_API_SETUP.md](/home/tv/bybit-trading-assistant/BYBIT_API_SETUP.md)
   - Správné nastavení API klíčů
   - Ošetření chyb při komunikaci s Bybit API
   - Opravy v souboru `/home/tv/bybit-trading-assistant/src/infrastructure/external/bybit/bybit_client.py`

3. **Dashboard a monitoring** - viz [DASHBOARD.md](/home/tv/bybit-trading-assistant/DASHBOARD.md)
   - Optimalizace dashboardu pro sledování obchodů
   - Rozšíření funkcionality pro analýzu výsledků

## Postup pro příští vývojáře

1. **Seznámení s projektem**
   - Prostudovat GUIDE.md pro pochopení architektury
   - Projít ROADMAP.md pro pochopení dalších kroků
   - Analyzovat STRATEGIES.md pro pochopení implementovaných strategií

2. **Oprava existujících problémů**
   - Implementovat opravy z OPRAVA_ASYNC.md
   - Opravit problémy s API integrací
   - Testovat funkcionalitu každé strategie jednotlivě

3. **Pokračování ve vývoji podle plánu**
   - Implementovat další fáze z ROADMAP.md podle priorit
   - Dodržovat stávající architektonické principy
   - Průběžně testovat nové funkcionality

## Technická dokumentace

Podrobná technická dokumentace je dostupná v těchto souborech:

- **[DATABASE.md](/home/tv/bybit-trading-assistant/docs/DATABASE.md)** - struktura databáze
- **[TRADINGVIEW_INTEGRATION.md](/home/tv/bybit-trading-assistant/docs/TRADINGVIEW_INTEGRATION.md)** - integrace s TradingView

## Spouštění a testování

Aplikaci lze spustit pomocí těchto skriptů:

- **[run_dashboard_only.sh](/home/tv/bybit-trading-assistant/run_dashboard_only.sh)** - spuštění pouze dashboardu (funkční)
- **[run_bot.sh](/home/tv/bybit-trading-assistant/run_bot.sh)** - spuštění obchodního bota (vyžaduje opravy)
- **[test_bybit_api_connection.py](/home/tv/bybit-trading-assistant/test_bybit_api_connection.py)** - testování API připojení
- **[test_strategies.sh](/home/tv/bybit-trading-assistant/test_strategies.sh)** - testování obchodních strategií

## Použité technologie

- Python 3.8+
- SQLite databáze
- Streamlit pro dashboard
- Bybit API pro obchodování
- Asynchronní programování (asyncio)
- Domain-Driven Design a Clean Architecture

---

Dokument vytvořen: 24.05.2025