# Strategie obchodního asistenta

Tento dokument popisuje implementované obchodní strategie, jejich základní principy a
klíčové parametry, které lze konfigurovat.

## 1. Trend Following (TrendFollowingStrategy)

**Parametry**
- `fast_period` (int): délka rychlé EMA (výchozí 9)
- `slow_period` (int): délka pomalé EMA (výchozí 21)
- `risk_management.stop_loss_percentage` (float): procento pro SL
- `risk_management.take_profit_percentage` (float): procento pro TP

Strategie sleduje průsečíky EMA linií:
- Bullish crossover: rychlá EMA protíná pomalou zdola nahoru → signál BUY
- Bearish crossover: rychlá EMA protíná pomalou shora dolů → signál SELL

## 2. RSI + MACD (RsiMacdStrategy)

**Parametry**
- `rsi_period` (int): délka RSI (výchozí 14)
- `rsi_overbought` (int): hranice overbought (výchozí 70)
- `rsi_oversold` (int): hranice oversold (výchozí 30)
- `macd_fast` (int): délka rychlé EMA pro MACD (výchozí 12)
- `macd_slow` (int): délka pomalé EMA pro MACD (výchozí 26)
- `macd_signal` (int): délka signální EMA (výchozí 9)
- `risk_management.stop_loss_percentage` (float)
- `risk_management.take_profit_percentage` (float)

Kombinuje indikátory RSI a MACD pro potvrzené signály:
- RSI opouští oversold/overbought zóny
- MACD bullish/bearish crossover a rostoucí/klesající histogram

## 3. Breakout (BreakoutStrategy)

**Parametry**
- `lookback_period` (int): počet historických svíček pro výpočet lokálního maxima/minima
- `threshold` (float): procentuální odstup od maxima/minima pro průlom (např. 0.003 = 0,3%)
- `min_touchpoints` (int): minimální počet dotyků hranice před průlomem
- `confirmation_candles` (int): počet svíček pro potvrzení průlomu
- `risk_management.stop_loss_percentage` (float)
- `risk_management.take_profit_percentage` (float)

Detekuje průlolmy cenových extrémů:
- Vypočítá lokální maximum a minimum za `lookback_period` svíček
- Zkontroluje počet dotyků hranice ( minima/maxima ) ≥ `min_touchpoints`
- Počká na jeden z `confirmation_candles`, kde cena zavírá nad/pod hranicí s odstupem ≥ `threshold`

## 4. Volume Spike (VolumeStrategy)

**Parametry**
- `volume_period` (int): počet historických svíček pro průměr objemu
- `volume_threshold` (float): násobek průměrného objemu pro detekci spike (např. 2.0)
- `price_change_threshold` (float): procentuální změna ceny v rámci svíčky pro validaci signálu
- `risk_management.stop_loss_percentage` (float)
- `risk_management.take_profit_percentage` (float)

Hledá objemové spike s potvrzením pohybu ceny:
- Aktuální objem ≥ `volume_threshold` × průměr(objem za volume_period)
- Cena zavírá s relativní změnou ≥ `price_change_threshold` → signál BUY/SELL

---

*Dokument vytvořen: 01.06.2025*