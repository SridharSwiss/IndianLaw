---
id: aadhaar-uidai
title: Aadhaar Act 2016 + UIDAI Developer Requirements
applies_to: [aadhaar]
status: "Active; UIDAI strictly regulates Aadhaar use. Only registered KUA/AUA entities may use Aadhaar eKYC/auth."
penalty: "Up to ₹1 crore fine + imprisonment for unauthorized Aadhaar use"
sources:
  - https://uidai.gov.in/en/legal-framework/aadhaar-act.html
  - https://www.uidai.gov.in/en/ecosystem/authentication-devices-documents/developer-section.html
---

## Aadhaar Act 2016 — Developer Obligations

### OBL-AADH-01 — Explicit informed consent before Aadhaar use
- **requirement:** Before collecting or using an Aadhaar number (even for eKYC), obtain explicit, informed consent from the user. Consent must state: what data is fetched (name, address, DOB, photo), who sees it, how long it is retained, and how to withdraw. User must be able to opt out and use alternative verification.
- **applies_when:** Any app that requests Aadhaar number or integrates UIDAI APIs
- **evidence_hints:** Consent dialog/screen before Aadhaar entry field; `aadhaar_consent` or `uidai_consent` field in user model with timestamp; alternative verification option (PAN, passport, etc.) available alongside Aadhaar
- **severity:** high
- **remediation:** Add a dedicated Aadhaar consent screen (not bundled with general T&Cs) before any UIDAI API call. Store consent record with user ID, timestamp, consent text version. Implement an Aadhaar-unlinking flow so users can remove Aadhaar linkage.
- **citation:** Aadhaar Act 2016 §§8, 29; UIDAI Circular on Consent

### OBL-AADH-02 — No storage of raw Aadhaar numbers
- **requirement:** Raw 12-digit Aadhaar numbers must NEVER be stored. After eKYC/auth, store only: the UIDAI-issued masked Aadhaar (shows last 4 digits), or a tokenized reference. Storing the full Aadhaar number is a criminal violation.
- **applies_when:** All apps using Aadhaar eKYC or auth
- **evidence_hints:** Database columns or model fields named `aadhaar_number`, `uid`, `aadhaar_id` storing full 12-digit values; no masking applied to stored Aadhaar data; logs containing full Aadhaar numbers
- **severity:** critical
- **detector:** india-pii patterns (12-digit Aadhaar with Verhoeff checksum validation)
- **remediation:** After eKYC: store only the masked version ("XXXX XXXX 1234") or UIDAI token. Delete the full number immediately after the eKYC transaction completes. Ensure Aadhaar numbers are never written to application logs.
- **citation:** Aadhaar Act 2016 §29; UIDAI Regulations 2016 r.17

### OBL-AADH-03 — KUA/AUA registration with UIDAI
- **requirement:** Before integrating UIDAI's authentication or eKYC API in production, the entity must register as an Authentication User Agency (AUA) or KYC User Agency (KUA) with UIDAI. Testing must use UIDAI's official sandbox/staging environment.
- **applies_when:** Any app integrating UIDAI APIs for auth or eKYC
- **evidence_hints:** UIDAI API endpoint URLs (sandbox vs production); AUA/KUA ID in UIDAI API request configuration; UIDAI registration certificate in project docs; `UIDAI_AUA_CODE`, `UIDAI_KUA_CODE`, `UIDAI_ENV` env vars
- **severity:** high
- **remediation:** Not fully code-verifiable. Check: (1) Is UIDAI_ENV set to "sandbox" or "production"? Production use requires a valid AUA/KUA certificate from UIDAI. (2) Is there a registration certificate in project docs? If not, add to manual review — production Aadhaar calls without registration are illegal.
- **citation:** Aadhaar Act 2016 §4; UIDAI (Authentication) Regulations 2016

### OBL-AADH-04 — SHA-256 digital signing (2026 requirement)
- **requirement:** UIDAI requires all Aadhaar authentication and eKYC XML requests to be digitally signed using SHA-256. Migration from SHA-1 to SHA-256 is mandatory as of 2026. Also, API communications must use TLS 1.2+.
- **applies_when:** Apps integrating UIDAI auth/eKYC APIs
- **evidence_hints:** Signing algorithm specified in UIDAI SDK configuration; `SHA256withRSA` or `SHA1withRSA` in certificate/signing code; TLS version config for UIDAI API calls; `UIDAI_SIGN_ALGO` env var
- **severity:** high
- **remediation:** Verify signing algorithm is SHA-256 (SHA256withRSA). Update UIDAI SDK to latest version. Test eKYC request in UIDAI sandbox with SHA-256 signing. Check TLS version on UIDAI API connection: openssl s_client against UIDAI endpoint should show TLSv1.2 or higher.
- **citation:** UIDAI Circular 2026 (SHA-256 migration); UIDAI API Integration Guide
