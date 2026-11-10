# Azure Iris Unified — expressive editorial palette v0.2.2

This supersedes `palette-v0.2.1.md` as the **default** for new builds. The older Azure / Iris Editorial profile remains available for reproducibility.

### Mode variants

| Mode | Background | Foreground | Primary accent | Accent support | Iris |
| --- | --- | --- | --- | --- | --- |
| Lighter | `#EFF5FF` | `#10264C` | `#2876ED` | `#B4C9F4` | `#B3A8EB` |
| Refined | `#DCE8FF` | `#13396E` | `#246AF0` | `#79B8F6` | `#8172D4` |
| Darker | `#102F68` | `#F8FAFF` | `#6BD0FC` | `#3D85E7` | `#A79AF3` |

The modes do **not** correspond to specific slide positions. They are adaptable editorial lighting states. A visually striking cover can be Lighter; a dense technical page can be Darker if its readability remains strong. Avoid automatic dark-light-dark stripes and copy-paste gradient backgrounds. The full design vocabulary and gradient/icon policy are in [`art-direction.md`](art-direction.md).

### Expressive is not decorative overload

A strong editorial design may use asymmetric gradients, fine contour fields, icon-led comparison, vector ribbons, clipped tonal panes, optical grid or an intentional 3D-like visual fold. Choose one primary motif for a slide, not all motifs simultaneously. A pure typographic page provides a counterweight to richly illustrated pages.

### HTML/PDF ↔ Hybrid PPTX

Keep effects in CSS/SVG static artwork behind `data-editable="true"` HTML text. This ensures gradients and icons transfer without reconstructing native PowerPoint objects. Verification requires an actual Office roundtrip and side-by-side inspection; text rendering is platform-dependent. Avoid effects that make editable text illegible, including blurred chromatic blobs behind small annotations.
