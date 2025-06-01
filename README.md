# Bybit Trading Assistant

Pokročilý automatizovaný obchodní asistent pro Bybit kryptoměnovou burzu s podporou více obchodních strategií.

## 🚀 Funkce

- **Více obchodních strategií**: Trend Following, RSI+MACD, Breakout, Volume
- **Asynchronní zpracování**: Vysoký výkon s async/await
- **Risk Management**: Kontrola pozic, stop loss, take profit
- **Clean Architecture**: Domain-Driven Design, modulární struktura
- **SQLite databáze**: Lokální uložení obchodů a dat
- **Real-time monitoring**: Sledování pozic a výkonnosti
- **Konfigurovatelné**: JSON konfigurace + environment variables

## 📋 Požadavky

- Python 3.8+
- Bybit účet s API klíči
- Doporučeno: Virtual environment
- Debian/Ubuntu: sudo apt-get install -y libjpeg-dev zlib1g-dev
- Fedora/RedHat: sudo dnf install -y libjpeg-turbo-devel zlib-devel

## 🛠️ Instalace

1. **Klonování a příprava**:
```bash
cd bybit-trading-assistant
python -m venv venv
source venv/bin/activate  # Linux/Mac
# nebo
venv\Scripts\activate     # Windows
```

2. **Instalace závislostí**:
```bash
pip install -r requirements.txt
```

3. **Konfigurace**:
```bash
# Zkopíruj vzorové soubory
cp config/config.example.json config/config.json
cp .env.example .env

# Uprav config.json a .env s tvými API klíči
```

## ⚙️ Konfigurace

### API Klíče

1. **Bybit API klíče**:
   - Přihlaš se na [Bybit](https://www.bybit.com)
   - Jdi na API Management
   - Vytvoř nové API klíče s oprávněními pro trading
   - Zkopíruj do `config/config.json` nebo `.env`
   - V souboru `config/config.json` v sekci `api.bybit` nastav `"trading_enabled": true`

2. **Testnet vs Mainnet**:
   - Doporučuji začít s `testnet: true`
   - Testnet klíče získáš na [testnet.bybit.com](https://testnet.bybit.com)

### Konfigurace strategií

Upravte `config/config.json`:

```json
{
  "strategies": {
    "trend_following": {
      "enabled": true,
      "weight": 1.0,
      "fast_period": 9,
      "slow_period": 21
    },
    "rsi_macd": {
      "enabled": true,
      "weight": 1.2,
      "rsi_period": 14,
      "rsi_overbought": 70,
      "rsi_oversold": 30
    }
  }
}
```

## 🚀 Spuštění

### 1. Test připojení
```bash
python test_connection.py
```

### 2. Spuštění bota
```bash
python run_bot.py
```

### 3. Pouze dashboard (Streamlit)
```bash
bash run_dashboard_only.sh
```

### 4. Jedním příkazem
Pro rychlé spuštění (včetně aktivace prostředí, instalace závislostí, testů a spuštění dashboardu) použijte:
```bash
bash start.sh
```

### 5. Desktopová ikona
Pro rychlé spuštění můžete nainstalovat desktopovou zkratku s ikonou (např. zelený dolar):

1. Ujistěte se, že v kořenovém adresáři máte soubor `bybit-trading-assistant.desktop` a adresář `icons/green-dollar.png`.
2. Vytvořte si adresář pro ikony (pokud neexistuje):
   ```bash
   mkdir -p icons
   ```
3. Umístěte si vlastní ikonu ve tvaru zeleného dolaru do `icons/green-dollar.png`.
4. Zkopírujte desktopový soubor na plochu:
   ```bash
   cp bybit-trading-assistant.desktop ~/Desktop/
   chmod +x ~/Desktop/bybit-trading-assistant.desktop
   ```
5. Dvojklikem na ikonu na ploše spustíte dashboard.

## 📊 Strategie

### Trend Following
- Používá rychlou a pomalou EMA
- Signály při crossover moving averages
- Vhodné pro trendové trhy

### RSI + MACD
- Kombinuje RSI a MACD indikátory
- Filtruje falešné signály
- Vhodné pro konsolidující trhy

### Risk Management
- Maximální počet pozic: 3
- Stop loss: 2% z pozice
- Take profit: 5% z pozice
- Maximální denní ztráta: $100

## 📁 Struktura projektu

```
src/
├── domain/           # Doménová logika
│   ├── models/       # Datové modely
│   ├── repositories/ # Repository interfaces
│   └── services/     # Domain services
├── application/      # Aplikační logika
├── infrastructure/   # Externí závislosti
│   ├── external/     # API klienti
│   └── persistence/  # Databáze
├── strategies/       # Obchodní strategie
└── config/          # Konfigurace
```

## 🔧 Vývoj

### Přidání nové strategie

1. Vytvoř novou třídu dědící z `BaseStrategy`
2. Implementuj metody `analyze()` a `get_required_candles_count()`
3. Přidej do `TradingOrchestrator._init_strategies()`
4. Aktualizuj konfiguraci

### Testování

```bash
# Spuštění testů
pytest tests/

# Test konkrétní strategie
python -m strategies.test_trend_following
```

## 📈 Monitoring

Bot loguje do:
- `logs/trading_assistant.log` - aplikační logy
- Konzole - real-time output
- Databáze - všechny obchody a pozice

## ⚠️ Upozornění

- **VŽDY začni s testnetem!**
- Bot obchoduje automaticky - může ztratit peníze
- Nastav si odpovídající risk management
- Monitoruj výkonnost a pozice
- Používej pouze peníze, které si můžeš dovolit ztratit

## 🤝 Přispívání

1. Fork repozitář
2. Vytvoř feature branch
3. Implementuj změny s testy
4. Pošli pull request

## 📄 Licence

MIT License - viz LICENSE soubor

## 🆘 Podpora

- Issues: [GitHub Issues](https://github.com/Sjeror11/bybit-trading-assistant/issues)
- Dokumentace: Viz docs/ složka
- Email: [tvůj-email]

---

**⚡ Happy Trading! ⚡**

*Nezapomeň: Obchodování s kryptoměnami je rizikové. Nikdy neinvestuj více, než si můžeš dovolit ztratit.*