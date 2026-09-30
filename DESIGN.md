# Design System — Cube & Co. Checkout

A one-page design reference for [`index.html`](./index.html). Every value in this document is implemented in the single `<style>` block of that file — there is no build step, no CSS framework and no second source of truth. Contrast ratios below were measured, not estimated.

---

## 1. Design thesis

> **A letterpress receipt for a fictional general store.**

The checkout is rendered as the physical artefact of one: cream laid paper, ink hairline rules, a perforated tear line, a barcode stub, monospaced numerals — and a rubber stamp that lands when payment is approved.

Three commitments hold the whole page together:

1. **Ink on paper, never "pixels".** Warm paper `#f2ecdd` and ink `#221e18` are the only structural colours. Surfaces stay flat; depth comes from **2px ink borders plus hard, unblurred offset shadows** — never blur, never a gradient pretending to be depth.
2. **Instruments, not buttons.** Controls read as printed hardware: uppercase mono labels with wide letter-spacing, tabular numerals, dashed rules, tags and stamps.
3. **Accent as red ink.** Oxblood `#9d2b1e` is reserved for meaning (required marks, kickers, errors, focus, the stamp). Green `#2e6b3f` appears *only* for confirmation. Nothing decorative shouts in the accent.

---

## 2. Colour system

### 2.1 Tokens (declared in `:root`)

| Token | Value | Role in the system |
| --- | --- | --- |
| `--paper` | `#f2ecdd` | Page ground — the desk the receipt sits on |
| `--panel` | `#faf6ea` | Receipt / slip surfaces (both `section`s) |
| `--paper-bright` | `#fffdf5` | Raised paper: inputs, tags, status strip, barcode block |
| `--ink` | `#221e18` | Body text, **all** structural borders, submit plate |
| `--ink-2` | `#6a6250` | Secondary text: order meta, help, captions, legend |
| `--line` | `#d8cdb2` | Decorative rules only: dashed tears, hairline separators |
| `--red` | `#9d2b1e` | Accent: required `*`, kickers, focus ring, errors, stamp |
| `--red-dark` | `#802114` | Input hover border |
| `--green` | `#2e6b3f` | Success only (`#checkout-status.ok`) |
| `--mono` | `"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace` | Body copy + every number |
| `--serif` | `"Fraunces", "Iowan Old Style", Georgia, serif` | Display headings + product name |

### 2.2 Non-token colours

| Value | Where | Why it is not a token |
| --- | --- | --- |
| `#f7f2e4` | Inverse text on ink plates, `::selection` text, skip link | Only ever used on an ink background |
| `#000` | `.pay-btn:hover` | A deliberate "press harder" darkening, 1 shade below `--ink` |
| `#a79d86` | `::placeholder` | Placeholder-only tint (see trade-offs in §8) |

### 2.3 Translucent overlays (atmosphere layers)

| Value | Layer |
| --- | --- |
| `rgba(34, 30, 24, .04)` | Laid-paper horizontal ruling (28px pitch) |
| `rgba(168, 123, 34, .10)` | Brass wash, radial from top-right |
| `rgba(157, 43, 30, .07)` | Oxblood wash, radial from bottom-left |
| `rgba(157, 43, 30, .35)` | Ledger margin rule (`.page::before`) |
| `rgba(157, 43, 30, .28)` | Marker highlight under the `h1` |
| `rgba(34, 30, 24, .9)` | Panel shadow (`.panel`) |
| `rgba(34, 30, 24, .8)` | Product-frame shadow |
| `rgba(157, 43, 30, .9)` | Submit-button shadow, input focus shadow |
| `rgba(157, 43, 30, .18)` | `-webkit-tap-highlight-color` |

### 2.4 Measured contrast (WCAG 2.1)

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `--ink` on `--paper` | **14.06:1** | AAA |
| `--ink` on `--panel` | **15.34:1** | AAA |
| `--ink-2` on `--panel` | **5.59:1** | AA |
| `--ink-2` on `--paper` | **5.13:1** | AA |
| `--red` on `--panel` | **6.95:1** | AA (AAA at large sizes) |
| `--red` on `--paper-bright` | **7.37:1** | AAA |
| `--green` on `--paper-bright` | **6.27:1** | AA |
| `#f7f2e4` on `--ink` | **14.82:1** | AAA |
| `#a79d86` placeholder on `--paper-bright` | **2.64:1** | ⚠️ below AA — documented in §8 |
| `--line` on `--panel` | 1.46:1 | Decorative only, never text |

### 2.5 Colour rules

- **Do** keep `--ink` for every structural border. Grey borders break the letterpress illusion.
- **Do** reach for `--red` only when something is required, wrong, or approved.
- **Don't** introduce new hues. A third hue (blue, purple) would read as "web app" and kill the concept.
- **Don't** use `--line` for text or icons — it exists to draw rules and tears.
- **Don't** put `--ink-2` text over the brass/oxblood washes at very small sizes; the washes lower effective contrast.

---

## 3. Typography

### 3.1 Families

| Family | Role | Loading |
| --- | --- | --- |
| **Fraunces** (variable serif) | Display headings, product name, stamp | Google Fonts CDN, `ital, opsz 9–144, wght 300–900`, `font-optical-sizing: auto` |
| **IBM Plex Mono** | Body text, labels, prices, meta, buttons, captions | Google Fonts CDN, weights 400 / 500 / 600, `display=swap` |

Both stacks carry local fallbacks (`Georgia` for the serif, `ui-monospace`/`Menlo` for mono), so the page degrades to a plain "printed" look with no layout dependency if the CDN is unavailable. `preconnect` hints are set for both font hosts.

### 3.2 Type scale (exact values in use)

| Element | Family | Size | Weight | Tracking | Line-height |
| --- | --- | --- | --- | --- | --- |
| `h1` "Checkout" | Fraunces | `clamp(2.9rem, 6.2vw, 4.5rem)` | 850 | −0.02em | 0.95 |
| `h2` panel headings | Fraunces | 1.62rem | 750 | −0.01em | 1.05 |
| Product name (link) | Fraunces | 1.06rem | 680 | −0.005em | inherit |
| Order meta (`.mast-meta`) | Mono | 11.5px | 500 | 0.14em | 1.7 |
| Masthead kicker | Mono | 11px | 600 | 0.26em | 1 |
| Panel kicker / tag | Mono | 10px | 600 | 0.24em / 0.18em | 1 |
| Form legend | Mono | 10px | 600 | 0.18em | 1.5 |
| Field label | Mono | 11px | 600 | 0.16em | 1.4 |
| Input value | Mono | 14px | 500 | 0 | 1.4 |
| Help / error text | Mono | 11.5px | 500 | 0 | 1.45 / 1.4 |
| Totals rows | Mono | 12.5px | 500 | 0 | 1.5 |
| Grand-total label / value | Mono | 14px / 17px | 600 | 0.06em (label) | 1 |
| Status strip | Mono | 13px | 500 | 0 | 1.5 |
| Submit plate | Mono | 12.5px | 600 | 0.22em | 1 |
| Stamp | Mono | 15px | 800 | 0.3em | 1 |
| Barcode caption | Mono | 9.5px | 500 | 0.2em | 1.4 |
| Footer | Mono | 10.5px | 500 | 0.2em | 1.7 |
| Body default | Mono | 16px | 400 | 0 | 1.55 |

### 3.3 Typographic rules

- **Serif is never uppercase.** Letter-spacing on the serif is always negative (tight); letter-spacing on mono micro-copy is always positive and grows as the size shrinks.
- **Every number is tabular** (`font-variant-numeric: tabular-nums`) — prices, totals, quantity — so digits do not jitter when repriced.
- **Headings balance** (`text-wrap: balance`) to avoid widows in "Payment Information".
- **Real punctuation:** `…`, `—`, `–`, `№`, `·` and `&nbsp;` inside units (`50&nbsp;mm`, `30&nbsp;days`) — never `...` or a straight quote.
- **Brand names** are wrapped in `translate="no"` so auto-translation cannot garble "Cube & Co.".

---

## 4. Layout & grid

### 4.1 Page frame

```text
.page  max-width 1080px · margin inline auto · padding 38px 24px 60px
grid-template-columns: minmax(0, 5fr) minmax(0, 7fr)
column-gap 32px · row-gap 16px
```

| Row | Column 1 (5fr) | Column 2 (7fr) |
| --- | --- | --- |
| 1 | `.mast-kicker` — spans `1 / -1` | — |
| 2 | `h1` "Checkout" (`align-self: end`) | `.mast-meta` (`justify-self: end`) |
| 3 | `#cart` (`align-self: start`) | `#pay` (`align-self: start`) |
| 4 | `.visa-line` → `#checkout-status` → `footer.foot` — all span `1 / -1` | — |

- **Asymmetry is deliberate:** the receipt column is narrower than the slip column (5:7), the giant left-aligned serif title is balanced by tiny right-aligned mono meta, and both panels start on the same line but end at different heights.
- **The ledger margin rule** (`.page::before`) is a 1.5px `rgba(157,43,30,.35)` vertical line 16px left of the content box, hidden on narrow screens.
- **DOM order is a spec constraint:** the `h1` must be an immediate sibling immediately followed by the two `section`s, so the visual row-2 pairing with `.mast-meta` is achieved with explicit `grid-row`/`grid-column` — *not* by reordering markup. Keep it that way or the lab tests break.

### 4.2 Spacing rhythm

| Step | Value | Used for |
| --- | --- | --- |
| Micro | 2–6px | Label→input gap (6px), star offset (2px), tag padding (5px 8px) |
| Field | 14–15px | `.field` bottom margin, `.form-row` column gap |
| Panel | 16–20px | `.panel-head` `16px 20px 13px`, `.panel-body` `18px 20px 20px` |
| Block | 14–18px | Totals spacing, tear margins (`18px -34px 16px`) |
| Page | 26px+ | Footer separation (`margin-top: 26px`) |

### 4.3 Breakpoints

| Breakpoint | Change |
| --- | --- |
| `> 880px` | Two-column receipt + slip layout as above |
| `≤ 880px` | Single column; padding `28px 18px 48px`; margin rule moves to −12px; meta left-aligned; panels forced into visual order **cart → payment** via `order`; footer stacks |
| `≤ 460px` | `.form-row` collapses to one column (expiry above CVC); meta drops to 10.5px |

---

## 5. Motifs, texture & print furniture

The page has a small vocabulary of repeated devices. Reuse these instead of inventing new ones.

| Motif | Implementation | Where |
| --- | --- | --- |
| **Hard offset shadow** | `box-shadow: Npx Npx 0 <translucent ink or red>` — zero blur | Panels 7px, submit plate 5px, product frame 3px, focused input 3px red |
| **Ink borders** | 2px `--ink` structural, 1.5px `--ink` secondary | Panels, inputs, tags, stepper, dividers |
| **Dashed rules** | 2px / 1.5px dashed `--line` | Tear line, totals separators, barcode stub, demo strip |
| **Square corners** | `border-radius: 0` everywhere except the stamp (4px) and tear punches (50%) | All components |
| **Perforated tear** | 0-height element with a dashed 2px top border, negative side margins reaching both panel edges, and two 18px circles (2px ink border) punched at −11px | Between product and totals |
| **Barcode stub** | Three overlaid `repeating-linear-gradient`s (13px period, deliberately uneven bar widths) in a 130×26px block + caption `* Keep this portion for your records *` | Receipt footer |
| **Paper grain** | Fixed `body::before`: SVG `feTurbulence` (fractalNoise, baseFrequency 0.85, 2 octaves), `opacity: .05`, `mix-blend-mode: multiply`, `z-index: 40`, `pointer-events: none` | Whole page |
| **Laid-paper ruling** | `repeating-linear-gradient(0deg, transparent 0 27px, rgba(34,30,24,.04) 27px 28px)` | `body` background layer 1 |
| **Warm washes** | Brass `rgba(168,123,34,.10)` top-right, oxblood `rgba(157,43,30,.07)` bottom-left | `body` background layers 2–3 |
| **Marker highlight** | `linear-gradient(180deg, transparent 66%, rgba(157,43,30,.28) 66%)` as `h1` background | Under "Checkout" |
| **Micro-rotation** | Product frame −1.5°, panel tag +1.5°, stamp −8° | Objects that should look *stuck on*, not drawn |
| **Inked-over look** | `mix-blend-mode: multiply` on the stamp so it darkens the form beneath | Success state |
| **Period photo** | `filter: sepia(.24) contrast(1.02)` | Cart thumbnail |

---

## 6. Components & states

### 6.1 Receipt (`.panel#cart`)

| Part | Anatomy | States |
| --- | --- | --- |
| `.panel` | `--panel` ground, 2px `--ink` border, `box-shadow: 7px 7px 0 rgba(34,30,24,.9)`, square corners | Static |
| `.panel-head` | Flex space-between, 2px ink bottom rule, padding `16px 20px 13px`; **kicker** (red mono 10px, 0.24em) above a Fraunces 1.62rem `h2`; `.panel-tag` (1.5px border, `--paper-bright`, rotated +1.5°) | Static |
| `.product` | Flex row: framed thumbnail → info (`min-width: 0` so long names cannot burst the grid) → price | Static |
| `.product-frame` | 5px `--paper-bright` padding, 2px ink border, 3px offset shadow, −1.5° rotation, 116×73px sepia image | Static |
| `.product-title a` | Fraunces link; red 2px underline **wipes in from the left** via `background-size: 0% → 100%` | `:hover`, `:focus-visible` |
| `.stepper` | 1.5px ink bordered group: 30×30px buttons, 34px-min `<output>` with 1.5px inline dividers, `touch-action: manipulation` | Button `:hover` fills ink/paper; `:disabled` drops to 45% opacity with `not-allowed` (hover reverts); output is `aria-live="polite"` |
| `.tear` | Zero-height dashed rule with two 18px punched circles at the panel edges | Decorative (`role="presentation"`) |
| `.totals` | Flex space-between rows, 12.5px mono `--ink-2`; `.grand` breaks with a 2px ink rule, uppercase 14px label + 17px value | Values repriced live by JS |
| `.barcode` | Bottom-aligned flex: `--paper-bright` bars block + caption | Static |

### 6.2 Payment slip (`.panel#pay`)

| Part | Anatomy | States |
| --- | --- | --- |
| `.form-legend` | 10px mono uppercase with a red `*` | Static |
| `.field` | Label (11px mono, 0.16em) + `.req` red star; `.help` (11.5px `--ink-2`); `.error` (11.5px `--red`) | See input states below |
| `input[type="text"]` | `--paper-bright`, 2px ink border, `border-radius: 0`, padding `10px 12px`, 14px mono | **hover** → `--red-dark` border · **focus** → red border + `3px 3px 0 rgba(157,43,30,.9)` shadow + `translate(-1px,-1px)` "lift" · **focus-visible** → 3px red outline, 2px offset · **invalid** → red border (+ `aria-invalid="true"`) |
| `.pay-btn` | Full-width ink plate, paper text, 0.22em tracking, `5px 5px 0 rgba(157,43,30,.9)` shadow, lock glyph (14px, `currentColor`) | **hover** → pure black · **active** → `translate(3px,3px)` with the shadow shrinking to 2px (a physical press) · **disabled** → 65% opacity, `progress` cursor |
| `.stamp` | Absolutely positioned mid-right, 3px red border, 4px radius, −8° rotation, `mix-blend-mode: multiply`, `aria-hidden`, `pointer-events: none` | Entered via `@keyframes stamp`: scale 1.9 → 1, rotation 2° → −8°, 0.38s `cubic-bezier(.2, 1.6, .35, 1)` (overshoot = rubber meeting paper) |
| `#checkout-status` | Full-width strip, 1.5px ink border, hidden while `:empty`, `role="status"` | `.ok` → green text/border · `.err` → red text/border |
| `.skip-link` | Ink plate parked at `top: -64px` | `:focus-visible` → slides to `top: 12px` |

---

## 7. Motion

**Principle: letterpress, not bouncy.** Motion exists only to mark a state change (a stamp landing, a link underlining itself, a plate being pressed). Nothing loops, nothing scroll-triggers, nothing floats.

| Interaction | Animates | Timing |
| --- | --- | --- |
| Product-title underline wipe | `background-size` (paint-only) | 0.25s `ease` |
| Input focus "lift" | `transform`, `box-shadow`, `border-color` | 0.15s `ease` |
| Stepper button fill | `background-color`, `color` | 0.15s `ease` |
| Submit plate press / hover | `transform`, `box-shadow`, `background-color` | 0.12s `ease` |
| Skip link reveal | `top` | 0.2s `ease` |
| Approval stamp | `transform`, `opacity` | 0.38s `cubic-bezier(.2, 1.6, .35, 1)` |

- **Properties are always listed explicitly** — `transition: all` is banned.
- Transform/opacity carry the motion; the only layout-animating exceptions are the underline's `background-size` and the skip link's `top`, both single paint/layout-light elements, both documented here on purpose.
- **Reduced motion wins:** a global `@media (prefers-reduced-motion: reduce)` block collapses every animation and transition to ~0ms, limits iterations to 1, and switches `scroll-behavior` to `auto`.

---

## 8. Accessibility is part of the aesthetic

The letterpress look was allowed to be opinionated, but never at the cost of operability.

### 8.1 Constraints baked into the visuals

| Constraint | How the design honours it |
| --- | --- |
| Focus must always be visible | Global `:focus-visible` = 3px `--red` outline, 2px offset. Inputs replace `outline` on `:focus` with a red border + hard red shadow, so the ring is never simply deleted |
| Colour is never the only signal | Errors carry a sentence *and* `aria-invalid` *and* a red border; success carries text *and* the stamp; required fields carry a visible `*` whose `aria-hidden` keeps it out of the accessible name |
| Decoration stays out of the way | Grain, tear punches, barcode bars, lock/bolt glyphs, tag rotation and the `h1` marker highlight are CSS or `aria-hidden` |
| Changes are announced | `#checkout-status` is `role="status" aria-live="polite"`; each `.error` span is a polite live region; the quantity `<output>` is live too |
| Structure is semantic | `main` → single `h1` → sibling `section`s labelled by their `h2`s (`aria-labelledby`); a skip link jumps to payment |
| Images reserve their space | `alt` text plus `width="307" height="192"` and `fetchpriority="high"` |
| Forms never fight the user | `label[for]`, `autocomplete="cc-*"`, `inputmode="numeric"`, `spellcheck="false"`, `maxlength` matching the mask, paste allowed, and the **first invalid field receives focus** on submit |
| Motion can be switched off | `prefers-reduced-motion` kills all of it |

### 8.2 Known trade-offs (honest list)

| Trade-off | Detail | Suggested fix |
| --- | --- | --- |
| **Placeholder contrast** | `#a79d86` on `#fffdf5` measures **2.64:1** — below AA | Darken to ≈`#8a8271` (≈4.5:1), or remove placeholders entirely since labels + help text already carry the meaning |
| **Input font-size 14px** | iOS Safari zooms the viewport when focusing inputs smaller than 16px | Raise input text to 16px, or accept it as a desktop-first demo |
| **Stepper targets 30×30px** | Below the 44×44px touch-target guidance | Grow to 44px under `@media (pointer: coarse)` |
| **Naming debt** | `.visa-line` actually renders the "Demo only" disclaimer, not card-brand marks | Rename to `.demo-note` when the markup is next touched |
| **Font loading** | Two families come from a Google Fonts CDN (privacy + an extra connection) | Self-host both files if that matters |
| **Single test harness** | Verification runs in jsdom — no real-browser paint, no screen-reader pass | Add a Playwright + axe visual/AT check before treating this as production UI |
| **10px micro-copy** | Kickers/legends are deliberately tiny for the receipt look | They are uppercase with wide tracking and never the sole carrier of information, but 11px is a safer floor |

---

## 9. Rules for extending the design

**Do**

- Keep exactly three structural colours: paper, ink, accent (plus one success hue).
- New surfaces = 2px ink border + hard 0-blur offset shadow + square corners + mono uppercase micro-labels.
- Put money and quantities through `Intl.NumberFormat` and `font-variant-numeric: tabular-nums`.
- Animate `transform` / `opacity` (paint-only properties at most), under ~400ms, and never remove the reduced-motion block.
- Size touch controls at ≥44px when they are meant for thumbs.

**Don't**

- No `border-radius` above 4px, no blurred shadows, no glassmorphism, no blue/purple gradients.
- No `transition: all` — list the properties.
- No `outline: none` without a replacement focus treatment.
- No `--line` text, and no `--ink-2` copy layered over the brass/oxblood washes at micro sizes.
- No reordering the DOM to fix layout: `h1` immediately followed by the two sibling `section`s is a contract with the lab tests.

---

## 10. Where to change what

| I want to change… | Edit this |
| --- | --- |
| Paper tone | `--paper` (and keep `<meta name="theme-color">` plus the two `rgba` washes in sync) |
| Ink tone | `--ink` (borders, text and the submit plate all follow it) |
| Accent | `--red` / `--red-dark`, then the `rgba(157, 43, 30, …)` literals listed in §2.3 |
| Headline scale | `h1 { font-size: clamp(2.9rem, 6.2vw, 4.5rem) }` |
| Panel depth | `.panel { box-shadow: 7px 7px 0 rgba(34, 30, 24, .9) }` |
| Column ratio | `.page { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr) }` |
| Product photo | `.product-frame img` (CSS size) **and** `alt` / `width="307"` / `height="192"` in the markup |
| Prices, tax, shipping, max quantity | JS constants `UNIT_PRICE`, `SHIPPING`, `TAX_RATE`, `MAX_QTY` |
| Store name, order number, disclaimer copy | `.mast-kicker`, `.mast-meta`, `.visa-line`, `footer.foot` |

## 11. Token reference (copy source of truth)

```css
:root {
    color-scheme: light;
    --paper: #f2ecdd;
    --panel: #faf6ea;
    --paper-bright: #fffdf5;
    --ink: #221e18;
    --ink-2: #6a6250;
    --line: #d8cdb2;
    --red: #9d2b1e;
    --red-dark: #802114;
    --green: #2e6b3f;
    --mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    --serif: "Fraunces", "Iowan Old Style", Georgia, serif;
}
```

Fixed values worth remembering (not tokenised, because they are structural decisions rather than themes): `2px` structural border · `1.5px` secondary border · hard shadows at 3 / 5 / 7px · page max-width `1080px` · grid `5fr / 7fr` with `32px` gap · breakpoints `880px` and `460px`.

---

## 12. Provenance

This design was produced as a deliberate practice run for **agent-driven development with reusable skills**:

- **`frontend-design` skill** — forced a single, committed aesthetic direction (letterpress receipt) instead of generic UI: distinctive type pairing, texture, motion with restraint, and print-derived motifs.
- **`web-design-guidelines` skill** — used as the review checklist that shaped forms, focus states, animation, typography and content handling, and which produced the trade-off list in §8.2.
- Built with **Cline + GLM-5.3 Flash**; the checks in §8.2 are the honest gaps a human reviewer should close next.

Related documents: [`README.md`](./README.md) (what the project is and how to run it) and [`AGENTS.md`](./AGENTS.md) (the lab spec and its 18 tests).
