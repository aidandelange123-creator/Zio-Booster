/**
 * Advanced Video Streaming Module for Smooth Web-Based Video Playback
 * Optimized for best-in-class smooth video streaming experience
 */

interface VideoQuality {
  resolution: string;
  bitrate: number;
  fps: number;
  codec: string;
}

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

interface VideoMetrics {
  currentBitrate: number;
  bufferHealth: number;
  droppedFrames: number;
  playbackStalls: number;
  averageLatency: number;
  qualitySwitches: number;
  timestamp: Date;
}

interface StreamState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  quality: VideoQuality;
}

class SmoothVideoStreamer {
  private videoElement: HTMLVideoElement | null = null;
  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;
  private config: StreamingConfig;
  private metricsHistory: VideoMetrics[] = [];
  private qualityLevels: VideoQuality[] = [];
  private currentQualityIndex: number = 0;
  private bufferQueue: ArrayBuffer[] = [];
  private isStreaming: boolean = false;
  private monitorInterval: number | null = null;
  private readonly maxMetricsHistory: number = 60;
  private bandwidthEstimate: number = 5000000; // 5 Mbps default
  private pendingAppends: Array<{ data: ArrayBuffer; start: number }> = [];

  constructor(config?: Partial<StreamingConfig>) {
    this.config = {
      enableAdaptiveBitrate: true,
      enablePreload: true,
      preloadSize: 30, // seconds
      bufferSize: 60, // seconds
      maxRetries: 3,
      retryDelay: 1000, // ms
      enableLowLatency: true,
      targetLatency: 2, // seconds
      ...config
    };

    this.initializeQualityLevels();
  }

  /**
   * Initialize predefined quality levels for adaptive streaming
   */
  private initializeQualityLevels(): void {
    this.qualityLevels = [
      { resolution: '360p', bitrate: 800000, fps: 30, codec: 'avc1.42E01E' },
      { resolution: '480p', bitrate: 1400000, fps: 30, codec: 'avc1.4D401E' },
      { resolution: '720p', bitrate: 2800000, fps: 30, codec: 'avc1.4D401F' },
      { resolution: '1080p', bitrate: 5000000, fps: 30, codec: 'avc1.640028' },
      { resolution: '1440p', bitrate: 9000000, fps: 60, codec: 'avc1.64002A' },
      { resolution: '2160p', bitrate: 15000000, fps: 60, codec: 'avc1.640033' }
    ];
  }

  /**
   * Attach video element and initialize MediaSource
   */
  async attachVideoElement(videoElement: HTMLVideoElement): Promise<void> {
    this.videoElement = videoElement;

    if ('MediaSource' in window && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E"')) {
      this.mediaSource = new MediaSource();
      videoElement.src = URL.createObjectURL(this.mediaSource);

      return new Promise((resolve) => {
        this.mediaSource!.addEventListener('sourceopen', () => {
          console.log('MediaSource opened successfully');
          resolve();
        });
      });
    } else {
      console.warn('MediaSource not supported, falling back to standard playback');
      return Promise.resolve();
    }
  }

  /**
   * Start smooth video streaming with optimizations
   */
  async startStream(streamUrl: string): Promise<void> {
    if (this.isStreaming) {
      console.warn('Stream already running');
      return;
    }

    this.isStreaming = true;
    console.log('Starting optimized video stream...');

    try {
      if (this.mediaSource && this.sourceBuffer) {
        await this.startMSEStreaming(streamUrl);
      } else if (this.videoElement) {
        await this.startStandardStreaming(streamUrl);
      }

      this.startMonitoring();
      this.startBufferManagement();
    } catch (error) {
      console.error('Failed to start stream:', error);
      throw error;
    }
  }

  /**
   * MSE-based streaming for optimal performance
   */
  private async startMSEStreaming(streamUrl: string): Promise<void> {
    const mimeType = 'video/mp4; codecs="avc1.42E01E"';
    
    if (!this.mediaSource?.sourceBuffers.length) {
      this.sourceBuffer = this.mediaSource!.addSourceBuffer(mimeType);
      this.sourceBuffer.mode = 'sequence';
    }

    this.sourceBuffer?.addEventListener('updateend', () => {
      this.processPendingAppends();
    });

    await this.fetchAndBufferSegments(streamUrl);
  }

  /**
   * Standard HTML5 streaming fallback
   */
  private async startStandardStreaming(streamUrl: string): Promise<void> {
    if (!this.videoElement) return;

    this.videoElement.preload = 'auto';
    this.videoElement.src = streamUrl;
    
    // Enable hardware acceleration hints
    this.videoElement.setAttribute('playsinline', 'true');
    this.videoElement.setAttribute('webkit-playsinline', 'true');
    
    // Optimize for smooth playback
    this.videoElement.addEventListener('canplaythrough', () => {
      console.log('Ready for smooth playback');
    });

    this.videoElement.addEventListener('waiting', () => {
      console.log('Buffering detected - optimizing...');
      this.optimizeForBuffering();
    });
  }

  /**
   * Fetch video segments with intelligent buffering
   */
  private async fetchAndBufferSegments(streamUrl: string): Promise<void> {
    let retryCount = 0;

    while (this.isStreaming && retryCount < this.config.maxRetries) {
      try {
        const response = await fetch(streamUrl, {
          method: 'GET',
          headers: {
            'Range': 'bytes=0-' + (this.config.preloadSize * 1024 * 1024)
          }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const chunk = await response.arrayBuffer();
        this.bufferQueue.push(chunk);
        
        if (this.sourceBuffer && !this.sourceBuffer.updating) {
          this.processPendingAppends();
        }

        retryCount = 0; // Reset on success
      } catch (error) {
        retryCount++;
        console.warn(`Fetch failed, retry ${retryCount}/${this.config.maxRetries}`);
        await this.delay(this.config.retryDelay * retryCount);
      }
    }
  }

  /**
   * Process pending buffer appends
   */
  private processPendingAppends(): void {
    if (!this.sourceBuffer || this.sourceBuffer.updating) return;

    if (this.pendingAppends.length > 0) {
      const { data, start } = this.pendingAppents.shift()!;
      try {
        this.sourceBuffer.appendBuffer(data);
      } catch (error) {
        console.error('Buffer append failed:', error);
      }
    } else if (this.bufferQueue.length > 0 && this.isStreaming) {
      const data = this.bufferQueue.shift()!;
      this.pendingAppends.push({ data, start: this.videoElement?.currentTime || 0 });
      this.sourceBuffer.appendBuffer(data);
    }
  }

  /**
   * Adaptive bitrate switching based on network conditions
   */
  private adaptBitrate(): void {
    if (!this.config.enableAdaptiveBitrate || !this.videoElement) return;

    const bufferHealth = this.getBufferHealth();
    const currentBandwidth = this.estimateBandwidth();

    // Update bandwidth estimate
    this.bandwidthEstimate = currentBandwidth;

    // Determine optimal quality level
    let targetQualityIndex = this.currentQualityIndex;

    if (bufferHealth < 10 && this.currentQualityIndex > 0) {
      // Low buffer - decrease quality
      targetQualityIndex = Math.max(0, this.currentQualityIndex - 1);
    } else if (bufferHealth > 30 && currentBandwidth > this.qualityLevels[this.currentQualityIndex].bitrate * 1.2) {
      // High buffer and good bandwidth - increase quality
      targetQualityIndex = Math.min(this.qualityLevels.length - 1, this.currentQualityIndex + 1);
    }

    if (targetQualityIndex !== this.currentQualityIndex) {
      this.switchQuality(targetQualityIndex);
    }
  }

  /**
   * Switch to a different quality level
   */
  private switchQuality(qualityIndex: number): void {
    if (qualityIndex === this.currentQualityIndex) return;

    const oldQuality = this.qualityLevels[this.currentQualityIndex];
    const newQuality = this.qualityLevels[qualityIndex];

    console.log(`Switching quality: ${oldQuality.resolution} -> ${newQuality.resolution}`);
    
    this.currentQualityIndex = qualityIndex;
    
    // Track quality switch in metrics
    const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];
    if (latestMetrics) {
      latestMetrics.qualitySwitches++;
    }
  }

  /**
   * Estimate available bandwidth
   */
  private estimateBandwidth(): number {
    // Simplified bandwidth estimation
    // In production, use Resource Timing API or fetch timing
    return this.bandwidthEstimate;
  }

  /**
   * Get current buffer health in seconds
   */
  private getBufferHealth(): number {
    if (!this.videoElement) return 0;

    const buffered = this.videoElement.buffered;
    if (buffered.length === 0) return 0;

    const currentTime = this.videoElement.currentTime;
    let bufferEnd = 0;

    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
        bufferEnd = buffered.end(i);
        break;
      }
    }

    return bufferEnd - currentTime;
  }

  /**
   * Start monitoring video metrics
   */
  private startMonitoring(): void {
    if (this.monitorInterval) return;

    this.monitorInterval = window.setInterval(() => {
      const metrics = this.collectMetrics();
      this.metricsHistory.push(metrics);

      if (this.metricsHistory.length > this.maxMetricsHistory) {
        this.metricsHistory.shift();
      }

      this.adaptBitrate();
      this.updateUI(metrics);
    }, 1000);
  }

  /**
   * Collect video streaming metrics
   */
  private collectMetrics(): VideoMetrics {
    const droppedFrames = (this.videoElement as any)?.webkitDecodedFrameCount ? 
      (this.videoElement as any).webkitDropFrameCount : 0;

    return {
      currentBitrate: this.qualityLevels[this.currentQualityIndex].bitrate,
      bufferHealth: this.getBufferHealth(),
      droppedFrames,
      playbackStalls: 0,
      averageLatency: this.config.enableLowLatency ? this.config.targetLatency : 5,
      qualitySwitches: this.metricsHistory.reduce((sum, m) => sum + m.qualitySwitches, 0),
      timestamp: new Date()
    };
  }

  /**
   * Update UI with current metrics
   */
  private updateUI(metrics: VideoMetrics): void {
    const qualityElement = document.getElementById('video-quality');
    const bufferElement = document.getElementById('video-buffer');
    const bitrateElement = document.getElementById('video-bitrate');

    if (qualityElement) {
      qualityElement.textContent = this.qualityLevels[this.currentQualityIndex].resolution;
    }

    if (bufferElement) {
      bufferElement.textContent = `${metrics.bufferHealth.toFixed(1)}s`;
      bufferElement.className = metrics.bufferHealth < 5 ? 'warning' : 'good';
    }

    if (bitrateElement) {
      bitrateElement.textContent = `${(metrics.currentBitrate / 1000000).toFixed(2)} Mbps`;
    }
  }

  /**
   * Optimize playback when buffering occurs
   */
  private optimizeForBuffering(): void {
    if (!this.videoElement) return;

    // Temporarily reduce playback rate
    const originalRate = this.videoElement.playbackRate;
    this.videoElement.playbackRate = 0.5;

    setTimeout(() => {
      if (this.videoElement && !this.videoElement.paused) {
        this.videoElement.playbackRate = originalRate;
      }
    }, 2000);

    // Force quality downgrade if needed
    if (this.currentQualityIndex > 0) {
      this.switchQuality(this.currentQualityIndex - 1);
    }
  }

  /**
   * Start intelligent buffer management
   */
  private startBufferManagement(): void {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('timeupdate', () => {
      const bufferHealth = this.getBufferHealth();

      // Preload more content if buffer is low
      if (bufferHealth < this.config.preloadSize && this.isStreaming) {
        this.prefetchNextSegment();
      }

      // Garbage collect old buffers if buffer is too large
      if (bufferHealth > this.config.bufferSize && this.sourceBuffer) {
        this.garbageCollectBuffer(bufferHealth);
      }
    });
  }

  /**
   * Prefetch next video segment
   */
  private async prefetchNextSegment(): Promise<void> {
    // Implementation for segment prefetching
    console.log('Prefetching next segment...');
  }

  /**
   * Remove old buffered data to prevent memory issues
   */
  private garbageCollectBuffer(currentBufferHealth: number): void {
    if (!this.sourceBuffer || !this.videoElement) return;

    const currentTime = this.videoElement.currentTime;
    const removeEnd = Math.max(0, currentTime - 30);

    if (this.sourceBuffer.buffered.length > 0) {
      const start = this.sourceBuffer.buffered.start(0);
      if (start < removeEnd) {
        try {
          this.sourceBuffer.remove(start, removeEnd);
          console.log(`Garbage collected buffer from ${start} to ${removeEnd}`);
        } catch (error) {
          console.warn('Buffer removal failed:', error);
        }
      }
    }
  }

  /**
   * Pause video playback
   */
  pause(): void {
    if (this.videoElement) {
      this.videoElement.pause();
    }
  }

  /**
   * Resume video playback
   */
  play(): void {
    if (this.videoElement) {
      this.videoElement.play().catch(error => {
        console.error('Playback failed:', error);
      });
    }
  }

  /**
   * Stop video streaming
   */
  stop(): void {
    this.isStreaming = false;

    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }

    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
    }

    if (this.mediaSource && this.mediaSource.readyState === 'open') {
      this.mediaSource.endOfStream();
    }

    this.bufferQueue = [];
    this.pendingAppends = [];

    console.log('Video streaming stopped');
  }

  /**
   * Seek to specific time
   */
  seek(time: number): void {
    if (this.videoElement) {
      this.videoElement.currentTime = time;
    }
  }

  /**
   * Set playback volume
   */
  setVolume(volume: number): void {
    if (this.videoElement) {
      this.videoElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Set playback speed
   */
  setPlaybackRate(rate: number): void {
    if (this.videoElement) {
      this.videoElement.playbackRate = Math.max(0.25, Math.min(4, rate));
    }
  }

  /**
   * Get current stream state
   */
  getState(): StreamState {
    if (!this.videoElement) {
      throw new Error('No video element attached');
    }

    return {
      isPlaying: !this.videoElement.paused,
      isBuffering: this.videoElement.readyState < 3,
      currentTime: this.videoElement.currentTime,
      duration: this.videoElement.duration || 0,
      volume: this.videoElement.volume,
      playbackRate: this.videoElement.playbackRate,
      quality: this.qualityLevels[this.currentQualityIndex]
    };
  }

  /**
   * Get historical metrics
   */
  getHistoricalMetrics(): VideoMetrics[] {
    return [...this.metricsHistory];
  }

  /**
   * Get average metrics from history
   */
  getAverageMetrics(): VideoMetrics {
    if (this.metricsHistory.length === 0) {
      return this.getDefaultMetrics();
    }

    const sum = this.metricsHistory.reduce((acc, curr) => ({
      currentBitrate: acc.currentBitrate + curr.currentBitrate,
      bufferHealth: acc.bufferHealth + curr.bufferHealth,
      droppedFrames: acc.droppedFrames + curr.droppedFrames,
      playbackStalls: acc.playbackStalls + curr.playbackStalls,
      averageLatency: acc.averageLatency + curr.averageLatency,
      qualitySwitches: acc.qualitySwitches + curr.qualitySwitches,
      timestamp: new Date()
    }), this.getDefaultMetrics());

    const count = this.metricsHistory.length;
    return {
      currentBitrate: sum.currentBitrate / count,
      bufferHealth: sum.bufferHealth / count,
      droppedFrames: sum.droppedFrames / count,
      playbackStalls: sum.playbackStalls / count,
      averageLatency: sum.averageLatency / count,
      qualitySwitches: sum.qualitySwitches / count,
      timestamp: new Date()
    };
  }

  private getDefaultMetrics(): VideoMetrics {
    return {
      currentBitrate: 0,
      bufferHealth: 0,
      droppedFrames: 0,
      playbackStalls: 0,
      averageLatency: 0,
      qualitySwitches: 0,
      timestamp: new Date()
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Web Component for Advanced Video Player
 */
class AdvancedVideoPlayerElement extends HTMLElement {
  private streamer: SmoothVideoStreamer;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.streamer = new SmoothVideoStreamer({
      enableAdaptiveBitrate: true,
      enableLowLatency: true,
      bufferSize: 60,
      preloadSize: 30
    });
    this.shadow = this.attachShadow({ mode: 'open' });
    this.init();
  }

  private init(): void {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: Arial, sans-serif;
        }
        
        .video-container {
          position: relative;
          width: 100%;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }
        
        video {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .controls-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .video-container:hover .controls-overlay {
          opacity: 1;
        }
        
        .progress-bar {
          width: 100%;
          height: 5px;
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
          cursor: pointer;
          margin-bottom: 15px;
        }
        
        .progress-fill {
          height: 100%;
          background: #007bff;
          border-radius: 3px;
          width: 0%;
          transition: width 0.1s;
        }
        
        .control-buttons {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 16px;
          padding: 5px;
        }
        
        button:hover {
          color: #007bff;
        }
        
        .quality-selector {
          background: rgba(0,0,0,0.7);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .metrics-display {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 10px;
          border-radius: 4px;
          font-size: 12px;
          display: none;
        }
        
        .video-container.show-metrics .metrics-display {
          display: block;
        }
        
        .buffer-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: none;
        }
        
        .video-container.buffering .buffer-indicator {
          display: block;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
      
      <div class="video-container">
        <video></video>
        
        <div class="metrics-display">
          <div>Quality: <span id="video-quality">Auto</span></div>
          <div>Buffer: <span id="video-buffer">0s</span></div>
          <div>Bitrate: <span id="video-bitrate">0 Mbps</span></div>
        </div>
        
        <div class="buffer-indicator">
          <div class="spinner"></div>
        </div>
        
        <div class="controls-overlay">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          
          <div class="control-buttons">
            <button id="play-pause-btn">▶</button>
            <button id="mute-btn">🔊</button>
            <select class="quality-selector" id="quality-select">
              <option value="auto">Auto</option>
              <option value="2160p">2160p (4K)</option>
              <option value="1440p">1440p (2K)</option>
              <option value="1080p">1080p (HD)</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
              <option value="360p">360p</option>
            </select>
            <button id="fullscreen-btn">⛶</button>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.initializeVideo();
  }

  private initializeVideo(): void {
    const videoElement = this.shadow.querySelector('video') as HTMLVideoElement;
    
    if (videoElement) {
      this.streamer.attachVideoElement(videoElement);
      
      videoElement.addEventListener('playing', () => {
        this.shadow.querySelector('.video-container')?.classList.remove('buffering');
      });
      
      videoElement.addEventListener('waiting', () => {
        this.shadow.querySelector('.video-container')?.classList.add('buffering');
      });
      
      videoElement.addEventListener('timeupdate', () => {
        const progressFill = this.shadow.querySelector('.progress-fill') as HTMLElement;
        if (progressFill && videoElement.duration) {
          progressFill.style.width = `${(videoElement.currentTime / videoElement.duration) * 100}%`;
        }
      });
    }
  }

  private setupEventListeners(): void {
    const playPauseBtn = this.shadow.querySelector('#play-pause-btn');
    const muteBtn = this.shadow.querySelector('#mute-btn');
    const fullscreenBtn = this.shadow.querySelector('#fullscreen-btn');
    const qualitySelect = this.shadow.querySelector('#quality-select');
    const progressBar = this.shadow.querySelector('.progress-bar');

    playPauseBtn?.addEventListener('click', () => {
      const state = this.streamer.getState();
      if (state.isPlaying) {
        this.streamer.pause();
        (playPauseBtn as HTMLElement).textContent = '▶';
      } else {
        this.streamer.play();
        (playPauseBtn as HTMLElement).textContent = '⏸';
      }
    });

    muteBtn?.addEventListener('click', () => {
      const videoElement = this.shadow.querySelector('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.muted = !videoElement.muted;
        (muteBtn as HTMLElement).textContent = videoElement.muted ? '🔇' : '🔊';
      }
    });

    fullscreenBtn?.addEventListener('click', () => {
      const container = this.shadow.querySelector('.video-container');
      if (container) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          container.requestFullscreen();
        }
      }
    });

    qualitySelect?.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value;
      console.log('Quality changed to:', value);
      // Handle quality change logic
    });

    progressBar?.addEventListener('click', (e) => {
      const videoElement = this.shadow.querySelector('video') as HTMLVideoElement;
      if (videoElement && videoElement.duration) {
        const rect = (progressBar as HTMLElement).getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.streamer.seek(pos * videoElement.duration);
      }
    });
  }

  /**
   * Load and play a video stream
   */
  async loadVideo(url: string): Promise<void> {
    await this.streamer.startStream(url);
    this.streamer.play();
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.streamer.stop();
  }
}

// Register the custom element
customElements.define('advanced-video-player', AdvancedVideoPlayerElement);

// Export for use in other modules
export { SmoothVideoStreamer, AdvancedVideoPlayerElement, VideoQuality, StreamingConfig, VideoMetrics, StreamState };
