# afterglow-v2.2  
### Active Development Line

This repository is the **single active development line** for Afterglow.

All other Afterglow-related repositories are archived and treated as
**legacy prototypes or reference material only**.  
No active development should continue outside this repository.

---

## Purpose

Afterglow is a calm, human-centered support space.

This repository focuses on maintaining a **minimal, runnable, and trustworthy**
web experience that users can enter safely, navigate clearly, and leave at will.

The goal of v2.2 is **structural stability**, not feature completeness.

---

## Working Rules (Version Contract)

- Only **one small, verifiable change per version**
- After each change, always:
  1. Commit
  2. Tag the version
  3. Update `version-log.html`

No large refactors.  
No parallel directions.  
Stability over expansion.

---

## Information Architecture (Current IA)

**Primary flow**

Gate → Home → Feature Menus → Feature Pages

**Detailed structure**

/
├── index.html                     → Gate（同意／免責／進入）
├── Home.html                      → 首頁（Glow Capsules）
│
├── meditation/
│   ├── menu.html                  → 冥想選單（入口）
│   ├── breathing.html             → 呼吸球（4-2-6）
│   └── GuideMeditation.html       → 語音導引（音檔播放）
│
├── support/
│   ├── menu.html                  → Support 選單（入口）
│   ├── Rights.html                → 保障你的權利（法律）
│   ├── ChemAid.html               → 風險混合器（用藥組合風險計算）
│   └── FirstAid.html              → 緊急自救（身心穩定）
│
├── docs/                          → Evidence Base（後台資料）
│   ├── harm-reduction.html        → Harm Reduction（留白）
│   ├── rights-guide.html          → 權利指南（留白）
│   └── references.html            → 資料來源（需維護）
│
├── assets/
│   ├── css/layout.css
│   ├── js/gate.js
│   ├── images/
│   └── audio/
│
├── privacy.html
├── legal.html
├── terms.html
├── about.html
│
├── deploy.html
└── version-log.html