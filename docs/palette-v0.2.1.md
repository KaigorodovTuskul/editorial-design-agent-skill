# Azure / Iris Editorial — Color direction v0.2.1

## Intent

A more expressive but still institutional identity: dominant blue-tinted papers, saturated cobalt and sky blue, a restrained iris highlight, no generic blue-purple gradients. Design is predominantly **chromatic** rather than stark white, with scene-by-scene light/dark contrast.

| Role | Color |
|---|---|
| Main blue-tinted paper | `#DCEFFB` |
| Sky-blue field | `#B7DCF9` |
| Periwinkle field | `#D5DDFB` |
| Institutional cobalt | `#3157B6` |
| Deep azure | `#2457BD` |
| Iris closing scene | `#5856B8` |
| Typography on light | `#163F89` |
| Typography on dark | `#F7FBFF` |

Across a 7-page demonstration: two saturated dark/chromatic scenes (cover + editorial ledger) plus one saturated iris conclusion, four lighter but distinctly colored pages, no plain white canvases. Do not make pages darker merely to add visual richness. Prioritize contrast, variety and restraint.

## Layout rules

- Color can occupy 100% of the canvas; do not treat white as the default ground.
- Use solid color planes and thin SVG contour systems instead of generic purple-to-blue gradients.
- The blue/iris palette is not a requirement to use every accent on every page.
- Maintain 4.5:1 text contrast for body and important financial labels; verify with an actual contrast checker if building a different slide.
- Preserve `data-editable` text geometry for the hybrid PDF/PPTX pipeline.

## Reproducibility

This package includes only open fonts available in the local render environment for the demo. Users must install Geologica Roman and independently validate native PowerPoint font fidelity; do not redistribute font binaries.
