#!/usr/bin/env bash
set -e

echo "🐍 Aktivace virtuálního prostředí..."
source venv/bin/activate

echo "📦 Instalace závislostí..."
if ! pip install -r requirements.txt; then
    echo "⚠️ Instalace závislostí selhala kvůli Pillow (JPEG dependency)."
    echo "   Na Debian/Ubuntu: sudo apt-get install -y libjpeg-dev zlib1g-dev"
    echo "   Na Fedora/RedHat: sudo dnf install -y libjpeg-turbo-devel zlib-devel"
    echo "Poté spusťte znovu: bash start.sh"
    exit 1
fi

echo "✅ Spuštění testů..."
pytest -q

echo "🚀 Spuštění Streamlit dashboardu..."
bash run_dashboard_only.sh