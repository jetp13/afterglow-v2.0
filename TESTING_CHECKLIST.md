# Afterglow v2.0 導覽列系統測試檢查清單

## 測試環境準備

### 必要測試裝置
- [ ] iPhone（iOS Safari）- 建議 iOS 15 以上
- [ ] Android 手機（Chrome）- 建議 Android 10 以上
- [ ] 桌機瀏覽器（Chrome/Edge/Safari）

### 測試前準備
- [ ] 清除瀏覽器快取
- [ ] 執行硬重整（Ctrl+Shift+R 或 Cmd+Shift+R）
- [ ] 開啟開發者工具（Console + Network）

---

## 一、桌機環境測試（≥ 768px）

### 1.1 導覽列高度驗證
- [ ] 開啟開發者工具 > Elements
- [ ] 檢查 `:root` 中 `--nav-height` 的計算值是否為 `72px`
- [ ] 檢查 `html` 的 `scroll-padding-top` 是否為 `72px`

### 1.2 首頁 Hero 區塊
- [ ] 首頁標題「Breathe」與頁面頂部之間有適當留白
- [ ] 標題不會被任何固定元素遮擋
- [ ] Hero 區塊的 `padding-top` 應為 `24px`（額外留白）

### 1.3 內頁標題顯示
- [ ] 開啟 `meditation/menu.html`
- [ ] 頁面標題不會被遮擋
- [ ] 標題與頁面頂部距離一致

### 1.4 錨點跳轉行為
- [ ] 建立測試錨點：`<a href="#section1">跳轉</a>`
- [ ] 點擊錨點後，目標內容不會被遮擋
- [ ] 捲動行為流暢（smooth scroll）

### 1.5 Console 檢查
- [ ] Console 無紅字錯誤
- [ ] 無 404 錯誤（特別是 CSS/JS 檔案）
- [ ] 無 manifest 或 service-worker 錯誤

### 1.6 Network 檢查
- [ ] `index.html` - HTTP 200
- [ ] `assets/layout.css` - HTTP 200
- [ ] 所有關鍵資源載入成功

---

## 二、行動裝置測試（< 768px）

### 2.1 導覽列高度驗證
- [ ] 使用 Chrome DevTools 模擬器（iPhone 12 Pro）
- [ ] 檢查 `:root` 中 `--nav-height` 的計算值是否為 `56px`
- [ ] 檢查 `html` 的 `scroll-padding-top` 是否為 `56px`

### 2.2 首頁 Hero 區塊
- [ ] 首頁標題「Breathe」與頁面頂部之間有適當留白
- [ ] 標題不會被任何固定元素遮擋
- [ ] 在直式與橫式模式下都顯示正常

### 2.3 內頁標題顯示
- [ ] 開啟 `meditation/menu.html`
- [ ] 頁面標題不會被遮擋
- [ ] 標題與頁面頂部距離一致

### 2.4 觸控操作
- [ ] 點擊按鈕反應靈敏
- [ ] 捲動流暢無卡頓
- [ ] 無意外的橫向捲動

---

## 三、iOS Safari 實機測試（重點）

### 3.1 Viewport 行為
- [ ] 首次載入時頁面顯示正常
- [ ] 向下捲動時，Safari 工具列收合，頁面不會跳動
- [ ] 向上捲動時，Safari 工具列展開，頁面不會跳動

### 3.2 scroll-padding-top 表現
- [ ] 錨點跳轉時，內容不會被 Safari 工具列遮擋
- [ ] 錨點跳轉時，內容不會被固定導覽列遮擋
- [ ] `scroll-padding-top` 在 iOS Safari 上正確運作

### 3.3 首頁 Hero 與內頁一致性
- [ ] 首頁 Hero 標題與導覽列之間距離舒適
- [ ] 內頁標題與導覽列之間距離一致
- [ ] 不同頁面之間的視覺起始位置統一

### 3.4 捲動流暢度
- [ ] 慣性捲動（momentum scrolling）正常
- [ ] 無卡頓或延遲
- [ ] 捲動到頂部/底部時的彈性效果正常

### 3.5 觸控手勢
- [ ] 單指捲動正常
- [ ] 雙指縮放正常（若允許）
- [ ] 邊緣滑動返回手勢不衝突

---

## 四、Android Chrome 實機測試

### 4.1 Viewport 行為
- [ ] 首次載入時頁面顯示正常
- [ ] 向下捲動時，Chrome 工具列收合，頁面不會跳動
- [ ] 向上捲動時，Chrome 工具列展開，頁面不會跳動

### 4.2 scroll-padding-top 表現
- [ ] 錨點跳轉時，內容不會被 Chrome 工具列遮擋
- [ ] 錨點跳轉時，內容不會被固定導覽列遮擋

### 4.3 捲動流暢度
- [ ] 捲動流暢無卡頓
- [ ] 慣性捲動正常

---

## 五、跨瀏覽器相容性測試

### 5.1 桌機瀏覽器
- [ ] Chrome（Windows/Mac）
- [ ] Edge（Windows）
- [ ] Safari（Mac）
- [ ] Firefox（Windows/Mac）

### 5.2 行動瀏覽器
- [ ] iOS Safari
- [ ] iOS Chrome
- [ ] Android Chrome
- [ ] Android Firefox

---

## 六、效能測試

### 6.1 Chrome DevTools Performance
- [ ] 開啟 Performance 面板
- [ ] 記錄捲動操作
- [ ] 檢查 FPS 是否穩定在 60fps
- [ ] 檢查是否有 Layout Shift（CLS）

### 6.2 Lighthouse 測試
- [ ] 執行 Lighthouse 測試
- [ ] Performance 分數 ≥ 90
- [ ] Accessibility 分數 ≥ 90
- [ ] Best Practices 分數 ≥ 90

### 6.3 低階裝置測試
- [ ] 使用 Chrome DevTools CPU Throttling（4x slowdown）
- [ ] 檢查 `backdrop-filter: blur(10px)` 是否造成效能問題
- [ ] 考慮為低階裝置提供降級方案

---

## 七、無障礙功能測試

### 7.1 鍵盤導覽
- [ ] Tab 鍵可正確切換焦點
- [ ] Enter/Space 可觸發按鈕
- [ ] Esc 可關閉彈窗（若有）

### 7.2 螢幕閱讀器
- [ ] 使用 VoiceOver（Mac/iOS）測試
- [ ] 使用 TalkBack（Android）測試
- [ ] 確保所有互動元素都有適當的 ARIA 標籤

### 7.3 高對比度模式
- [ ] Windows 高對比度模式下顯示正常
- [ ] macOS 增加對比度模式下顯示正常

---

## 八、邊界情況測試

### 8.1 極端內容長度
- [ ] 超長標題顯示正常（不溢出）
- [ ] 超短內容顯示正常（不留白過多）

### 8.2 極端螢幕尺寸
- [ ] 小螢幕（320px 寬）顯示正常
- [ ] 大螢幕（2560px 寬）顯示正常

### 8.3 網路狀況
- [ ] 慢速網路下載入正常
- [ ] 離線狀態下的錯誤處理

---

## 九、回歸測試

### 9.1 核心功能
- [ ] 呼吸球體動畫正常
- [ ] 按鈕互動正常
- [ ] 頁面跳轉正常

### 9.2 既有樣式
- [ ] Glow Button 顏色、大小、Glow 強度未改變
- [ ] Glow Circle 顏色、大小、Glow 強度未改變
- [ ] Footer 樣式未改變
- [ ] Logo 樣式未改變

---

## 十、文件與部署

### 10.1 文件更新
- [ ] `NAVIGATION_SYSTEM.md` 已更新
- [ ] `README.md` 已更新（若需要）
- [ ] 變更記錄已記錄

### 10.2 Git 提交
- [ ] 所有變更已提交
- [ ] Commit message 清楚描述變更內容
- [ ] 已推送到遠端倉庫

### 10.3 部署驗證
- [ ] 部署到測試環境
- [ ] 執行硬重整（清除快取）
- [ ] 重新執行所有測試項目

---

## 測試結果記錄

### 測試日期：____________________

### 測試人員：____________________

### 測試環境：
- 裝置：____________________
- 作業系統：____________________
- 瀏覽器：____________________

### 發現問題：
1. ____________________
2. ____________________
3. ____________________

### 解決方案：
1. ____________________
2. ____________________
3. ____________________

### 測試結論：
- [ ] 通過所有測試
- [ ] 部分測試失敗（需修正）
- [ ] 需要進一步測試

---

## 附錄：常見問題與解決方案

### Q1: iOS Safari 錨點跳轉時內容被遮擋
**解決方案：**
- 檢查 `scroll-padding-top` 是否正確設定
- 檢查 Safari 版本是否支援 `scroll-padding-top`（iOS 11+）
- 考慮使用 JavaScript 降級方案

### Q2: Android Chrome 捲動卡頓
**解決方案：**
- 檢查 `backdrop-filter` 是否造成效能問題
- 考慮移除或降低 blur 強度
- 使用 `will-change: transform` 優化

### Q3: 桌機與行動裝置高度不一致
**解決方案：**
- 檢查 media query 斷點是否正確（768px）
- 檢查 CSS 變數是否正確覆蓋
- 使用開發者工具檢查計算值

### Q4: 首頁 Hero 留白過多或過少
**解決方案：**
- 調整 `.hero-header` 的 `padding-top` 值
- 考慮不同裝置使用不同留白值
- 參考設計稿確認正確數值
