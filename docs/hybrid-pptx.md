# Hybrid PPTX — design freedom, native editability, paired-PDF fidelity

## Output contract

The author's HTML and CSS are the canonical **design source**, not a PDF parsed back into layout. Every 1920×1080 page produces:

1. A full HTML source screenshot and Chromium master PDF.
2. The same page without `[data-editable="true"]` text, captured at the **exact same CSS pixel size** (one native PPTX picture shape).
3. One native PowerPoint text shape per marked text line, using measured CSS coordinates, color, family, weight and size. No text baked underneath.
4. An actual PPTX roundtrip rendering and visual difference analysis.
5. **If similarity gates pass:** output PDF is regenerated from the same validated PPTX renderer; `publication-browser.pdf` remains for fidelity comparison. The final delivered PDF and PPTX thus agree under the tested native renderer.

## Authoring conventions that protect native fidelity

- The artwork can use arbitrary SVG/CSS, gradients or procedural backgrounds. Put those on **noneditable parent or sibling layers**.
- Keep `[data-editable="true"]` elements text-only, explicit, and ideally **one visual line per element**. Avoid nesting colored spans and CSS transforms inside an editable field.
- If several lines are required, prefer several text elements to a single auto-wrapping paragraph. Every field stays independently editable.
- Use a verified installed font family. Variable font axes (such as Geologica `CRSV=0`) can render differently in Chromium and PowerPoint; review. A fallback in Chromium and a *different* fallback in PowerPoint destroys fidelity.
- `PptxGenJS` uses enlarged text rectangles to prevent wrapping and **preserves left/right/center alignment anchors**. It does not use `fit:'shrink'` or auto-resize typography to hide errors.
- For charts, draw the bars/lines as static SVG but create independent HTML edit fields for every numeric or textual label which must be editable. A change to the editable value will **not** recalculate a static chart; re-export the source for consistency.

## Mandatory verification

```bash
node bin/editorial.mjs verify outputs/project
# Equivalent low-level:
python python/verify_pptx.py outputs/project/publication-editable.pptx \
  --out outputs/project --visual --strict --pair-pdf
```

The test checks each slide has one background picture and native text shapes. LibreOffice renders PPTX at the exact source pixel dimensions. The verifier reports full-page, text-region and background mean absolute RGB error and saves exact PNG renders and contrast-enhanced diffs. Defaults are intentionally conservative *quality thresholds*, **not** mathematically exact equality. A severely reflowed slide may need manual visual inspection even if aggregate numbers are low, so the agent must review problem slides at full resolution.

## Technical limitation

The same PPTX can render differently on other machines or Microsoft Office versions because of installed fonts, shaping and line-height differences. It is **not possible** to guarantee mathematically pixel-identical native editable glyphs across arbitrary renderers. A background with fully baked visible text plus transparent, technically editable duplicates would be visually deceptive; edited values would not replace the text underneath. This workflow does not use that workaround.
