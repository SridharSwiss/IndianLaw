---
id: it-act
title: Information Technology Act, 2000 (key sections for developers)
applies_to: [all]
status: "Active and enforced"
penalty: "Varies by section — ₹5 lakh fine + up to 3 years imprisonment (§72A); compensation without upper limit (§43A)"
sources:
  - https://www.indiacode.nic.in/handle/123456789/2048
  - https://www.meity.gov.in/content/information-technology-act-2000
---

## IT Act 2000 — Developer Obligations

### OBL-ITA-01 — Section 43A: Compensation for data loss due to negligent security
- **requirement:** Any "body corporate" handling "sensitive personal data" must implement "reasonable security practices." Failure causing wrongful loss/gain triggers compensation liability.
- **applies_when:** All commercial apps handling personal or sensitive data
- **evidence_hints:** Security controls (encryption, access control, input validation, logging). Absence indicates non-compliance.
- **severity:** high
- **remediation:** Implement controls per security-safeguards.md. Conduct annual security audit or pen test. Use IS 17428 / ISO 27001 as baseline.
- **citation:** IT Act 2000 §43A; SPDI Rules 2011 r.8

### OBL-ITA-02 — Section 72A: No unauthorized disclosure of personal information
- **requirement:** Disclosing personal information obtained under contract without consent is criminal. Penalty: up to 3 years imprisonment + ₹5 lakh fine.
- **applies_when:** All apps; third-party integrations, analytics, data sharing
- **evidence_hints:** Third-party SDKs, data export pipelines, APIs exposing user data, access logs
- **severity:** high
- **remediation:** Review data-sharing. Ensure user consent covers third parties, Data Processing Agreements exist, APIs don't expose PII. Mask PII in logs.
- **citation:** IT Act 2000 §72A

### OBL-ITA-03 — Section 79: Intermediary safe harbor conditions
- **requirement:** "Intermediary" platforms have liability protection for user content IF due diligence conditions are met. Non-compliance forfeits safe harbor.
- **applies_when:** UGC profile apps
- **evidence_hints:** See intermediary-rules.md. Minimum: Terms of Use, grievance officer, takedown process.
- **severity:** high
- **remediation:** See intermediary-rules.md
- **citation:** IT Act 2000 §79; IT Rules 2021

### OBL-ITA-04 — Sections 66/67/69: Prevent cybercrime via your platform
- **requirement:** §66 (unauthorized access), §67 (obscene/CSAM), §69 (lawful interception) create liability if platforms facilitate or fail to prevent these.
- **applies_when:** All apps, especially UGC and consumer apps
- **evidence_hints:** OWASP Top 10 defenses, CSAM detection (UGC apps), no hardcoded credentials, dependency scanning
- **severity:** high
- **remediation:** Implement OWASP Top 10 fixes. UGC apps: PhotoDNA hashing, content moderation, NCMEC reporting. Maintain audit logs for interception compliance.
- **citation:** IT Act 2000 §§66, 67, 69
