# Public Safety refinement review｜2026-10-15

Status: **Draft / VALIDATION_PENDING. Not approved for merge or production.**

## Scope and authority

Owner's 2026-10-15 instruction: one Public Safety area and one existing 18+ area. Preserve existing evidence and the 14 Etomidate interactions. Do not merge PR #9. Owner subsequently accepted the general visual direction and required consistent neon tubes, type, and text layout.

Implementation baseline: `41c24453ef3ce8700a5c28e6160d63fafb46917a`, branch `feat/etomidate-safety`.
UX reference: Notion UI/UX guide `7eea6ac1-019f-43ee-a44a-ccab1eaa3db2`; historical Design Guide `29fed301-4568-805a-9b68-dfb79952c122` is archived and was not used as current authority. Owner's narrower art direction takes precedence.

## Implemented boundary

- Landing has one Public Safety CTA, with a separate 18+ entry and expandable existing notice.
- Public: safety hub, Etomidate rapid safety, First Aid / 119, Help. Policy and About information remains public.
- Gated: ChemAid, detailed First Aid substance/legal sections, Rights, existing adult tools.
- Detailed First Aid sections were relocated verbatim, not re-researched or rewritten. Rights body and ChemAid calculation/interaction data are unchanged.
- Public return links lead to Safety / Landing; a finite allowlist preserves adult return destinations.
- External, malformed, unknown and self-referential return paths are rejected. Storage failure stays closed with a public safety recovery path.
- Client gate scripts and no-script suppression are UI safeguards only. The files are static and remain technically retrievable. This is **not identity verification, server authorization, or a legal sufficiency finding**.
- New service worker preloads public resources only, skips adult caching, updates only Afterglow caches and claims clients. Actual browser upgrade/offline lifecycle still needs testing.

## Design taste review

Design read: preserve Afterglow's existing identity for tired or stressed users; true black, sparse layout, restrained neon tube edges, minimal motion. `DESIGN_VARIANCE=3`, `MOTION_INTENSITY=2`, `VISUAL_DENSITY=3`. Native project CSS, no new design framework.

| Item | Observed difference | Bounded correction / limit |
|---|---|---|
| Font family | Same stack as `layout.css` and `home.html` | Retained `-apple-system`, BlinkMacSystemFont, Segoe UI, Noto Sans TC, sans-serif. No new web font request. Actual fallback font depends on installed device fonts; exact glyph identity across devices is unverified. |
| Headline | Initial safety heading 28-38px / weight 600, while About is 20-24px / weight 300 | Safety and Landing refined to 26-32px / weight 500; key emergency warning retains 600. Safety hierarchy is intentionally stronger than long-form About. |
| Body | Safety initially 16px / 1.75; About 14px / 1.8 | New Safety hub uses 15px / 1.8, same family and clearer hierarchy. Existing detailed page bodies remain unchanged. |
| Layout | Emergency stylesheet plus page padding narrowed the Etomidate column twice | Scoped scroll padding reset; safety content uses one 24px inset and max-width 560px. This must still be visually checked. |
| Neon tubes | Initial minimal version reduced important links to ordinary flat rules | Thin colored edge plus narrow inner/outer glow on main CTAs; red reserved for emergency action; white body text has no glow. No large gradients, glass panels or flashing. |
| Line breaks | Long Chinese titles could break awkwardly in the narrow column | Natural wrapping, balanced headings, moderate letter spacing. No forced line breaks in general copy. |
| Keyboard / motion | Existing clickable accordion divs lacked keyboard state | Enter/Space support, controls/expanded state, visible focus; closed contents hidden from keyboard. Reduced-motion override retained. Screen-reader and focus-order acceptance remains pending. |

Not a visual PASS: current capture attempts timed out or could not reach the local server. No old screenshots were substituted. Owner's aesthetic acceptance is recorded separately and is not a substitute for the required 390×844 screenshot audit.

## Content / legal risk scan

This is a bounded source review, not an assertion that the website complies with Taiwanese law. Claim statuses are only **Verified / Revise / Remove / Unknown**. A technical Verified result does not turn a legal claim Verified.

| Surface | Claim / issue | Status | Evidence / disposition |
|---|---|---|---|
| Landing / routing | ChemAid available before age confirmation | Revise | Direct source behavior corrected; 18+ gate restored. |
| Etomidate | No dosing, administration or fixed driving wait instruction | Verified | Source text review only; retained non-driving / emergency-routing language. Medical/legal sufficiency remains separate. |
| First Aid | Detailed named-substance and legal sections exposed in public | Revise | Moved intact to existing 18+ capability boundary; public emergency content retained. |
| First Aid details | Medical confidentiality described with a narrow criminal-case exception | Revise | Medical Care Act Art.72 prohibits disclosure without cause; retrieved text does not justify treating that one exception as exhaustive. Keep legal rewrite pending fuller exceptions review. |
| ChemAid | Missing-data fallback says `少量測試`; low-risk result says `協同效應` | Revise | Existing source could be read as suggesting experimentation. Not changed in this entry/routing patch; needs a separately verified narrow copy correction before content scan can be GREEN. Matrix/evidence must not be rebuilt. |
| Help | Source contains public phone and third-party LINE links | Unknown | No personal data submitted or calls placed. Current service availability, hours and destination safety not reverified. |
| Rights | Blanket mobile-unlock refusal | Unknown | No current judgment/authority proving a universal password/biometric rule retrieved. Not promoted into Public Safety. |
| Rights | General maximum of three hours | Revise | Police Power Exercise Act Art.7 concerns specified identity-verification circumstances, counted from stopping; not a general limit for every criminal process. |
| Rights | Search warrant five-item list includes executing officer as required entry | Revise | Code of Criminal Procedure Art.128 lists four entries plus judge signature; Arts.130-131 describe warrantless exceptions. Existing content not rewritten yet. |
| Rights | Criminal Procedure Art.131 as compulsory urine authority | Remove | Art.131 retrieved text concerns warrantless premises search. Sampling rules must instead be verified in their specific context; Arts.205-1 to 205-4 retrieved. |
| Rights | Everyone with prior drug history must submit urine | Revise | Drug Prevention and Control Act Art.25 identifies particular persons/periods and delegated procedure, not that blanket category. Implementing regulations still require review. |
| Rights | Drug-driving / saliva screening procedure | Unknown | Current procedure, implementing rules and effective dates not yet verified in this run. |
| Privacy | Absolute zero data / zero transmission claims | Revise | Replaced with bounded application behavior, sessionStorage, public cache and provider/third-party uncertainty. Hosting configuration/network verification remains pending. |
| Terms | Visiting public content is treated as adult consent | Revise | Corrected product description: public reading does not set age/consent state. Enforceability of clauses is not verified. |
| Legal | Complete exclusion of creator liability | Unknown | Disclaimer is not treated as a legal safe harbor. Existing substantive wording awaits legal review. |
| About | Compassionate narrative, no newly added detailed use instructions | Verified | Source content review only; no efficacy or legal compliance finding. |
| Architecture | A self-declared 18+ checkbox is sufficient protection | Unknown | Child/Youth Act Arts.43-46 retrieved. Art.46 requires clear, feasible protective measures; the text does not establish a checkbox safe harbor. Static-content retrieval limitation is material. |
| Architecture | Public Safety before Gate is automatically lawful | Unknown | No product-specific official determination or direct exemption retrieved. Information separation is an Owner design decision, not a verified legal conclusion. |
| Architecture | No inducement risk because there is a disclaimer | Remove | Do not make this inference. Drug Prevention and Control Act Art.7 concerns inducement; actual content and context require examination. |

Official provisions retrieved through `taiwan-legal-db` in this run:

- [Child and Youth Welfare and Rights Protection Act, Arts.43-46](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0050001)
- [Drug Prevention and Control Act, Arts.7,9,21,25](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=C0000008)
- [Police Power Exercise Act, Art.7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080145&flno=7)
- [Code of Criminal Procedure, Arts.128,130,131,205-1 to 205-4](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=C0010001)
- [Medical Care Act, Art.72](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0020021&flno=72)

Search for regulation names containing `網際網路` did not locate a child-content implementing rule. That limited search does not establish that no applicable rules or self-regulatory standards exist. No criminal sentence, penalty or deadline calculation is supplied here.

## Verification and current state

- Vite production build: PASS on the refined visual version.
- Typecheck (`tsc --noEmit`): PASS before the subsequent CSS-only refinement and guard-display change; no TypeScript source changed.
- Backend esbuild: PASS.
- `node scripts/public-safety.test.mjs`: **404 assertions PASS** after the closed-on-script-load-failure guard was added. Includes entry round-trips, malformed return targets, blocked-storage fallback, existing text/data invariants, public-only precache and internal file existence.
- `git diff --check`: PASS before final report addition; rerun before commit.
- Actual browser flow, desktop/mobile screenshots, contrast measurement, keyboard focus sequence, reduced-motion browser emulation, offline cache upgrade and external link reachability: **pending**.
- Real 5-second / 30-second stressed-user acceptance: **pending**. Automated or simulated timing must not substitute.
- Vercel Preview for this new revision: **pending**.
- Production: unchanged; no merge, promotion or production configuration mutation authorized.

## Required next unit

Obtain fresh 390×844 screenshots and inspect Landing → Safety → Etomidate / First Aid / Help → Gate → ChemAid. Finish the source-anchored legal checks and narrow high-risk copy repairs; keep Rights unknown claims isolated. Only after all required acceptance gates pass may this become a release candidate. Do not repeat the 14-pair evidence audit or overwrite the primary checkout's pre-existing changes.
