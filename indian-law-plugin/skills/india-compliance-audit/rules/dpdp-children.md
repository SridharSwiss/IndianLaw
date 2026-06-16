---
id: dpdp-children
title: DPDP Act 2023 §9 — Children's Personal Data
applies_to: [children]
status: "Phase 3 (~May 2027); highest penalty tier"
penalty: "Up to ₹200 crore per violation"
sources:
  - https://www.meity.gov.in/content/digital-personal-data-protection-act-2023
  - https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa
---

## Children's Data Obligations (DPDP Act §9)

Applies to any app that: targets children (under 18), may be used by children, or where age verification is absent.

### OBL-CHILD-01 — Verifiable parental consent before collecting children's data
- **requirement:** Before collecting personal data of a child (under 18), obtain verifiable consent from a parent or guardian. Consent must be genuine — not self-declared age.
- **applies_when:** Apps used by or targeting minors
- **evidence_hints:** Age verification gate on signup; parental consent flow; DOB field with age check; `is_minor`, `parent_email`, `guardian_consent` in user model; age verification SDK
- **severity:** critical
- **remediation:** REM-AGE-01. Implement age check at registration. If under 18: redirect to parental consent flow with parent email OTP verification.
- **citation:** DPDP Act 2023 §9(1); DPDP Rules 2025 r.10

### OBL-CHILD-02 — No behavioural tracking or profiling of children
- **requirement:** Must not track, monitor, or profile children's behaviour for advertising, recommendation, or profiling purposes.
- **applies_when:** Apps used by children with analytics, recommendations, or advertising
- **evidence_hints:** Analytics SDK calls (Firebase Analytics, Mixpanel, Amplitude) — must be disabled for child accounts; recommendation engine using behavioral data; retargeting pixel (Meta Pixel, Google Tag Manager) — must be disabled for minors
- **severity:** high
- **remediation:** Disable all behavioral analytics, ad tracking, and recommendation engines for accounts identified as minors. Use a flag like `is_minor: true` to gate SDK calls.
- **citation:** DPDP Act 2023 §9(3)

### OBL-CHILD-03 — No targeted advertising to children
- **requirement:** Displaying targeted, personalized, or behavioral advertising to children is prohibited.
- **applies_when:** Apps with advertising that may show to children
- **evidence_hints:** Ad network SDK (Google AdMob, Meta Audience Network, etc.) — must have child-directed settings enabled; `COPPA-compliant` or `child-directed` flag in ad SDK config
- **severity:** high
- **remediation:** Enable "child-directed treatment" in all ad SDKs for minor accounts (AdMob: `tagForChildDirectedTreatment(true)`). Do not show behavioral ads to any user whose age is unverified.
- **citation:** DPDP Act 2023 §9(3)

### OBL-CHILD-04 — Age-appropriate design and content
- **requirement:** Apps used by children must have age-appropriate design, language, and privacy settings by default. High privacy settings must be the default for child accounts.
- **applies_when:** All apps accessible to children
- **evidence_hints:** Privacy settings defaulting to most restrictive for minor accounts; child-mode UI; content filters for age-appropriate content
- **severity:** medium
- **remediation:** For child accounts: default visibility to private, disable direct messaging from strangers, enable content filtering. Document age-appropriate design choices.
- **citation:** DPDP Act 2023 §9(2); UK Age Appropriate Design Code (reference standard)
