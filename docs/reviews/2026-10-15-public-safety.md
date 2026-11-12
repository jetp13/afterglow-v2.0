# PR #9 手機與法律邊界驗收｜2026-10-15

狀態：**VALIDATION_PENDING，尚非整體 GREEN。禁止合併或正式上線。**

Owner 授權：完成 Public Safety／18+ 分層、手機真實截圖、霓虹與字型一致性、剩餘法律核證及必要文案修正；截圖上傳指定 Drive。保留原始 Evidence、14 組 Etomidate interactions，不重建 ChemAid。

## 可以直接看的成果

[全部手機畫面](https://drive.google.com/drive/folders/1TRBxUpy4q9p2NXef4jVwruJq3FMgzx6v)。17 張圖片均已上傳並回讀確認 parent folder。圖片為本機實際執行畫面，非設計示意、非 production 證據。09／10／16 補充圖的頁首渲染擷取不完整，Drive 檔名標示「局部擷取」，不算完整視覺 PASS。Drive 網頁 IAB 需重新登入、Chrome 被其他外掛 UI 阻擋；已透過 Drive 連接器讀回圖片實際檢視，未改分享權限。截圖清單與 Drive IDs 見 `pr9-screenshots.json`。

## 視覺與手機驗證

- 真實 CSS viewport 390 × 844；IAB 原有 80% 縮放，以外框 312 × 675 校正後讀取 innerWidth／innerHeight 確認。不是 iPhone 實機或 Safari 測試。
- Landing → Safety → Etomidate／First Aid／Help 已實際導航。119 與不駕駛提醒可在 Etomidate 首屏看到；未實際撥電話。
- Owner 當下允許本機確認年齡／聲明後，實際勾選並進入，正確回到 ChemAid。沒有在 production 接受聲明。
- First Aid accordion Enter 展開、aria-expanded=true；ChemAid 用 Enter／Space 選酒精與 GHB，得到致命危險。原 div 選項已改為原生 button，提供 aria-pressed、焦點與最小 44px 高度。
- 同一字型 stack：-apple-system、BlinkMacSystemFont、Segoe UI、Noto Sans TC、sans-serif。字型實際字形仍取決於裝置；未宣稱 iOS 與 Windows 字形完全相同。
- 真黑底、手寫 Logo、細霓虹燈管、低強度 glow；公開頁返回入口與頁首留白統一。正文不加 glow。安全主標較大，說明頁保留較小的閱讀階層。
- 找到並修正公開頁暗小字、說明頁低對比紫色、Logo／返回排法差異。Safety／First Aid／Help／政策頁檢查無橫向溢出。
- prefers-reduced-motion 實測安全 CTA animation=none、transition=0s，已恢復原偏好。
- 真人 5 秒辨識／30 秒任務、螢幕閱讀器、iOS Safari、所有成人工具的全面 A11y 尚未完成。不能以 AI 操作速度當真人測試。

## 法律及內容 claim 核證

Verified 僅表示該項敘述與檢得法源一致，不等於律師簽核或保證產品合法。

| Claim | 狀態 | 結果與依據 |
|---|---|---|
| 公開區只提供當下安全與求助，不放詳細混用教學 | Verified | 本輪入口與公開頁逐頁檢查；詳細段落在 Gate 後。這是已觀察產品行為。 |
| 勾選 18+ 即保證符合所有兒少保護義務 | Unknown | 兒少法 43、44、46 與 iWIN 分級框架未提供通用 checkbox safe harbor。自陳 Gate 不是身分驗證或伺服器權限控管。 |
| 本站內容整體應分哪一防護層級，現有 Gate 是否充分 | Unknown | iWIN 區分警示、阻攔、嚴格年齡限制，須按整體內容與正面價值比例判斷。此缺口不能用 disclaimer 消除；尚不可稱法律邊界 GREEN。 |
| 醫療保密只有重大刑案例外 | Remove | 改為醫療法第 72 條禁止無故洩漏；是否提供資料須依具體法源與程序判斷，不保證永不通報。 |
| 撥 119 自動取得自動求治或免責 | Remove | 毒品危害防制條例第 21 條有犯罪未發覺前、指定醫療機構等條件。新增條件界線，不保證個案結果。 |
| 快篩一律無法律效力，刑訴 131 是強制採尿依據 | Remove | 刑訴 131 是處所搜索；採尿另涉刑訴 205-2、毒危 25 與採驗尿液實施辦法。交通唾液檢測另有處理細則 19-4，不能混為一談。 |
| 3 小時是所有偵查共同上限 | Remove | 警察職權行使法第 7 條是特定身分查證帶往勤務處所的界線。 |
| 搜索票必須記載每個執行警員 | Remove | 刑訴 128 列四項事項及法官簽名；另查 130、131、131-1 法定例外。 |
| 全面手機解鎖／拒絕搜索保證 | Unknown | 未取得足以支持通用結論的實務。Rights 完整內容已退出產品頁，保留於非 public 的內部審查檔；對外只顯示 UNKNOWN 待核證入口。 |
| 最新公布毒駕數額即是已施行標準 | Unknown | 道交條例資料標示部分修正施行日另定；本輪不在公開頁新增未確認生效的罰鍰、刑度或規避執法資訊。 |
| ChemAid 劑量／少量測試操作建議 | Remove | 移除減量、控制劑量、少量測試與用鎮靜劑改善體驗等建議。各 pair 的風險等級、全部配對及 14 組 Etomidate 文字不變。 |
| 無組合資料時仍顯示低風險 | Revise | 已修復：無資料顯示無法評估；部分缺資料保留已知最高風險並明示資料不完整。已有情境測試。 |
| 創作者一概無責、責任完全由使用者承擔 | Remove | Landing／Legal／Terms 改為依適用法令與個案事實判斷，不聲稱靠網站聲明免除責任。 |
| Privacy 完全零傳輸／零資料 | Remove | 已區分不要求身分、sessionStorage、公開快取與主機／第三方必要技術資料。未取得託管後台保留政策，沒有補猜。 |
| Help 聯絡資訊 | Revise | 露德電話按官方更正為 02-2371-1406；同志熱線／皓日時段按官方更新；無可靠最新時段者改看官方公告，未實際致電確認。 |

法源：台灣法律 MCP 取得原文與沿革。刑事訴訟法 C0010001 第95、128、130、131、131-1、205-2條；醫療法 L0020021 第72條；毒品危害防制條例 C0000008 第7、9、21、25條；兒童及少年福利與權益保障法 D0050001 第43、44、46條；警察職權行使法 D0080145 第4、6、7、29條；採驗尿液實施辦法 I0030029 第1–6條；違反道路交通管理事件統一裁罰基準及處理細則 D0080029 第1、19-4條。來源均為全國法規資料庫。法規版本與施行資訊有差異者保留 Unknown。

外部原始來源：
- https://i.win.org.tw/enterprise_discipline.php （阻攔性防護與嚴格年齡防護不同；正面價值須符合比例）
- https://www.lourdes.org.tw/List.aspx?mid=22 （露德電話）
- https://hotline.org.tw/services/115 （同志熱線電話與服務時間）
- https://hotline.org.tw/space/3102 （皓日電話與服務時間）
- https://www.taiwanlovehope.org/List.aspx?mid=74 （愛之希望電話）
- https://kmsh.kcg.gov.tw/News_Content.aspx?n=1B9F85765AB97E07&s=65DA8BEFBCCBE0D8&sms=7FF4435907648B9F （HERO 官方資訊）

## 工程驗證與剩餘 gate

- Vite production build、TypeScript noEmit、esbuild：PASS；未改套件、部署設定或 package manager。
- public-safety.test.mjs：540 項 PASS；涵蓋 hostile return targets、失敗保護、全部 pair 等級、14 Etomidate 文字與三個醫療 accordion 原文、unknown/partial/deadly 結果。
- 本機 SW 實際 activated；cache keys 只有公開頁與資產，無成人詳細頁。網路離線時安全頁可讀，已恢復網路。實際更新 v5 → v6 後只剩 v6，舊 cache 已移除。
- 不表示已在 production、所有瀏覽器或所有舊版 cache 情境驗收。
- 尚缺：年齡防護充分性之具體內容分級結論、真人時限任務與必要實機／輔具驗證。Rights 獨立 UNKNOWN，不作正式內容發布。

唯一下一步：完成現有 Public Safety／ChemAid 內容的防護層級與 Gate 充分性結論，再補真人 5／30 秒及必要實機驗收；之前維持 Draft，不合併、不上線。

本法律檢索與內容風險盤點僅供資訊參考，不構成正式法律意見；具體個案及上線法律判斷應由中華民國執業律師依完整事實確認。
