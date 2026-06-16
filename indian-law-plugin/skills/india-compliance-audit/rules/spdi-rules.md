---
id: spdi-rules
title: SPDI Rules 2011 — Sensitive Personal Data or Information
applies_to: [all]
status: "Active; will be superseded by DPDP Rules Phase 3 but currently enforceable"
penalty: "Compensation under IT Act §43A (no upper limit); ₹5 lakh fine"
sources:
  - https://www.meity.gov.in/content/sensitive-personal-data-or-information
  - https://www.indiacode.nic.in/handle/123456789/2048
---

## SPDI Rules 2011 — Obligations

SPDI (Sensitive Personal Data or Information) includes: passwords, financial data (bank account, credit/debit card), health data, sexual orientation, biometric data.

### OBL-SPDI-01 — SPDI must be secured per IS/ISO 27001
- **requirement:** Body corporates handling SPDI must implement IS/ISO 27001 or equivalent security practices. Annual audit required if not certified.
- **applies_when:** All apps handling passwords, financial data, health data, or biometric data
- **evidence_hints:** Security policy document; IS 27001 certificate; security controls (encryption, access control, audit logging); annual pen test reports
- **severity:** high
- **remediation:** Adopt IS 17428 (Indian standard for ISMS) or ISO 27001. Conduct annual security review. Maintain a documented information security policy.
- **citation:** SPDI Rules 2011 r.8; IT Act 2000 §43A

### OBL-SPDI-02 — Disclosure of SPDI collection
- **requirement:** Before collecting SPDI, inform the user: what data is being collected, purpose, intended recipients, and their right to not provide (with consequences).
- **applies_when:** All apps collecting SPDI
- **evidence_hints:** Privacy notice mentioning specific SPDI categories; consent form referencing financial data, health data, or passwords
- **severity:** high
- **remediation:** Update privacy notice to explicitly list SPDI categories. Provide opt-out option with consequence disclosure.
- **citation:** SPDI Rules 2011 r.5

### OBL-SPDI-03 — No transfer of SPDI without consent
- **requirement:** SPDI must not be shared with third parties without the data subject's consent, unless required by law or contract necessity.
- **applies_when:** All apps with third-party data sharing
- **evidence_hints:** Data Processing Agreements with vendors; consent covering third-party sharing; list of third parties in privacy policy
- **severity:** high
- **remediation:** Map all SPDI flows. Obtain explicit consent for each third-party sharing arrangement. Execute DPAs with all processors.
- **citation:** SPDI Rules 2011 r.6
