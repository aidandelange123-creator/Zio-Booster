# Zio Booster - NPM Package

Zio Booster is now available as an NPM package! This allows you to easily install and run Zio Booster using npm, with automatic Git installation if needed.

## Quick Start

### Run without installing (recommended for testing)
```bash
npx zio
```

### Install globally
```bash
npm install -g zio
zio
```

### Install locally in your project
```bash
npm install zio
npx zio
```

## Features

When you run `zio` (or `npx zio`), it will:

1. **Auto-detect Git** - Checks if Git is installed on your system
2. **Auto-install Git** - If Git is not found, it will automatically install it:
   - **Windows**: Uses winget or Chocolatey
   - **macOS**: Uses Homebrew
   - **Linux**: Uses apt, yum, dnf, or pacman
3. **Launch Zio Booster** - Starts the Python-based FPS booster application

## What is Zio Booster?

Zio Booster is a powerful system optimization tool that includes:

- 🚀 **FPS Boosting** - Optimize your system for better gaming performance
- 🌡️ **Temperature Monitoring** - Real-time CPU/GPU temperature tracking
- 💻 **System Monitoring** - CPU, memory, and process monitoring
- 🎮 **Game Profiles** - Custom optimization profiles for different games
- 🎬 **Video Browser API** - Custom video player with branded watermarks
- ⚡ **Auto-Optimization** - Automatic system optimization when resources are high

## Requirements

- **Node.js** 14+ (for the NPM package)
- **Python** 3.7+ (for the actual application)
- **Git** (auto-installed if missing)

## Commands

Once installed, you can use:

```bash
# Via NPM (auto-installs Git and launches Zio Booster)
zio

# Direct Python usage (if you prefer)
python start-application.py

# CLI mode
python zio-booster-cli.py boost
python zio-booster-cli.py status
python zio-booster-cli.py monitor
```

## Troubleshooting

### Git installation fails
If automatic Git installation fails, please install Git manually:
- Windows: https://git-scm.com/download/win
- macOS: `brew install git` or download from git-scm.com
- Linux: `sudo apt-get install git` (Debian/Ubuntu) or your distro's package manager

### Python not found
Make sure Python 3.7+ is installed and in your PATH:
- Download from: https://www.python.org/downloads/
- During installation on Windows, check "Add Python to PATH"

### Permission errors on macOS/Linux
Try running with sudo or fix permissions:
```bash
sudo npm install -g zio
# Or
chmod +x /path/to/zio/index.js
```

## Development

To develop or modify the NPM package:

```bash
# Clone the repository
git clone https://github.com/aidandelange123-oss/Zio-Booster.git
cd Zio-Booster

# Link locally for testing
npm link

# Test the command
zio
```

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/aidandelange123-oss/Zio-Booster
- Issues: https://github.com/aidandelange123-oss/Zio-Booster/issues
