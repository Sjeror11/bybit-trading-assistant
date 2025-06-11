#!/usr/bin/env python3
"""
Port monitor pro Bybit Trading Assistant
"""

import socket
import time
import subprocess
import sys
from datetime import datetime

def check_port(host='localhost', port=8501):
    """Zkontroluje zda je port otevřený"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

def get_port_process(port=8501):
    """Získá proces běžící na portu"""
    try:
        result = subprocess.run(['lsof', '-ti', f':{port}'], 
                              capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            pid = result.stdout.strip()
            # Získáme jméno procesu
            proc_result = subprocess.run(['ps', '-p', pid, '-o', 'comm='], 
                                       capture_output=True, text=True)
            if proc_result.returncode == 0:
                return f"PID {pid} ({proc_result.stdout.strip()})"
        return None
    except:
        return None

def check_bybit_status():
    """Zkontroluje stav Bybit aplikace"""
    try:
        result = subprocess.run(['pgrep', '-f', 'streamlit'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            pids = result.stdout.strip().split('\n')
            return f"Streamlit procesy: {', '.join(pids)}"
        return "Žádné Streamlit procesy"
    except:
        return "Nelze zjistit stav"

def main():
    port = 8501
    once_mode = False
    
    if len(sys.argv) > 1:
        if '--once' in sys.argv:
            once_mode = True
        else:
            try:
                port = int(sys.argv[1])
            except:
                print("Použití: python port_monitor.py [PORT] [--once]")
                sys.exit(1)
    
    if once_mode:
        # Jednorázová kontrola pro status příkaz
        timestamp = datetime.now().strftime("%H:%M:%S")
        port_open = check_port('localhost', port)
        
        if port_open:
            process = get_port_process(port)
            print(f"✅ Port {port} je OTEVŘENÝ - {process or 'Neznámý proces'}")
        else:
            print(f"❌ Port {port} je UZAVŘENÝ")
        
        bybit_status = check_bybit_status()
        print(f"📊 Bybit status: {bybit_status}")
        return
    
    print(f"🔍 Monitoring portu {port} pro Bybit Trading Assistant")
    print("Stiskněte Ctrl+C pro ukončení\n")
    
    while True:
        try:
            timestamp = datetime.now().strftime("%H:%M:%S")
            port_open = check_port('localhost', port)
            
            if port_open:
                process = get_port_process(port)
                print(f"[{timestamp}] ✅ Port {port} je OTEVŘENÝ - {process or 'Neznámý proces'}")
            else:
                print(f"[{timestamp}] ❌ Port {port} je UZAVŘENÝ")
            
            # Další informace o Bybit
            bybit_status = check_bybit_status()
            print(f"[{timestamp}] 📊 Status: {bybit_status}")
            print("-" * 60)
            
            time.sleep(10)  # Kontrola každých 10 sekund
            
        except KeyboardInterrupt:
            print("\n👋 Port monitoring ukončen")
            break
        except Exception as e:
            print(f"[{timestamp}] ⚠️ Chyba: {e}")
            time.sleep(10)

if __name__ == "__main__":
    main()