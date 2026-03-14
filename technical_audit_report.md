# Afterglow Technical Audit Report

**Date:** 2026-03-15
**Scope:** Full site audit (home, menu, tools, support flows)
**Objective:** Identify broken links, CSS issues, layout problems, and JS errors. **NO FIXES APPLIED.**

## Summary of Critical Issues
- **HTML Structure:** Multiple pages (`menu.html`, `breathing.html`, `support-main.html`, `rights.html`, `help.html`) have broken HTML nesting (premature `</div>` closures), causing footers or content to render outside their containers.
- **Back Buttons:** All subpages use empty `<a>` tags for back buttons, relying on CSS `::before` content which may be missing or inconsistent.
- **Inline Styles:** Extensive use of inline `<style>` blocks in `head` across all subpages, making maintenance difficult and inconsistent with the "Single Source of Truth" principle.
- **Missing Assets:** `white-noise.html` has an empty audio source.
- **JS Dependencies:** `first-aid.html` relies on a global `toggleAccordion` function that needs verification.

## Detailed Issue Checklist

| Page | Issue Description | Type | Severity | Proposed Fix |
| :--- | :--- | :--- | :--- | :--- |
| **home.html** | Back button (line 34) uses `<button>` with inline onclick and empty content. | link/layout | Medium | Replace with `<a>` tag and explicit icon. |
| **home.html** | Logo path `/assets/logo-new.png` needs verification. | link | High | Verify file existence. |
| **home.html** | Footer structure differs from other pages. | layout | Low | Standardize footer HTML. |
| **menu.html** | **CRITICAL:** `</div>` closed prematurely (line 207), breaking layout. | layout | High | Fix HTML nesting. |
| **menu.html** | Back button is empty. | link/layout | Medium | Add icon content. |
| **breathing.html** | **CRITICAL:** `</div>` closed prematurely (line 105). | layout | Low | Fix HTML nesting. |
| **breathing.html** | Inline script for animation logic. | js | Low | Move to external JS. |
| **voice.html** | Inline styles in `<head>`. | css | Low | Move to `layout.css`. |
| **white-noise.html** | **CRITICAL:** Audio source `src=""` is empty. | link/js | High | Add valid audio file. |
| **white-noise.html** | Extensive inline styles. | css | Low | Move to `layout.css`. |
| **support-main.html** | **CRITICAL:** `</div>` closed prematurely (line 132). | layout | High | Fix HTML nesting. |
| **support-main.html** | Back button is empty. | link/layout | Medium | Add icon content. |
| **first-aid.html** | **CRITICAL:** Depends on `toggleAccordion` (line 349) which may be undefined. | js | High | Ensure function exists. |
| **first-aid.html** | Extensive inline styles. | css | Low | Move to `layout.css`. |
| **risk-calculator.html** | Extensive inline styles. | css | Low | Move to `layout.css`. |
| **rights.html** | **CRITICAL:** `</div>` closed prematurely (line 313). | layout | High | Fix HTML nesting. |
| **rights.html** | Extensive inline styles. | css | Low | Move to `layout.css`. |
| **help.html** | **CRITICAL:** `</div>` closed prematurely (line 134). | layout | High | Fix HTML nesting. |
| **help.html** | Extensive inline styles. | css | Low | Move to `layout.css`. |

## Next Steps
1.  **Fix HTML Structure:** Prioritize fixing the broken nesting in `menu.html`, `support-main.html`, `rights.html`, and `help.html`.
2.  **Standardize Back Buttons:** Replace all empty back buttons with a consistent `<a>` tag structure containing the icon.
3.  **Consolidate CSS:** Move all inline styles from subpages to `layout.css` to ensure consistency and maintainability.
4.  **Fix Critical Functionality:** Address the missing audio in `white-noise.html` and the JS dependency in `first-aid.html`.
