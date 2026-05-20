/**
 * Zio Booster Video Browser API System
 * A custom video player with watermark functionality
 * 
 * Usage:
 *   const player = new ZioBoosterPlayer({
 *     container: '#video-container',
 *     videoUrl: 'https://example.com/video.mp4',
 *     watermarkText: 'Zio Booster'
 *   });
 *   player.load();
 */

class ZioBoosterPlayer {
  constructor(options = {}) {
    this.container = typeof options.container === 'string' 
      ? document.querySelector(options.container) 
      : options.container;
    this.videoUrl = options.videoUrl || '';
    this.watermarkText = options.watermarkText || 'Zio Booster';
    this.watermarkPosition = options.watermarkPosition || 'bottom-right';
    this.watermarkOpacity = options.watermarkOpacity || 0.7;
    this.watermarkColor = options.watermarkColor || '#ffffff';
    this.watermarkFontSize = options.watermarkFontSize || '24px';
    this.autoplay = options.autoplay || false;
    this.showControls = options.showControls !== false;
    this.onReady = options.onReady || (() => {});
    this.onError = options.onError || (() => {});
    this.onPlay = options.onPlay || (() => {});
    this.onPause = options.onPause || (() => {});
    this.onEnded = options.onEnded || (() => {});
    
    this.video = null;
    this.playerContainer = null;
    this.watermark = null;
    this.controls = null;
    this.isPlaying = false;
    this.isFullscreen = false;
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.error('ZioBoosterPlayer: Container not found');
      return;
    }
    
    this.createPlayerStructure();
    this.setupEventListeners();
    
    if (this.videoUrl) {
      this.loadVideo(this.videoUrl);
    }
  }
  
  createPlayerStructure() {
    // Create main player container
    this.playerContainer = document.createElement('div');
    this.playerContainer.className = 'zio-booster-player';
    this.playerContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      background: #000;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    // Create video element
    this.video = document.createElement('video');
    this.video.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `;
    this.video.playsInline = true;
    
    // Create watermark
    this.watermark = document.createElement('div');
    this.watermark.className = 'zio-booster-watermark';
    this.watermark.textContent = this.watermarkText;
    this.updateWatermarkPosition();
    
    // Create controls
    if (this.showControls) {
      this.createControls();
    }
    
    // Assemble player
    this.playerContainer.appendChild(this.video);
    this.playerContainer.appendChild(this.watermark);
    if (this.controls) {
      this.playerContainer.appendChild(this.controls);
    }
    
    this.container.appendChild(this.playerContainer);
    
    // Trigger ready callback
    this.onReady(this);
  }
  
  createControls() {
    this.controls = document.createElement('div');
    this.controls.className = 'zio-booster-controls';
    this.controls.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 10;
    `;
    
    // Play/Pause button
    const playBtn = document.createElement('button');
    playBtn.innerHTML = '▶';
    playBtn.style.cssText = `
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    playBtn.onclick = () => this.togglePlay();
    
    // Progress bar
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
      flex: 1;
      height: 5px;
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
      cursor: pointer;
      position: relative;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'zio-booster-progress';
    progressBar.style.cssText = `
      height: 100%;
      width: 0%;
      background: #00d4ff;
      border-radius: 3px;
      transition: width 0.1s linear;
    `;
    progressContainer.appendChild(progressBar);
    
    progressContainer.onclick = (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      this.seekTo(pos);
    };
    
    // Time display
    const timeDisplay = document.createElement('span');
    timeDisplay.className = 'zio-booster-time';
    timeDisplay.style.cssText = `
      color: white;
      font-size: 14px;
      min-width: 100px;
    `;
    timeDisplay.textContent = '0:00 / 0:00';
    
    // Volume control
    const volumeBtn = document.createElement('button');
    volumeBtn.innerHTML = '🔊';
    volumeBtn.style.cssText = `
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
    `;
    volumeBtn.onclick = () => this.toggleMute();
    
    // Fullscreen button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.style.cssText = `
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 35px;
      height: 35px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    fullscreenBtn.onclick = () => this.toggleFullscreen();
    
    this.controls.appendChild(playBtn);
    this.controls.appendChild(progressContainer);
    this.controls.appendChild(timeDisplay);
    this.controls.appendChild(volumeBtn);
    this.controls.appendChild(fullscreenBtn);
    
    // Store references
    this.playButton = playBtn;
    this.progressBar = progressBar;
    this.timeDisplay = timeDisplay;
    this.volumeButton = volumeBtn;
    
    // Show controls on mouse move
    let controlsTimeout;
    this.playerContainer.onmousemove = () => {
      this.controls.style.opacity = '1';
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (this.isPlaying) {
          this.controls.style.opacity = '0';
        }
      }, 2000);
    };
  }
  
  updateWatermarkPosition() {
    const positions = {
      'top-left': 'top: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'bottom-left': 'bottom: 80px; left: 20px;',
      'bottom-right': 'bottom: 80px; right: 20px;',
      'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
    };
    
    this.watermark.style.cssText = `
      position: absolute;
      ${positions[this.watermarkPosition] || positions['bottom-right']}
      color: ${this.watermarkColor};
      font-size: ${this.watermarkFontSize};
      font-weight: bold;
      opacity: ${this.watermarkOpacity};
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      pointer-events: none;
      z-index: 5;
      user-select: none;
    `;
  }
  
  setupEventListeners() {
    this.video.addEventListener('loadedmetadata', () => {
      this.updateTimeDisplay();
    });
    
    this.video.addEventListener('timeupdate', () => {
      this.updateProgress();
      this.updateTimeDisplay();
    });
    
    this.video.addEventListener('play', () => {
      this.isPlaying = true;
      this.playButton.innerHTML = '⏸';
      this.onPlay(this);
    });
    
    this.video.addEventListener('pause', () => {
      this.isPlaying = false;
      this.playButton.innerHTML = '▶';
      this.onPause(this);
    });
    
    this.video.addEventListener('ended', () => {
      this.isPlaying = false;
      this.playButton.innerHTML = '▶';
      this.onEnded(this);
    });
    
    this.video.addEventListener('error', (e) => {
      this.onError(e, this);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.playerContainer.matches(':hover') || document.activeElement === this.video) {
        switch(e.key) {
          case ' ':
          case 'k':
            e.preventDefault();
            this.togglePlay();
            break;
          case 'f':
            this.toggleFullscreen();
            break;
          case 'm':
            this.toggleMute();
            break;
          case 'ArrowLeft':
            this.seekRelative(-5);
            break;
          case 'ArrowRight':
            this.seekRelative(5);
            break;
        }
      }
    });
  }
  
  loadVideo(url) {
    if (!url) {
      console.error('ZioBoosterPlayer: No video URL provided');
      return;
    }
    
    this.videoUrl = url;
    this.video.src = url;
    this.video.load();
    
    if (this.autoplay) {
      this.play();
    }
  }
  
  play() {
    this.video.play().catch(err => {
      console.error('ZioBoosterPlayer: Autoplay failed', err);
    });
  }
  
  pause() {
    this.video.pause();
  }
  
  togglePlay() {
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  
  seekTo(position) {
    const time = position * this.video.duration;
    this.video.currentTime = Math.max(0, Math.min(time, this.video.duration));
  }
  
  seekRelative(seconds) {
    this.video.currentTime = Math.max(0, Math.min(
      this.video.currentTime + seconds,
      this.video.duration
    ));
  }
  
  setVolume(level) {
    this.video.volume = Math.max(0, Math.min(level, 1));
  }
  
  toggleMute() {
    this.video.muted = !this.video.muted;
    this.volumeButton.innerHTML = this.video.muted ? '🔇' : '🔊';
  }
  
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.playerContainer.requestFullscreen) {
        this.playerContainer.requestFullscreen();
      } else if (this.playerContainer.webkitRequestFullscreen) {
        this.playerContainer.webkitRequestFullscreen();
      } else if (this.playerContainer.msRequestFullscreen) {
        this.playerContainer.msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
  }
  
  updateProgress() {
    if (this.progressBar && this.video.duration) {
      const percent = (this.video.currentTime / this.video.duration) * 100;
      this.progressBar.style.width = `${percent}%`;
    }
  }
  
  updateTimeDisplay() {
    if (this.timeDisplay && this.video.duration) {
      const current = this.formatTime(this.video.currentTime);
      const total = this.formatTime(this.video.duration);
      this.timeDisplay.textContent = `${current} / ${total}`;
    }
  }
  
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  setWatermark(text) {
    this.watermarkText = text;
    this.watermark.textContent = text;
  }
  
  setWatermarkOptions(options) {
    if (options.position) this.watermarkPosition = options.position;
    if (options.opacity) this.watermarkOpacity = options.opacity;
    if (options.color) this.watermarkColor = options.color;
    if (options.fontSize) this.watermarkFontSize = options.fontSize;
    this.updateWatermarkPosition();
  }
  
  destroy() {
    this.pause();
    if (this.playerContainer && this.playerContainer.parentNode) {
      this.playerContainer.parentNode.removeChild(this.playerContainer);
    }
  }
}

// API Helper Functions
const ZioBoosterAPI = {
  createPlayer: (container, options = {}) => {
    return new ZioBoosterPlayer({ container, ...options });
  },
  
  playVideo: (containerSelector, videoUrl, options = {}) => {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('ZioBoosterAPI: Container not found');
      return null;
    }
    const player = new ZioBoosterPlayer({
      container,
      videoUrl,
      watermarkText: 'Zio Booster',
      ...options
    });
    return player;
  },
  
  batchPlayVideos: (containerSelector, videoList, options = {}) => {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('ZioBoosterAPI: Container not found');
      return null;
    }
    
    container.innerHTML = '';
    const players = [];
    
    videoList.forEach((video, index) => {
      const videoContainer = document.createElement('div');
      videoContainer.style.cssText = `
        width: ${options.width || '100%'};
        height: ${options.height || '300px'};
        margin: 10px 0;
      `;
      container.appendChild(videoContainer);
      
      const player = new ZioBoosterPlayer({
        container: videoContainer,
        videoUrl: typeof video === 'string' ? video : video.url,
        watermarkText: 'Zio Booster',
        autoplay: index === 0 && options.autoPlayFirst,
        ...options
      });
      players.push(player);
    });
    
    return players;
  }
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ZioBoosterPlayer, ZioBoosterAPI };
}

if (typeof window !== 'undefined') {
  window.ZioBoosterPlayer = ZioBoosterPlayer;
  window.ZioBoosterAPI = ZioBoosterAPI;
}
