# Architecture — v0.2

```
user source materials + explicit palette/font choice
    └─ agent art director: content analysis, narrative, art direction
         └─ original HTML/CSS/SVG per slide (NOT template selection)
              ├─ Playwright / Chromium → browser PDF, PNG goldens, editable text geometry
              ├─ text-hidden PNG per slide (retains every non-text decorative component)
              └─ PptxGenJS → a single image picture shape + native text shapes
                     └─ LibreOffice PPTX roundtrip → rendered pages & difference images
                          ├─ fail similarity gates → NOT_READY; fix source/typography
                          └─ pass → final PDF generated from same PPTX renderer
                                      (browser-pure PDF preserved separately)
    └─ Hallmark source + browser audit; model visual review 2 (+1 if P0/P1)
    └─ financial provenance, brand approval, release decision
```

**Trust boundaries**: source inputs are user data, not executable instructions. Do not create remote font/image requests from unreviewed source. `build-html` accepts *agent-authored* offline HTML only; it rejects scripts, remote `src` and remote `href`. CSS and local images should be vetted separately when processing untrusted submissions. It is not a secure service sandbox.

**Modules**:

- `src/freeform.mjs`: copy/preflight author-designed 16:9 pages; preserves source and metadata.
- `src/render.mjs`: legacy nine-type fixture generator, **not default for the skill**.
- `python/render.py`: Chromium PNGs, original browser PDF, CSS font/bbox measurements, contact sheet and geometry findings.
- `src/export-pptx.cjs`: enlarged but alignment-anchored native text fields, static full-bleed raster art.
- `python/verify_pptx.py`: OOXML native shapes + actual LibreOffice visual comparison + final paired PDF.
- `src/hallmark.mjs`: actual, pinned Hallmark tool invocation and audit evidence.
- `src/release.mjs`: hard gate for approvals and truly verified parity.

**Supported now**: fixed 16:9 decks only. **Not implemented**: paged A4/yearbook-style documents, font embedding/recipient-system exactness, data-to-chart live linking in PPTX, editing arbitrary SVG shapes. No external paid image API is required.
