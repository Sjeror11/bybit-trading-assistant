import json
import os
from pathlib import Path

import pytest

from src.config.settings import Settings, ApiConfig


def test_load_from_file_with_defaults(tmp_path, monkeypatch):
    # No config file: should return default Settings
    config_path = tmp_path / "config.json"
    settings = Settings.load_from_file(str(config_path))
    assert isinstance(settings, Settings)
    # Default environment
    assert settings.environment == "development"
    # Default API config values
    assert settings.api.bybit_api_key == ""
    assert settings.api.bybit_api_secret == ""
    assert settings.api.bybit_testnet is True
    assert settings.api.trading_enabled is False


def test_load_from_file_with_api_data(tmp_path):
    data = {
        "api": {
            "bybit": {
                "api_key": "key123",
                "api_secret": "sec456",
                "testnet": False,
                "trading_enabled": True
            },
            "tradingview": {"username": "tv", "password": "pw"},
            "openai": {"api_key": "oakey", "model": "gpt-3", "temperature": 0.5, "max_tokens": 50}
        },
        "environment": "production"
    }
    config_file = tmp_path / "config.json"
    config_file.write_text(json.dumps(data))
    settings = Settings.load_from_file(str(config_file))
    assert settings.api.bybit_api_key == "key123"
    assert settings.api.bybit_api_secret == "sec456"
    assert settings.api.bybit_testnet is False
    assert settings.api.trading_enabled is True
    assert settings.api.openai_api_key == "oakey"
    assert settings.environment == "production"


@pytest.mark.usefixtures("monkeypatch")
def test_load_from_env(monkeypatch):
    monkeypatch.setenv("BYBIT_API_KEY", "env_key")
    monkeypatch.setenv("BYBIT_API_SECRET", "env_secret")
    monkeypatch.setenv("BYBIT_TESTNET", "false")
    monkeypatch.setenv("BYBIT_TRADING_ENABLED", "true")
    monkeypatch.setenv("OPENAI_API_KEY", "env_oakey")
    monkeypatch.setenv("ENVIRONMENT", "staging")
    settings = Settings.load_from_env()
    assert settings.api.bybit_api_key == "env_key"
    assert settings.api.bybit_api_secret == "env_secret"
    assert settings.api.bybit_testnet is False
    assert settings.api.trading_enabled is True
    assert settings.api.openai_api_key == "env_oakey"
    assert settings.environment == "staging"