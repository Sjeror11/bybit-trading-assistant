 # API Integrace (Bybit API Setup)

 Tento dokument popisuje, jak získat API klíče s oprávněním k obchodování (trading) z Bybit a jak je nakonfigurovat v aplikaci.

 ## 1. Vytvoření Bybit API klíčů

 1. Přihlaste se do svého účtu na [Bybit](https://www.bybit.com) (pro testnet použijte [testnet.bybit.com](https://testnet.bybit.com)).
 2. V menu vyberte **API Management**.
 3. Klikněte na **Create New API Key**.
 4. Zvolte název klíče (např. `TradingAssistant`) a zaškrtněte **Enable Trade** (trading oprávnění).
 5. (Volitelně) Omezte IP adresy, ze kterých lze klíč použít (doporučeno).
 6. Uložte si **API Key** a **API Secret** na bezpečné místo.

 ## 2. Konfigurace v aplikaci

 Otevřete `config/config.json` a doplňte sekci `api.bybit`:

 ```json
 "api": {
   "bybit": {
     "api_key": "<VAŠE_API_KEY>",
     "api_secret": "<VAŠE_API_SECRET>",
     "testnet": true,
     "trading_enabled": true
   },
   ...
 }
 ```

 - Pokud obchodujete na mainnetu, nastavte `"testnet": false`.

 ## 3. Ověření připojení

 Spusťte test připojení:

 ```bash
 python test_connection.py
 ```

 Ověřte, že se načte zůstatek účtu a zobrazí stav `Trading Enabled: True`.

 ---
 *Dokument vytvořen: 01.06.2025*