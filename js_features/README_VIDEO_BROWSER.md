# Zio Booster Video Browser API System

## Overview

The Zio Booster Video Browser API is a custom JavaScript video player system that allows users to play video files with a branded "Zio Booster" watermark on all videos. The system provides a simple yet powerful API for integrating video playback with customizable watermarks into any web application.

## Features

### Core Features
- ✅ **Custom Watermark**: All videos display "Zio Booster" watermark by default
- ✅ **Watermark Customization**: Position, opacity, color, font size, and text
- ✅ **Modern Player Controls**: Play/pause, progress bar, volume, fullscreen
- ✅ **Multiple Players**: Support for multiple simultaneous video players
- ✅ **Batch Loading**: Load multiple videos at once
- ✅ **Keyboard Shortcuts**: Space, F, M, arrow keys for quick control
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Event Callbacks**: Ready, play, pause, ended, error events
- ✅ **Cross-Browser**: Compatible with all modern browsers

### Enhanced Features
- 🎨 Customizable watermark positioning (5 positions)
- 🎨 Adjustable watermark opacity (0.1 - 1.0)
- 🎨 Custom watermark colors
- 🎨 Resizable watermark text
- ⌨️ Full keyboard navigation support
- 📱 Touch-friendly controls
- 🔄 Auto-hide controls during playback
- 📊 Real-time progress tracking
- 🔊 Volume control with mute toggle
- 🖥️ Fullscreen mode support

## Installation

### Method 1: Direct Script Include

```html
<script src="js_features/video-browser-api.js"></script>
```

### Method 2: Module Import

```javascript
import { ZioBoosterPlayer, ZioBoosterAPI } from './js_features/video-browser-api.js';
```

### Method 3: CDN (Future)

```html
<script src="https://cdn.ziobooster.com/video-browser-api.js"></script>
```

## Quick Start

### Basic Usage

```javascript
// Create a simple player
const player = new ZioBoosterPlayer({
  container: '#video-container',
  videoUrl: 'https://example.com/video.mp4',
  watermarkText: 'Zio Booster'
});
```

### Using the API Helper

```javascript
// Use the simplified API
const player = ZioBoosterAPI.playVideo('#container', 'video.mp4', {
  watermarkText: 'Zio Booster',
  autoplay: true
});
```

### Multiple Videos

```javascript
// Load multiple videos at once
const videos = [
  'https://example.com/video1.mp4',
  'https://example.com/video2.mp4',
  'https://example.com/video3.mp4'
];

const players = ZioBoosterAPI.batchPlayVideos('#container', videos, {
  height: '300px',
  autoPlayFirst: true
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | String/Element | Required | DOM element or CSS selector |
| `videoUrl` | String | `''` | URL of the video file |
| `watermarkText` | String | `'Zio Booster'` | Watermark text |
| `watermarkPosition` | String | `'bottom-right'` | Position: top-left, top-right, bottom-left, bottom-right, center |
| `watermarkOpacity` | Number | `0.7` | Opacity level (0.0 - 1.0) |
| `watermarkColor` | String | `'#ffffff'` | Color in hex format |
| `watermarkFontSize` | String | `'24px'` | Font size with units |
| `autoplay` | Boolean | `false` | Auto-play on load |
| `showControls` | Boolean | `true` | Show/hide controls |
| `onReady` | Function | `() => {}` | Callback when ready |
| `onPlay` | Function | `() => {}` | Callback on play |
| `onPause` | Function | `() => {}` | Callback on pause |
| `onEnded` | Function | `() => {}` | Callback on end |
| `onError` | Function | `() => {}` | Callback on error |

## API Methods

### Player Instance Methods

```javascript
// Load a new video
player.loadVideo('https://example.com/new-video.mp4');

// Playback control
player.play();
player.pause();
player.togglePlay();

// Seeking
player.seekTo(0.5);        // Seek to 50%
player.seekRelative(10);   // Forward 10 seconds
player.seekRelative(-10);  // Backward 10 seconds

// Volume control
player.setVolume(0.8);     // Set volume to 80%
player.toggleMute();       // Toggle mute

// Fullscreen
player.toggleFullscreen();

// Watermark customization
player.setWatermark('New Text');
player.setWatermarkOptions({
  position: 'top-right',
  opacity: 0.9,
  color: '#ff0000',
  fontSize: '32px'
});

// Cleanup
player.destroy();
```

### Static API Methods

```javascript
// Create a player
const player = ZioBoosterAPI.createPlayer(container, options);

// Play a single video
const player = ZioBoosterAPI.playVideo('#container', 'video.mp4', options);

// Play multiple videos
const players = ZioBoosterAPI.batchPlayVideos('#container', videoArray, options);
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` or `K` | Play/Pause |
| `F` | Toggle Fullscreen |
| `M` | Mute/Unmute |
| `←` | Rewind 5 seconds |
| `→` | Forward 5 seconds |

## Event Callbacks

```javascript
const player = new ZioBoosterPlayer({
  container: '#video-player',
  videoUrl: 'video.mp4',
  
  onReady: (player) => {
    console.log('Player is ready!');
  },
  
  onPlay: (player) => {
    console.log('Video started playing');
  },
  
  onPause: (player) => {
    console.log('Video paused');
  },
  
  onEnded: (player) => {
    console.log('Video finished');
  },
  
  onError: (error, player) => {
    console.error('Error occurred:', error);
  }
});
```

## Examples

### Example 1: Simple Player

```html
<div id="my-player" style="width: 800px; height: 450px;"></div>

<script>
  const player = new ZioBoosterPlayer({
    container: '#my-player',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    watermarkText: 'Zio Booster',
    autoplay: false
  });
</script>
```

### Example 2: Customized Watermark

```javascript
const player = new ZioBoosterPlayer({
  container: '#player',
  videoUrl: 'video.mp4',
  watermarkText: '© My Company 2024',
  watermarkPosition: 'top-left',
  watermarkOpacity: 0.5,
  watermarkColor: '#ffff00',
  watermarkFontSize: '28px'
});
```

### Example 3: Dynamic Watermark Update

```javascript
// Update watermark in real-time
player.setWatermark('Live Stream');
player.setWatermarkOptions({
  position: 'center',
  opacity: 0.3,
  color: '#ff0000'
});
```

### Example 4: Playlist Implementation

```javascript
const playlist = [
  'video1.mp4',
  'video2.mp4',
  'video3.mp4'
];

let currentIndex = 0;

const player = new ZioBoosterPlayer({
  container: '#player',
  videoUrl: playlist[0],
  onEnded: () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    player.loadVideo(playlist[currentIndex]);
    player.play();
  }
});
```

## Demo

Open `video-browser-demo.html` in your browser to see a fully interactive demo with:
- Basic player example
- Customized watermark controls
- Batch video loading
- Complete API documentation
- Feature showcase

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 60+ | ✅ Full |
| Firefox | 55+ | ✅ Full |
| Safari | 12+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Opera | 47+ | ✅ Full |
| Mobile Safari | iOS 12+ | ✅ Full |
| Chrome Mobile | Android 5+ | ✅ Full |

## File Structure

```
js_features/
├── video-browser-api.js      # Main API library
├── video-browser-demo.html   # Interactive demo page
└── README_VIDEO_BROWSER.md   # This documentation
```

## Advanced Usage

### Responsive Player

```javascript
// Create responsive container
const container = document.createElement('div');
container.style.cssText = `
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 16/9;
`;

const player = new ZioBoosterPlayer({
  container: container,
  videoUrl: 'video.mp4',
  watermarkText: 'Zio Booster'
});
```

### Custom Styling Integration

```css
/* Override default styles */
.zio-booster-player {
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.zio-booster-controls {
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
}

.zio-booster-watermark {
  font-family: 'Custom Font', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
}
```

### Integration with Frameworks

#### React

```jsx
import { useEffect, useRef } from 'react';

function VideoPlayer({ videoUrl }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  
  useEffect(() => {
    playerRef.current = new ZioBoosterPlayer({
      container: containerRef.current,
      videoUrl: videoUrl,
      watermarkText: 'Zio Booster'
    });
    
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl]);
  
  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
}
```

#### Vue

```vue
<template>
  <div ref="playerContainer" style="width: 100%; height: 400px"></div>
</template>

<script>
export default {
  props: ['videoUrl'],
  mounted() {
    this.player = new ZioBoosterPlayer({
      container: this.$refs.playerContainer,
      videoUrl: this.videoUrl,
      watermarkText: 'Zio Booster'
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }
};
</script>
```

## Performance Considerations

- **Lazy Loading**: Players are initialized only when needed
- **Memory Management**: Always call `destroy()` when removing players
- **Resource Optimization**: Controls auto-hide during playback
- **Mobile Optimization**: Touch-friendly controls and responsive design

## Security Notes

- Ensure video URLs are from trusted sources
- Implement CORS headers for cross-origin videos
- Consider HTTPS for all video resources
- Validate user-provided watermark text to prevent XSS

## Troubleshooting

### Common Issues

**Issue**: Video doesn't load
- Check video URL is accessible
- Verify CORS headers are set correctly
- Ensure video format is supported (MP4, WebM, Ogg)

**Issue**: Watermark not visible
- Check opacity value (should be > 0)
- Verify color contrasts with video content
- Ensure position is within viewport

**Issue**: Controls not showing
- Move mouse over player to reveal controls
- Check if `showControls` is set to `true`
- Verify browser supports hover events

## Future Enhancements

- [ ] HLS streaming support
- [ ] DASH streaming support
- [ ] Video quality selection
- [ ] Subtitle/caption support
- [ ] Picture-in-picture mode
- [ ] Social sharing integration
- [ ] Analytics tracking
- [ ] DRM support
- [ ] Live streaming capabilities
- [ ] Video effects and filters

## License

This project is part of the Zio Booster ecosystem. See main LICENSE file for details.

## Support

For issues, questions, or contributions:
- Open an issue on the repository
- Contact the development team
- Check existing documentation

---

**Zio Booster** - Enhancing your video experience with branded playback solutions.
