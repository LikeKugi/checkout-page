# Checkout Page — Cube & Co. General Store

A freeCodeCamp **Build a Checkout Page** lab, built as a *letterpress ledger / paper receipt* checkout. Everything on the page is hand-written **vanilla HTML, CSS and JavaScript** — no frameworks, no UI libraries, no build step.

This repository is also a personal sandbox: it exists to **improve my own skill at agent-driven development with reusable skills** — planning a task from a spec, loading skills that encode design and accessibility rules, implementing in small verifiable steps, and proving the result with an automated checker instead of eyeballing it.

## Why this repo exists

- **Practice: spec → implementation → verification.** The lab spec (`AGENTS.md`) is the source of truth, the page is the deliverable, and `npm test` is the proof.
- **Practice: working with skills.** The UI was directed by the `frontend-design` skill (aesthetic direction, typography, motion, spatial composition) and audited against the `web-design-guidelines` skill (Vercel Web Interface Guidelines: forms, focus states, a11y, animation, typography, content handling).
- **Practice: agent-friendly repos.** A precise spec plus a runnable, deterministic check gives an agent a tight feedback loop it can trust.

## Built with

| | |
| --- | --- |
| Agent / IDE | [Cline](https://cline.bot/) in VS Code |
| Model | GLM-5.3 Flash |
| Skills | `web-design-guidelines` (compliance rules), `frontend-design` (design direction) |
| Page stack | Vanilla HTML + CSS (`<style>`) + JavaScript (`<script>`), Google Fonts CDN for type only |
| Test dependency | `jsdom` — **dev-only**, used by the local verifier. The page itself ships zero libraries. |

## Quick start

Open the page — no build, no server required:

```bash
open index.html          # macOS  (or just double-click the file)
```

Run the check suite (mirrors all 18 lab tests against a real DOM):

```bash
npm install              # installs jsdom (dev-only)
npm test
```

Expected output:

```text
PASS  1. h1 with text Checkout
...
PASS  18. card number input aria-describedby=card-number-help
PASS  bonus: quantity stepper updates totals
PASS  bonus: valid submit shows approved status

20/20 checks passed
```

Tested with Node.js `v26.7.0` and `jsdom@30.1.1`.

## The 18 lab tests

The specs live in [`AGENTS.md`](./AGENTS.md); these are the checks the page must satisfy, all of which pass:

1. An `h1` element with the text **Checkout**.
2. Only one `h1` on the page.
3. At least two `section` elements after the `h1` (they are its immediate siblings).
4. An `h2` reading **Your Cart** inside the first section.
5. At least one image with alternate text in the first section.
6. An `h2` reading **Payment Information** inside the second section.
7. A `form` inside the second section.
8. An `input` with `id` and `name` of `card-name` inside the form.
9. That input has `type="text"`.
10. An `input` with `id` and `name` of `card-number` inside the form.
11. That input has `type="text"`.
12. Every non-submit `input` has an associated `label`.
13. At least two inputs carry the `required` attribute (the page has four).
14. Each required input's label contains a `span` with the text `*`.
15. Those `*` spans have `aria-hidden="true"`.
16. A `p#card-number-help` sits **immediately after** the card number input.
17. The card number help text is not empty.
18. The card number input points at it with `aria-describedby="card-number-help"`.

## Feature tour

### Your Cart (the receipt)

- Product row with a framed, slightly rotated thumbnail (explicit `width`/`height`, `alt` text, `fetchpriority="high"`).
- **Quantity stepper (1–9)** with real `disabled` bounds and `aria-label`s; it reprices the receipt live.
- Totals — subtotal, shipping, 8% est. tax and grand total — all rendered through `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`, never hardcoded strings.
- Receipt furniture that sells the concept: a perforated tear line, mono tabular numerals, a CSS-only barcode and "keep this portion" caption.

### Payment Information (the form)

- **Card number**: digits only, auto-grouped in fours (`4242 4242 4242 4242`), capped at 16 digits, **caret position preserved** while typing, and paste is never blocked (pasted text is simply reformatted).
- **Expiry**: auto-inserts the `MM/YY` slash; validated against real month ranges and the current date.
- **CVC**: 3–4 digits.
- **Inline validation**: errors render next to the field (`aria-invalid`, `aria-live` error slots), validation reruns on `blur` and while correcting, and the **first invalid field is focused** on submit while a status region explains what happened.
- **Simulated payment**: on a valid submit the form locks, the button disables, and an **"Approved" rubber stamp** thumps onto the card. Try `4242 4242 4242 4242`, any future expiry, any CVC.

### Look and feel

- Direction: *letterpress ledger* — warm paper, ink hairlines, hard offset shadows, oxblood accent.
- Type pairing: **Fraunces** (characterful variable serif, optical sizing) for display + **IBM Plex Mono** for data, labels and prices.
- Atmosphere: laid-paper ruling, a faint margin rule, an SVG `feTurbulence` grain overlay and `<meta name="theme-color">` matched to the paper.
- Responsive: two-column receipt/slip layout on desktop, single column with reordered panels on mobile.

## Accessibility & UX (audited with `web-design-guidelines`)

- Every control is labelled (`label[for]`), with `autocomplete="cc-*"`, `inputmode="numeric"` on numeric fields and `spellcheck="false"` where relevant.
- Semantic structure: `main` → `h1` → sibling `section`s that are `aria-labelledby` their `h2`s; a **skip link** jumps straight to the payment section.
- Focus is always visible (`:focus-visible` ring, offset ink borders on inputs) — no `outline: none` without a replacement.
- Status and validation messages are announced through live regions; the quantity change reprices an `<output aria-live="polite">`.
- Animation respects `prefers-reduced-motion`; only `transform`/`opacity` animate and `transition` always lists explicit properties (never `transition: all`).
- Content handling: decorative SVG/graphics are `aria-hidden`, copy uses … and — characters, and units use non-breaking spaces (`50&nbsp;mm`, `30&nbsp;days`).

## Project structure

```text
.
├── AGENTS.md                  # the lab spec + the 18 test descriptions
├── index.html                 # the whole page: markup, <style>, <script>
├── package.json               # "npm test" entry point (dev dependency: jsdom)
├── package-lock.json
├── scripts/
│   └── verify-tests.mjs       # mirrors the 18 lab tests in a real DOM + 2 smoke checks
├── README.md
└── .gitignore
```

## How the work flowed (the agent loop)

1. **Read the spec cold** — `AGENTS.md` user stories *and* its test list, treating the test wording (`immediately after`, "only one `h1`", "all spans") as hard constraints on markup shape.
2. **Load the skills** — `frontend-design` for aesthetic direction, `web-design-guidelines` for the review checklist, so quality rules existed *before* code was written.
3. **Choose a concept, then commit** — one bold direction (letterpress receipt) instead of generic UI.
4. **Implement in small, reviewable chunks** — the file was assembled stage by stage (foundations → layout → cart → form → markup → script) so nothing depended on one giant unreviewable edit.
5. **Verify, do not assume** — `scripts/verify-tests.mjs` loads the real page in jsdom, runs the script, and asserts each test (including sibling-order and `nextElementSibling` subtleties) plus interactive smoke checks; failures were fixed and the suite rerun until green.

## Notes & limitations

- **Nothing is real but the code.** The checkout is a simulation: no network requests, no data leaves the page, no card is charged, and the form is `novalidate`d so the custom, accessible validation UI is what users experience.
- The store, order number, prices and "clerk" are fictional demo copy.
- Google Fonts is the only external resource; if it is unavailable the page falls back to `Georgia`/`ui-monospace` with no layout dependency.
- `jsdom` is a **dev dependency for testing only** — it is not loaded, bundled or referenced by `index.html`.
- This is a learning lab for a freeCodeCamp curriculum task, so the graded contract is intentionally narrow; the extra polish (stepper, stamp, formatting) is deliberate practice on top of it.

