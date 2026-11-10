# Editorial Design — Agent Skill & Publishing Engine

**Version 0.2.3: original, agent-authored editorial HTML → PDF + hybrid editable PPTX.**

**Art-direction upgrade:** **Crystal Cobalt Enterprise** is now the default **four-mode** identity (Atmospheric Dark / Analytical Light / Data Night / Mixed Strategic), with original reusable seed assets in [`seeds/crystal-cobalt/`](seeds/crystal-cobalt/README.md). Azure Iris Unified remains available. This version introduces actual local artwork, automatic seed inclusion in source builds, and an offline renderer that correctly loads the SVGs. The agent still chooses free-form compositions for every page: the seeds are not slide templates.

An agent skill for investment presentations, strategy decks and financial publications that are visually designed rather than filled into a deck template. The **model art-directs each page** in unrestricted HTML/CSS/SVG. A deterministic engine measures text, renders real browser pages, and exports one static artwork image per slide plus native PowerPoint text objects.

> Status: **working reference implementation, NOT automatically investor-ready**. The included example uses illustrative, user-supplied material. External Hallmark cannot be certified until installed, and professional release requires font verification, factual approval and two real visual reviews. A final PDF/PPTX pair can be generated from one verified native Office render to eliminate discrepancies *between those two delivered outputs in that renderer*. PowerPoint on an unrelated computer may render native fonts differently.

## What changed from v0.1

| Old | v0.2 |
|---|---|
| 9 fixed generic slide templates | **Free-form original compositions authored by the agent** |
| Every slide looks like a filled container | A single visual world with different page silhouettes and narrative rhythm |
| Font handoff ignored actual CSS fallback | Font-family selection per editable element with explicit fallback diagnostics |
| PowerPoint text wrapping and text cutoffs | Wider text boxes anchored to the original alignment; editable single-line fields |
| No enforced PDF/PPTX likeness gate | **Real LibreOffice PowerPoint roundtrip, per-slide diff images and strict numeric gates** |
| Separate Chromium PDF and independently rendered PPTX | **Verified paired PDF derived from the same PPTX renderer**; browser PDF preserved |
| Hallmark configured but only static `--scope app` | Hallmark `--genre editorial --render --json`, captured evidence, missing dependency blocks release |

## Requirements

- Node 20+, Python 3.10+, Chromium and the Python dependencies below.
- PptxGenJS (available globally or `npm install`).
- **LibreOffice** to perform a test conversion of PPTX back to PDF and produce a visually aligned PDF/PPTX delivery pair.
- **Hallmark pinned revision**, installed through `npm run setup:hallmark` (requires GitHub access). No Hallmark audit is fabricated when this dependency is unavailable.
- User-approved font installed **on render and recipient machines**, e.g. Geologica Roman. Fonts are never distributed by this repository.

## Quick start

```bash
pip install -r requirements.txt
npm install
npm run setup:hallmark

# Preview the original seven-slide Azure Iris demo (still available)
python examples/editorial-reference/build_example.py
node bin/editorial.mjs build-html examples/editorial-reference \
    --out outputs/azure-iris --allow-unverified

# Native PowerPoint roundtrip + strict visual comparison.
# If it passes, publication.pdf is regenerated from the verified PPTX
# so the delivered PDF and PPTX share the same rendering authority.
node bin/editorial.mjs verify outputs/azure-iris

npm run check
npm run check:visual-plan  # inspect composition variety before release
```

`--allow-unverified` means only "create auditable draft artifacts"; it does not mark a document as approved. The `build-html` path requires `project.json`, `slides/01-*.html`, and optional local `assets/`. Each HTML file contains one `.slide` at **1920 × 1080 CSS px**, with all editable visible text in independent `[data-editable="true"]` elements. There is no named slide type to choose and no compulsory visual grid. See `examples/editorial-reference/` for a complete offline source.

Do not run `build_example.py` to create real investor content; it is an illustrative sample whose values came from a provided conceptual strategy PDF.

## CLI

```text
editorial themes
editorial seeds [theme]
editorial seed <project-dir> [--theme crystal-cobalt-enterprise]
editorial build-html <project> --out <output> [--allow-unverified] [--unattended]
editorial verify <output>
editorial review <output> --cycle 1|2|3 --notes <qa.json>
editorial release <output> --approval <approved.json>

editorial build <legacy-structured-json> ...  # regression compatibility only
```

## What gets produced

| Artifact | Explanation |
|---|---|
| `publication-browser.pdf` | Chromium-authored editorial master (preserved after pairing) |
| `publication.pdf` | Final delivery PDF, rendered from the same native PPTX as the PowerPoint deliverable **after passing the parity gate** |
| `publication-editable.pptx` | Every page has **one raster picture** containing non-text artwork, then native editable text/numbers |
| `slides/*.html` & `assets/` | Original layout source, fully regenerable by an agent |
| `images/slide-*.png` | Chromium visual goldens and text-free backgrounds |
| `pptx-render/slide-*.png` | Actual PPTX roundtrip screenshots through LibreOffice |
| `parity-diffs/*` | Contrast-enhanced source/PPTX visual differences |
| `contact-sheet.png` | Whole-deck editorial overview |
| `visual-plan-report.json` | Low-cost page-to-page originality and effect-repetition advice, when a visual plan is supplied |
| `render-report.json` | DOM measurements, font availability, geometry findings |
| `pptx-verify-report.json` | Editable-shape checks, visual distance metrics, paired PDF status |
| `hallmark-report.json` | Actual Hallmark invocation or explicit missing dependency |
| `release-status.json` | NOT_READY until *all* release gates are evidenced |

## Hybrid PPTX: what is and is not identical

**One native rendering environment can output a matching PDF/PPTX pair.** The `editorial verify` command first tests the editable PPTX against the Chromium HTML design. If it passes, it preserves the browser PDF separately and makes `publication.pdf` using the same LibreOffice PPTX rendering. This removes the "PDF looked different from PPTX" failure in the verified renderer. It does **not** guarantee identical native text pixels in every installed version of Microsoft PowerPoint: proprietary text shaping, font substitution and machine fonts still matter. The release must name the tested renderer; do not say "pixel-perfect everywhere".

Editable fields may be modified in PowerPoint. Their original backgrounds are text-free; no ghost text is baked beneath. But changes to numbers **do not update static chart bars or connected calculations**. Re-generate from source for that. All diagrams, gradients, contours and images remain static.

## Design system and agent contract

Default palette: **Crystal Cobalt Enterprise** (Atmospheric Dark / Analytical Light / Data Night / Mixed Strategic), with original blue/cyan/violet optical seed artwork. Azure Iris Unified remains an alternative. Default text face: **Geologica Roman**. The agent must ask for palette and font **once, before a new interactive publication**, offering "Use defaults"; brand assets override defaults when provided. Supported alternatives: Geist, IBM Plex Sans, Onest, Manrope. The demos request Geologica but may render with installed browser substitutes in this execution environment, and therefore cannot be cleared as a final approved Geologica publication.

Read [`SKILL.md`](SKILL.md) for the agent contract. Start with [`docs/art-direction.md`](docs/art-direction.md). Supporting references: [`docs/design-grammar.md`](docs/design-grammar.md), [`docs/quality-gates.md`](docs/quality-gates.md), [`docs/hybrid-pptx.md`](docs/hybrid-pptx.md), [`docs/hallmark-integration.md`](docs/hallmark-integration.md) and [`docs/architecture.md`](docs/architecture.md).

## Responsible release

Enterprise publication is not synonymous with "the file exists". The PDF/PPTX pair remains `NOT_READY` unless a real Hallmark audit, typography/geometry checks, two independent visual review rounds, a real PPTX roundtrip, data-source checks and named human approval pass. The demo intentionally remains NOT_READY due to missing Geologica and Hallmark on the reference machine, and illustrative unapproved figures.

## License

MIT for this project's own code. Hallmark is an independent MIT dependency. Fonts, photos and third-party visual assets retain their own licenses and are never redistributed here.

## Crystal Cobalt Enterprise (integrated, default)

The default design profile is grounded in a 55-page corporate financial strategy reference; it is a design language, **not a copy of the brand's graphic assets**. The repository ships original, reusable, editable SVG seeds in `seeds/crystal-cobalt/` (5 full-frame gradient underlays, 3 optical hero objects, 2 technical linework elements, 8 domain pictograms), plus the design specification in `references/styles/crystal-cobalt-enterprise.md`.

```bash
node bin/editorial.mjs themes
node bin/editorial.mjs seeds crystal-cobalt-enterprise
node bin/editorial.mjs seed examples/crystal-cobalt-showcase --theme crystal-cobalt-enterprise
npm run check:seeds
npm run preview:seeds
node bin/editorial.mjs build-html examples/crystal-cobalt-showcase --out outputs/crystal-cobalt --allow-unverified
```

The `seed` command copies original art into `PROJECT/assets/seeds/crystal-cobalt/` without replacing project-authored files. The build pipeline copies the currently selected theme's seeds into `OUTPUT/assets/seeds/crystal-cobalt/` automatically. Slides can reference, for example, `../assets/seeds/crystal-cobalt/backgrounds/atmospheric-dark.svg` or `../assets/seeds/crystal-cobalt/objects/optical-loop.svg`. These are **visual layers only**: editable text/numbers remain native HTML so the hybrid PPTX exporter can overlay them.

Original seed authorship and restrictions are documented in `seeds/crystal-cobalt/manifest.json`. Hallmark remains a pinned external dependency and is not bundled; no successful audit should be claimed until it is installed and actually executed.
