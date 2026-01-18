# Afterglow v2.1.2 更新任務

## Prompt A - Home.html 與 Footer 更新

- [x] 更新首頁上方 Logo（使用 /assets/afterglow-logo.png，套用 .ag-logo CSS）
- [x] 更新首頁標語為「讓夜裡的光有方向」
- [x] 保持英文三行標語：STAY SAFE · CARE FOR YOURSELF · SEEK HELP
- [x] 保持首頁 Glow 雙膠囊按鈕（開始冥想 → /menu.html、緊急支援 → /support.html）
- [x] 新增 Footer 模組（包含隱私權政策、法律免責、使用條款、關於 Afterglow 連結）
- [x] 在 Footer 加入版權聲明：© 2025 Afterglow. All rights reserved.

## Prompt B - 轉換為純靜態 HTML 結構

- [x] 建立 index.html（首頁）
- [x] 建立 about.html（關於頁面）
- [x] 建立 privacy.html（隱私權政策）
- [x] 建立 legal.html（法律免責）
- [x] 建立 terms.html（使用條款）
- [x] 建立 /assets/layout.css（全域樣式）
- [x] 確保所有頁面都能正確顯示

## Logo 更新

- [x] 替換 afterglow-logo.png 為使用者提供的新 Logo

## Afterglow v2.1.2 完整更新

- [x] 更新 Home.tsx（保持 Logo 外溢設計）
- [x] 更新 Footer.tsx（加入「即將上線」訊息）
- [x] 更新 about.html（新版內容）
- [x] 更新 privacy.html（新版內容）
- [x] 更新 terms.html（新版內容）
- [x] 更新 legal.html（新版內容）
- [x] 更新 layout.css（補齊所有樣式：Logo、Glow 按鈕、Footer、Legal 頁面）
- [x] 測試所有頁面顯示

## 一次性版面修正（v2.1.2 Refinement）

### A. Logo 區調整
- [x] Logo 使用 1200×500 寬版，螢幕寬度 75%，置於上方偏左
- [ ] 允許 Logo 向左右外擴，不限制在 9:16 安全區
- [ ] 保留透明邊界，不裁切

### B. 副標題區調整
- [x] 中文副標「讓夜裡的光有方向」放在 Logo 右下方（18-20px）
- [x] 英文副標「STAY SAFE · CARE FOR YOURSELF · SEEK HELP」置於中文下方（14px）
- [x] 調整三者間距，整體排版偏上區域

### C. Glow 膠囊按鈕完整效果
- [x] 膠囊外框 Glow（藍色／桃紅）
- [x] 外層柔光暈（blur glow）
- [x] 內部深色透明度 10-20% 的黑
- [x] 字級 18-20px，置中、字距偏大
- [x] hover/active 狀態更強的內外 Glow

### D. Footer Component 重建
- [x] 上排四個連結（12-13px）
- [x] 中間段落「即將上線」（13-14px）
- [x] 最下行版權聲明（10-11px）
- [x] 三層文字置中，行距 10-14px
- [x] 字體重量 light，字距拉大

### E. 法律／關於頁面調整
- [x] 四個頁面頂部加入《返回首頁》按鈕（置左、14px、無 glow）
- [x] 避免段落換行後只剩一個字
- [x] 標題 24-28px，副標 16px，內文 14-15px
- [x] 行距 1.6-1.8，段落間距 16-20px
- [x] 套用一致的 Footer Component

## 緊急支援連結更新與樣式優化

- [x] 更新首頁「緊急支援」按鈕連結為 `https://afterglow-es-zzmw9knr.manus.space`
- [x] 分析目標頁面樣式，確保首頁膠囊按鈕與其呼應
- [x] 若有需要，微調首頁膠囊按鈕樣式以達成視覺一致性
