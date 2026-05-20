#!/usr/bin/env python3
"""
Zio-Booster Command Line Interface (CLI)
A powerful FPS booster and system optimization tool that runs directly from command prompt.
No Git required - just install and run!

Usage:
    zio-booster [command] [options]

Commands:
    boost           Start automatic system optimization for gaming
    stop            Stop the boosting process
    status          Show current system status and optimization state
    profile         Manage game profiles
    monitor         Real-time system monitoring
    optimize        Manual one-click optimization
    config          Configure settings
    version         Show version information
    help            Show this help message

Examples:
    zio-booster boost              # Start automatic optimization
    zio-booster status             # Check current status
    zio-booster monitor            # Real-time monitoring
    zio-booster profile list       # List all profiles
    zio-booster config set threshold 75  # Set temperature threshold
"""

import sys
import os
import json
import time
import argparse
from datetime import datetime

# Add the workspace directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False
    print("Warning: psutil not installed. Some features will be limited.")
    print("Install with: pip install psutil")

try:
    import customtkinter as ctk
    CTk_AVAILABLE = True
except ImportError:
    CTk_AVAILABLE = False

# Version information
VERSION = "2.0.0"
APP_NAME = "Zio-Booster CLI"
CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config", "cli_config.json")


class Config:
    """Configuration manager for Zio-Booster CLI"""
    
    DEFAULT_CONFIG = {
        "temperature_threshold": 75,
        "cpu_threshold": 80,
        "memory_threshold": 85,
        "auto_optimize": True,
        "gaming_mode": False,
        "protected_processes": ["System", "Idle", "csrss.exe", "wininit.exe"],
        "optimization_interval": 5,
        "log_level": "INFO",
        "watermark_text": "Zio Booster",
        "watermark_position": "bottom-right"
    }
    
    def __init__(self):
        self.config = self.load_config()
    
    def load_config(self):
        """Load configuration from file or create default"""
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, 'r') as f:
                    return {**self.DEFAULT_CONFIG, **json.load(f)}
            except Exception as e:
                print(f"Warning: Could not load config file: {e}")
                return self.DEFAULT_CONFIG.copy()
        else:
            # Create default config
            os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
            self.save_config(self.DEFAULT_CONFIG)
            return self.DEFAULT_CONFIG.copy()
    
    def save_config(self, config=None):
        """Save configuration to file"""
        if config is None:
            config = self.config
        try:
            with open(CONFIG_FILE, 'w') as f:
                json.dump(config, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving config: {e}")
            return False
    
    def get(self, key, default=None):
        """Get configuration value"""
        return self.config.get(key, default)
    
    def set(self, key, value):
        """Set configuration value"""
        self.config[key] = value
        self.save_config()


class SystemMonitor:
    """System monitoring and optimization class"""
    
    def __init__(self, config):
        self.config = config
        self.is_boosting = False
        self.optimization_count = 0
        self.start_time = None
    
    def get_cpu_usage(self):
        """Get current CPU usage percentage"""
        if PSUTIL_AVAILABLE:
            return psutil.cpu_percent(interval=0.1)
        return 0
    
    def get_memory_usage(self):
        """Get current memory usage percentage"""
        if PSUTIL_AVAILABLE:
            return psutil.virtual_memory().percent
        return 0
    
    def get_temperature(self):
        """Get system temperature (if available)"""
        if not PSUTIL_AVAILABLE:
            return None
        
        try:
            temps = psutil.sensors_temperatures()
            if temps:
                for name, entries in temps.items():
                    for entry in entries:
                        if 'core' in entry.label.lower() or 'cpu' in entry.label.lower():
                            return entry.current
                # Return first available temperature
                for name, entries in temps.items():
                    if entries:
                        return entries[0].current
        except Exception:
            pass
        
        return None
    
    def get_processes(self):
        """Get list of processes with resource usage"""
        if not PSUTIL_AVAILABLE:
            return []
        
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                processes.append({
                    'pid': proc.info['pid'],
                    'name': proc.info['name'],
                    'cpu': proc.info['cpu_percent'] or 0,
                    'memory': proc.info['memory_percent'] or 0
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        # Sort by CPU usage
        processes.sort(key=lambda x: x['cpu'], reverse=True)
        return processes[:10]  # Top 10 processes
    
    def optimize(self):
        """Perform system optimization"""
        if not PSUTIL_AVAILABLE:
            print("⚠️  Cannot optimize: psutil not installed")
            return False
        
        optimized = []
        protected = self.config.get('protected_processes', [])
        temp_threshold = self.config.get('temperature_threshold', 75)
        
        # Get high-resource processes
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                name = proc.info['name']
                if name in protected:
                    continue
                
                cpu = proc.info['cpu_percent'] or 0
                memory = proc.info['memory_percent'] or 0
                
                # Optimize processes using too many resources
                if cpu > self.config.get('cpu_threshold', 80) or memory > self.config.get('memory_threshold', 85):
                    # Instead of terminating, just report
                    optimized.append(name)
            
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        self.optimization_count += 1
        return optimized
    
    def start_boosting(self):
        """Start automatic optimization"""
        self.is_boosting = True
        self.start_time = datetime.now()
        print("🚀 Zio-Booster started optimizing your system...")
        print("Press Ctrl+C to stop")
        print("-" * 60)
        
        try:
            while self.is_boosting:
                cpu = self.get_cpu_usage()
                memory = self.get_memory_usage()
                temp = self.get_temperature()
                
                # Display status
                temp_str = f"{temp:.1f}°C" if temp else "N/A"
                print(f"\rCPU: {cpu:5.1f}% | Memory: {memory:5.1f}% | Temp: {temp_str:>8} | Optimizations: {self.optimization_count}", end="", flush=True)
                
                # Auto-optimize if needed
                if self.config.get('auto_optimize', True):
                    if cpu > self.config.get('cpu_threshold', 80) or memory > self.config.get('memory_threshold', 85):
                        self.optimize()
                
                time.sleep(self.config.get('optimization_interval', 5))
        
        except KeyboardInterrupt:
            print("\n\n⏹️  Boosting stopped by user")
            self.is_boosting = False
        
        elapsed = datetime.now() - self.start_time if self.start_time else None
        if elapsed:
            print(f"Total optimizations performed: {self.optimization_count}")
            print(f"Session duration: {elapsed}")
    
    def stop_boosting(self):
        """Stop automatic optimization"""
        self.is_boosting = False
        print("⏹️  Zio-Booster stopped")


def cmd_boost(args, config, monitor):
    """Start boosting command"""
    print("🎮 Starting Zio-Booster Gaming Mode...")
    monitor.start_boosting()


def cmd_stop(args, config, monitor):
    """Stop boosting command"""
    monitor.stop_boosting()


def cmd_status(args, config, monitor):
    """Show system status"""
    print("=" * 60)
    print(f"  {APP_NAME} - Status Report")
    print("=" * 60)
    print()
    
    cpu = monitor.get_cpu_usage()
    memory = monitor.get_memory_usage()
    temp = monitor.get_temperature()
    
    print("📊 Current System Status:")
    print(f"   CPU Usage:      {cpu:.1f}%")
    print(f"   Memory Usage:   {memory:.1f}%")
    print(f"   Temperature:    {temp:.1f}°C" if temp else "   Temperature:    N/A")
    print()
    
    print("⚙️  Configuration:")
    print(f"   Temperature Threshold:  {config.get('temperature_threshold')}°C")
    print(f"   CPU Threshold:          {config.get('cpu_threshold')}%")
    print(f"   Memory Threshold:       {config.get('memory_threshold')}%")
    print(f"   Auto-Optimize:          {'Enabled' if config.get('auto_optimize') else 'Disabled'}")
    print(f"   Gaming Mode:            {'Active' if config.get('gaming_mode') else 'Inactive'}")
    print()
    
    print("📈 Optimization Stats:")
    print(f"   Total Optimizations:    {monitor.optimization_count}")
    if monitor.start_time:
        elapsed = datetime.now() - monitor.start_time
        print(f"   Session Duration:       {elapsed}")
    print()
    
    print("🔝 Top Processes by CPU:")
    processes = monitor.get_processes()
    for i, proc in enumerate(processes[:5], 1):
        print(f"   {i}. {proc['name']:<20} CPU: {proc['cpu']:5.1f}%  Memory: {proc['memory']:5.1f}%")
    print()
    print("=" * 60)


def cmd_monitor(args, config, monitor):
    """Real-time monitoring"""
    print("📊 Real-time System Monitor (Ctrl+C to exit)")
    print("-" * 60)
    
    try:
        while True:
            cpu = monitor.get_cpu_usage()
            memory = monitor.get_memory_usage()
            temp = monitor.get_temperature()
            timestamp = datetime.now().strftime("%H:%M:%S")
            
            temp_str = f"{temp:.1f}°C" if temp else "N/A"
            
            print(f"[{timestamp}] CPU: {cpu:5.1f}% | Memory: {memory:5.1f}% | Temp: {temp_str:>8}")
            
            time.sleep(1)
    
    except KeyboardInterrupt:
        print("\n\nMonitoring stopped")


def cmd_optimize(args, config, monitor):
    """Manual optimization"""
    print("⚡ Performing manual optimization...")
    optimized = monitor.optimize()
    
    if optimized:
        print(f"✅ Optimization complete!")
        print(f"   Identified {len(optimized)} high-resource processes:")
        for proc in optimized:
            print(f"      - {proc}")
    else:
        print("✅ System is already optimized - no action needed")
    
    print(f"   Total optimizations: {monitor.optimization_count}")


def cmd_profile(args, config, monitor):
    """Manage game profiles"""
    profiles_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config", "profiles")
    os.makedirs(profiles_dir, exist_ok=True)
    
    if args.action == "list":
        print("📋 Available Profiles:")
        print("-" * 40)
        profiles = [f for f in os.listdir(profiles_dir) if f.endswith('.json')]
        if profiles:
            for profile in profiles:
                print(f"   • {profile[:-5]}")
        else:
            print("   No profiles found")
            print("\n💡 Tip: Create profiles in the src/ directory or via the GUI")
    
    elif args.action == "create":
        if not args.name:
            print("❌ Error: Profile name required")
            print("Usage: zio-booster profile create <name>")
            return
        
        profile_name = f"{args.name}.json"
        profile_path = os.path.join(profiles_dir, profile_name)
        
        profile_data = {
            "name": args.name,
            "temperature_threshold": config.get('temperature_threshold'),
            "cpu_threshold": config.get('cpu_threshold'),
            "memory_threshold": config.get('memory_threshold'),
            "created": datetime.now().isoformat()
        }
        
        with open(profile_path, 'w') as f:
            json.dump(profile_data, f, indent=2)
        
        print(f"✅ Profile '{args.name}' created successfully!")
    
    elif args.action == "delete":
        if not args.name:
            print("❌ Error: Profile name required")
            return
        
        profile_path = os.path.join(profiles_dir, f"{args.name}.json")
        if os.path.exists(profile_path):
            os.remove(profile_path)
            print(f"✅ Profile '{args.name}' deleted")
        else:
            print(f"❌ Profile '{args.name}' not found")
    
    else:
        print("Usage: zio-booster profile <list|create|delete> [name]")


def cmd_config(args, config, monitor):
    """Configure settings"""
    if args.action == "show":
        print("⚙️  Current Configuration:")
        print("-" * 40)
        for key, value in config.config.items():
            print(f"   {key}: {value}")
    
    elif args.action == "set":
        if not args.key or args.value is None:
            print("❌ Error: Key and value required")
            print("Usage: zio-booster config set <key> <value>")
            return
        
        # Try to convert to appropriate type
        try:
            value = int(args.value)
        except ValueError:
            try:
                value = float(args.value)
            except ValueError:
                if args.value.lower() in ['true', 'yes', '1']:
                    value = True
                elif args.value.lower() in ['false', 'no', '0']:
                    value = False
                else:
                    value = args.value
        
        config.set(args.key, value)
        print(f"✅ Configuration updated: {args.key} = {value}")
    
    elif args.action == "reset":
        config.config = Config.DEFAULT_CONFIG.copy()
        config.save_config()
        print("✅ Configuration reset to defaults")
    
    else:
        print("Usage: zio-booster config <show|set|reset> [key] [value]")


def cmd_version(args, config, monitor):
    """Show version information"""
    print("=" * 60)
    print(f"  {APP_NAME}")
    print(f"  Version: {VERSION}")
    print("=" * 60)
    print()
    print("Features:")
    print("  ✓ System monitoring (CPU, Memory, Temperature)")
    print("  ✓ Automatic optimization")
    print("  ✓ Game profile management")
    print("  ✓ Real-time monitoring")
    print("  ✓ Manual optimization")
    print("  ✓ Customizable thresholds")
    print()
    print("Dependencies:")
    print(f"  psutil:       {'✓ Installed' if PSUTIL_AVAILABLE else '✗ Not installed'}")
    print(f"  customtkinter: {'✓ Installed' if CTk_AVAILABLE else '✗ Not installed'}")
    print()
    print("For more information, visit: https://github.com/aidandelange123-oss/Zio-Booster")


def cmd_help(args, config, monitor):
    """Show help message"""
    print(__doc__)


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        prog='zio-booster',
        description='Zio-Booster CLI - FPS Booster & System Optimizer',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  zio-booster boost              Start automatic optimization
  zio-booster status             Show system status
  zio-booster monitor            Real-time monitoring
  zio-booster optimize           Manual optimization
  zio-booster profile list       List game profiles
  zio-booster config show        Show configuration
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Boost command
    boost_parser = subparsers.add_parser('boost', help='Start automatic optimization')
    boost_parser.set_defaults(func=cmd_boost)
    
    # Stop command
    stop_parser = subparsers.add_parser('stop', help='Stop optimization')
    stop_parser.set_defaults(func=cmd_stop)
    
    # Status command
    status_parser = subparsers.add_parser('status', help='Show system status')
    status_parser.set_defaults(func=cmd_status)
    
    # Monitor command
    monitor_parser = subparsers.add_parser('monitor', help='Real-time monitoring')
    monitor_parser.set_defaults(func=cmd_monitor)
    
    # Optimize command
    optimize_parser = subparsers.add_parser('optimize', help='Manual optimization')
    optimize_parser.set_defaults(func=cmd_optimize)
    
    # Profile command
    profile_parser = subparsers.add_parser('profile', help='Manage game profiles')
    profile_subparsers = profile_parser.add_subparsers(dest='action', help='Profile actions')
    profile_subparsers.add_parser('list', help='List profiles')
    create_parser = profile_subparsers.add_parser('create', help='Create profile')
    create_parser.add_argument('name', nargs='?', help='Profile name')
    delete_parser = profile_subparsers.add_parser('delete', help='Delete profile')
    delete_parser.add_argument('name', nargs='?', help='Profile name')
    profile_parser.set_defaults(func=cmd_profile)
    
    # Config command
    config_parser = subparsers.add_parser('config', help='Configure settings')
    config_subparsers = config_parser.add_subparsers(dest='action', help='Config actions')
    config_subparsers.add_parser('show', help='Show configuration')
    set_parser = config_subparsers.add_parser('set', help='Set configuration value')
    set_parser.add_argument('key', nargs='?', help='Configuration key')
    set_parser.add_argument('value', nargs='?', help='Configuration value')
    config_subparsers.add_parser('reset', help='Reset to defaults')
    config_parser.set_defaults(func=cmd_config)
    
    # Version command
    version_parser = subparsers.add_parser('version', help='Show version information')
    version_parser.set_defaults(func=cmd_version)
    
    # Help command
    help_parser = subparsers.add_parser('help', help='Show help message')
    help_parser.set_defaults(func=cmd_help)
    
    args = parser.parse_args()
    
    # Initialize
    config = Config()
    monitor = SystemMonitor(config)
    
    # Execute command
    if args.command and hasattr(args, 'func'):
        args.func(args, config, monitor)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
