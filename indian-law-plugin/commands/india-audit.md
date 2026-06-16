---
description: Audit this codebase against Indian laws — DPDP Act, IT Act, CERT-In, RBI, accessibility, sector rules. NOT legal advice.
---

# /india-audit

Run a compliance audit of the current codebase against applicable Indian laws and regulations.

## Usage

```
/india-audit              # Full audit (all applicable packs)
/india-audit dpdp         # DPDP Act only
/india-audit cert-in      # CERT-In Directions only
/india-audit rbi          # RBI/fintech rules only
/india-audit all /path    # Audit a specific directory
```

## What this command does

Invoke the `india-compliance-audit` skill. Follow its SKILL.md exactly:

1. **Identify project root** — use the argument path if given, else the repo root.

2. **Detect app type** — read `references/app-type-detection.md`. Classify into profiles:
   `generic`, `ecommerce`, `fintech`, `health`, `ugc`, `public-website`, `erp`, `children`, `aadhaar`.
   Multiple profiles are allowed.

3. **Select law packs** — consult `rules/_index.md` applicability matrix. If a specific pack is named
   in the argument (e.g. `dpdp`), load only that pack. Otherwise load all applicable packs.

4. **Run deterministic detectors** — execute:
   ```
   node indian-law-plugin/detectors/run-detectors.mjs <project-root> --json
   ```
   Capture the JSON output. If Node is not available, note it and proceed with AI-only analysis.

5. **AI analysis** — for each obligation in the selected packs, inspect the codebase:
   - Glob for route files, model files, config files, templates, policy documents
   - Look for the `evidence_hints` listed in the obligation
   - Mark each obligation: `ok`, `gap`, `partial`, or `not-auto-verifiable`
   - Cite file:line numbers for every finding

6. **Merge findings** — combine detector output with AI findings. Deduplicate.

7. **Generate report** — write `india-compliance-report.md` to the audited project root.
   Follow the template in `references/report-format.md` exactly.
   Use remediation IDs from `references/remediation-patterns.md`.

8. **Summarise** — tell the user:
   - Overall posture (compliant / partial / gap)
   - Count of critical/high/medium/low findings
   - Top 3 most urgent issues
   - That the report was written to `india-compliance-report.md`
   - Reminder: NOT legal advice

## Critical rules

- **Never invent obligations** — only cite obligations present in the loaded rule packs.
- **Conservative confidence** — absence of a violation is not proof of compliance; mark uncertain
  items as `not-auto-verifiable` and add them to the manual review checklist.
- **Specific evidence** — always cite file:line or "file not found". Never say "appears to comply"
  without evidence.
- **NOT LEGAL ADVICE** — always include the disclaimer in the report and in your summary.
- **Official sources** — meity.gov.in, cert-in.org.in, rbi.org.in, indiacode.nic.in.
