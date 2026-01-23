# Afterglow PWA - Harm Reduction Tool

一個獨立的漸進式網頁應用（PWA），整合減害資源中心（Resources Hub）與 G-Timer 計時工具，支援離線使用與安裝到主畫面。

## 功能特性

### 📚 Resources Hub（資源中心）
- **GBL 參考資訊**：劑量範圍、吸收特性、風險提示
- **過量徵兆與應對**：識別徵兆、應急步驟、求助資源
- **減害資源連結**：台灣與國際減害組織、求助熱線

### ⏱️ G-Timer（計時工具）
- **呼吸球視覺化**：動態呼吸球，實時顯示時間
  - **文字固定設計**：中央時間顯示不隨球體放大縮小，避免視覺暈眩
- **智能狀態判斷**：
  - **0–2 小時**（高峰期）：紅色警示，禁止補劑
  - **2–3.5 小時**（代謝期）：金色警告，強烈建議再等
  - **3.5 小時+**（相對安全）：白色邊框，可重新評估
- **本地儲存**：所有時間記錄保存在 localStorage，支援離線查詢

## 技術架構

### 檔案結構
```
afterglow-pwa/
├── index.html          # 單一入口頁（合併 Hub + Timer）
├── manifest.json       # PWA 配置清單
├── sw.js              # Service Worker（離線快取）
├── icons/
│   ├── icon-192.png   # 應用圖示 (192×192)
│   └── icon-512.png   # 應用圖示 (512×512)
└── README.md          # 本文件
```

### 核心技術
- **HTML5 + CSS3 + Vanilla JavaScript**：無框架依賴，極簡代碼
- **Service Worker**：支援離線使用，快取必要資源
- **Web App Manifest**：支援安裝到主畫面（Android Chrome、iOS Safari）
- **LocalStorage API**：本地資料持久化，無雲端上傳

## 部署指南

### 本地測試
```bash
cd afterglow-pwa
python3 -m http.server 8080
# 訪問 http://localhost:8080
```

### HTTPS 部署（必要）
PWA 功能（Service Worker、manifest）**必須在 HTTPS 下運作**。部署選項：
- **Vercel**：`vercel deploy`
- **GitHub Pages**：推送到 `gh-pages` 分支
- **自有伺服器**：配置 SSL 證書

### 部署檢查清單
1. ✅ 確保 HTTPS 啟用
2. ✅ manifest.json 正確指向圖示路徑
3. ✅ Service Worker 正確註冊（檢查 DevTools > Application > Service Workers）
4. ✅ 圖示正確加載（檢查 DevTools > Application > Manifest）
5. ✅ 在 Android Chrome 中測試「安裝應用」功能

## 使用指南

### 資源中心
1. 點擊「資源中心」標籤
2. 展開各個折疊區塊查看詳細資訊
3. 點擊外部連結訪問國際減害組織

### G-Timer
1. 點擊「G-Timer」標籤
2. 點擊「記錄劑量 (LOG)」開始計時
3. 觀察呼吸球顏色變化與狀態提示
4. 根據時間區間判斷是否安全補劑
5. 點擊「重置 / 清除資料」重新開始

## 設計原則

### 呼吸球動畫
- **球體放大縮小**：0.95–1.05 倍，6 秒循環
- **文字層獨立**：使用絕對定位，不受 scale 動畫影響
- **色彩系統**：
  - 粉紅色（#FF2D95）：安全、標準狀態
  - 紅色（#FF0044）：高峰期，禁止補劑
  - 金色（#FFD700）：警戒期，建議再等

### 色彩與排版
- **背景**：純黑（#000000），減少眼睛疲勞
- **文字**：淺灰（#F3F4F5），高對比度
- **字體**：系統字體堆棧，支援繁體中文

## 隱私與安全

- ✅ **完全本地**：所有資料存儲在裝置上，無雲端上傳
- ✅ **無追蹤**：不使用第三方分析或廣告追蹤
- ✅ **開源透明**：代碼完全可見，無隱藏邏輯
- ⚠️ **教育用途**：此工具僅供減害教育參考，不是醫療建議

## 法律聲明

Afterglow 是獨立的減害教育工具，由社群維護。使用者對自身行為負責。此工具不替代專業醫療建議。

## 未來整合

此 PWA 目前獨立運作，未來可整合進 Afterglow 主系統，作為「工具」板塊的核心模組。

---

**版本**：v1.0  
**最後更新**：2026 年 1 月 23 日  
**維護者**：Afterglow Community
