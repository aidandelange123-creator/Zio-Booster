# Zio-Booster CLI - Command Line Usage Without Git

## 🚀 Quick Start

Zio-Booster now includes a **Command Line Interface (CLI)** that allows you to use the app directly from your command prompt **without needing Git**!

## 📦 Installation

### Windows

1. **Download the files:**
   - Download `zio-booster-cli.py`
   - Download `install-cli.bat`

2. **Run the installer:**
   ```cmd
   install-cli.bat
   ```

3. **Restart your command prompt** and use:
   ```cmd
   zio-booster --help
   ```

### Linux/macOS

1. **Download the files:**
   - Download `zio-booster-cli.py`
   - Download `install-cli.sh`

2. **Make the installer executable:**
   ```bash
   chmod +x install-cli.sh
   ```

3. **Run the installer:**
   ```bash
   ./install-cli.sh
   ```

4. **Restart your terminal** or run:
   ```bash
   source ~/.bashrc  # or ~/.zshrc
   ```

5. **Use the CLI:**
   ```bash
   zio-booster --help
   ```

### Manual Installation (Any OS)

1. **Install Python dependencies:**
   ```bash
   pip install psutil
   ```

2. **Run directly:**
   ```bash
   python zio-booster-cli.py --help
   ```

## 💻 Available Commands

| Command | Description |
|---------|-------------|
| `boost` | Start automatic system optimization for gaming |
| `stop` | Stop the boosting process |
| `status` | Show current system status and optimization state |
| `monitor` | Real-time system monitoring |
| `optimize` | Manual one-click optimization |
| `profile` | Manage game profiles |
| `config` | Configure settings |
| `version` | Show version information |
| `help` | Show help message |

## 📖 Usage Examples

### Check System Status
```bash
zio-booster status
```

Output:
```
============================================================
  Zio-Booster CLI - Status Report
============================================================

📊 Current System Status:
   CPU Usage:      4.8%
   Memory Usage:   34.3%
   Temperature:    N/A

⚙️  Configuration:
   Temperature Threshold:  75°C
   CPU Threshold:          80%
   Memory Threshold:       85%
   Auto-Optimize:          Enabled
   Gaming Mode:            Inactive

🔝 Top Processes by CPU:
   1. chrome.exe           CPU:  15.2%  Memory:  12.3%
   2. discord.exe          CPU:   5.1%  Memory:   8.7%
   ...
```

### Start Automatic Optimization
```bash
zio-booster boost
```

This will continuously monitor your system and automatically optimize when resource usage exceeds thresholds. Press `Ctrl+C` to stop.

### Real-Time Monitoring
```bash
zio-booster monitor
```

Shows real-time CPU, memory, and temperature updates every second.

### Manual Optimization
```bash
zio-booster optimize
```

Performs a one-time manual optimization of high-resource processes.

### View Configuration
```bash
zio-booster config show
```

### Change Settings
```bash
# Set temperature threshold to 70°C
zio-booster config set temperature_threshold 70

# Enable gaming mode
zio-booster config set gaming_mode true

# Reset to defaults
zio-booster config reset
```

### Manage Game Profiles
```bash
# List all profiles
zio-booster profile list

# Create a new profile
zio-booster profile create my-game

# Delete a profile
zio-booster profile delete my-game
```

### Show Version Info
```bash
zio-booster version
```

## ⚙️ Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| `temperature_threshold` | 75 | Temperature threshold (°C) for optimization |
| `cpu_threshold` | 80 | CPU usage threshold (%) for optimization |
| `memory_threshold` | 85 | Memory usage threshold (%) for optimization |
| `auto_optimize` | true | Automatically optimize when thresholds exceeded |
| `gaming_mode` | false | Enable gaming mode optimizations |
| `optimization_interval` | 5 | Seconds between optimization checks |
| `protected_processes` | [...] | List of processes to never terminate |

## 🔧 Advanced Usage

### Run as Background Service (Windows)

Create a batch file to run Zio-Booster in the background:

```batch
@echo off
start /B zio-booster boost
```

### Run on Startup (Linux)

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
zio-booster boost &
```

### Custom Configuration File

The CLI stores configuration in:
- **Windows:** `%USERPROFILE%\AppData\Local\Zio-Booster\config\cli_config.json`
- **Linux/macOS:** `~/.local/share/zio-booster/config/cli_config.json`

You can edit this file directly to customize settings.

## 🐛 Troubleshooting

### "Command not found" after installation
- **Windows:** Restart your command prompt or run `refreshenv`
- **Linux/macOS:** Run `source ~/.bashrc` or restart terminal

### "psutil not installed" error
```bash
pip install psutil
```

### Permission denied (Linux/macOS)
```bash
chmod +x ~/.local/share/zio-booster/zio-booster
```

### Temperature not showing
- Temperature sensors may not be available on all systems
- This is normal and doesn't affect other functionality

## 📋 Requirements

- **Python:** 3.7 or higher
- **Dependencies:** 
  - `psutil` (required for system monitoring)
  - `customtkinter` (optional, for GUI features)

## 🎮 Why Use the CLI?

✅ **No Git Required** - Just download and install  
✅ **Lightweight** - No GUI overhead  
✅ **Scriptable** - Automate optimizations in your own scripts  
✅ **Remote Friendly** - Use over SSH or remote connections  
✅ **Quick Access** - One command from anywhere  

## 📞 Support

For issues or questions, visit: https://github.com/aidandelange123-oss/Zio-Booster

---

**Enjoy faster gaming with Zio-Booster CLI! 🚀**
