#!/usr/bin/env python3
"""
Spouštěcí skript pro Bybit Trading Assistant
"""

import sys
import os
from pathlib import Path

# Přidej src složku do Python path
project_root = Path(__file__).parent
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

# Nastav environment proměnné
os.environ.setdefault('PYTHONPATH', str(src_path))

if __name__ == "__main__":
    from src.main import main
    import asyncio
    
    print("🚀 Spouštím Bybit Trading Assistant...")
    print(f"📁 Projekt: {project_root}")
    print(f"🐍 Python path: {src_path}")
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⏹️  Ukončuji na požádání uživatele...")
    except Exception as e:
        print(f"❌ Kritická chyba: {e}")
        sys.exit(1)