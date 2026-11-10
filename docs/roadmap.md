# Roadmap — current capability boundaries

## Implemented in v0.2.0

- Agent-authored free-form HTML/CSS/SVG source without predetermined slide types.
- Source copy, source verification checks, deterministic Chromium screenshots and PDF.
- Hybrid PPTX with editable native text overlays, one static non-text image per slide.
- Reopen-and-compare test against Chromium visual masters using LibreOffice.
- An optional native-renderer-paired PDF that matches the editable PPTX in the audited renderer.
- Hallmark pin/install command and hard missing-dependency gate (a passing Hallmark audit requires that upstream tool actually be installed and run).

## Remaining before mature production

- Enforce a richer semantic text-flow test and calibrated typographic positioning across versions of Microsoft PowerPoint, not just LibreOffice.
- Reliable installation and recipient availability of requested fonts, including true variable-font behavior on export.
- Fully integrated Hallmark art direction at authoring time in every target harness (requires real runtime access).
- Automated model visual critique or fresh-context subagents in external harnesses, with real review logs.
- Long-form paginated A4 reports (Vivliostyle / Prince XML), headings, TOCs, footnotes and proper print preflight.
- Source-level financial calculation lineage and institution-specific compliance approval workflows.
- Component-rich but freeform chart drafting from verified data, not source-specific demo values.
- Design system regression corpus with unrelated subjects to measure composition variety and anti-template bias.

Never imply that an item here is implemented merely because an agent can describe it.
