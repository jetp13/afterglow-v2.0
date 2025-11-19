# Afterglow v2.x 程式碼審查規範（給工程師 & Codex）

> 目的：確保 Afterglow v2.x Web App 的程式碼在多次跨平台生成（Manus / ChatGPT / Figma / 自行手改）之後，仍能維持 **版面一致、UI 規格統一、程式結構清晰、容易維護**。  
> 使用對象：  
> - 人類 Reviewer  
> - ChatGPT Codex 自動程式碼審查

---

## 1. 專案範圍與關鍵頁面

### 1.1 目前主要頁面（示意，可依實際 repo 調整）

- `index.html`：入口頁（或 Gate / Landing）
- `Home.html`：Afterglow 主首頁
- `Gate.html`：權限／進入流程（若存在）
- `menu.html`（或 `MeditationMenu.html`）：冥想模式選單
- `Voice.html`：語音引導冥想頁
- `Breathing.html`（或 `Sphere.html`）：呼吸球冥想頁
- `Support.html`：緊急支援／減害說明
- `legal.html`：條款、告知與同意流程

### 1.2 共享樣式與腳本

- `layout.css`：全站排版與共用樣式（Glow OS 的核心 CSS）
- `components/`：按鈕、Glow 元件、Footer 等（若有獨立檔案）
- `main.js` / `script.js`：共用互動邏輯（如有）

---

## 2. 審查總原則（General Principles）

Reviewer（含 Codex）在看 PR 時，請優先檢查：

1. **不破壞現有 UI 規格**
   - Glow 膠囊按鈕外觀與尺寸一致
   - Breathing Sphere 保持原設計（尺寸與動畫）
   - Logo 與主標、副標層級清楚，符合 9:16 版面要求

2. **版面與排版穩定**
   - 不因新增元素導致跑版、溢出、捲軸異常
   - 手機直立 9:16 視窗下，仍維持可讀、可點擊

3. **程式碼乾淨、容易維護**
   - 避免重複樣式與魔法數字
   - 保持命名一致與結構清楚

4. **盡量延續既有結構**
   - 優先重用既有 class / component
   - 避免引入不必要的新框架或風格

---

## 3. HTML 審查規範

### 3.1 結構與語意化

- 頁面應有明確層級：
  - 一個 `<h1>` 作為主標題
  - 其他副標使用 `<h2> ~ <h4>`，依層級遞減
- 主要內容區域應使用語意化標籤：
  - `<main>`, `<section>`, `<header>`, `<footer>` 等
- 禁止單純用 `<div>` 亂堆，若可以用語意標籤就用。

### 3.2 Glow UI 結構要求

**Glow 膠囊按鈕（Glow Capsule Buttons）：**

- 使用既有 class（範例）：
  - `class="glow-button glow-button--primary"`
  - `class="glow-button glow-button--support"`
- 每個按鈕至少包含：
  ```html
  <button class="glow-button glow-button--primary">
    <span class="glow-button__label">開始冥想</span>
  </button>
````

* 不拆開或隨意修改 BEM 結構（`glow-button__label` 等）。

**Breathing Sphere（呼吸球）：**

* 外層容器應保留，例如：

  ```html
  <div class="breathing-sphere-container">
    <div class="breathing-sphere"></div>
  </div>
  ```
* 不任意移除 `breathing-sphere` class，以免動畫失效。

### 3.3 連結與導頁

* 所有導頁按鈕／連結需使用明確的 `href` 或 click handler。
* 若 PR 有新增或修改路由，需確認：

  * 對應的檔案存在
  * 不會造成死連結或 404

---

## 4. CSS / 版面審查規範

### 4.1 檔案與命名

* 新增樣式應優先寫在 `layout.css` 或指定 component CSS，而非到處開新檔。
* 使用一致命名規則（建議 BEM 或明確前綴）：

  * `glow-...`
  * `afterglow-...`
* 避免無意義命名（如 `.style1`, `.newClass`, `.box2`）。

### 4.2 Glow Buttons 規格

Reviewer 應確認：

* 文字不會被切掉或溢出膠囊外。
* 按鈕在手機寬度（如 375px）仍維持合理內距與可點擊區域。
* Hover / Active / Focus 狀態顏色與陰影一致。

若發現新 PR：

* 直接在 CSS 裡硬寫內聯樣式
  👉 建議改為重用既有 `glow-button` 類別或新增 modifier（`--secondary` 等）。

### 4.3 Breathing Sphere 規格（重要）

**請 Reviewer 確認以下條件保持不變（如有 `layout.css` 規格）：**

* 直徑：`220px`
* 動畫週期：`6s`（例如吸氣 3 秒、呼氣 3 秒）
* 在 9:16 視窗中垂直與水平置中（至少視覺上如此）
* 不被其他元素遮蓋或壓縮變形

若 PR 修改到 `.breathing-sphere` 或其父容器樣式，請特別檢查是否破壞上述規格。

### 4.4 9:16 版面與 RWD

* 手機視窗（約 390 x 844 或類似）不可出現：

  * 水平捲軸
  * 主要內容被擠到螢幕外
* `max-width` / `padding` 調整時，請檢查：

  * 是否仍保留居中
  * 是否保留適當留白

---

## 5. JavaScript 審查規範

### 5.1 一般原則

* 避免全局汙染：盡量使用函式或區塊作用域。
* 與 DOM 綁定時：

  * 使用明確 selector（例如 `.glow-button--support`），避免過度寬鬆。
* 新增事件監聽時要小心重複綁定。
* 避免魔法數字，可改用常數命名：

  ```js
  const BREATHING_CYCLE_MS = 6000;
  ```

### 5.2 與 UI 行為的對應

* 若 JS 控制的是：

  * 呼吸球縮放節奏
  * 按鈕點擊導頁
  * 緊急支援流程的步驟顯示
* Reviewer 應確認：

  * 導頁對象正確
  * 不會出現卡死、無法返回首頁等行為

---

## 6. Manus 產生程式碼的特別注意事項

當 PR 來自 Manus / 其他 AI 生成時，Reviewer（含 Codex）應特別檢查：

1. 是否多產生了新的 CSS reset 或 framework，與現有 `layout.css` 衝突。
2. 是否用大量 inline-style（`style="..."`），應提醒改為 class。
3. 是否破壞既有 class 命名，改成不一致的名稱。
4. 是否在 HTML 中塞入多餘的無用 `<div>` 或 nested container。

> 對 Codex 的指示：
> 若偵測到 Manus 生成風格（大量 inline-style、奇怪 class、重複結構），請用「條列」方式指出：
>
> * 哪一段是 Manus 風格
> * 建議如何重構以符合 Afterglow 現有結構

---

## 7. 無障礙與可用性（基本層級）

* 按鈕應使用 `<button>` 或 `<a>`，不要用 `<div>` 偽裝。
* 若為重要操作，應有清楚文字標籤（不要只有 Icon）。
* 對於動畫（如 Breathing Sphere），應避免：

  * 過快、眩暈感的動畫
  * 無目的持續閃動

若新增重度動畫，建議提供停用或減少動態的選項。

---

## 8. PR 說明格式建議（給人類作者）

請 PR 作者盡量遵守以下模板（可複製到 PR 描述）：

```markdown
## 變更內容簡述
- （例）調整 Home.html Hero 區塊排版
- （例）修正 Breathing Sphere 在手機版的置中問題

## 影響頁面
- Home.html
- layout.css

## 需要 Reviewer 特別留意的部分
- 按鈕間距是否在手機版仍然可接受
- 是否仍符合 Glow Buttons 規格

## 測試狀態
- [ ] 桌機寬度（≥ 1280px）
- [ ] 平板（約 768px 寬）
- [ ] 手機直立 9:16（約 375–414px 寬）
```

---

## 9. Reviewer Checklist（給工程師 & Codex）

在完成審查前，請至少快速檢查以下項目：

### 9.1 UI 與排版

* [ ] Glow Buttons 外觀與間距沒有明顯跑版
* [ ] Breathing Sphere 仍為 220px 並置中顯示
* [ ] Logo / 主標 / 副標層級清楚、不被壓縮或遮蓋
* [ ] 手機 9:16 版面無水平捲軸，主要內容可見

### 9.2 程式結構

* [ ] 未新增無意義 class 或 inline-style（如可避免）
* [ ] 未重複定義相同的 CSS 選擇器
* [ ] JS 變更有限且清楚、有註解（如涉及需求邏輯）

### 9.3 路由與互動

* [ ] 所有按鈕／連結有明確目的地
* [ ] 測試主要 user flow：

  * 首頁 → 冥想 → 語音／呼吸
  * 首頁 → 緊急支援 → 法律／減害說明
* [ ] 不會卡在某頁無法返回首頁

---

## 10. 給 ChatGPT Codex 的額外指示

當 Codex 自動審查 PR 時，請遵守以下回覆格式：

1. **使用繁體中文** 回覆，讓作者可以直接貼回 Notion 作為紀錄。
2. 使用精簡條列式，避免長篇大論。建議格式：

```markdown
### 總結
- （一句話描述這個 PR 的狀況，例如：整體 OK，但有 2 個需要調整的小地方）

### 優點
- ...

### 需要調整的部分
1. [檔名:行號] 問題說明 + 建議解法
2. ...

### 建議測試
- 建議在手機 9:16 模式下檢查 Home.html Hero 區塊排版
```

3. 當變更有可能破壞 **Glow Buttons / Breathing Sphere / 9:16 排版** 時，請明確標註「🚨 高風險區」並優先說明。

---

## 11. 總結

Afterglow v2.x 的程式碼審查核心不是「炫技」，而是：

* 保護既有 UI 設計與 Glow OS 一致性
* 減少跨平台（Manus / ChatGPT / 人工修改）帶來的破版風險
* 讓未來可以持續疊代，而不會每次改版都從頭崩潰重來

請 Reviewer（包含 Codex）在提出建議時，以 **「維持穩定＋清晰結構」為優先**，再來才是風格優化或細節微調。

```

---
