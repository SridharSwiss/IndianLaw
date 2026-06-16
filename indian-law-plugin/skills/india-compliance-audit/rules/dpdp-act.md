---
id: dpdp-act
title: Digital Personal Data Protection Act, 2023 + DPDP Rules, 2025
applies_to: [all]
status: "Phase 2 ACTIVE (Consent Manager Framework, Nov 2026); Phase 3 full obligations ~May 14 2027 — NO grace period. Always verify at meity.gov.in."
penalty: "Up to ₹250 crore per breach category"
last_verified: "2026-06-11"
sources:
  - https://www.meity.gov.in/content/digital-personal-data-protection-act-2023
  - https://www.indiacode.nic.in/handle/123456789/22037
  - https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa
---

## DPDP Act 2023 — Obligations

Every app that collects, stores, or processes personal data about Indian residents is a **Data Fiduciary** and must comply. "Personal data" means any information that can identify a natural person (name, email, phone, IP address, device ID, location, etc.).

### Phase timeline (verify current dates at meity.gov.in before citing)

| Phase | Effective Date | Status (as of Jun 2026) | What goes live |
|---|---|---|---|
| **Phase 1** | Nov 14, 2025 | ACTIVE | Data Protection Board of India (DPBI) established; definitions; administrative provisions |
| **Phase 2** | Nov 13, 2026 | ACTIVE | Consent Manager Framework operational; all Data Fiduciaries must integrate with a registered Consent Manager |
| **Phase 3** | ~May 14, 2027 | COMING — no grace period | Full substantive obligations: consent & notice, data principal rights (access/correction/erasure/grievance), breach notification (72h), children's data rules, significant data fiduciary requirements |

**Key facts:**
- DPDP Rules 2025 were notified by MeitY and set out the detailed procedural requirements.
- The Data Protection Board of India (DPBI) is the enforcement authority.
- Phase 3 has **no grace period** — non-compliance on day 1 of enforcement attracts full penalties.
- Penalty schedule: ₹250 crore for breach of data principal rights or security obligations; ₹200 crore for children's data violations; ₹50 crore for failure to notify a breach; ₹10,000 for minor procedural lapses.

---

### OBL-DPDP-01 — Granular, purpose-specific consent
- **requirement:** Collect separate, opt-in, informed consent for each distinct purpose. No bundled, pre-ticked, or implicit consent.
- **applies_when:** App collects any personal data
- **evidence_hints:** signup/onboarding forms, cookie banners, consent modal/dialog components, `consent` or `agree` UI elements
- **severity:** high
- **phase:** Phase 3 (~May 2027) — prepare now
- **remediation:** REM-CONSENT-01
- **citation:** DPDP Act 2023 §6; DPDP Rules 2025 r.3

### OBL-DPDP-02 — Plain language notice before/at data collection
- **requirement:** Show a privacy notice (in English and at least one Indian language) before collecting data. Must state: what data, why, retention period, how to exercise rights, grievance contact.
- **applies_when:** Any data collection point (signup, contact form, checkout, app install)
- **evidence_hints:** First-load notice, privacy notice component, `notice` or `disclosure` or `privacy-banner` in UI
- **severity:** high
- **phase:** Phase 3
- **remediation:** REM-PRIVACY-POLICY-01
- **citation:** DPDP Act 2023 §§5, 6; DPDP Rules 2025 r.3

### OBL-DPDP-03 — Right to access (Right to Information)
- **requirement:** User can request a summary of all personal data held about them. Must respond within 7 days (verify current SLA with DPBI).
- **applies_when:** All apps
- **evidence_hints:** Route/endpoint named `data-export`, `my-data`, `account-data`, `subject-access`, or similar
- **severity:** high
- **phase:** Phase 3
- **remediation:** REM-ACCESS-01
- **citation:** DPDP Act 2023 §11

### OBL-DPDP-04 — Right to correction
- **requirement:** User can correct inaccurate or outdated personal data. Mechanism must be available in the app.
- **applies_when:** All apps that store editable user profile data
- **evidence_hints:** Profile edit page, `edit-profile`, `update-account`, settings page with editable fields
- **severity:** medium
- **phase:** Phase 3
- **remediation:** Add edit fields for all stored PII (name, email, phone, address, DOB)
- **citation:** DPDP Act 2023 §12

### OBL-DPDP-05 — Right to erasure / deletion
- **requirement:** User can request permanent deletion of their personal data. App must delete or anonymise all PII. Legally required retention (tax, audit) may be kept in a separate compliance-only store.
- **applies_when:** All apps
- **evidence_hints:** Route/function `delete-account`, `close-account`, `erase-data`, `GDPR-delete` (same right under India law)
- **severity:** high
- **phase:** Phase 3
- **remediation:** REM-DELETE-01
- **citation:** DPDP Act 2023 §13

### OBL-DPDP-06 — Grievance mechanism
- **requirement:** Appoint a Grievance Officer (or use the Data Fiduciary's grievance mechanism). Acknowledge within 24 hours; resolve within 15–30 days (verify with DPBI). Contact visible in privacy policy and in-app.
- **applies_when:** All apps
- **evidence_hints:** Privacy policy mentions grievance officer with name/email; in-app grievance form or link
- **severity:** medium
- **phase:** Phase 2 onwards
- **remediation:** REM-GRIEVANCE-01
- **citation:** DPDP Act 2023 §13(6); DPDP Rules 2025 r.13

### OBL-DPDP-07 — Data breach notification (72 hours)
- **requirement:** Notify DPBI (Data Protection Board of India) within 72 hours of becoming aware of a breach. Notify affected data principals if risk is high. CERT-In report (6h) may also apply — see cert-in.md.
- **applies_when:** All apps
- **evidence_hints:** Incident response runbook, breach notification template, monitoring/alerting config, `breach` or `incident` handler code
- **severity:** critical
- **phase:** Phase 3
- **remediation:** REM-BREACH-01
- **citation:** DPDP Act 2023 §8(6); DPDP Rules 2025 r.7

### OBL-DPDP-08 — Cross-border transfer disclosure
- **requirement:** If personal data is stored or processed outside India, disclose this in the privacy notice. Government may publish a "negative list" of restricted countries — monitor meity.gov.in for updates.
- **applies_when:** Apps using non-India cloud regions (AWS us-east-1, EU regions, etc.)
- **evidence_hints:** Cloud provider region config, `AWS_REGION`, `CLOUD_REGION`, deployment IaC; privacy policy disclosure
- **severity:** medium
- **phase:** Active (negative list not yet published as of June 2026 — verify)
- **remediation:** REM-LOCALIZE-01 (or add disclosure to privacy policy)
- **citation:** DPDP Act 2023 §16

### OBL-DPDP-09 — Consent Manager integration
- **requirement:** Data Fiduciaries must integrate with a registered Consent Manager (CM) so users can manage consents across apps. CM framework operational November 2026.
- **applies_when:** All apps collecting consent-based personal data
- **evidence_hints:** CM API integration code, `consent-manager` SDK import, DPDP CM webhook handler
- **severity:** high
- **phase:** Phase 2 (Nov 2026) — ACTIVE
- **remediation:** Integrate with a DPBI-registered Consent Manager; add "Manage consent" link in settings pointing to CM. Verify registered CMs at meity.gov.in.
- **citation:** DPDP Act 2023 §7; DPDP Rules 2025 r.9

### OBL-DPDP-10 — Reasonable security safeguards
- **requirement:** Implement security measures proportionate to the sensitivity and volume of personal data: encryption, access control, logging, incident response. See security-safeguards.md for concrete controls.
- **applies_when:** All apps
- **evidence_hints:** Encryption on PII fields, TLS config, access control middleware, audit logging
- **severity:** high
- **phase:** Active
- **remediation:** See security-safeguards.md
- **citation:** DPDP Act 2023 §8(1); DPDP Rules 2025 r.6

### OBL-DPDP-11 — Significant Data Fiduciary (SDF) duties
- **requirement:** If designated SDF by government: appoint a DPO (based in India), conduct annual DPIA, annual independent audit, algorithmic fairness assessment (if using profiling/recommendations).
- **applies_when:** Large-scale data processors likely to be designated (high volume, sensitive data) — check DPBI notifications at meity.gov.in
- **evidence_hints:** DPO appointment record, DPIA document, audit report
- **severity:** high
- **phase:** Phase 3; SDF designations not yet published (June 2026 — verify)
- **remediation:** Not auto-verifiable from code. Add to manual review checklist.
- **citation:** DPDP Act 2023 §§10, 11

### OBL-DPDP-12 — Data minimization and retention limits
- **requirement:** Collect only data necessary for the stated purpose. Delete personal data when the purpose is fulfilled or the user withdraws consent. No indefinite retention of PII.
- **applies_when:** All apps
- **evidence_hints:** Scheduled jobs or cron tasks for data deletion; `retentionPeriod`, `purgeOlderThan`, `data_expiry` in code or config; ORM soft-delete vs hard-delete handling
- **severity:** medium
- **phase:** Phase 3
- **remediation:** Implement a data retention schedule. After purpose ends (or on consent withdrawal), purge or anonymise records.
- **citation:** DPDP Act 2023 §8(3)
