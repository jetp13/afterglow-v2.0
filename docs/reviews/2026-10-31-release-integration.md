# PR #9 發布整合驗證｜2026-10-31

狀態：PARTIAL；尚未達發布 GREEN，禁止以本文件推定已合併或已上線。

## Owner 決定與版本

- Owner 已核准目前視覺，授權 debug to green 後合併上線。
- Owner 明確選擇保留正式站完整 Rights。本次以 origin/main 的 5ed3c49 版本逐位元組保留 rights.html；並未重新核證其法律內容。
- 整合基線：PR head 79c3220 與 origin/main 5ed3c49；核准的本機視覺來源為 public-safety-refinement 工作區。原工作區保持不動。
- 保留原首頁 Logo／副標、四顆霓虹膠囊與已核准的提醒留白，不新增設計。沒有修改依賴、建置設定或部署設定。
- 發現並恢復後續 PR 已補的呼吸判斷、胸外按壓／AED 提醒、119 照著念、復原姿勢限制與八項回歸檢查，防止舊本機版本覆蓋較新的急救修正。
- Rights 保持原有 inline consent guard；其舊式 guard 不具本次其他詳細工具的完整 fallback／回跳保護，不能聲稱整站已統一。入口已有確認時可抵達 Rights。

## 本輪臺灣法律技能核對

使用 afterglow-law-powers:legal-research，已讀 SKILL.md 與共用 agents-rules.md。本輪為條文／官方框架檢索，沒有引用判決或宣稱司法實務已核證。

- taiwan-legal-db 即時取得《兒童及少年福利與權益保障法》第43、44、46條，pcode D0050001；回傳最新修正2021-01-20，並核對沿革。
- 即時取得《毒品危害防制條例》第7、9條，pcode C0000008；回傳最新修正2022-05-04。本輪不引用刑度或其他數值結論。
- iWIN 業者自律專區的有害兒少物品框架，區分教導／引誘、強調使用過程及未強調細節等情形，並區分阻攔與嚴格年齡防護。這不是對本網站的個別認定。

| 檢查項目 | 狀態 | 範圍與限制 |
|---|---|---|
| 條文要求平台採取明確可行防護措施 | Verified | 僅表示第46條原文已核對，不推定本網站措施充分。 |
| 公開頁與詳細風險工具在產品上分層 | Verified | 原始碼與測試確認公開安全／冥想可讀，詳細風險工具保留 Gate；本輪實際瀏覽器驗證受阻。 |
| 18+ 勾選即保證全面合法 | Remove | 不作此聲明，也不能把自陳當身分驗證或伺服器存取控制。 |
| 此完整內容應適用何種防護層級，現有 Gate 是否充分 | Unknown | 法條及通用框架未對本網站作個別認定；本輪不能升為 Verified。這仍是原定發布條件的缺口。 |
| 保留正式 Rights 等同重新法律核證通過 | Remove | 保留是 Owner 的版本決定；不是法律判斷。 |

法源：
- https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0050001
- https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=C0000008
- https://i.win.org.tw/enterprise_discipline.php

## 驗證與停止點

- public-safety 512項、首頁聲明4項及公開冥想 routing 測試通過。數量與前一版不同，是因 Rights 改驗正式站原檔與其 inline guard，沒有以新 guard 的測試假稱舊頁通過。
- 膠囊互動、可見性與動態節制測試通過；五種風險結果語意色測試通過。
- TypeScript、Vite production build、esbuild 通過。
- 瀏覽器操作工具回報 Local browser use is disabled in Work settings；本輪未取得新手機畫面、未測整合後的實際 SW 更新／回跳與鍵盤操作，不沿用舊截圖冒充新驗證。
- 未進行本輪真人手機或輔具驗收。既有截圖是歷史證據，非目前發布整合版的截圖。
- 必須完成可用瀏覽器上的整合驗收，並解除既定內容分級／Gate 充分性缺口後，才可宣告整體 GREEN。Owner 的合併／上線授權已存在，不需重複索取。

**免責聲明**：本助理提供之所有分析、檢索與審查結果僅供參考，不構成中華民國法律意義下之正式法律意見。任何關鍵法律決策或訴訟行為，請務必諮詢中華民國執業律師。
