
## System-Level Consistency (Strict Rules)

- [x] **Rule A: Global Navigation**
    - [x] Ensure ALL internal pages (non-Home) have a fixed top-left back button.
    - [x] Icon: Neon Arrow (`←`).
    - [x] Position: Fixed, `top: calc(24px + env(safe-area-inset-top))`, `left: 16px`.
    - [x] Z-index: High enough to be always clickable.

- [x] **Rule B: Footer Strategy**
    - [x] **Immersive Pages (Breathing, Meditation):** REMOVE Footer completely.
    - [x] **Info/Support Pages (First Aid, Risk Calc, Resources):** SINGLE Footer at the bottom of the scrollable content. NO duplicates.
    - [x] **Legal Pages (Rights, Privacy, Terms):** Standard Footer allowed.

- [x] **Rule C: Animation Separation**
    - [x] **Breathing/Meditation:** Only the central object (circle/glow) scales.
    - [x] Text MUST remain fixed size (no `transform: scale` on text container).

## Page-Specific Fixes

- [x] **Home:**
    - [x] Move Footer down (or hide until scroll).
    - [x] Increase vertical spacing between "Start/Support" CTA and bottom modules (margin-bottom >= 32px).

- [x] **Menu (Meditation):**
    - [x] Add top-left Back button.
    - [x] Ensure single-screen visibility (reduce card height if needed).

- [x] **Breathing:**
    - [x] Remove Footer.
    - [x] Add top-left Back/Exit button.
    - [x] Fix animation: Circle scales, Text static.

- [x] **Support Menu:**
    - [x] Add top-left Back button.
    - [x] Ensure single-screen visibility.

- [x] **Risk Calculator:**
    - [x] Add top-left Back button.
    - [x] Increase padding inside Neon Box (>= 16px).
    - [x] Unify field rhythm (Title -> Desc -> Options).

- [x] **First Aid:**
    - [x] Remove duplicate Footer (keep only one at bottom).
    - [x] Add top-left Back button.

- [x] **Help (Resources):**
    - [x] Ensure single-screen visibility.
    - [x] Remove extra visual effects (keep it clean).
