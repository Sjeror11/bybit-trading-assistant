import sys
from pathlib import Path

# Ensure project root is in sys.path for imports
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))