# Zio-Booster FPS Booster

Zio-Booster is a modern FPS boosting application that enhances your gaming experience by optimizing system resources and reducing temperatures in the background.

## 🚀 Features

### Core Features
- **Temperature Monitoring**: Continuously monitors system temperature and identifies high-temperature processes
- **Automatic Optimization**: Automatically terminates high-temperature applications to boost FPS
- **Modern UI**: Clean, intuitive interface with real-time system information
- **Safe Process Management**: Protects critical system processes while optimizing performance
- **Real-time Monitoring**: Shows CPU, memory, and temperature statistics
- **Manual Optimization**: One-click manual optimization when needed

### Safety Features
- **Input Validation Safety Feature (Rust)**: Validates all input parameters are within acceptable ranges
- **Resource Limits Enforcement Safety Feature (Rust)**: Prevents resource exhaustion attacks
- **Numeric Overflow Prevention Safety Feature (Rust)**: Protects against numeric overflow vulnerabilities
- **Error Checking Safety Feature (C++)**: Adds comprehensive error checking for system calls
- **Buffer Overflow Prevention Safety Feature (C++)**: Implements bounds checking for arrays and strings
- **Process Validation Safety Feature (C++)**: Validates process IDs and protects critical system processes

## 📋 Requirements

- Python 3.7 or higher
- Windows, macOS, or Linux operating system

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/aidandelange170-hub/Zio-Booster.git
```

2. Navigate to the project directory:
```bash
cd Zio-Booster
```

3. Run the start application script:
```bash
python start-application.py
```

## 🎮 Usage

1. Run the application using `python start-application.py`
2. The application will automatically install required dependencies
3. Select a game profile from the dropdown menu (optional)
4. Click "Apply Profile" to use custom optimization settings
5. Click "Enable Gaming Mode" to activate focused gaming mode
6. Click "Start Boosting" to begin automatic optimization
7. Monitor system resources and process temperatures in real-time
8. Use "Manual Optimize" for on-demand optimization
9. Click "Stop Boosting" to pause automatic optimization

## 🔧 New Feature Details

### Game Profile Management
- Create custom profiles for different games with specific optimization settings
- Each profile can have different temperature thresholds and optimization behaviors
- Profiles are saved between sessions

### Gaming Mode
- Blocks system notifications during gameplay
- Disables power-saving features temporarily
- Sets high-performance power plan
- Optimizes background services

### Performance Metrics
- Tracks CPU, memory, and temperature trends
- Provides optimization impact analysis
- Historical performance statistics

## 📊 System Information

The UI displays real-time information including:
- CPU usage percentage
- Memory usage percentage
- System temperature (where supported)
- List of processes with temperature scores
- Current optimization status
- Number of optimizations performed
- Gaming mode status

## ⚠️ Safety Features

- Protected critical system processes from termination
- Safeguards against terminating important applications
- Temperature-based scoring to identify problematic processes
- Confirmation prompts for manual actions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Issues

If you encounter any issues, please report them in the Issues section of the repository.
