# Hallmark installation

Hallmark is a **required external dependency** for a release-quality build.
Run `npm run setup:hallmark` (requires git and network access). The installer checks out
exactly the version pinned in `config/dependencies.json`.
Do not vendor or modify Hallmark's files in this repository.
Do not treat missing Hallmark as an audit pass.
