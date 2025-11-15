// Afterglow v2.0 - shared/gate.js
// 智慧閘門骨架（Skeleton）
//
// 目前目標：
// 1. 在「同一個開啟階段」裡，只要同意過一次，就不再重複跳出閘門。
// 2. 關掉整個網站重新開啟後，要重新走一次閘門。
// → 因此使用 sessionStorage，而不是 localStorage。

const AG_GATE_KEY = "afterglow_v2_gate_consent";

/**
 * 取得目前是否已經通過智慧閘門
 * 回傳：true / false
 */
export function hasGateConsent() {
  try {
    if (typeof window === "undefined") return false;
    const value = window.sessionStorage.getItem(AG_GATE_KEY);
    return value === "yes";
  } catch (e) {
    // 若瀏覽器不支援 sessionStorage，就一律視為「尚未通過」
    return false;
  }
}

/**
 * 設定已通過智慧閘門
 * 之後在「免責／法律聲明」頁面按下同意時呼叫
 */
export function setGateConsent() {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(AG_GATE_KEY, "yes");
  } catch (e) {
    // 靜默失敗即可，不中斷頁面
  }
}

/**
 * 清除同意狀態（預留）
 * 之後如果有「重走閘門」的需求可以使用
 */
export function clearGateConsent() {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(AG_GATE_KEY);
  } catch (e) {}
}

/**
 * 在需要智慧閘門的頁面呼叫此函式
 *
 * options.legalUrl   → 閘門頁面（例如："/legal.html" 或 "/legal/index.html"）
 * options.onBypass   → 若已通過閘門，可以在這裡做一些初始化（可選）
 */
export function ensureGateOrRedirect(options = {}) {
  const { legalUrl = "/legal.html", onBypass } = options;

  if (!hasGateConsent()) {
    // 尚未通過：導向到閘門頁面，並帶上 from 參數
    try {
      const current =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/";
      const target =
        legalUrl + "?from=" + encodeURIComponent(current || "/");
      if (typeof window !== "undefined") {
        window.location.href = target;
      }
    } catch (e) {
      // 若無法導向，就維持原頁面（最少干擾原本流程）
    }
    return;
  }

  // 已通過閘門：可選擇執行額外邏輯
  if (typeof onBypass === "function") {
    try {
      onBypass();
    } catch (e) {}
  }
}

/**
 * TODO（之後的版本再做）：
 * - 在 legal.html / disclaimer.html 中：
 *   - 使用 setGateConsent() 紀錄通過狀態
 *   - 讀取 URL ?from=... 決定同意後導回哪一頁
 * - 在需要被保護的頁面（例如 index.html / Support.html）：
 *   - 在 <script type="module"> 中呼叫：
 *       import { ensureGateOrRedirect } from "../shared/gate.js";
 *       ensureGateOrRedirect({ legalUrl: "/legal.html" });
 */
