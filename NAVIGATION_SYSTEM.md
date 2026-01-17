# Afterglow v2.0 全站導覽列與捲動行為系統

## 已完成項目

### 1. 統一導覽列高度變數系統

在 `assets/layout.css` 與 `index.html` 中建立了統一的導覽列高度變數：

```css
:root {
    /* 行動裝置預設 */
    --nav-height: 56px;
}

/* 桌機環境 */
@media (min-width: 768px) {
    :root {
        --nav-height: 72px;
    }
}
```

**優點：**
- 單一變數來源，避免 `--navH` 與 `--nav-height` 不一致問題
- 響應式設計：行動裝置 56px、桌機 72px
- 所有相關計算統一使用 `var(--nav-height)`

### 2. 全站捲動行為設定

```css
html {
    /* 確保錨點定位時內容不被固定導覽列遮擋 */
    scroll-padding-top: var(--nav-height);
    scroll-behavior: smooth;
}

body {
    /* 確保所有頁面內容不被導覽列覆蓋 */
    padding-top: var(--nav-height);
}
```

**功能：**
- `scroll-padding-top`：頁面跳轉與錨點定位時，內容不會被固定導覽列遮擋
- `body padding-top`：所有頁面內容在初始顯示時不被導覽列覆蓋
- `scroll-behavior: smooth`：平滑捲動效果

### 3. 首頁 Hero 區塊額外留白

```css
/* 首頁 Hero 區塊額外留白 */
header.hero-header {
    padding-top: 24px;
}
```

**目的：**
- 使首頁主標題與導覽列之間具有清楚的視覺呼吸空間
- 區別首頁與內頁的視覺層次

### 4. 導覽列元件（預留）

在 `layout.css` 中預留了導覽列元件樣式：

```css
.ag-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    box-sizing: border-box;
}
```

## 測試狀態

### ✅ 桌機環境測試項目
- [ ] 首頁 Hero 標題與導覽列之間距離舒適
- [ ] 內頁標題（如「服務」「關於」）不會被導覽列遮擋
- [ ] 所有內頁標題的視覺起始位置已統一
- [ ] 錨點跳轉時內容不被遮擋

### ⚠️ 行動裝置測試項目（需實機測試）
- [ ] iOS Safari 導覽列點擊後的捲動行為
- [ ] iOS Safari viewport 行為與 scroll-padding-top 表現
- [ ] Android Chrome 捲動行為
- [ ] 首頁 Hero 與內頁標題在行動裝置上的顯示一致性
- [ ] 觸控操作的流暢度

## 建議後續優化方向

### 1. iOS Safari 實機測試（高優先）

**測試重點：**
- 導覽列點擊後的捲動行為與視覺距離
- viewport 行為與 scroll-padding-top 的實際表現
- 首頁 Hero 與內頁標題在行動裝置上的顯示一致性

**測試方法：**
1. 在 iPhone 實機上開啟 Safari
2. 測試首頁 Hero 區塊顯示
3. 測試內頁標題顯示
4. 測試錨點跳轉行為
5. 測試捲動流暢度

### 2. 跨瀏覽器相容性測試

**測試環境：**
- iOS Safari（iPhone）
- Android Chrome（Android 手機）
- 桌機 Chrome
- 桌機 Edge
- 桌機 Safari（Mac）

### 3. 效能優化

**建議項目：**
- 檢查 `backdrop-filter: blur(10px)` 在低階裝置上的效能
- 考慮為低階裝置提供降級方案
- 監控捲動效能（使用 Chrome DevTools Performance）

### 4. 無障礙功能

**建議項目：**
- 確保鍵盤導覽功能正常
- 檢查螢幕閱讀器相容性
- 測試高對比度模式

## 技術規格

### CSS 變數
| 變數名稱 | 行動裝置 | 桌機 | 用途 |
|---------|---------|------|------|
| `--nav-height` | 56px | 72px | 導覽列高度 |

### 響應式斷點
| 斷點 | 寬度 | 說明 |
|------|------|------|
| 行動裝置 | < 768px | 預設樣式 |
| 桌機 | ≥ 768px | 調整導覽列高度 |

### Z-index 層級
| 元件 | Z-index | 說明 |
|------|---------|------|
| `.ag-nav` | 1000 | 固定導覽列 |

## 檔案清單

### 已更新檔案
- `assets/layout.css` - 主要樣式檔案，包含全站導覽列系統
- `index.html` - 首頁，套用新的導覽列系統與 Hero 區塊留白

### 待更新檔案（若需要）
- `meditation/*.html` - 冥想相關頁面
- `support/*.html` - 支援相關頁面
- `legal.html` - 法律聲明頁面

## 版本歷史

### v2.0.1 (2026-01-17)
- ✅ 建立統一的導覽列高度變數系統
- ✅ 實作響應式導覽列（行動 56px、桌機 72px）
- ✅ 設定全站 scroll-padding-top 與 body padding-top
- ✅ 為首頁 Hero 區塊增加 24px 額外留白
- ✅ 預留導覽列元件樣式

## 注意事項

1. **不要改動核心元件**：Glow Button、Glow Circle、Footer、Logo 的顏色、大小、Glow 強度、位置必須保持固定
2. **僅調整排版屬性**：spacing、padding、margin、Flex positioning
3. **保持 CSS Class 名稱**：不得改動現有的 CSS class 名稱
4. **遵循設計稿**：所有調整必須符合 UI 設計稿

## 聯絡資訊

如有問題或建議，請參考 [GitHub Repository](https://github.com/jetp13/afterglow-v2.0)
