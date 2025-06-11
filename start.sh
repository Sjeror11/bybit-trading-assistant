#!/usr/bin/env bash
set -e

# Funkce pro spuštění port monitoru
start_port_monitor() {
    echo "🔍 Spouštím port monitor..."
    python port_monitor.py > logs/port_monitor.log 2>&1 &
    PORT_MONITOR_PID=$!
    echo $PORT_MONITOR_PID > logs/port_monitor.pid
    echo "📊 Port monitor spuštěn (PID: $PORT_MONITOR_PID)"
}

# Funkce pro zastavení port monitoru
stop_port_monitor() {
    if [ -f logs/port_monitor.pid ]; then
        PID=$(cat logs/port_monitor.pid)
        if kill -0 $PID 2>/dev/null; then
            echo "🛑 Zastavuji port monitor (PID: $PID)..."
            kill $PID
            rm -f logs/port_monitor.pid
        fi
    fi
}

# Trap pro cleanup při ukončení
trap 'stop_port_monitor; exit' INT TERM

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

mode=${1:-all}

case "$mode" in
  bot)
    start_port_monitor
    echo "🚀 Spouštím obchodního bota..."
    python run_bot.py
    ;;  
  dashboard)
    start_port_monitor
    echo "🚀 Spuštění Streamlit dashboardu..."
    bash run_dashboard_only.sh
    ;;  
  all)
    start_port_monitor
    echo "🚀 Spuštění Streamlit dashboardu..."
    bash run_dashboard_only.sh
    ;;
  status)
    echo "📊 Kontrola stavu aplikace..."
    python port_monitor.py --once
    ;;
  stop)
    stop_port_monitor
    echo "🛑 Aplikace zastavena"
    ;;
  *)
    echo "Usage: $0 [bot|dashboard|all|status|stop]"
    echo "  bot       - spustí pouze obchodního bota"
    echo "  dashboard - spustí pouze dashboard"
    echo "  all       - spustí celou aplikaci (výchozí)"
    echo "  status    - zkontroluje stav aplikace"
    echo "  stop      - zastaví všechny procesy"
    exit 1
    ;;
esac