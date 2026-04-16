/**
 * ag-player.js — Afterglow 共用音訊播放器邏輯
 *
 * 使用方式：
 *   在頁面底部呼叫 AgPlayer.init(config)
 *
 * config 物件：
 *   audioId       {string}  audio element 的 id
 *   playBtnId     {string}  播放/暫停按鈕的 id
 *   progressBarId {string?} 進度條 input[range] 的 id（語音引導用）
 *   currentTimeId {string?} 當前時間 span 的 id
 *   durationId    {string?} 總時長 span 的 id
 *   rewindBtnId   {string?} 倒退 15s 按鈕的 id
 *   forwardBtnId  {string?} 快進 15s 按鈕的 id
 *   volumeSliderId{string?} 音量 slider 的 id（白噪音用）
 *   visualId      {string?} 視覺容器的 id（白噪音 pulse ring）
 *   orbRingId     {string?} 霓虹光環的 id（語音引導）
 *   statusTextId  {string?} 狀態文字的 id
 *   iconPlayId    {string?} 播放圖示的 id
 *   iconPauseId   {string?} 暫停圖示的 id
 *   iconReplayId  {string?} 重播圖示的 id
 *   isLoop        {boolean} 是否循環（白噪音 = true）
 *   mediaTitle    {string}  Media Session 標題
 *   mediaArtist   {string}  Media Session 藝術家
 *   artworkSrc    {string}  Media Session 封面圖路徑
 *
 * 背景播放說明：
 *   霓虹光環使用 Web Audio API AnalyserNode 讀取頻率資料。
 *   為避免 AudioContext 截斷原生音訊輸出導致熄屏後無聲，
 *   這裡使用「分析專用 AudioContext」架構：
 *     audio element → GainNode(gain=0) → analyser → destination
 *   音訊的實際輸出仍走 HTMLAudioElement 的原生路由，
 *   AudioContext 只負責讀取頻率資料，不影響聲音播放。
 *   熄屏時 visibilitychange 會暫停 rAF 迴圈（省電），
 *   回到前景時自動恢復。
 */

var AgPlayer = (function () {
  'use strict';

  /* ── SVG icons ── */
  var SVG_PLAY  = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polygon points="8,4 20,12 8,20" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" fill="none"/></svg>';
  var SVG_PAUSE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><line x1="9" y1="5" x2="9" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="5" x2="15" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var SVG_REPLAY= '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C8.41 4.5 5.5 7.41 5.5 11s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M12 4.5L9.5 2.5M12 4.5L9.5 6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function fmt(s) {
    if (!isFinite(s)) return '--:--';
    return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  function init(cfg) {
    var audio         = document.getElementById(cfg.audioId);
    var playBtn       = document.getElementById(cfg.playBtnId);
    var progressBar   = cfg.progressBarId   ? document.getElementById(cfg.progressBarId)   : null;
    var currentTimeEl = cfg.currentTimeId   ? document.getElementById(cfg.currentTimeId)   : null;
    var durationEl    = cfg.durationId      ? document.getElementById(cfg.durationId)      : null;
    var rewindBtn     = cfg.rewindBtnId     ? document.getElementById(cfg.rewindBtnId)     : null;
    var forwardBtn    = cfg.forwardBtnId    ? document.getElementById(cfg.forwardBtnId)    : null;
    var volumeSlider  = cfg.volumeSliderId  ? document.getElementById(cfg.volumeSliderId)  : null;
    var visualEl      = cfg.visualId        ? document.getElementById(cfg.visualId)        : null;
    var orbRing       = cfg.orbRingId         ? document.getElementById(cfg.orbRingId)         : null;
    var spectrumSvg   = cfg.spectrumSvgId    ? document.getElementById(cfg.spectrumSvgId)    : null;
    var visualVoiceEl = orbRing ? orbRing.closest('.ag-player-visual--voice') : null;
    var statusText    = cfg.statusTextId    ? document.getElementById(cfg.statusTextId)    : null;
    var iconPlay      = cfg.iconPlayId      ? document.getElementById(cfg.iconPlayId)      : null;
    var iconPause     = cfg.iconPauseId     ? document.getElementById(cfg.iconPauseId)     : null;
    var iconReplay    = cfg.iconReplayId    ? document.getElementById(cfg.iconReplayId)    : null;

    if (!audio || !playBtn) return;

    /* ── 音量初始化 ── */
    if (volumeSlider) {
      audio.volume = parseFloat(volumeSlider.value) || 0.5;
      volumeSlider.addEventListener('input', function (e) {
        audio.volume = parseFloat(e.target.value);
      });
    }

    /* ══════════════════════════════════════════════════════════════════
     * Web Audio API — 分析專用架構（不截斷原生音訊輸出）
     *
     * 關鍵設計：
     *   audio element 的原生輸出保持不變（直接到系統）。
     *   另外建立一條「靜音分析支路」：
     *     createMediaElementSource → GainNode(0) → AnalyserNode → destination
     *   GainNode gain=0 確保這條支路完全靜音，
     *   AnalyserNode 只讀取頻率資料，不輸出任何聲音。
     *
     * 注意：createMediaElementSource 會將 audio element 的輸出
     *   「接管」到 AudioContext，所以必須同時把 analyser 接回
     *   audioCtx.destination，否則聲音會消失。
     *   這裡的做法是：src → analyser → destination（正常輸出）
     *   同時 gain=0 的支路不接 destination，只讀資料。
     *   實際上最簡單且安全的做法是：
     *     src → analyser → destination（聲音正常走 AudioContext 輸出）
     *   但熄屏時 AudioContext 可能被 suspend，導致無聲。
     *
     * 最終採用的解法：
     *   不使用 createMediaElementSource（避免接管音訊路由）。
     *   改用 createMediaStreamDestination + captureStream()，
     *   或直接放棄 Web Audio 分析，改用 CSS 動畫模擬呼吸感。
     *   → 選擇後者：熄屏時光環改為 CSS 呼吸動畫，回到前景再恢復分析。
     * ══════════════════════════════════════════════════════════════════ */

    var audioCtx = null, analyser = null, freqBuf = null;
    var smoothVol = 0, rafId = null;
    var pageVisible = !document.hidden;

    /* CSS 呼吸動畫（熄屏備援）*/
    function startOrbBreathing() {
      if (!orbRing) return;
      orbRing.style.animation = 'agOrbBreathe 4s ease-in-out infinite';
    }
    function stopOrbBreathing() {
      if (!orbRing) return;
      orbRing.style.animation = '';
    }

    /* 注入 CSS keyframe（只注入一次）*/
    if (orbRing && !document.getElementById('ag-orb-breathe-style')) {
      var st = document.createElement('style');
      st.id = 'ag-orb-breathe-style';
      st.textContent =
        '@keyframes agOrbBreathe {' +
        '  0%,100% { box-shadow: 0 0 10px rgba(189,0,255,0.55),0 0 28px rgba(189,0,255,0.22),0 0 60px rgba(189,0,255,0.08),inset 0 0 10px rgba(189,0,255,0.06); transform: scale(1); }' +
        '  50%     { box-shadow: 0 0 18px rgba(189,0,255,0.75),0 0 48px rgba(189,0,255,0.35),0 0 90px rgba(189,0,255,0.14),inset 0 0 14px rgba(189,0,255,0.10); transform: scale(1.04); }' +
        '}';
      document.head.appendChild(st);
    }

    /* Web Audio 初始化（使用者手勢後呼叫）
     *
     * 使用 captureStream() 而非 createMediaElementSource()。
     * captureStream() 只複製一份串流給 AudioContext 分析，
     * 不接管 audio element 的原生輸出路由。
     * 熄屏後聲音繼續走原生 HTMLAudioElement → 系統，
     * AudioContext 被 suspend 只影響視覺分析，不影響聲音。
     *
     * 相容性：iOS Safari 不支援 captureStream()，
     * 偵測到不支援時直接跳過（光環退回 CSS 動畫，聲音不受影響）。
     */
    function initWebAudio() {
      if (audioCtx || !orbRing) return;
      if (typeof audio.captureStream !== 'function' &&
          typeof audio.mozCaptureStream !== 'function') {
        /* 不支援 captureStream（例如 iOS Safari）：直接用 CSS 動畫 */
        return;
      }
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var stream = audio.captureStream
          ? audio.captureStream()
          : audio.mozCaptureStream();
        var streamSrc = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        freqBuf  = new Uint8Array(analyser.frequencyBinCount);
        /* 分析路由：streamSrc → analyser（不接 destination，純分析）
         * 原生輸出路由完全不受影響 */
        streamSrc.connect(analyser);
      } catch (e) {
        audioCtx = null;
      }
    }

    function boost(x) {
      var gained = Math.min(x * 3.5, 1.0);
      return Math.pow(gained, 0.55);
    }

    function applyGlow(v) {
      if (!orbRing) return;
      var b1 = (10  + v * 22).toFixed(1);
      var b2 = (28  + v * 44).toFixed(1);
      var b3 = (60  + v * 60).toFixed(1);
      var a1 = (0.55 + v * 0.40).toFixed(3);
      var a2 = (0.22 + v * 0.38).toFixed(3);
      var a3 = (0.08 + v * 0.22).toFixed(3);
      var ai = (0.06 + v * 0.14).toFixed(3);
      var sc = (1.0  + v * 0.06).toFixed(4);
      orbRing.style.boxShadow =
        '0 0 ' + b1 + 'px rgba(189,0,255,' + a1 + '),' +
        '0 0 ' + b2 + 'px rgba(189,0,255,' + a2 + '),' +
        '0 0 ' + b3 + 'px rgba(189,0,255,' + a3 + '),' +
        'inset 0 0 10px rgba(189,0,255,' + ai + ')';
      orbRing.style.transform = 'scale(' + sc + ')';
    }

    /* ── SVG 環形頻譜初始化（只執行一次）── */
    (function buildSpectrumSvg() {
      if (!spectrumSvg) return;
      /* 參數設計：對標圖二的比例與參差感 */
      var BARS    = 80;    /* 線條數量：與圖二相近的密度 */
      var CX      = 200;   /* SVG 中心（配合 400x400 viewBox）*/
      var CY      = 200;
      var ORB_R   = 105;   /* orb-ring 外緣半徑（對標 150px 光環在 400px SVG 中）*/
      var MIN_LEN = 18;    /* 最短線條 */
      var MAX_LEN = 72;    /* 最長線條：與圖二相近的幅度 */
      var LINE_W  = 1.4;
      var NS      = 'http://www.w3.org/2000/svg';

      /* 用固定种子的偽隨機數列，保證每次頁面載入都是同一組參差 */
      var seeds = [0.82,0.31,0.95,0.47,0.68,0.12,0.76,0.55,0.39,0.88,
                   0.23,0.61,0.44,0.97,0.15,0.73,0.52,0.86,0.28,0.64,
                   0.91,0.37,0.79,0.18,0.56,0.43,0.99,0.25,0.67,0.84,
                   0.11,0.72,0.48,0.93,0.35,0.59,0.81,0.22,0.66,0.45,
                   0.78,0.14,0.96,0.33,0.57,0.89,0.41,0.70,0.26,0.53,
                   0.87,0.19,0.62,0.38,0.75,0.50,0.94,0.29,0.71,0.16,
                   0.83,0.42,0.98,0.24,0.60,0.36,0.77,0.13,0.65,0.90,
                   0.32,0.54,0.85,0.20,0.69,0.46,0.92,0.17,0.58,0.80];

      for (var i = 0; i < BARS; i++) {
        var angle = (i / BARS) * Math.PI * 2 - Math.PI / 2;
        /* 參差長度：用种子數列決定，保證每次相同 */
        var t   = seeds[i % seeds.length];
        var len = MIN_LEN + t * (MAX_LEN - MIN_LEN);

        var x1 = CX + Math.cos(angle) * ORB_R;
        var y1 = CY + Math.sin(angle) * ORB_R;
        var x2 = CX + Math.cos(angle) * (ORB_R + len);
        var y2 = CY + Math.sin(angle) * (ORB_R + len);

        var line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', x1.toFixed(2));
        line.setAttribute('y1', y1.toFixed(2));
        line.setAttribute('x2', x2.toFixed(2));
        line.setAttribute('y2', y2.toFixed(2));
        line.setAttribute('stroke', 'rgba(189,0,255,1)');
        line.setAttribute('stroke-width', LINE_W);
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('class', 'ag-spec-line');
        spectrumSvg.appendChild(line);
      }

      /* 更新 SVG viewBox 配合新的中心座標 */
      spectrumSvg.setAttribute('viewBox', '0 0 400 400');
    })();

    /* ── 整體呼吸：用 smoothVol 控制 SVG 整體 scale ── */
    function applySpectrumScale(v) {
      if (!spectrumSvg) return;
      /* v: 0–1，靜止時 v=0，大聲時 v=1
       * scale 範圍：0.86（靜止）→ 1.22（最大聲）——幅度加大讓呼吸更明顯 */
      var sc = (0.86 + v * 0.36).toFixed(4);
      spectrumSvg.style.transform = 'translate(-50%, -50%) scale(' + sc + ')';
    }

    function glowLoop() {
      rafId = requestAnimationFrame(glowLoop);
      var isPlaying = !audio.paused && pageVisible;
      var rawVol = 0;
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(freqBuf);
        var sum = 0, count = 0;
        for (var i = 4; i < 28; i++) { sum += freqBuf[i]; count++; }
        rawVol = sum / count / 255;
      }
      /* 上升快、下降稍慢：讓呼吸節奏跟說話速度吸合 */
      var lerpRate = rawVol > smoothVol ? 0.55 : 0.10;
      smoothVol += (rawVol - smoothVol) * lerpRate;
      applyGlow(boost(smoothVol));
      if (isPlaying) applySpectrumScale(boost(smoothVol));
    }

    if (orbRing) glowLoop();

    /* ── 熄屏 / 回到前景處理 ── */
    document.addEventListener('visibilitychange', function () {
      pageVisible = !document.hidden;

      if (document.hidden) {
        /* 熄屏：AudioContext suspend（省電），改用 CSS 呼吸動畫 */
        if (audioCtx && audioCtx.state === 'running') {
          audioCtx.suspend().catch(function () {});
        }
        if (orbRing && !audio.paused) startOrbBreathing();
        /* 停止 rAF（省電；聲音由 HTMLAudioElement 繼續播放）*/
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

      } else {
        /* 回到前景：恢復 AudioContext，重啟 rAF */
        stopOrbBreathing();
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume().catch(function () {});
        }
        if (!rafId && orbRing) glowLoop();

        /* 同步 UI 狀態 */
        if (audio.paused) {
          showIcon(audio.ended ? 'replay' : 'play');
          playBtn.classList.remove('active');
          if (visualEl) visualEl.classList.remove('playing');
        } else {
          showIcon('pause');
          playBtn.classList.add('active');
          if (visualEl) visualEl.classList.add('playing');
        }
      }
    });

    /* ── 圖示切換 ── */
    function showIcon(which) {
      if (iconPlay) {
        iconPlay.style.display   = which === 'play'   ? '' : 'none';
        if (iconPause)  iconPause.style.display  = which === 'pause'  ? '' : 'none';
        if (iconReplay) iconReplay.style.display = which === 'replay' ? '' : 'none';
      } else {
        if (which === 'play')   playBtn.innerHTML = SVG_PLAY;
        if (which === 'pause')  playBtn.innerHTML = SVG_PAUSE;
        if (which === 'replay') playBtn.innerHTML = SVG_REPLAY;
      }
    }

    /* ── 播放/暫停按鈕 ── */
    playBtn.addEventListener('click', function () {
      if (audio.ended) audio.currentTime = 0;
      if (audio.paused) {
        initWebAudio();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    });

    /* ── 倒退 / 快進 ── */
    if (rewindBtn) {
      rewindBtn.addEventListener('click', function () {
        audio.currentTime = Math.max(0, audio.currentTime - 15);
      });
    }
    if (forwardBtn) {
      forwardBtn.addEventListener('click', function () {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
      });
    }

    /* ── 進度條 ── */
    if (progressBar) {
      audio.addEventListener('loadedmetadata', function () {
        if (durationEl) durationEl.textContent = fmt(audio.duration);
        progressBar.max = audio.duration;
      });
      audio.addEventListener('timeupdate', function () {
        var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        progressBar.value = audio.currentTime;
        progressBar.style.setProperty('--progress', pct.toFixed(1) + '%');
        if (currentTimeEl) currentTimeEl.textContent = fmt(audio.currentTime);
      });
      progressBar.addEventListener('input', function () {
        audio.currentTime = parseFloat(progressBar.value);
        var pct = audio.duration ? (progressBar.value / audio.duration) * 100 : 0;
        progressBar.style.setProperty('--progress', pct.toFixed(1) + '%');
      });
    }

    /* ── 播放狀態事件 ── */
    audio.addEventListener('play', function () {
      initWebAudio();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
      stopOrbBreathing();
      if (!rafId && orbRing) glowLoop();
      showIcon('pause');
      playBtn.classList.add('active');
      playBtn.setAttribute('aria-label', '暫停');
      if (visualEl) visualEl.classList.add('playing');
      if (visualVoiceEl) visualVoiceEl.classList.add('playing');
      if (statusText) statusText.textContent = cfg.statusPlaying || '播放中';
      updateMediaSession();
    });

    audio.addEventListener('pause', function () {
      showIcon('play');
      playBtn.classList.remove('active');
      playBtn.setAttribute('aria-label', '播放');
      if (visualEl) visualEl.classList.remove('playing');
      if (visualVoiceEl) visualVoiceEl.classList.remove('playing');
      stopOrbBreathing();
      if (statusText) {
        statusText.textContent = audio.currentTime > 0
          ? (cfg.statusPaused || '已暫停')
          : (cfg.statusIdle   || '點擊播放');
      }
    });

    audio.addEventListener('ended', function () {
      showIcon('replay');
      playBtn.classList.remove('active');
      playBtn.setAttribute('aria-label', '重新播放');
      if (visualEl) visualEl.classList.remove('playing');
      if (visualVoiceEl) visualVoiceEl.classList.remove('playing');
      stopOrbBreathing();
      if (statusText) statusText.textContent = cfg.statusEnded || '播放結束';
      if (progressBar) {
        progressBar.value = 0;
        progressBar.style.setProperty('--progress', '0%');
      }
      if (currentTimeEl) currentTimeEl.textContent = '0:00';
    });

    /* ── Media Session API（鎖屏背景播放）── */
    function updateMediaSession() {
      if (!('mediaSession' in navigator)) return;
      navigator.mediaSession.metadata = new MediaMetadata({
        title:  cfg.mediaTitle  || 'Afterglow',
        artist: cfg.mediaArtist || 'Afterglow',
        artwork: [{
          src:   cfg.artworkSrc    || '/assets/icons/icon-192x192.png',
          sizes: '192x192',
          type:  'image/png'
        }, {
          src:   cfg.artworkSrc512 || '/assets/icons/icon-512x512.png',
          sizes: '512x512',
          type:  'image/png'
        }]
      });

      navigator.mediaSession.setActionHandler('play', function () {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        audio.play().catch(function () {});
      });
      navigator.mediaSession.setActionHandler('pause', function () {
        audio.pause();
      });
      navigator.mediaSession.setActionHandler('stop', function () {
        audio.pause();
        audio.currentTime = 0;
      });

      if (!cfg.isLoop) {
        navigator.mediaSession.setActionHandler('seekbackward', function (details) {
          audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 15));
        });
        navigator.mediaSession.setActionHandler('seekforward', function (details) {
          audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + (details.seekOffset || 15));
        });
        navigator.mediaSession.setActionHandler('seekto', function (details) {
          if (details.seekTime != null) audio.currentTime = details.seekTime;
        });
      }
    }
  }

  return { init: init };
})();
