---
name: editorial-design
version: 0.2.2
description: >-
  Art-direct and build high-end editorial investor decks, board presentations, annual and financial reports as original HTML/CSS/SVG compositions. Generate print-ready fixed-slide PDF and a hybrid PPTX with a raster background and editable text/numbers. Required: Hallmark design critique, browser visual review, and strict PDF/PPTX roundtrip parity gating.
license: MIT
---

# Editorial Design — original art direction, not template filling

## Nonnegotiable objective

Create cohesive, distinctive, content-specific publications with the editorial ambition of a serious art-direction studio. **The model is the art director. Do not reduce the design to selecting one of nine predefined slide types.** The original `build <json>` path is a **legacy regression fixture**, not the recommended generation strategy.

You must actually author and revise real HTML/CSS/SVG, render it in Chromium, look at the output, fix issues, and verify artifacts. A skill, branding file or lint script cannot substitute for original visual direction or for inspecting the rendered pages. Hallmark is required for professional release, but it is not a publishing engine or a replacement for this skill.

## 0. Start of a new interactive project — ask only two design choices

Ask the user to select **palette and type**, together, before beginning. Defaults: **Azure Iris Unified** (adaptive Lighter / Refined / Darker within one editorial identity; rich azure and cobalt, quiet iris and sky-blue, no uniform plain-white deck) and **Geologica Roman** (`CRSV=0`). Alternatives: `deep-navy`, `monochrome-editorial`, or approved custom/brand palettes; type: Geist, IBM Plex Sans, Onest, Manrope or approved custom family. Offer one easy response: *Use defaults*. Existing project decisions always override. In automated/noninteractive use, persist those defaults with a clear inferred-choice flag. Never require the user to know design terminology. For this revision, previously established selections are inherited; do not re-ask.

Fonts are **not bundled**. Confirm font availability before publishing. In particular, the font used for browser render and the font used for native PPTX must be verified as the same installed family; substitutions must be reported and block release unless approved after re-render.

## 1. The content is the design input

Read actual sources (user reference PDF, approved copy, XLSX financial model, tables, photographs and brand kit). Do not invent factual figures, logos or corporate facts. For spreadsheet financial models, note that openpyxl does not recalculate formulas. Label demo values unverified. The design may restructure and tighten prose, but must not change numerical meaning, units, dates, caveats, denominators, signs or source provenance.

Before coding, internally map the document's **narrative rhythm**, e.g. opening thesis → negative baseline → strategic pivot → drivers → scenarios → bridge → decision. Create one distinct visual concept for the publication: typographic hierarchy, spacing logic, chart marks, quiet/loud rhythm and one or two signature motifs grounded in the content. Do not borrow the source reference's palette or grid literally unless requested. Reuse its editorial ambition, not its pixels.

## 2. Art direction rules (freedom with discipline)

- **Write original layouts as HTML.** Free-form grids, CSS positioning, CSS shapes, and author-designed SVG are permitted. There is **no fixed slide anatomy** and no enforced template family per page.
- **Composition follows the claim.** A one-line thesis can own half a page. A number can be monumental. A financial bridge must retain quantitative meaning. Do not box everything into KPI cards, use identical grids page after page, or fill whitespace indiscriminately.
- One visual world, different compositions. Build a paced alternation of asymmetric/quiet/dense, light/dark, type-led/data-led. Avoid consecutive identical silhouettes.
- **Creative ambition is required, not merely tolerated.** Use striking asymmetry, expressive typography, custom SVG compositions, layered shapes, controlled gradients, technical illustration, iconography and subtle textural effects when useful. Make visual richness purposeful and content-specific; do not turn every slide into the same wave-gradient hero. If a page feels generic despite being mechanically valid, redesign its visual concept rather than adding random decoration. Images, if present, must be genuine/licensed or clearly artistic.
- Avoid fake precision, invented financial claims, default indigo-purple glow, ubiquitous icons, decorative card matrices, broken Cyrillic, underfilled data charts and tiny disclaimers. **Intentional azure/iris gradients are not forbidden**: prefer structured banded gradients, directional light, iridescent ribbons or localized depth over full-slide blurred purple-blue blobs. Allow illustrations and SVG marks where they clarify the story. Icons require semantic meaning and visual consistency.
- **Before coding, draft a one-page visual score** (`visual-plan.json` or notes): one unique focal element and silhouette per slide; assign adaptive `lighter`, `refined`, or `darker` surface modes; describe its signature motif and data role. On a seven-slide deck, aim for at least five visibly different silhouettes; do not force all pages into one composition. Select from the vocabulary in `docs/art-direction.md` or invent a stronger original treatment.
- **Variation gates:** adjacent pages must not share the same primary geometry, hero treatment, graphic motif and density; within a deck, include both exceptionally restrained and strongly graphic pages. Reserve at least one composition that breaks the expected left-headline/right-chart arrangement. Use a distinctive motif on at most 2–3 pages before varying its expression. These are design-review rules, not ungrounded numeric claims.
- **Icon policy:** use purposeful, stylistically matched inline SVG icons or thin author-designed pictograms. Use zero icons for a pure type or data-led page, 1–3 when they improve hierarchy, and never an icon above every KPI merely for decoration. Do not use emoji as icon substitutes.
- **Effects and gradients:** permit multiple aesthetic families across the publication: e.g., iridescent silk/ribbon, contour-map linework, clipped light fields, translucent technical overlays, typographic masking, softly graded panels, fine grid textures, and data-bound SVG marks. Avoid repeating the same effect on every page. Keep decorative SVG out of editable text elements so Hybrid PPTX preserves it as part of the exact static background.
- Build one source project with `project.json`, independent `slides/01-*.html ...`, and `assets/*.css`. Each source slide is a complete offline HTML document containing exactly one 1920×1080 `<section class="slide">`.
- Every visible text/number to remain editable **must be a single explicit HTML element with `data-editable="true"`**. For maximum PPTX fidelity, author each displayed line in a separate element, with no nested styled text spans, and CSS `white-space:nowrap`. Complex SVG figures and graphic decoration remain static background. Chart labels must be separate HTML text elements if they need editing.
- Keep text unclipped, including disclaimers, and ensure native text can fit if fonts substitute. Use real units and references.

## 3. Mandatory Hallmark dependency

Install the pinned upstream revision via `npm run setup:hallmark` or a manually reviewed equivalent at `vendor/hallmark`. Read its `SKILL.md` plus only the relevant reference files (`craft.md`, `layout.md`, `gates.md`, `data-viz.md`). The brief and client design profile take precedence over randomized Hallmark themes. **Actually run** Hallmark `sloplint --genre editorial --render --json` against the authored pages, capture the result, and review its findings. Publication-specific exceptions to website-only layout rules may be recorded with explicit rule IDs and reasons, but missing Hallmark can never count as PASS. Do not pretend the tool ran.

## 4. Render with the included deterministic engine

```bash
python examples/editorial-reference/build_example.py # optional demo only
node bin/editorial.mjs build-html <project-directory> --out <output-directory> --allow-unverified
node bin/editorial.mjs verify <output-directory>
```

`build-html` copies original author-designed HTML files; it does **not** pass them through a generic slide template. Python Playwright/Chromium captures (i) full PNG/PDF and (ii) identical pixel-size static backgrounds with only `[data-editable]` text hidden, plus per-element DOM coordinates, computed font/style, and geometry findings. PptxGenJS then puts those backgrounds behind native text. It is a **hybrid editable PPTX**, not full native PowerPoint reconstruction. On deployment, require `--strict` verification and correct fonts. Source HTML, screenshots and the per-slide edit manifest remain reproducible.

## 5. Visual QA: bounded but real

The first authored preview is **not ready for delivery**. Conduct two actual visual review rounds, using Playwright MCP if available, otherwise the bundled Playwright runner. In every round inspect the **contact sheet** and the relevant full-resolution slides. Round 1 critiques hierarchy, rhythm, uniqueness, overflow, density, charts and clarity, then applies a **batch** of corrections. Round 2 re-renders all changed slides and audits corrections/regressions. A third round is conditional on P0/P1 failures; never run unbounded loops. Use one fresh-context critique subagent only if actually available and materially useful. Do not invent `/goal` tooling: use it only in harnesses that implement it.

Automated DOM and font checks run on **every** slide. Use screenshots strategically (one contact sheet plus detailed problem slides) to control token use. Record both reviews with `editorial review ...` and the screenshots' checksums. No review notes without actual inspection. Break the run after round 3 if defects remain, with an honest NOT_READY state.

## 6. PPTX fidelity is a release blocker

**Never** claim PPTX is identical to PDF merely because text objects and background images exist. Every build must reopen PPTX in an actual compatible renderer, rasterize all its pages at the HTML reference size, compare against the HTML/PNG goldens (and inspect severe differences). Use:

```bash
python python/verify_pptx.py outputs/project/publication-editable.pptx --out outputs/project --visual --strict
```

Checks compare whole image, text regions and background separately and save actual PPTX page PNGs plus diff images. One exported layer is a full-slide image **without editable text**; the native text overlays must preserve its coordinates, family, color and weight. Do not use PowerPoint autofit/shrink, because it silently changes type. Avoid wrapped native text: one authored line → one native text object. The same fonts need to be installed on the receiving device. The source data and background chart artwork do **not** update when numbers are modified in PowerPoint.

**Fundamental limitation:** arbitrarily rendered native PowerPoint text cannot be guaranteed *bit-for-bit* identical to Chromium text on all machines and office suites. Promise a tested tolerance on a named renderer, not universal pixel-perfect equivalence. Fail the gate when fidelity is below threshold. Do not substitute transparent editable text on top of text already baked into the background: the edited value would not visibly replace the old one.

## 7. Delivery and release

User should get PDF, hybrid PPTX, source HTML, contact sheet and QA evidence (`render-report.json`, `hallmark-report.json`, `pptx-verify-report.json`, parity diffs and `release-status.json`). `READY` requires real Hallmark audit, installed/approved fonts, true visual review rounds, verified financial claims, and a passing PPTX visual roundtrip, plus human approval for investor distribution. A demonstrator may be `NOT_READY`, and must be labeled so.

Read `docs/art-direction.md` before every new editorial publication. Additional supporting docs: `docs/architecture.md`, `docs/design-grammar.md`, `docs/quality-gates.md`, `docs/hybrid-pptx.md`, `docs/hallmark-integration.md`.
