# india-compliance-audit

Hybrid compliance auditing tool for Indian software projects. Combines **deterministic pattern detection** with **AI reasoning** to flag technical compliance gaps against Indian regulations.

## Trigger

Invoked by the `/india-audit` command.

## Core Function

Audits codebases against:
- DPDP Act 2023 + DPDP Rules 2025 (Data Protection)
- IT Act 2000 (Security / cybercrime)
- CERT-In Directions 2022 (Incident reporting / logging)
- RBI Payment Data directives (Localization, KYC)
- SPDI Rules 2011 (Sensitive personal data)
- Accessibility — WCAG 2.1 AA, IS 17802, RPwD Act §40
- Health — ABDM/NMC/telemedicine rules
- E-commerce & Consumer Protection Rules
- Aadhaar Act 2016 / UIDAI regulations
- Children's data rules (DPDP §9)
- Intermediary Rules 2021 (IT Rules)
- Business compliance (GST, ROC, IEC)
- IS 17428 / ISO 27001 standards (informational)

## Workflow

**Step 1 — Project root**
Use the path argument if provided, else the repo root.

**Step 2 — App-type detection**
Read `references/app-type-detection.md`. Identify all matching profiles:
`generic` (always), `ecommerce`, `fintech`, `health`, `ugc`, `public-website`, `erp`, `children`, `aadhaar`.

**Step 3 — Pack selection**
Read `rules/_index.md`. Select packs matching the detected profiles.
If a specific pack was named in the command argument, load only that pack.

**Step 4 — Run deterministic detectors**
Execute:
```bash
node <plugin-dir>/detectors/run-detectors.mjs <project-root> --json
```
If Node.js is unavailable, note it and proceed with AI-only analysis.

**Step 5 — AI codebase analysis**
For each obligation in the selected packs:
- Read the `evidence_hints` field
- Glob/read the relevant files (routes, models, config, templates, policy docs)
- Determine status: `ok` | `gap` | `partial` | `not-auto-verifiable`
- Cite `file:line` for every finding
- Do not invent obligations — only report what is in the loaded packs

**Step 6 — Merge findings**
Combine detector JSON with AI findings. Deduplicate by obligation ID.

**Step 7 — Generate report**
Write `india-compliance-report.md` to the audited project root.
Follow the template in `references/report-format.md` exactly.
Reference remediation IDs from `references/remediation-patterns.md`.

**Step 8 — Summarise to user**
- Overall posture
- Critical/high/medium/low counts
- Top 3 urgent issues
- Path to report
- NOT LEGAL ADVICE disclaimer

## Key Rules

- **Never invent obligations** — cite actual law from loaded packs only.
- **Conservative confidence** — absence of violation ≠ proof of compliance. Mark unknowns as `not-auto-verifiable`.
- **Specific evidence** — cite `file:line`; avoid vague assertions. "File not found" is valid evidence.
- **Phased enforcement** — flag DPDP Phase 3 obligations (~May 2027) as high priority with phase label.
- **Official sources** — meity.gov.in, cert-in.org.in, rbi.org.in, indiacode.nic.in, uidai.gov.in.

---

**Critical Disclaimer:** This tool is **NOT LEGAL ADVICE**. It flags technical signals only. Users must verify findings with qualified legal counsel and official sources before making compliance decisions.
