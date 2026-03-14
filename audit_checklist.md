# Afterglow Technical Audit Checklist

| Page | Issue Description | Type (link/css/layout/js) | Severity (High/Medium/Low) | Proposed Fix |
| :--- | :--- | :--- | :--- | :--- |
| | | | | |
| home.html | Back button (line 34) has empty content and uses inline onclick. Should use `<a>` tag with `href` and proper icon class for consistency. | link/layout | Medium | Replace `<button>` with `<a href="/" class="ag-back-button neon-style"><span class="ag-neon-icon-back"></span></a>` |
| home.html | Logo image path `/assets/logo-new.png` (line 42) needs verification. | link | High | Verify file existence. If missing, use correct path. |
| home.html | Footer structure (lines 66-81) differs from other pages (e.g., `ag-footer__links` inside `ag-footer__inner` vs direct children). | layout | Low | Standardize footer structure across all pages. |
| home.html | `ag-capsule` classes (lines 55, 60) need to be verified in `layout.css` to ensure they match the "Dark Entrance" design (vertical, no tilt). | css | High | Verify `.ag-capsule` styles in `layout.css`. |
| menu.html | Back button (line 167) is empty and relies on CSS `::before` which might be missing or incorrect. Should use explicit icon span. | link/layout | Medium | Replace with `<a href="/home.html" class="ag-back-button neon-style"><span class="ag-neon-icon-back"></span></a>` |
| menu.html | HTML structure error: `</div>` closed prematurely at line 207, leaving footer outside container but inside body. Also stray text `/* Footer: Standard Sticky Footer */` at line 210. | layout | High | Fix HTML nesting and remove comment text from body. |
| menu.html | `ag-menu-details` (line 195) structure is complex; ensure `details/summary` works correctly on mobile. | js/layout | Low | Verify interactive behavior on mobile. |
| menu.html | Inline styles (line 211) for footer padding should be moved to CSS. | css | Low | Move styles to `layout.css`. |
| breathing.html | HTML structure error: `</div>` closed prematurely at line 105, leaving comment `<!-- End of ag-container -->` dangling. | layout | Low | Fix HTML nesting. |
| breathing.html | Inline script (lines 80-103) should ideally be in a separate JS file or at least properly indented. | js | Low | Refactor to external JS or clean up. |
| breathing.html | Back button (line 68) uses `neon-style` class which needs verification in `layout.css`. | css | Medium | Verify `.neon-style` in `layout.css`. |
| voice.html | Footer structure (lines 45-61) uses `ag-footer__links` inside `ag-footer__inner`, consistent with `home.html` but check `layout.css` for correct nesting. | layout | Low | Verify footer CSS. |
| voice.html | `ag-wave` (line 24) uses inline styles in `<head>`. Should be moved to `layout.css` or a component CSS. | css | Low | Move styles to `layout.css`. |
| white-noise.html | Audio source `src=""` (line 198) is empty. Needs a valid audio file path. | link/js | High | Provide valid audio source or placeholder. |
| white-noise.html | Inline styles (lines 18-168) should be moved to `layout.css` or component CSS. | css | Low | Move styles to `layout.css`. |
| support-main.html | Back button (line 98) is empty and relies on CSS `::before`. Should use explicit icon span. | link/layout | Medium | Replace with `<a href="/home.html" class="ag-back-button neon-style"><span class="ag-neon-icon-back"></span></a>` |
| support-main.html | HTML structure error: `</div>` closed prematurely at line 132, leaving footer outside container. | layout | High | Fix HTML nesting. |
| support-main.html | Inline styles (line 126) for Help button should be moved to CSS class `.ag-menu-button--help`. | css | Low | Move styles to `layout.css`. |
| support-main.html | `ag-menu-button` styles (lines 37-84) are defined in `<style>` block. Should be moved to `layout.css` for maintainability. | css | Low | Move styles to `layout.css`. |
| first-aid.html | Inline `onclick="toggleAccordion(this)"` (line 349) requires a global JS function. Verify if `toggleAccordion` is defined. | js | High | Ensure `toggleAccordion` is defined in a script tag or external file. |
| first-aid.html | Inline styles (lines 15-286) should be moved to `layout.css` or component CSS. | css | Low | Move styles to `layout.css`. |
| first-aid.html | Duplicate comment for Back Button (lines 290-291). | layout | Low | Remove redundant comment. |
| risk-calculator.html | Inline styles (lines 15-335) should be moved to `layout.css` or component CSS. | css | Low | Move styles to `layout.css`. |
| risk-calculator.html | Duplicate comment for Back Button (lines 339-340). | layout | Low | Remove redundant comment. |
| rights.html | Inline styles (lines 15-303) should be moved to `layout.css` or component CSS. | css | Low | Move styles to `layout.css`. |
| rights.html | HTML structure error: `</div>` closed prematurely at line 313 (inferred from indentation), leaving content outside container. | layout | High | Fix HTML nesting. |
| help.html | Inline styles (lines 9-83) should be moved to `layout.css` or component CSS. | css | Low | Move styles to `layout.css`. |
| help.html | Duplicate comment for Back Button (lines 87-88). | layout | Low | Remove redundant comment. |
| help.html | HTML structure error: `</div>` closed prematurely at line 134, leaving footer outside container. | layout | High | Fix HTML nesting. |
