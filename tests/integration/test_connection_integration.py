import os
import asyncio
import pytest

pytestmark = pytest.mark.skipif(
    not (os.getenv('BYBIT_API_KEY') and os.getenv('BYBIT_API_SECRET')),  # skip when creds missing
    reason="BYBIT_API_KEY and BYBIT_API_SECRET not set, skipping integration tests",
)

from test_connection import test_connection


@pytest.mark.asyncio
async def test_connection_script_integration():
    success = await test_connection()
    assert success is True