# Hallmark — mandatory, pinned external design dependency

Hallmark is **not** this skill's layout engine. It is an audited design reference and rendered anti-slop linter. A model authoring a deck must consult the installed `vendor/hallmark/skills/hallmark/SKILL.md` and relevant `references/gates.md`, `craft.md`, `layout.md` and `data-viz.md` before creative work, not just run one lint command after building.

Install the exact SHA from `config/dependencies.json` with `npm run setup:hallmark`. Review upstream source and runtime hooks before using in unattended environments. Run via `src/hallmark.mjs`:

```bash
node vendor/hallmark/skills/hallmark/scripts/sloplint.mjs \
  output/slides/*.html --genre editorial --render --json
```

The project records `hallmark-report.json`, including the binary's real exit status, stdout/stderr and revision. A missing Hallmark or missing browser-tier execution must not be represented as a successful audit.

Hallmark is website-oriented. Its exact mobile-first page constraints and marketing calls-to-action are not automatically relevant to fixed 16:9 publications. Apply technical/factual gates as hard rules; surface aesthetic reflexes as an independent reviewer. Record published exceptions with specific rule IDs and reasons. **The selected brand/palette and source facts take priority over auto-dealt Hallmark themes.** Do not use Hallmark to force an unrelated website structure on a financial report.

The model runs the separate Playwright geometry/contact-sheet pipeline even when Hallmark has already produced screenshots. To reduce token waste, inspect a single contact sheet plus only flagged full-resolution slides; do not re-run Hallmark for every CSS edit.

## Crystal Cobalt style conflicts (must not be concealed)

The required Crystal Cobalt blue-violet-magenta atmospheric gradients intentionally conflict with upstream Hallmark **Floor 2a**. Hallmark's raw output is saved unchanged; an explicit published style exception is recorded in `references/quality/crystal-cobalt-hallmark.md`, and the separate editorial blocking checks remain in force. **Do not claim upstream Hallmark PASS if it fails.** Read the adapter document before interpreting the result; accessibility, missing data, clipped text and bad geometry cannot be waived merely as style.
