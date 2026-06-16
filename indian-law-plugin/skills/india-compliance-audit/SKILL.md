---
name: india-compliance-audit
description: Hybrid AI + deterministic compliance audit for Indian software — DPDP Act, IT Act, CERT-In, RBI, Aadhaar, accessibility, and sector-specific rules. NOT legal advice.
---

# india-compliance-audit

Hybrid compliance auditing tool for Indian software projects. Combines **deterministic pattern detection** with **AI reasoning** to flag technical compliance gaps against Indian regulations.

## Used by

The `/india-audit` command. Follow this SKILL.md as the authoritative workflow.

## Laws covered

- DPDP Act 2023 + DPDP Rules 2025 (Data Protection)
- IT Act 2000 (Security / cybercrime)
- CERT-In Directions 2022 (Incident reporting / logging)
- RBI Payment Data directives (Localization, KYC)
- SPDI Rules 2011 (Sensitive personal data)
- Accessibility — WCAG 2.1 AA, IS 17802, RPwD Act §40
- Health — ABDM/NMC/telemedicine rules
- E-commerce & Consumer Protection Rules 2020
- Aadhaar Act 2016 / UIDAI regulations
- Children's data rules (DPDP Act §9)
- Intermediary Rules 2021 (IT Rules)
- Business compliance — GST, ROC, IEC (informational only)
- IS 17428 / ISO 27001 standards (informational only)

---

## Workflow

### Step 1 — Locate project root

Use the path argument if given (`/india-audit all /path`), otherwise use the repository root.

### Step 2 — Detect app type

Read this skill's `references/app-type-detection.md`. Inspect `package.json` / `requirements.txt` / `build.gradle` / root build files, then scan route files and config for the keyword signals listed there.

Assign **all** matching profiles — an app can match more than one:

| Profile | Always include |
|---|---|
| `generic` | Yes — always |
| `ecommerce` | Cart, orders, checkout signals |
| `fintech` | Payment, UPI, loan, wallet signals |
| `health` | Patient, doctor, prescription, ABDM signals |
| `ugc` | Post, comment, feed, upload signals |
| `public-website` | Static site, no auth, government/NGO |
| `erp` | Employee, payroll, HR, ledger signals |
| `children` | School, student, edtech, age-check signals |
| `aadhaar` | UIDAI SDK, eKYC, aadhaar env vars |

**Note on `erp`:** there is no dedicated ERP pack. ERP apps use the always-included packs (dpdp-act, it-act, cert-in, security-safeguards, spdi-rules, accessibility, business-tax, standards).

### Step 3 — Select and read law packs

Read this skill's `rules/_index.md` to get the applicability matrix. For each profile detected in Step 2, identify which pack files to include.

Then **read each selected pack file** from this skill's `rules/` directory. Load the full content of each `rules/<pack>.md` — the obligations, evidence_hints, severity, and citations are all in those files.

**Pack behaviour by type:**

| Type | How to handle |
|---|---|
| Code-auditable packs | Run AI analysis (Step 5) + detectors (Step 4) |
| `✓ info` packs (`business-tax`, `standards`) | Skip code analysis; add all obligations directly to the Manual Review checklist in the report |

If the `/india-audit` argument names a specific pack (e.g. `dpdp`), load only that pack's `rules/<pack>.md` and skip the rest.

### Step 4 — Run deterministic detectors

Execute the scanner from the **project root**:

```bash
node indian-law-plugin/detectors/run-detectors.mjs <project-root> --json
```

- Capture stdout as JSON. The schema is `{ projectRoot, findings: [...] }`.
- If Node.js is unavailable (e.g. Python-only environment), note this in the report and proceed with AI-only analysis.
- The detector covers: India PII (Aadhaar/Verhoeff, PAN, IFSC, UPI VPA), cloud data-residency signals, hardcoded secrets, SQL injection patterns, accessibility violations in markup, and missing policy artifact files.

### Step 5 — AI codebase analysis

For each obligation loaded in Step 3 (code-auditable packs only):

1. Read the obligation's `evidence_hints` field — these tell you exactly which files, routes, model fields, or patterns to look for.
2. Glob and read the relevant files in the audited project (routes, models, middleware, config, templates, HTML/JSX, CSS, policy docs, IaC).
3. Determine status for each obligation:
   - `ok` — clear evidence of compliance found at a specific location
   - `gap` — evidence clearly absent or pattern of non-compliance found
   - `partial` — some controls present but incomplete
   - `not-auto-verifiable` — obligation exists but cannot be confirmed from code alone (add to manual review checklist)
4. Cite `file:line` for every `ok`, `gap`, or `partial` finding. For missing files, cite "file not found in codebase".
5. Do not invent obligations — only report what is in the loaded pack files.

**Priority scan targets by profile:**

| Profile | Key files to read |
|---|---|
| All | `package.json`, env files, `README`, privacy policy, terms, routes/controllers |
| fintech | Payment gateway config, KYC flow, loan logic, `AWS_REGION` / cloud config |
| health | ABDM SDK config, patient model, consent flow, prescription route |
| aadhaar | UIDAI SDK config, Aadhaar entry form, `UIDAI_ENV` env var, signing config |
| ugc | Moderation queue, content flagging, terms of service, grievance handler |
| children | Age gate, DOB field, analytics SDK calls, ad network config |
| ecommerce | Checkout flow, seller disclosure, review system, cancellation flow |

### Step 6 — Merge findings

Combine the detector JSON from Step 4 with the AI findings from Step 5:
- Deduplicate by obligation ID — if both detector and AI flag the same obligation, keep the finding with the most specific evidence.
- Detector findings for `not-auto-verifiable` obligations should remain as `not-auto-verifiable` unless AI analysis upgrades them.

### Step 7 — Generate report

**Always write this file**, even if there are zero findings.

Write `india-compliance-report.md` to the root of the **audited project** (not the plugin directory).

Follow the template in this skill's `references/report-format.md` exactly. Reference remediation IDs from `references/remediation-patterns.md` in every finding.

### Step 8 — Summarise to user

Reply with:
- Path where `india-compliance-report.md` was written
- Overall posture (compliant / partial / gap)
- Count of findings by severity: critical / high / medium / low
- Top 3 most urgent issues with obligation IDs
- **Prominent disclaimer: "NOT LEGAL ADVICE — consult a qualified legal professional before acting on these findings."**

---

## Key rules (do not skip)

- **Never invent obligations** — cite actual law only from the loaded pack files.
- **Conservative confidence** — absence of a violation is not proof of compliance. Mark unknowns `not-auto-verifiable`.
- **Specific evidence** — cite `file:line` for every finding. "File not found" is valid evidence.
- **Phased enforcement** — flag DPDP Phase 3 obligations (~May 2027) with their phase label so developers can prioritise.
- **Info packs skip code scan** — `business-tax.md` and `standards.md` obligations go straight to the manual review checklist; do not scan code for them.
- **Official sources** — meity.gov.in, cert-in.org.in, rbi.org.in, indiacode.nic.in, uidai.gov.in, abdm.gov.in.

---

> **NOT LEGAL ADVICE.** This skill flags technical signals against published Indian law requirements only. It does not constitute legal advice and cannot account for your specific business context. Always verify findings with qualified legal counsel and official government sources before making compliance decisions.
