# Agent Installation and Usage

This is a portable Agent Skill plus an executable engine. The skill file uses standard YAML frontmatter and relative document links. Install **the entire repository directory**, not only a detached SKILL.md, so the agent can invoke the scripts and read its references.

## Codex CLI

After cloning, either run the agent from the repository root and reference `SKILL.md`, or place a full local repository checkout at `.agents/skills/editorial-design` in your workspace. The agent should recognize the `editorial-design` skill and follow the startup color/font selection. Run the engine from its own repository root.

## OpenCode

Place the full checkout under `.opencode/skills/editorial-design` in a project or the user's OpenCode skills directory, depending on your OpenCode configuration. Make sure process execution, Python, Chromium and access to the intended input files are enabled. Use explicit skill invocation if auto-discovery does not trigger.

## Other compatible harnesses

Claude Code, DeepSeek Harness, Hermes and other tools supporting Agent Skills can consume the root SKILL.md when registered in the harness's documented skills directory. Do not assume `/goal` or subagents exist in the running harness; if absent, use ordinary in-session QA with Playwright.

## Installation requirements

1. Node, Python, Chromium and the declared font installed.
2. Python dependencies and `npm install` completed.
3. `npm run setup:hallmark` completed at the pinned revision.
4. User selected theme/font or explicitly requested unattended defaults.
5. The agent is actually able to inspect screenshots or delegate to an available reviewer.

The README demo is deliberately illustrative; the example cannot be released to investors. Production release is blocked by factual approval, Hallmark status, fonts and visual evidence until genuinely satisfied.
