# Crystal Cobalt Enterprise — original reusable seeds

These assets are **usable source art**, not screenshots of presentation slides. They are intended to be inserted into user-authored editorial HTML/CSS layouts. The skill remains free-form: the assets do not define page templates.

## Contents

| Folder | Assets | Purpose |
| --- | --- | --- |
| `backgrounds/` | 5 full-frame 1920×1080 SVGs | Atmospheric covers, subdued analytics, dark charts, strategic splits |
| `objects/` | 3 transparent original optical SVGs | Occasional focal art, e.g. glass loop, prism, dimensional arrow |
| `elements/` | 2 technical vector fields | Contour lines and orbital details, crop/overlay as needed |
| `icons/` | 8 consistent vector pictograms | Bank balance, treasury, growth, operations, risk, liquidity, clients, digital |
| `tokens.json` | 1 style token set | Four atmospheric/analytical/data/mixed modes |
| `gradients.css` | 1 design-reference stylesheet | Gradient recipes to adapt, not mandatory page overlays |
| `manifest.json` | Provenance and inventory | Asset rights and content restrictions |
| `preview.png` | Visual contact sheet | Previews; this raster is **not** a slide background |

These images are **original SVG illustrations created specifically for this skill**. They are not the Almazergienbank trademark, not the original glass artwork, and not the radial mark appearing in the 55-page reference document. The 3D-style artwork is a vector approximation with prismatic shading, **not** a physically ray-traced transparent glass model. Use Blender or optional image generation for photorealistic hero sculptures if the visual brief requires that level of material realism. Never present these assets as approved bank logos.

## CLI

```bash
node bin/editorial.mjs themes
node bin/editorial.mjs seeds crystal-cobalt-enterprise
node bin/editorial.mjs seed examples/crystal-cobalt-showcase --theme crystal-cobalt-enterprise
npm run check:seeds
npm run preview:seeds
```

When the user selects this theme, `build-html` automatically includes the local assets in `OUTPUT/assets/seeds/crystal-cobalt/`; the `seed` command installs them into a source project for offline HTML preview as well.

```html
<img class="decorative" alt="" src="../assets/seeds/crystal-cobalt/objects/optical-loop.svg">
```

For editable PPTX, **never bake actual slide text into an SVG seed**. Place native HTML `data-editable="true"` text separately above the static visual layers. Chrome embeds local SVG files into its rendering copy at runtime; the original SVGs remain independently editable in the repository.

## Art-direction guidance

- A single dramatic optical object on a cover works better than one on every page.
- Mix dark atmospheric, dark data, light analytical and asymmetric split layouts according to meaning.
- Pictograms are **semantic**, not decorations for every metric.
- No one asset should become mandatory. The agent may invent new SVG art whenever a better content-specific composition requires it.
- Do not reuse the client's corporate symbols or unique glass artwork from the reference deck without separate permission.

For the full specification: `references/styles/crystal-cobalt-enterprise.md`.
