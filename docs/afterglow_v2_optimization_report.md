# Afterglow v2.0 骨架程式碼優化建議報告

**作者：** Manus AI
**日期：** 2025 年 12 月 19 日
**目標儲存庫：** `jetp13/afterglow-v2.0`

---

## 摘要與專案概況

本報告根據用戶指示，對 `jetp13/afterglow-v2.0` 儲存庫的現有骨架程式碼進行了初步審查，旨在提出優化建議並確保程式碼符合專案的維護標準。

**專案技術棧分析：**
該專案採用 **純粹的 Web 技術棧**，包括 HTML5、CSS3（集中於 `assets/layout.css`）以及 Vanilla JavaScript（使用 ES 模組，例如 `shared/gate.js`）。此架構的優勢在於輕量、高效且易於部署。

**核心功能審查：**
專案的核心邏輯集中在 **智慧閘門（Smart Gate）** 機制，透過 `shared/gate.js` 實現。此機制利用瀏覽器的 `sessionStorage` 確保用戶在單次瀏覽會話中，只需同意一次免責聲明（`legal.html`）即可訪問其他受保護的頁面，這完全符合專案的設計目標。

---

## 1. 程式碼風格與結構優化

在審查過程中，我們發現並立即實施了一項關於樣式管理的重要優化，以提高程式碼的**可維護性**與**樣式重用性**。

### 1.1 CSS 樣式集中化與重用（已實施）

**問題描述：**
在 `legal.html` 檔案中，免責聲明同意按鈕使用了大量的 **內聯樣式（inline-style）** 來定義其外觀。這種做法違反了程式碼審查規範中「避免使用內聯樣式，應改為重用既有 class 或新增 modifier」的原則。內聯樣式會導致樣式難以管理，且無法在其他頁面重用。

**優化實施：**
我們已將按鈕的樣式抽象化，並新增至全域樣式表 `assets/layout.css` 中，以確保樣式與結構分離。

| 檔案 | 變更內容 | 目的 |
| :--- | :--- | :--- |
| `assets/layout.css` | 新增通用按鈕類別 `ag-button` 及主色按鈕類別 `ag-button--primary`。 | 集中管理樣式，提高重用性。 |
| `legal.html` | 將 `<button>` 標籤中的內聯 `style` 屬性移除，替換為 `class="ag-button ag-button--primary"`。 | 淨化 HTML 結構，符合專案規範。 |

### 1.2 樣式命名空間的統一建議

專案中已廣泛使用 **`ag-`** 作為 CSS 類別的前綴（例如 `ag-app-frame`, `ag-header`）。為確保專案風格的一致性，我們建議未來所有新增的專案級樣式都應統一採用 **`ag-`** 前綴，以避免與未來可能引入的 `glow-` 或 `afterglow-` 類別產生混淆，從而保持命名空間的清晰度。

---

## 2. 智慧閘門（Smart Gate）邏輯審查

`shared/gate.js` 中的智慧閘門邏輯設計得相當完善，它有效地利用 `sessionStorage` 實現了用戶體驗與法律要求之間的平衡。

| 函式 | 目的 | 審查結果 |
| :--- | :--- | :--- |
| `hasGateConsent()` | 檢查是否已同意 | 邏輯清晰，使用 `sessionStorage` 鍵 `afterglow_v2_gate_consent`。 |
| `setGateConsent()` | 記錄同意狀態 | 靜默失敗處理，確保不中斷頁面流程。 |
| `ensureGateOrRedirect()` | 執行閘門檢查與導向 | 成功實現了帶有 `?from=` 參數的導向邏輯，確保同意後能返回原頁面。 |

**進一步優化建議：**

雖然目前的錯誤處理機制（`try...catch`）是靜默失敗的，但在開發階段，建議在 `shared/gate.js` 的 `ensureGateOrRedirect` 函式中，針對導向失敗的情況，**在瀏覽器 Console 中輸出一個警告**。這將有助於開發者在除錯時，快速發現因瀏覽器限制（如沙盒環境或嚴格的隱私設定）導致的 `sessionStorage` 或 `window.location` 存取問題。

---

## 3. 專案結構與後續開發建議

### 3.1 檔案結構符合標準

目前的檔案結構（包含 `index.html`, `legal.html`, `meditation/`, `support/`, `assets/`, `shared/` 等）與專案知識庫中定義的 **Afterglow 網站專案檔案樹結構標準** 保持一致。

### 3.2 待實作頁面與骨架建議

目前專案中尚有許多頁面處於骨架狀態，尚未實作具體內容。為了確保未來開發的連貫性，我們建議在這些頁面中加入基礎的骨架結構和閘門檢查：

| 頁面路徑 | 狀態 | 建議動作 |
| :--- | :--- | :--- |
| `meditation/menu.html` | 待實作 | 應作為 `index.html` 通過閘門後的主要導航頁面。 |
| `meditation/breathing.html` | 待實作 | 應引入 `ensureGateOrRedirect` 確保受閘門保護。 |
| `meditation/guide.html` | 待實作 | 應引入 `ensureGateOrRedirect` 確保受閘門保護。 |
| `support/*` 頁面 | 待實作 | 所有緊急支援頁面都應引入 `ensureGateOrRedirect`。 |

**總結：**

本次審查已完成一項重要的程式碼風格優化。專案的基礎架構穩固，核心邏輯清晰。下一步的開發重點應放在實作各個功能頁面的內容，並確保所有頁面都正確地整合了智慧閘門邏輯。
