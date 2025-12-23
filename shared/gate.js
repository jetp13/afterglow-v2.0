// Afterglow v2.0 - shared/gate.js
// 智慧閘門（Gate）模組｜GitHub Pages 安全版
//
// 設計原則：
// 1. 同一個瀏覽階段（session）只需同意一次
// 2. 關閉瀏覽器後需重新同意
// 3. 相容 GitHub Pages（repo base path）
// 4. 靜默失敗，不阻斷頁面

const AG_GATE_KEY = "afterglow_v2_gate_consent";

/**
 * 是否已通過智慧閘門
 * @returns {boolean}
 */
export function hasGateConsent() {
  try {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(AG_GATE_KEY) === "yes";
  } catch (e) {
    return false;
  }
}

/**
 * 設定已通過智慧閘門
 * 在 legal.html 按下「同意」時呼叫
 */
export function setGateConsent() {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(AG_GATE_KEY, "yes");
  } catch (e) {
    // 靜默失敗
  }
}

/**
 * 清除同意狀態（預留）
 */
export function clearGateConsent() {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(AG_GATE_KEY);
  } catch (e) {}
}

/**
 * 確保已通過智慧閘門，否則導向 legal 頁
 *
 * @param {Object} options
 * @param {string} options.legalUrl  預設 "./legal.html"
 * @param {Function} options.onBypass 已通過時執行（可選）
 */
export function ensureGateOrRedirect(options = {}) {
  const { legalUrl = "./legal.html", onBypass } = options;

  if (!hasGateConsent()) {
    try {
      if (typeof window === "undefined") return;

      const current =
        window.location.pathname + window.location.search;

      // 使用 URL 物件，確保 GitHub Pages base path 正確
      const targetUrl = new URL(legalUrl, window.location.href);
      targetUrl.searchParams.set("from", current || "/");

      window.location.assign(targetUrl.toString());
    } catch (e) {
      // 靜默失敗，不中斷頁面
    }
    return;
  }

  // 已通過閘門，可執行額外初始化邏輯
  if (typeof onBypass === "function") {
    try {
      onBypass();
    } catch (e) {}
  }
}

/**
 * 使用說明（範例）：
 *
 * 在 index.html / 受保護頁面：
 *
 * <script type="module">
 *   import { ensureGateOrRedirect } from "./shared/gate.js";
 *   ensureGateOrRedirect({
 *     legalUrl: "./legal.html",
 *   });
 * </script>
 *
 * 在 legal.html：
 *
 * <script type="module">
 *   import { setGateConsent } from "./shared/gate.js";
 *
 *   document.querySelector("#agreeBtn").addEventListener("click", () => {
 *     setGateConsent();
 *     const params = new URLSearchParams(window.location.search);
 *     const from = params.get("from") || "./index.html";
 *     window.location.assign(from);
 *   });
 * </script>
 */
