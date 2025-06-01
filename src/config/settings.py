import json
import os
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional
from decimal import Decimal
from pathlib import Path


@dataclass
class ApiConfig:
    """Konfigurace API"""
    bybit_api_key: str = ""
    bybit_api_secret: str = ""
    bybit_testnet: bool = True
    trading_enabled: bool = False
    tradingview_username: str = ""
    tradingview_password: str = ""
    openai_api_key: str = ""
    openai_model: str = "gpt-4"
    openai_temperature: float = 0.7
    openai_max_tokens: int = 1000


@dataclass 
class RiskManagementConfig:
    """Konfigurace risk managementu"""
    max_position_size_usd: Decimal = Decimal('1000')
    max_daily_loss_usd: Decimal = Decimal('100')
    stop_loss_percentage: float = 2.0
    take_profit_percentage: float = 5.0
    max_positions: int = 3
    position_size_usd: Decimal = Decimal('100')


@dataclass
class TradingConfig:
    """Konfigurace tradingu"""
    default_symbols: List[str] = field(default_factory=lambda: ["BTCUSDT", "ETHUSDT", "SOLUSDT"])
    refresh_interval: int = 60
    risk_management: RiskManagementConfig = field(default_factory=RiskManagementConfig)
    indicators: Dict[str, Dict[str, Any]] = field(default_factory=dict)


@dataclass
class StrategyConfig:
    """Konfigurace jednotlivé strategie"""
    enabled: bool = True
    weight: float = 1.0
    parameters: Dict[str, Any] = field(default_factory=dict)
    risk_management: Dict[str, Any] = field(default_factory=dict)


@dataclass
class DatabaseConfig:
    """Konfigurace databáze"""
    enabled: bool = True
    type: str = "sqlite"
    path: str = "data/trading.db"
    auto_migrate: bool = True


@dataclass
class LoggingConfig:
    """Konfigurace logování"""
    level: str = "INFO"
    file: str = "logs/trading_assistant.log"
    console: bool = True


@dataclass
class ServerConfig:
    """Konfigurace serveru"""
    host: str = "0.0.0.0"
    port: int = 8000
    base_url: str = "http://localhost:8000"


@dataclass
class Settings:
    """Hlavní konfigurace aplikace"""
    api: ApiConfig = field(default_factory=ApiConfig)
    trading: TradingConfig = field(default_factory=TradingConfig)
    strategies: Dict[str, StrategyConfig] = field(default_factory=dict)
    database: DatabaseConfig = field(default_factory=DatabaseConfig)
    logging: LoggingConfig = field(default_factory=LoggingConfig)
    server: ServerConfig = field(default_factory=ServerConfig)
    environment: str = "development"
    
    @classmethod
    def load_from_file(cls, config_path: str) -> 'Settings':
        """Načte konfiguraci ze souboru"""
        try:
            config_file = Path(config_path)
            if not config_file.exists():
                # Pokud config neexistuje, zkus example
                example_path = config_file.parent / "config.example.json"
                if example_path.exists():
                    print(f"Konfigurace {config_path} neexistuje, používám {example_path}")
                    config_path = str(example_path)
                else:
                    print(f"Konfigurace {config_path} neexistuje, používám výchozí hodnoty")
                    return cls()
            
            with open(config_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            settings = cls()
            
            # API konfigurace
            if 'api' in data:
                api_data = data['api']
                bybit_cfg = api_data.get('bybit', {})
                settings.api = ApiConfig(
                    bybit_api_key=bybit_cfg.get('api_key', ''),
                    bybit_api_secret=bybit_cfg.get('api_secret', ''),
                    bybit_testnet=bybit_cfg.get('testnet', True),
                    trading_enabled=bybit_cfg.get('trading_enabled', False),
                    tradingview_username=api_data.get('tradingview', {}).get('username', ''),
                    tradingview_password=api_data.get('tradingview', {}).get('password', ''),
                    openai_api_key=api_data.get('openai', {}).get('api_key', ''),
                    openai_model=api_data.get('openai', {}).get('model', 'gpt-4'),
                    openai_temperature=api_data.get('openai', {}).get('temperature', 0.7),
                    openai_max_tokens=api_data.get('openai', {}).get('max_tokens', 1000),
                )
            
            # Trading konfigurace
            if 'trading' in data:
                trading_data = data['trading']
                risk_data = trading_data.get('risk_management', {})
                
                risk_config = RiskManagementConfig(
                    max_position_size_usd=Decimal(str(risk_data.get('max_position_size_usd', 1000))),
                    max_daily_loss_usd=Decimal(str(risk_data.get('max_daily_loss_usd', 100))),
                    stop_loss_percentage=risk_data.get('stop_loss_percentage', 2.0),
                    take_profit_percentage=risk_data.get('take_profit_percentage', 5.0),
                    max_positions=trading_data.get('max_positions', 3),
                    position_size_usd=Decimal(str(trading_data.get('position_size', 100)))
                )
                
                settings.trading = TradingConfig(
                    default_symbols=trading_data.get('default_symbols', ["BTCUSDT", "ETHUSDT", "SOLUSDT"]),
                    refresh_interval=trading_data.get('refresh_interval', 60),
                    risk_management=risk_config,
                    indicators=trading_data.get('indicators', {})
                )
            
            # Strategie
            if 'strategies' in data:
                for name, strategy_data in data['strategies'].items():
                    settings.strategies[name] = StrategyConfig(
                        enabled=strategy_data.get('enabled', True),
                        weight=strategy_data.get('weight', 1.0),
                        parameters={k: v for k, v in strategy_data.items() 
                                  if k not in ['enabled', 'weight', 'risk_management']},
                        risk_management=strategy_data.get('risk_management', {})
                    )
            
            # Databáze
            if 'database' in data:
                db_data = data['database']
                settings.database = DatabaseConfig(
                    enabled=db_data.get('enabled', True),
                    type=db_data.get('type', 'sqlite'),
                    path=db_data.get('path', 'data/trading.db'),
                    auto_migrate=db_data.get('auto_migrate', True)
                )
            
            # Logování
            if 'logging' in data:
                log_data = data['logging']
                settings.logging = LoggingConfig(
                    level=log_data.get('level', 'INFO'),
                    file=log_data.get('file', 'logs/trading_assistant.log'),
                    console=log_data.get('console', True)
                )
            
            # Server
            if 'server' in data:
                server_data = data['server']
                settings.server = ServerConfig(
                    host=server_data.get('host', '0.0.0.0'),
                    port=server_data.get('port', 8000),
                    base_url=server_data.get('base_url', 'http://localhost:8000')
                )
            
            settings.environment = data.get('environment', 'development')
            
            return settings
            
        except Exception as e:
            print(f"Chyba při načítání konfigurace: {e}")
            print("Používám výchozí konfiguraci")
            return cls()
    
    @classmethod 
    def load_from_env(cls) -> 'Settings':
        """Načte konfiguraci z environment variables"""
        settings = cls()
        
        # API keys z ENV
        settings.api.bybit_api_key = os.getenv('BYBIT_API_KEY', '')
        settings.api.bybit_api_secret = os.getenv('BYBIT_API_SECRET', '')
        settings.api.bybit_testnet = os.getenv('BYBIT_TESTNET', 'true').lower() == 'true'
        settings.api.trading_enabled = os.getenv('BYBIT_TRADING_ENABLED', 'false').lower() == 'true'
        settings.api.openai_api_key = os.getenv('OPENAI_API_KEY', '')
        
        # Environment
        settings.environment = os.getenv('ENVIRONMENT', 'development')
        
        return settings


def get_settings() -> Settings:
    """Získá konfiguraci aplikace"""
    # Najdi config soubor
    possible_paths = [
        "config/config.json",
        "/home/tv/bybit-trading-assistant/config/config.json",
        "config.json"
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            return Settings.load_from_file(path)
    
    # Pokud není nalezen, zkus environment variables
    env_settings = Settings.load_from_env()
    if env_settings.api.bybit_api_key:
        return env_settings
    
    # Fallback na example config
    example_path = "/home/tv/bybit-trading-assistant/config/config.example.json"
    if os.path.exists(example_path):
        return Settings.load_from_file(example_path)
    
    # Poslední fallback - default
    return Settings()