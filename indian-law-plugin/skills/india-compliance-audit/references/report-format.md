# Report Format Reference

## Output file

Write findings to `india-compliance-report.md` in the **root of the audited project**.

## Severity model

| Severity | Meaning | Examples |
|---|---|---|
| `critical` | Active legal obligation; breach can trigger immediate penalty | DPDP breach notification, CERT-In 6h reporting, Aadhaar raw storage |
| `high` | Core compliance requirement; gap is likely discovered in any audit | Consent, data-deletion right, encryption at rest, privacy policy |
| `medium` | Important but context-dependent or phased | Cross-border disclosure, grievance SLA, accessibility |
| `low` | Best-practice / voluntary / future phase | IS 17428, ISO 27001, e-invoicing when under threshold |
| `info` | Informational — action needed outside code | GST registration threshold, DPO appointment, insurance |

## Posture level per pack

| Level | Meaning |
|---|---|
| `compliant` | All checked obligations satisfied |
| `partial` | Some obligations met, gaps present |
| `gap` | Major obligations missing |
| `not-auto-verifiable` | Obligations exist but cannot be confirmed from code (manual review needed) |

## Report template

```markdown
# India Compliance Audit Report

> **DISCLAIMER — NOT LEGAL ADVICE.** This report identifies technical signals against
> published Indian law requirements. It does not constitute legal advice, is not
> exhaustive, and cannot account for your specific business context. Consult a qualified
> legal professional for compliance decisions. Law requirements verified against official
> sources as of the date noted; verify current status at meity.gov.in, cert-in.org.in,
> rbi.org.in, indiacode.nic.in.

**Audited project:** `<path>`
**Detected profiles:** `<generic | ecommerce | fintech | ...>`
**Packs applied:** `<list>`
**Audit date:** `<YYYY-MM-DD>`
**Plugin version:** 0.1.0

---

## Posture Summary

| Law Pack | Posture | Critical | High | Medium | Low | Info |
|---|---|---|---|---|---|---|
| DPDP Act 2023 | gap | 1 | 3 | 1 | 0 | 0 |
| CERT-In 2022 | partial | 0 | 1 | 2 | 0 | 0 |
| ... | | | | | | |

**Overall posture:** gap / partial / compliant
*Note: "compliant" means no code-level gaps were detected; manual/legal review items remain.*

---

## Key Deadlines

| Date | Event |
|---|---|
| Nov 13, 2026 | DPDP Phase 2: Consent Manager Framework operational |
| ~May 14, 2027 | DPDP Phase 3: Full substantive obligations — NO grace period (verify current status at meity.gov.in) |

---

## Findings

### [PACK-NAME] — [Posture]

#### [SEVERITY] OBL-XX-NN — [Obligation title]

- **Status:** gap / partial / ok / not-auto-verifiable
- **Evidence:** `src/auth/signup.js:45` (pre-ticked consent checkbox found) — OR — privacy policy file not found in codebase
- **Law:** [Regulation] §[section] — [citation URL]
- **What is required:** [plain-English obligation]
- **Remediation:** [concrete fix — see remediation-patterns.md for reusable snippets]
- **Confidence:** high / medium / low

---

## Manual / Legal Review Required

These items cannot be verified from the codebase. They require human action:

- [ ] **DPO appointed** (if Significant Data Fiduciary) — DPDP Act §10
- [ ] **Grievance officer named in T&Cs** — IT Rules 2021 r.4
- [ ] **CERT-In incident report template prepared** — CERT-In Directions 2022
- [ ] **GST registration** (if turnover > ₹20 lakh) — CGST Act
- [ ] **Consent Manager integration** — DPDP Rules 2025 r.9 (operational Nov 2026)
- [ ] **Cyber/E&O insurance** — recommended given ₹250 crore DPDP penalty exposure
- [ ] **Cloud provider KYC** — CERT-In Directions 2022
- [ ] **Legal review of privacy policy** — ensure DPDP Rules 2025 plain-language requirement met
- [ ] **Annual penetration test** — DPDP Act §8 reasonable security
- ... (add any pack-specific items)

---

## Detector Output

*Raw findings from deterministic scan (India PII, data residency, policy artifacts,
security patterns, accessibility patterns):*

```json
{ /* paste detector JSON here */ }
```
```

## Confidence notes for AI

- Mark findings `confidence: high` only when the evidence is clear (file found / missing,
  pattern matched, dependency present).
- Mark `confidence: medium` when you're inferring from indirect signals (e.g., no deletion
  route in routes file, but could be in another file).
- Mark `confidence: low` / `not-auto-verifiable` when you can't confirm from the codebase.
- Never invent a finding. A missing signal means "not found" — note it as such.
