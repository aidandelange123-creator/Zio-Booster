# ZioBooster Video Streaming Module

## Overview

Advanced video streaming module optimized for the **smoothest video streaming experience on the web**. This module implements cutting-edge streaming technologies to deliver buffer-free, high-quality video playback.

## Key Features

### 🚀 Core Optimizations

1. **Adaptive Bitrate Streaming (ABR)**
   - Automatically adjusts video quality based on network conditions
   - Prevents buffering by switching to lower bitrates when needed
   - Seamlessly upgrades quality when bandwidth improves
   - Supports 6 quality levels: 360p, 480p, 720p, 1080p, 1440p, 2160p (4K)

2. **Media Source Extensions (MSE)**
   - Low-level control over video buffering
   - Custom segment loading and management
   - Optimal memory usage through buffer garbage collection
   - Hardware acceleration support

3. **Smart Buffer Management**
   - Intelligent preloading (30 seconds ahead)
   - Automatic buffer garbage collection
   - Maintains optimal buffer size (60 seconds max)
   - Prefetching for seamless playback

4. **Low Latency Mode**
   - Target latency of just 2 seconds
   - Ideal for live streaming and real-time content
   - Optimized segment fetching

5. **Real-time Metrics Monitoring**
   - Buffer health tracking
   - Bitrate monitoring
   - Dropped frames detection
   - Quality switch tracking
   - Latency measurement

6. **Automatic Recovery**
   - Retry failed requests (up to 3 attempts)
   - Exponential backoff for retries
   - Graceful degradation on errors

## Installation

```bash
# Copy the TypeScript file to your project
cp js_features/video-streaming.ts your-project/src/

# Compile TypeScript
tsc video-streaming.ts --target ES2020 --module esnext --lib dom,es2020
```

## Usage

### Basic Usage

```typescript
import { SmoothVideoStreamer } from './video-streaming';

// Create a new streamer instance
const streamer = new SmoothVideoStreamer({
  enableAdaptiveBitrate: true,
  enableLowLatency: true,
  bufferSize: 60,
  preloadSize: 30
});

// Attach to a video element
const videoElement = document.querySelector('video') as HTMLVideoElement;
await streamer.attachVideoElement(videoElement);

// Start streaming
await streamer.startStream('https://example.com/video.mp4');

// Control playback
streamer.play();
streamer.pause();
streamer.seek(120); // Seek to 2 minutes
streamer.setVolume(0.8);
streamer.setPlaybackRate(1.5);
```

### Using the Web Component

```html
<!-- Include the compiled JavaScript -->
<script src="video-streaming.js"></script>

<!-- Use the custom element -->
<advanced-video-player id="my-player"></advanced-video-player>

<script>
  const player = document.getElementById('my-player');
  player.loadVideo('https://example.com/video.mp4');
</script>
```

### Advanced Configuration

```typescript
const config = {
  enableAdaptiveBitrate: true,    // Enable ABR
  enablePreload: true,            // Preload content
  preloadSize: 30,                // Preload 30 seconds
  bufferSize: 60,                 // Max buffer 60 seconds
  maxRetries: 3,                  // Retry failed requests 3 times
  retryDelay: 1000,               // Wait 1 second between retries
  enableLowLatency: true,         // Enable low latency mode
  targetLatency: 2                // Target 2 second latency
};

const streamer = new SmoothVideoStreamer(config);
```

## API Reference

### SmoothVideoStreamer Class

#### Constructor
- `constructor(config?: Partial<StreamingConfig>)` - Create new streamer instance

#### Methods
- `attachVideoElement(video: HTMLVideoElement): Promise<void>` - Attach video element
- `startStream(url: string): Promise<void>` - Start streaming from URL
- `play(): void` - Resume playback
- `pause(): void` - Pause playback
- `stop(): void` - Stop streaming completely
- `seek(time: number): void` - Seek to specific time (seconds)
- `setVolume(volume: number): void` - Set volume (0.0 to 1.0)
- `setPlaybackRate(rate: number): void` - Set playback speed (0.25x to 4x)
- `getState(): StreamState` - Get current stream state
- `getHistoricalMetrics(): VideoMetrics[]` - Get metrics history
- `getAverageMetrics(): VideoMetrics` - Get average metrics

### Interfaces

#### StreamingConfig
```typescript
interface StreamingConfig {
  enableAdaptiveBitrate: boolean;
  enablePreload: boolean;
  preloadSize: number;
  bufferSize: number;
  maxRetries: number;
  retryDelay: number;
  enableLowLatency: boolean;
  targetLatency: number;
}
```

#### VideoQuality
```typescript
interface VideoQuality {
  resolution: string;    // e.g., "1080p"
  bitrate: number;       // bits per second
  fps: number;           // frames per second
  codec: string;         // codec identifier
}
```

#### VideoMetrics
```typescript
interface VideoMetrics {
  currentBitrate: number;
  bufferHealth: number;      // seconds of buffered content
  droppedFrames: number;
  playbackStalls: number;
  averageLatency: number;
  qualitySwitches: number;
  timestamp: Date;
}
```

## Performance Optimizations

### 1. Adaptive Bitrate Algorithm
The module continuously monitors:
- Buffer health (seconds of content buffered)
- Estimated bandwidth
- Playback stalls

Based on these metrics, it automatically switches quality:
- **Buffer < 10s**: Downgrade quality
- **Buffer > 30s + Good bandwidth**: Upgrade quality

### 2. Buffer Management
- **Prefetching**: Automatically loads content before it's needed
- **Garbage Collection**: Removes old buffered data to prevent memory bloat
- **Optimal Sizing**: Maintains 30-60 seconds of buffered content

### 3. MSE Optimization
- Uses Media Source Extensions for fine-grained control
- Sequential mode for optimal performance
- Efficient buffer appending with update event handling

### 4. Error Recovery
- Automatic retry with exponential backoff
- Graceful fallback to standard HTML5 playback
- Detailed error logging for debugging

## Browser Support

- ✅ Chrome 23+
- ✅ Firefox 42+
- ✅ Safari 8+
- ✅ Edge 12+
- ✅ Opera 15+

**Note**: MSE is required for advanced features. Falls back to standard HTML5 playback if not supported.

## Demo

Open `video-streaming-demo.html` in a modern browser to see the module in action with:
- Interactive video player
- Real-time metrics display
- Sample test videos
- Quality selection
- Performance visualization

## Best Practices

1. **Always attach video element before starting stream**
2. **Handle promise rejections** for better error handling
3. **Monitor metrics** to understand user experience
4. **Test on various network conditions** to ensure robustness
5. **Use HTTPS** for streaming content to avoid mixed content issues

## Troubleshooting

### Video doesn't play
- Check if the URL is accessible
- Verify CORS headers on the server
- Ensure video format is supported (MP4/H.264 recommended)

### Frequent quality switches
- May indicate unstable network
- Consider increasing buffer size
- Check server bandwidth capacity

### High memory usage
- Buffer garbage collection should handle this
- Reduce buffer size if needed
- Check for memory leaks in browser dev tools

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please open an issue on the project repository.

---

**ZioBooster** - Delivering the best smooth video streaming experience on the web 🚀
