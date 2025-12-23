// assets/gate.js
// Refactored for PROD | 呼吸膠囊 Mobile v1.1
[span_23](start_span)[span_24](start_span)//[span_23](end_span)[span_24](end_span)

(() => {
    // 1. Config Setup
    const cfg = window.AG_CONFIG || {};
    const audioSrc = cfg.audioSrc;

    [span_25](start_span)// 2. DOM Elements (Mapping to Glow Naming)[span_25](end_span)
    const sphere = document.getElementById("sphere"); // .glow-sphere
    const btnAction = document.getElementById("btn-action"); // .glow-btn-primary
    const btnStop = document.getElementById("btn-stop"); // .glow-btn-secondary
    const hint = document.getElementById("hint"); // .glow-title-sub

    // 3. Audio Init
    const audio = new Audio();
    audio.preload = "auto";
    let isPlaying = false;

    // 4. State Management
    function setState(state) {
        // state: "rest" | "breathing"
        if (state === "breathing") {
            sphere.classList.add("is-breathing");
            
            // UI Update
            btnAction.style.display = "none";
            btnStop.style.display = "inline-block";
            safeSetHint("跟隨光暈呼吸...");
            isPlaying = true;
        } else {
            sphere.classList.remove("is-breathing");
            
            // UI Update
            btnAction.style.display = "inline-block";
            btnAction.innerText = "再次開始";
            btnStop.style.display = "none";
            safeSetHint("已完成。隨時可以再次開始。");
            isPlaying = false;
        }
    }

    function safeSetHint(text) {
        if (hint) hint.innerHTML = text;
    }

    // 5. Core Actions
    function startJourney() {
        if (!audioSrc) {
            safeSetHint("⚠️ 系統錯誤：未設定 Audio Source");
            console.error("Missing window.AG_CONFIG.audioSrc");
            return;
        }

        audio.src = audioSrc;
        audio.currentTime = 0;

        // 啟動視覺
        setState("breathing");

        // 啟動聽覺
        audio.play().catch((e) => {
            console.warn("Autoplay blocked", e);
            safeSetHint("請點擊畫面以播放音訊");
            setState("rest"); // Rollback if failed
        });
    }

    function stopJourney() {
        audio.pause();
        audio.currentTime = 0;
        setState("rest");
    }

    // 6. Event Listeners
    [span_26](start_span)// 音檔自然結束時的處理[span_26](end_span)
    audio.addEventListener("ended", () => {
        setState("rest");
        safeSetHint("旅程結束。");
    });

    btnAction?.addEventListener("click", startJourney);
    btnStop?.addEventListener("click", stopJourney);

    // Initial State
    safeSetHint("點擊開始以進入旅程");
    console.log("Glow OS | Gate Logic Loaded v1.1");
})();
