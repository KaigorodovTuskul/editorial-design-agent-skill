# Azure Iris Unified — editorial art-direction system

This is a **design grammar, not a catalog of prefabricated slides**. It favors exceptional typography, real financial evidence, spatial rhythm and a carefully composed graphic language. Three tonal modes coexist in one presentation. An art director can override any suggested color distribution if the source content calls for it.

## Three modes — one visual identity

- **Lighter:** clear powder-blue or icy surfaces; high readability and diagram precision. Good for analyses, quantitative exhibits and detailed annotation. Pure white is allowed as a small local canvas, never mandated as an entire repeated deck background.
- **Refined:** richer azure periwinkle fields and selected iris highlights. Use for pivots, comparisons, chapter transitions, interstitial visual statements and a key data visual.
- **Darker:** deep midnight blue / cobalt atmosphere with luminous blue and subtle iris highlights. Use on decisive statements, cover, and occasional evidence-led sections; not as an automatic fixed 1st-4th-last pattern.

Modes affect *color/light*, not composition. A Lighter page may be radical, a Darker page may be quiet and exceptionally typographic. See `config/design-presets.json` for semantic color tokens. Do not paint every slide with every palette token.

## Graphic expression — the palette must not become a cage

The model may author new compositions with SVG/CSS. Potential graphic mechanisms include:

| Device | When it earns its place | Construction hint |
| --- | --- | --- |
| Iridescent ribbon / silk fold | Visualizes a strategic change or transition | Layered SVG Bézier paths, precise linear/radial gradients, limited specular highlights |
| Cropped orbital geometry | Long-horizon or scenario relationships | Fine circular arcs, clipping mask, substantial off-canvas crop |
| Editorial cutout | Puts a number or headline in front of a supporting shape | CSS masks, shape-outside if necessary; ensure visible text remains native HTML |
| Tonal gradient planes | Adds dimensional hierarchy without noisy cards | 2–3 stops, large calm regions, muted end colors |
| Fine contour or vector field | Finance/treasury systems, networks or sensitivity | Coherent lines with custom phase/spacing, never random squiggles |
| Thin technical grid | Dense comparisons and data schematics | Consistent x/y coordinates and hairline strokes, low contrast |
| Alternating split page | Separates hypothesis from evidence | Offset 35/65 or 42/58 division; content-driven not universal |
| Typographic overprint | Hero numbers / title-led concept | Large type placed over static color/shape, not repeated baked text |
| Structured vignette | Key result emphasized by controlled light | Neutral edge falloff, no floating glow orb |
| Modular vertical score | Scenarios, risk ladders, capital allocation | Real aligned data marks; avoid symbolic fake graph quantities |
| Horizontal audit ledger | Executable plan, decision table or KPI decomposition | Rule-based row structure and sparse semantic pictograms |
| Stacked quantitative bridge | Financial profit reconciliation | Data-driven SVG coordinates, accurate joins and labels |
| Cropped photo with duotone | Real products/assets with approved imagery | Keep source photo provenance, mask/crop instead of AI fake evidence |
| Outline pictograms | Visual grouping of genuine concepts | Consistent stroke width and caps; icon belongs to actual meaning |
| Glass layer | Rare translucent overlay for a section move | Flat vector transparency, restraint; no stacked translucent cards |
| Single accent stroke | Large typographic chapter or conclusion | Purposeful diagonal/arc that directs reading order |

### Icons

Use an SVG icon set such as Lucide, Tabler or Phosphor with correct licenses, or author minimalist SVG pictograms. Choose a **consistent family per publication**, stroke weight and bounding box. Icons are content labels, not a way to make an ordinary KPI card feel premium. Typical categories include deposits, treasury/ALM, operations, risk, liquidity and time; the symbol should not imply a financial fact that is absent.

### Gradients and effects

Gradients are explicitly **allowed and encouraged when they improve the design**. Repeated dark-navy + blue-purple glow on every page is not art direction. Mix visual approaches such as a single iridescent ribbon on one hero slide, a pure typographic spread with a small color field, precise 2D chart geometry, and a cropped orbital/contour graphic on a chapter-ending page. Two adjacent spreads should not share the same gradient center and direction. Avoid non-printable filters, especially when they degrade PDF fidelity. Static gradients/SVG become the raster background in Hybrid PPTX and therefore require no native reconstruction.

Visual texture may include fine noise, engraved linework, halftone or subtle optical grid, but must be tested at 100% export resolution so it does not cause moiré or muddy charts. Never put a decorative effect underneath fine text that destroys contrast.

## A visual score before implementation

For a 7-slide investor deck, the plan must record at least:

- **Narrative role** and one sentence of factual content per slide.
- **Dominant silhouette**: hero type; diagonal division; oversized metric; integrated chart; full-bleed silhouette; comparison ledger; editorial photo; etc.
- **Color mode**: Lighter, Refined or Darker. Select adaptively, not at fixed slide numbers.
- **Visual family**: contours, ribbon, technical grid, gradients, typographic mask, pure-type, data-viz, photography, etc.
- **One reason** the chosen visual family supports that specific claim.
- **Editable map**: all textual/financial facts identified as independent HTML nodes, SVG decoration only in static background.

Require at least 5 visibly distinct dominant silhouettes in a 7-slide sample. Allow recurring brand motifs, but do not repeat one SVG path, glow, gradient direction, or identical KPI card arrangement on every page. Preserve the same typographic system, basic spacing grid, and financial chart color semantics.

## QA — design, not just code

Hallmark remains mandatory, but **website defaults are not editorial truth**. When its rules flag a legitimate, intentional editorial gradient or compact report annotation, record the gate ID and the visual rationale rather than blindly stripping the design. Correct real issues: broken contrast, invented figures, insufficient font sizes, off-page content and inconsistent layout. Use fresh-context critique or Playwright screenshots. On a representative contact sheet, check: the page shapes are genuinely different; surfaces do not alternate mechanically; one or two hero visuals are memorable; some pages are satisfyingly quiet; icons fit content; gradients do not dominate information; source data remains exact.

## Production constraints

Do not place real text *inside* SVG art or image generation outputs if the text must be editable in PPTX. Keep the visual underlay separate from HTML `data-editable="true"` text. Each authored text line is a native editable line in PPTX. Always render and visually compare source HTML/PDF against the PowerPoint round trip; large typography and advanced gradient treatments make this check more important, not less. Read `docs/hybrid-pptx.md` for limits.
