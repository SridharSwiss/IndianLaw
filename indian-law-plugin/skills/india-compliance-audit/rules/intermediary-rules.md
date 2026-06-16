---
id: intermediary-rules
title: IT (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021
applies_to: [ugc]
status: "Active; strictly enforced for social media intermediaries"
penalty: "Loss of safe harbor immunity under IT Act §79"
sources:
  - https://www.meity.gov.in/content/information-technology-intermediary-guidelines-and-digital-media-ethics-code-rules-2021
  - https://www.indiacode.nic.in/handle/123456789/2048
---

## Intermediary Rules 2021 — Obligations

Applies to "intermediaries" — any platform that hosts, transmits, or stores user-generated content. Non-compliance forfeits the liability shield under IT Act §79.

### OBL-INTR-01 — Grievance Officer appointment and disclosure
- **requirement:** Appoint a Grievance Officer (India-based). Name, contact details, and working hours must be published on the app and website. Acknowledge complaints within 24 hours; resolve within 15 days.
- **applies_when:** All intermediary platforms
- **evidence_hints:** Grievance officer name and email in T&Cs, About page, or footer; `/grievance` or `/contact` route with officer details; `grievance_officer` in site config
- **severity:** high
- **remediation:** REM-GRIEVANCE-01. Add a Grievance section to T&Cs with officer name, email, and office address. Create a formal complaint intake form with acknowledgment emails.
- **citation:** IT Rules 2021 r.3(2)(b); IT Act 2000 §79

### OBL-INTR-02 — User terms prohibiting illegal content
- **requirement:** Terms of Service must explicitly prohibit content that is unlawful, obscene, defamatory, harmful, harassing, or violates any applicable laws. Terms must be in plain language.
- **applies_when:** All UGC platforms
- **evidence_hints:** Terms of Service or Community Guidelines file/page; prohibited content list in T&Cs
- **severity:** medium
- **remediation:** Add or update Terms of Service to explicitly list prohibited content categories aligned with IT Act §67, §67A, and §67B. Reference CERT-In and NCMEC reporting for CSAM.
- **citation:** IT Rules 2021 r.3(1)(b); IT Act 2000 §§67, 79

### OBL-INTR-03 — Content takedown within 36 hours (for significant social media intermediaries)
- **requirement:** Significant Social Media Intermediaries (SSMI — >5 million users in India) must take down notified content within 36 hours. Child abuse content must be removed within 24 hours.
- **applies_when:** UGC platforms with >5 million India users (SSMI)
- **evidence_hints:** Content moderation pipeline; CSAM detection (PhotoDNA); automated takedown system; `content_moderation`, `flagged_content`, `takedown` in codebase; legal hold process
- **severity:** high
- **remediation:** Implement a content flagging and moderation queue with SLA tracking. For CSAM: integrate PhotoDNA or equivalent hash-matching. Maintain a legal contact for government takedown orders.
- **citation:** IT Rules 2021 r.3(1)(d), r.4(4); IT Act 2000 §79
