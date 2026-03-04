#!/usr/bin/env python3
"""
Zio-Booster Startup Script with Auto-Update Capability
"""

import sys
import os
import subprocess
import threading
from pathlib import Path

# Add the project root to the path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from utils.update_manager import initialize_auto_updates
from ui.update_notification import UpdateNotificationGUI


def initialize_application():
    """Initialize the application with auto-update capability"""
    print("Initializing Zio-Booster with auto-update capability...")
    
    # Initialize the auto-update system
    initialize_auto_updates()
    
    # Import and launch the main application
    try:
        # Try to use the modern UI first
        from src.modern_main import ZioBoosterApp
        print("Using modern UI with CustomTkinter")
    except ImportError as e:
        print(f"Could not load modern UI: {e}")
        print("Falling back to basic UI")
        from src.main import ZioBoosterApp
    
    # Create and run the application
    app = ZioBoosterApp()
    app.run()


def main():
    """Main entry point"""
    print("Starting Zio-Booster FPS Booster...")
    print("Auto-update system will check for updates...")
    
    # Initialize the application in the main thread
    initialize_application()


if __name__ == "__main__":
    main()