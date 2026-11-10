# Quality gates — actual evidence, bounded token cost

**Creation is not approval.** Block professional delivery until evidence exists.

| Stage | Required checks | Cost control |
|---|---|---|
| Content preflight | Source provenance; periods/units; numerical correctness and approval | Deterministic data checks before model art direction |
| Pre-render | Correct font selection, 1920×1080 size, text-only editable markers, no scripts/remotes | CLI/static checks, every slide |
| Hallmark | True pinned Hallmark `sloplint` with rendered audit and source methodology | One batched invocation, not per edit |
| Playwright | Geometry, clipped text, browser screenshot, contact sheet and clean Chromium PDF | Automated per slide |
| Visual cycle 1 | Model/human critique of contact sheet, cover, dense chart and flagged slides | Inspect as batch; fix as batch |
| Visual cycle 2 | Rerender all changed pages, verify pacing and defects; optional fresh critic | Must run; conditional third only P0/P1 |
| Hybrid PPTX | One background + editable fields; reopen, compare to HTML goldens, preserve diff PNG | Deterministic strict gate |
| Paired PDF | Generate final PDF from verified PPTX renderer; preserve Chromium master | The two handed-off outputs have one renderer |
| Release | Real Hallmark pass, approved fonts, 2 actual reviews, PPTX parity, verified data and human signoff | State defaults to NOT_READY |

Do not invent visual critiques. `editorial review` records actual reviewer ID, inspected slide numbers, findings and contact-sheet hash. In a harness with real subagents, a single independent critique may be used for a large deck. If no subagent or `/goal` mode exists, do not claim to use them. Avoid repeated oversized screenshot calls; a contact sheet plus 2–4 selected full-res slides usually suffices.

PPTX parity statistics are measured, not aesthetic scores. They must be accompanied by human/model inspection of flagged visual differences: aggregate image error can miss a locally severe text wrap. Any unresolved critical visual discrepancy fails professional release regardless of numerical averages. No programmatic metric can certify an investor-ready publication by itself.
