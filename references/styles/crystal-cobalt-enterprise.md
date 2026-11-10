# Crystal Cobalt Enterprise — Visual Identity & Editorial Art Direction Specification

**Status:** Proposed design direction, version 1.0 · 11 November 2026  
**Source:** `АЭБ_Стратегия_3006.pdf` (55 pages, 16:9), provided by the project owner  
**Scope:** Investor decks, strategic presentations, bank annual reports, analytical publications.  
**Relationship to the existing skill:** A standalone style specification. It does not modify any existing skill, renderer, or theme.

## 0. What is directly observed, and what is proposed?

This document separates evidence from interpretation:

- **Reference observations:** actual visual features visible in the supplied Almazergienbank PDF. Page numbers refer to the PDF's 1-based page order.
- **Design proposal:** reusable, original design rules inspired by that visual language, not a reproduction of AEB's corporate identity.
- **Non-inferable:** exact original colors, fonts, design software, 3D authoring software, and licensing status cannot be reliably determined from the PDF alone. Color codes below are **curated approximate tokens**, not purported original brand values. The PDF exposes Type 3 font objects with no recoverable font-family names.

Reference observations by category:

| Feature | Reference pages | Interpretation |
| --- | --- | --- |
| Near-black, electric blue and pink-violet luminous backgrounds | 1, 3, 6, 14, 23, 33, 36, 43, 52 | Signature atmospheric section treatment |
| Cobalt-to-cyan gradients | 22, 23, 33, 43, 47 | Cooler alternate mode for sections and transitions |
| Large translucent intertwined glass ring/sculpture | 1, 32 | Hero art object, *not* a small icon |
| Radial emblem/logo repeated in corners | 2–55 | Bank-specific **corporate identity**; not a reusable generic symbol |
| Asymmetric splits, sweeping curved boundaries, angular chevrons | 4, 20–21, 27, 49, 54 | Contrasting editorial layouts rather than only card grids |
| Light chart boards, white/blue-grey rounded panels | 5, 8–12, 29–31, 48, 53 | Analytical mode, lower visual noise |
| Dark quantitative dashboards, dark tables, luminous blue data marks | 16, 41–42, 44–45, 50–51, 55 | High-density night mode |
| Icons and colored panels for business concepts | 4, 9, 24, 26–28, 31 | Graphic signs assigned to semantic entities |
| Iceberg brand metaphor and photography | 24–26 | Occasional concept art / authentic imagery |

A coarse luminance classification of rendered pages gives **33 dark, 20 light, 2 mixed**, with classification sensitive to thresholds and mixed layouts. This is a description of the source document, **not** a required ratio for future publications.

## 1. Visual positioning

**Keywords:** luminous, confident, technological, blue-led, substantial, spatial, crystalline, institutional.  
**Not:** generic SaaS dashboard, generic blue-purple AI gradient, neon club poster, randomly decorative 3D, glassmorphism on every card.

Core idea: a **controlled contrast between a dramatic corporate visual layer and precise financial analysis**. The graphic system changes with the page's job. Each page has one dominant idea, one focal hierarchy, and a non-repeating composition.

Keep the visual expression distinctive while ensuring auditability and numerical credibility.

## 2. Color system

### 2.1 Color roles — proposed approximations

| Token | Hex | Role |
| --- | --- | --- |
| `ink.950` | `#141A24` | Signature almost-black marine field, dark covers and dense data |
| `ink.850` | `#222B3A` | Dark sub-panels, cards, tables |
| `navy.900` | `#0D2456` | Midnight blue, shadow gradient stop |
| `blue.800` | `#0739AD` | Primary saturated corporate cobalt |
| `blue.650` | `#075DDE` | Bright electrical blue and major KPI emphasis |
| `blue.500` | `#1885F1` | Main data blue and light mode accent |
| `cyan.450` | `#00BFE9` | Cyan glow, selective graph highlight |
| `violet.500` | `#7756D9` | Prism/refraction and selective classification |
| `magenta.550` | `#B21EB4` | Ambient light in dark spreads, not body text |
| `paper.100` | `#F9FBFE` | Light background, cool white |
| `paper.200` | `#F0F3F8` | Chart panel surface |
| `paper.300` | `#E6EDF6` | Dividers / secondary panels |
| `muted.500` | `#8490A3` | Supporting text, axis labels |
| `success.500` | `#25B88A` | Meaningful positive status only |
| `warning.500` | `#EEA44F` | Meaningful warning or benchmark only |

Use **one dominant hue and one secondary glow per page**. A full suite of all saturated tones on the same page is discouraged. Magenta and violet work best as *atmospheric reflections* and rare data-group identities, not default button colors.

### 2.2 Semantic use

- **Dark covers and divider pages:** `ink.950` / `navy.900` / `blue.800`, with directional cyan and violet light. Text `#FFFFFF`.
- **Light analytical spreads:** `paper.100` and `paper.200`, `ink.950` body, cobalt highlights, very sparse violet.
- **Dark data spreads:** `ink.950`, `ink.850` chart surfaces, high-contrast white values, blue and cyan series; violet only as a separately encoded series.
- **Mixed decision spreads:** one dark region plus a cool-light or cobalt region; visual separation must carry meaning.

### 2.3 Recommended gradient recipes (proposed, not original source values)

- `aurora-cobalt-magenta`: large, blurred blue light across the field, magenta on one boundary. Use on chapter dividers or selected covers.
- `marine-cyan`: almost-black blue to radiant cyan, mostly for section introductions.
- `electric-cobalt`: saturated cobalt to brighter blue/cyan, for confident feature fields.
- `prismatic-glass`: translucent cyan-blue-violet reflections, **applied to the object**, not to all text and cards.
- `ice-surface`: low-amplitude pale blue for analytical pages.

Avoid gradient text as a default. Large backgrounds can carry colorful gradients while text remains solid and readable.

Detailed CSS definitions are in `gradients.css`; token values are in `tokens.json`.

## 3. Typography

### 3.1 Font selection protocol

Before beginning an interactive new publication, ask once for **color theme** and **font family**, preselecting Crystal Cobalt and Geologica Roman. Allow “use defaults” as one response. Keep the selection in the project's `design.json` and do not ask again during regeneration. In headless runs use explicit defaults and log them.

- **Primary default:** Geologica Roman (ensure actual font files are installed; the `Roman` choice is an axis/variant, not assumed to be a separate universally installed font name).
- **Alternative sans:** Geist Sans; IBM Plex Sans; Onest.
- **Optional high-character display variant:** a licensed condensed sans selected and approved for chapter dividers where that is important. Do not assert this is the exact source font.
- **Maximum:** 2 type families in normal designs (3 only with justified editorial reason). Do not silently substitute missing fonts.

### 3.2 Typographic roles at a 1920×1080 artboard (starting ranges)

| Role | Suggested range | Rules |
| --- | --- | --- |
| Cover title | 80–112 px | Big but with consistent line rhythm, usually left aligned |
| Section title | 66–90 px | Strong scale, generous negative space, no busy charts |
| Content heading | 45–65 px | Sentence case or deliberate all-caps where needed |
| Hero KPI | 78–150 px | Clear units and time period, tabular figures |
| Body | 25–32 px | Short text lines, strong readability |
| Chart labels | 18–27 px | Dense charts may go smaller only if final-size proof remains legible |
| Source/footer | 15–21 px | At final 1080p this must stay readable |

When a passage is too long: reflow, split, or promote a chart; **do not blindly shrink typography**. All visible figures must retain units, dates and source provenance.

## 4. Signature graphic language

### 4.1 Crystal / glass brand object

The hero object in the source is best described as a **translucent twisted glass ring or ribbon-like torus** (pages 1 and 32), not a diamond icon. For this design system, make **original objects** in the same broad material category. Never reuse AEB's specific 3D object unless the user owns the artwork or provides permission.

**Art direction:** transparent optical glass; bent band or loop; clean inner refractions; blue/cyan highlights; occasional violet rim reflection; glossy but not plasticky; dark background; controlled dispersion; consistent virtual studio lighting. No embedded letters or logos.

**Preferred production:** 3D procedural renderer (Blender), original 3D asset, or optional image generation with high-quality transparent background. CSS/SVG are suitable for gradients, rings, curved lines, glows and graphic geometry, **but they do not automatically reproduce convincing refraction**.

**Canvas:** 16:9 slide art object; transparency with soft shadow where appropriate; output ideally transparent WebP/PNG at least 2× the on-slide pixel footprint; maintain asset provenance and rights.

**Frequency:** one principal hero object per important chapter/opening/ending visual beat. Vary crops, scale and presence. Do not place the same object in every slide.

### 4.2 Other graphic families

1. **Aurora light fields:** soft, directional, large-scale chromatic transitions, without noisy halos behind body copy.
2. **Geometric masks:** sweeping curves, angular wedges, circles, oversized framing shapes. See source pages 4, 20–21, 27, 49.
3. **Technical linework:** subtle concentric arcs, circuit-like detail, ruled dividers, dotted fields, vector overlays.
4. **Data marks:** rules, bars, category blocks, visual comparisons; scaled according to quantitative values.
5. **Iconography:** restrained mono/duotone SVG symbols for business concepts; one icon system per project. Use custom dimensional icons only when their expressive role is earned.
6. **Photography:** authentic, licensed imagery where bank facilities, staff, geography or clients must be represented. No AI-generated factual photos presented as documentary evidence.

### 4.3 Corporate logo handling

The source PDF's blue-white radial emblem is AEB branding. **Do not reproduce it as our generic motif.** Create an original mark only if explicitly requested, or use the end user's supplied authorized corporate logo. Keep any neutral visual motif distinct from the reference's emblem and bank name.

## 5. Composition grammar: freedom with rhythm

Do **not** use rigid layouts like a standard three-KPI card grid on every page. Assign a purpose and visual gesture per slide, then author each composition in HTML/CSS/SVG.

Possible **roles**, not templates:

| Role | Composition ideas | Visual treatment |
| --- | --- | --- |
| Narrative cover | 1 big statement, hero sculpture on an edge | Dark atmospheric gradient |
| Chapter divider | deliberate blank space and large title | Strong dark-to-color field |
| Executive thesis | type-led with bold asymmetry | Split panel / geometric mask |
| Metric statement | single dominant financial figure and evidence | Deep navy/cobalt or light contrast |
| Strategy levers | 2–4 semantic blocks and custom icons | Controlled cards, meaningful geometry |
| Scenario comparison | side-by-side bars or diverging measures | Light surface, highly legible series |
| Financial bridge | waterfall or contribution graphic | Data-first; effect is in data hierarchy |
| Data board | 3–6 genuinely different analyses | Light or dark dashboard, no filler |
| Corporate comparison | segmented ranking / before-after | Graphic contrast and meaningful highlight |
| Decision / closing | concise choices + next action | Dark feature field, not another cover clone |

### Rhythm and variety

A 10–15 slide bank deck can include: 2–4 theatrical dark pages, 3–5 clean light analytics pages, 2–3 dark/mixed strategic or comparative pages, and one decisive ending. **Adjust to actual content:** source AEB uses many more dark pages, especially in finance sections. Avoid a forced fixed alternation.

Require variation in at least **four** axes over a deck: (1) density, (2) focal point placement, (3) data representation, (4) dark/light, (5) visual motif, (6) spatial structure. Repeating a page family should be a conscious editorial decision, not the default.

One strong effect per page usually has more impact than five weak ones. If a page is conceptually minimal it may have no icon or visual effect at all.

## 6. Financial charts & tables

- Charts are derived deterministically from validated data, never drawn from generative guesswork.
- Each series has a stable meaning/color across all pages; color differences must encode semantics.
- Never distort axes, hide negative values, fabricate dates or mix rubles/millions/billions.
- Use precise data-driven SVG/D3 marks, labels and sources; allow charts to be rasterized **only for delivery presentation**, never lose source data in the project.
- On dark analytic slides, chart surface `ink.850`, series `blue.500`, comparisons `cyan.450`, purple reserved for a distinct scenario. On light slides, a saturated cobalt series against a cool neutral field.
- Data tables can use bright cobalt on totals/group headers; do not paint entire dense tables neon. Present reasonable row heights, right-aligned numbers, tabular figures and clear unit declarations.
- Negative, forecast and historical values must remain explicitly distinguished. Do not use green/red alone as the only encoding.

## 7. Visual QA / Hallmark integration

Hallmark is a **required external diagnostic dependency**, not the source of truth for publication-specific art direction.

Critical conflict: standard Hallmark v2 has a **non-waivable ban on purple-to-blue gradients** (Floor gate 2a) and other rules tailored to web UI. This reference specifically uses dark blue + violet/magenta glow. Therefore **a plain unmodified Hallmark “all green” claim would be incorrect** for Crystal Cobalt.

Integration contract:

1. Pin and install a specific upstream Hallmark version/commit. Ensure its code is present before attempting a production build.
2. Run Hallmark source lint and rendered audit; save raw findings and detected exceptions.
3. Route *style-specific* conflicts (blue-violet gradient, legitimate all-caps chapter headings, dense financial tables) to a **versioned project adapter/exception policy**, never silently discard failures.
4. Maintain separate **hard safety/data/legibility gates**: cut-off text, overflow, contrast, missing assets, unsourced figures, unreadable final-size labels, bad chart axes, missing font, exporting without integrity test.
5. Render all pages; create a contact sheet; inspect high-risk slides at full size; perform one fix batch and verification; use a third visual pass if serious defects remain.
6. Optional independent subagent for large decks; do not create one subagent per slide. Use a fixed review budget and explicit `NOT_READY` if quality cannot be proven.

A Hallmark upstream FAIL intentionally overridden by the approved Crystal Cobalt style spec **must still appear in the QA log** with its category and justification. It is not a Hallmark PASS.

## 8. HTML/PDF/PPTX parity

- Author 16:9 pages as a single canonical HTML/CSS/SVG design; use the same frozen DOM and assets for export.
- PDF: full scene rendered in Chromium after fonts, images and charts are ready.
- Hybrid PPTX: rasterize exact final slide **with only editable text/figures masked out**, then add native editable text boxes with extracted geometry and exact font metrics.
- Non-editable objects (3D art, glow, waves, geometric masks, chart drawing, decorative icons) remain raster in PPTX. Editing values that drive a chart **does not** update the chart image; the project must regenerate the affected slide from source data.
- All font assets must be available and tested on the rendering target; matching may not be pixel-perfect across different PowerPoint implementations.
- Re-render PPTX on the defined target environment; compare against HTML/PDF with per-region text geometry tests, image diff, clipping tests and regression contact sheet. `READY` is prohibited when the visual thresholds are missed.
- Pixel-identical **paired PDF/PPTX visual renderings** can be achieved by generating the paired PDF from the verified PPTX renderer; that does *not* prove the PPTX is identical to the original Chromium composition or portable across all Office versions. Test both separately.

## 9. Asset and licensing rules

- User-provided brand logos may be included with authorization. No invented brand logos or fake insignias.
- Do not extract or redistribute the distinctive AEB logo or 3D artwork as reusable assets by default.
- Original glass object should be documented by source, author/model, prompt or scene file, license, approved use, version.
- For investment materials, never generate charts, values, infrastructure scenes, maps or employees as fictitious factual evidence.
- Embed or package only fonts with appropriate licensing. Do not distribute proprietary font files casually.

## 10. Definition of done — design specimen

The first evaluation specimen should contain **7–10 slides** with the *same audited financial inputs* as earlier design tests, including cover, executive statement, banking KPI, strategy drivers, scenario comparison, waterfall, dense table and decision close. Judge against the reference for **visual maturity**, not for copying exact content or proprietary imagery.

Acceptance criteria:

- The slides are visibly from one art-directed identity, but not the same template repeated.
- At least four distinct composition families and two different data-visualization families.
- Both luminous atmospheric pages and legible information-dense pages.
- Text/number source traceability is preserved.
- Color roles, typography, grid and financial units remain consistent.
- Original non-infringing hero sculpture (if present) has sufficient image quality.
- Hallmark inspection is executed and exception ledger is present; no false clean status.
- PPTX and PDF undergo end-to-end visual comparison on the specified renderer; no silent failures.

---

## Integration recommendation

Add this document as an optional `references/styles/crystal-cobalt-enterprise.md` to the editorial skill after approval. Add `tokens.json` as a design token preset and `gradients.css` as a *reference library*, not a mandatory stylesheet imported on all pages. Existing `Azure Iris` remains a separate theme until the user asks to switch.
