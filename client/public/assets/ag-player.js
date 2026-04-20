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
      /* ag-orb-ring 已在 voice 頁面被隱藏（由 SVG 圓環取代），此函式保留但不操作 DOM */
    }

    /* ── SVG 圓環頻譜初始化
     *   架構：3 條圓心公轉交織圓環，色彩為粉紅/紫/藍低飽和系
     *   圓心偏移：每條圓的圓心以不同速度、不同相位繞著圖片中心公轉
     *   交織感來源：各圓心偏移導致圓環在不同方向微小錢移，形成交織感
     * ── */
    var ringTs      = 0;   /* 圓心公轉累積時間（ms）*/
    var lastRingTs  = 0;   /* 上次更新時間戳 */

    (function buildRingSpectrum() {
      if (!spectrumSvg) return;
      var NS = 'http://www.w3.org/2000/svg';
      var CX = 120;   /* viewBox 240x240 中心 */
      var CY = 120;
      var R  = 85;    /* 基礎半徑 */

      /* ── 3 條圓環的屬性設定
       *   色彩：粉紅/紫/藍 低飽和系，不使用 hue-rotate
       *   orbitR：圓心公轉半徑（px）
       *   orbitSpeed：圓心公轉速度（度/秒）
       *   orbitPhase：初始相位（度）
       *   sw：線條粗細（px）
       *   opacity：透明度 */
      var ringDefs = [
        { color: '#c084fc', sw: 1.0, opacity: 0.90, orbitR: 10, orbitSpeed:  18, orbitPhase:   0 },  /* 紫粉 */
        { color: '#818cf8', sw: 0.8, opacity: 0.75, orbitR:  8, orbitSpeed: -13, orbitPhase: 120 },  /* 藍紫 */
        { color: '#f0abfc', sw: 0.6, opacity: 0.55, orbitR: 13, orbitSpeed:  22, orbitPhase: 240 }   /* 淡粉紫 */
      ];

      /* 建立圓環元素：每條圓環用一個 <circle> */
      var ringEls = [];
      ringDefs.forEach(function(def) {
        var circle = document.createElementNS(NS, 'circle');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', def.color);
        circle.setAttribute('stroke-width', def.sw.toFixed(1));
        circle.setAttribute('opacity', def.opacity.toFixed(2));
        circle.setAttribute('class', 'ag-ring-arc');
        spectrumSvg.appendChild(circle);
        ringEls.push(circle);
      });

      spectrumSvg._ringEls   = ringEls;
      spectrumSvg._ringDefs  = ringDefs;
      spectrumSvg._CX        = CX;
      spectrumSvg._CY        = CY;
      spectrumSvg._R0        = R;

      spectrumSvg.setAttribute('viewBox', '0 0 240 240');
    })();

    /* ── 圓環呼吸：多圓心公轉交織架構
     *   v    = smoothVol boost（控制半徑 / 線寬）
     *   ts   = rAF timestamp
     *   vRaw = rawVol boost（控制公轉加速，即時語音節奏）
     * ── */
    function applyRingSpectrum(v, ts, vRaw) {
      if (vRaw === undefined) vRaw = v;
      if (!spectrumSvg || !spectrumSvg._ringEls) return;

      var CX       = spectrumSvg._CX;
      var CY       = spectrumSvg._CY;
      var R0       = spectrumSvg._R0;
      var ringEls  = spectrumSvg._ringEls;
      var ringDefs = spectrumSvg._ringDefs;

      /* 更新圓心公轉累積時間
       *   靜止時：公轉慢速（1x），說話時：加速至最大 6x，強化語音節奏對比 */
      if (lastRingTs > 0 && ts > 0) {
        var dt = ts - lastRingTs;
        if (dt > 0 && dt < 500) {
          var speedMult = 1 + vRaw * 5;   /* 1x（停頓）→ 6x（最大聲）*/
          ringTs += dt * speedMult;
        }
      }
      if (ts > 0) lastRingTs = ts;

      /* 更新每條圓環：圓心公轉 + 半徑呼吸 + 線寬反向 */
      ringDefs.forEach(function(def, i) {
        var el = ringEls[i];
        /* 圓心公轉角度（度）*/
        var angle = (def.orbitPhase + def.orbitSpeed * ringTs / 1000) % 360;
        var rad   = angle * Math.PI / 180;
        /* 圓心偏移：在 orbitR 半徑的圓上公轉 */
        var cx = CX + def.orbitR * Math.cos(rad);
        var cy = CY + def.orbitR * Math.sin(rad);
        /* 半徑：基礎 R0 + 音量擴張 + 圓心偏移补償（圓心偏外時半徑微小縮）*/
        var r  = R0 + v * 20;
        /* 線寬：說話時變細（拉伸感）*/
        var sw = (def.sw * (1 - v * 0.50)).toFixed(2);

        el.setAttribute('cx', cx.toFixed(2));
        el.setAttribute('cy', cy.toFixed(2));
        el.setAttribute('r',  r.toFixed(2));
        el.setAttribute('stroke-width', sw);
      });

      /* drop-shadow 微光暈：色彩對齊粉累累紫色調
       *   靜止時 2px，說話時隨音量擴散至 5px */
      var glowR = (2 + v * 3).toFixed(1);
      var glowA = (0.40 + v * 0.40).toFixed(2);
      spectrumSvg.style.filter =
        'drop-shadow(0 0 ' + glowR + 'px rgba(192,132,252,' + glowA + '))';
    }

    function glowLoop(ts) {
      rafId = requestAnimationFrame(glowLoop);
      var isPlaying = !audio.paused && pageVisible;
      var rawVol = 0;
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(freqBuf);
        var sum = 0, count = 0;
        for (var i = 4; i < 28; i++) { sum += freqBuf[i]; count++; }
        rawVol = sum / count / 255;
      }
      /* 上升快、下降快：讓停頓時圓環迅速靜下來，強化講話/停頓對比
       * 上升 0.70（幾乎即時）、下降 0.25（約 4 幀歸零）*/
      var lerpRate = rawVol > smoothVol ? 0.70 : 0.25;
      smoothVol += (rawVol - smoothVol) * lerpRate;
      applyGlow(boost(smoothVol));
      /* 圓環頻譜：
       *   smoothVol → 控制半徑 / 線寬（有平滑感的呼吸）
       *   rawVol    → 控制色相旋轉速度（即時反映語音節奏）*/
      applyRingSpectrum(
        isPlaying ? boost(smoothVol) : 0,
        ts || 0,
        isPlaying ? boost(rawVol)    : 0
      );
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
          if (visualVoiceEl) visualVoiceEl.classList.remove('playing');
        } else {
          showIcon('pause');
          playBtn.classList.add('active');
          if (visualEl) visualEl.classList.add('playing');
          if (visualVoiceEl) visualVoiceEl.classList.add('playing');
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
