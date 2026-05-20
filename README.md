# Zio-Booster - FPS Booster & Video Browser API

Zio-Booster is a modern FPS boosting application that enhances your gaming experience by optimizing system resources and reducing temperatures in the background. It now includes a powerful **Video Browser API** with custom video player capabilities and branded watermarks.

## 🎉 NEW: NPM Package Available!

You can now install and run Zio Booster using npm! The NPM package automatically installs Git if it's not present on your system.

```bash
# Run without installing
npx zio

# Or install globally
npm install -g zio
zio
```

See [NPM_README.md](NPM_README.md) for full details.

## 🚀 Features

### Core Features
- **Temperature Monitoring**: Continuously monitors system temperature and identifies high-temperature processes
- **Automatic Optimization**: Automatically terminates high-temperature applications to boost FPS
- **Modern UI**: Clean, intuitive interface with real-time system information
- **Safe Process Management**: Protects critical system processes while optimizing performance
- **Real-time Monitoring**: Shows CPU, memory, and temperature statistics
- **Manual Optimization**: One-click manual optimization when needed

### 🎬 Video Browser API System (NEW)
- **Custom Video Player**: Modern, responsive video player with full control capabilities
- **Branded Watermark**: "Zio Booster" watermark displayed on all videos (fully customizable)
- **Multiple Watermark Positions**: Choose from 5 positions (top-left, top-right, bottom-left, bottom-right, center)
- **Watermark Customization**: Adjust opacity, color, font size, and text content
- **Modern Controls**: Play/pause, progress bar, volume control, fullscreen support
- **Keyboard Shortcuts**: Space/K (play/pause), F (fullscreen), M (mute), Arrow keys (volume/seek)
- **Batch Video Loading**: Load multiple videos dynamically
- **Event Callbacks**: onReady, onPlay, onPause, onEnded, onError handlers
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Cross-Browser Compatible**: Supports all modern browsers

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
git clone https://github.com/aidandelange123-oss/Zio-Booster.git
```

2. Navigate to the project directory:
```bash
cd Zio-Booster
```

3. Run the start application script:
```bash
python start-application.py
```

### 🔄 Reinstall Git Files

If you need to reset the repository to a clean state (e.g., to fix corrupted files or revert all changes):

**Option 1: Quick Reset (keeps Git history)**
```bash
# Remove all tracked and untracked files except .git
git clean -fdx
git reset --hard HEAD
```

**Option 2: Complete Reinstall (fresh clone)**
```bash
# Delete the .git directory and reinstall
rm -rf .git
git init
git remote add origin https://github.com/aidandelange123-oss/Zio-Booster.git
git pull origin main
```

**Option 3: Windows Batch Script**
Create a file named `reset_git.bat` with the following content:
```batch
@echo off
echo Deleting Git files...
rmdir /s /q .git
del /q /s .gitignore
echo Git files deleted. Run 'git clone' again to reinstall.
pause
```

Then run:
```bash
reset_git.bat
git clone https://github.com/aidandelange123-oss/Zio-Booster.git
```

⚠️ **Warning**: These commands will remove all local changes and Git history. Make sure to backup any important data before proceeding.

## 🎮 Usage

### FPS Booster Application
1. Run the application using `python start-application.py`
2. The application will automatically install required dependencies
3. Select a game profile from the dropdown menu (optional)
4. Click "Apply Profile" to use custom optimization settings
5. Click "Enable Gaming Mode" to activate focused gaming mode
6. Click "Start Boosting" to begin automatic optimization
7. Monitor system resources and process temperatures in real-time
8. Use "Manual Optimize" for on-demand optimization
9. Click "Stop Boosting" to pause automatic optimization

### 🎬 Video Browser API Usage

#### Quick Start
Include the video browser API script in your HTML:
```html
<script src="js_features/video-browser-api.js"></script>
```

#### Basic Implementation
```javascript
// Initialize player with default settings
const player = new ZioBoosterPlayer({
  container: '#video-container',
  videoUrl: 'https://example.com/video.mp4',
  watermarkText: 'Zio Booster'
});

// Play video
player.play();

// Pause video
player.pause();

// Change video
player.loadVideo('https://example.com/new-video.mp4');

// Destroy player
player.destroy();
```

#### Advanced Configuration
```javascript
const player = new ZioBoosterPlayer({
  container: '#my-player',
  videoUrl: 'https://example.com/video.mp4',
  
  // Watermark settings
  watermarkText: 'Zio Booster',
  watermarkPosition: 'bottom-right', // top-left, top-right, bottom-left, bottom-right, center
  watermarkOpacity: 0.7,
  watermarkColor: '#FFFFFF',
  watermarkFontSize: '24px',
  
  // Player settings
  autoplay: false,
  loop: false,
  muted: false,
  volume: 0.8,
  
  // Event callbacks
  onReady: () => console.log('Player ready'),
  onPlay: () => console.log('Video playing'),
  onPause: () => console.log('Video paused'),
  onEnded: () => console.log('Video ended'),
  onError: (error) => console.error('Error:', error)
});
```

#### Batch Video Loading
```javascript
const videos = [
  'https://example.com/video1.mp4',
  'https://example.com/video2.mp4',
  'https://example.com/video3.mp4'
];

const player = new ZioBoosterPlayer({
  container: '#playlist-player',
  videos: videos,
  watermarkText: 'Zio Booster'
});

// Navigate playlist
player.nextVideo();
player.previousVideo();
```

#### Using the API Helper
```javascript
// Create player with helper function
const player = ZioBoosterAPI.createPlayer('#container', {
  videoUrl: 'https://example.com/video.mp4',
  watermarkText: 'Zio Booster'
});

// Get all active players
const players = ZioBoosterAPI.getAllPlayers();

// Destroy all players
ZioBoosterAPI.destroyAllPlayers();
```

## 🔧 Feature Details

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

### Video Player Features
- **Responsive Controls**: Auto-hide controls when inactive
- **Progress Bar**: Seek to any position by clicking or dragging
- **Volume Control**: Adjustable volume with mute toggle
- **Fullscreen Mode**: Toggle fullscreen with F key or button
- **Time Display**: Current time and total duration
- **Keyboard Navigation**: Full keyboard shortcut support

## 📊 System Information

### FPS Booster UI
The UI displays real-time information including:
- CPU usage percentage
- Memory usage percentage
- System temperature (where supported)
- List of processes with temperature scores
- Current optimization status
- Number of optimizations performed
- Gaming mode status

### Video Player API
The video player provides:
- Custom container element for embedding
- Branded "Zio Booster" watermark overlay
- Full playback controls (play, pause, seek, volume, fullscreen)
- Event callbacks for integration
- Playlist support for multiple videos
- Responsive design for all screen sizes

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
