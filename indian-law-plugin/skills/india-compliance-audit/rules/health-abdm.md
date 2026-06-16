---
id: health-abdm
title: ABDM / NMC / Telemedicine Health Obligations
applies_to: [health]
status: "Active; enforced by NMC, MoHFW, ABDM"
penalty: "Up to ₹5 lakh; license cancellation for NMC violations"
sources:
  - https://abdm.gov.in/
  - https://www.nmc.org.in/
  - https://www.mohfw.gov.in/
---

## Health App Obligations

### OBL-HEALTH-01 — ABDM HIP/HIU registration
- **requirement:** Health apps integrating with India's Health Stack (ABHA, Health Records, PHR) must register as a Health Information Provider (HIP) or Health Information User (HIU) with ABDM (Ayushman Bharat Digital Mission).
- **applies_when:** Apps storing, sharing, or requesting health records; apps using ABHA number
- **evidence_hints:** ABDM SDK integration (`@abdm/sdk`, `abdm-api`); ABHA number field; health record sharing flow; `ABDM_CLIENT_ID`, `ABDM_API_URL` env vars
- **severity:** high
- **remediation:** Register at abdm.gov.in as HIP/HIU. Complete sandbox testing before production. Store patient health records in FHIR R4 format as required by ABDM.
- **citation:** ABDM Health Data Management Policy; National Digital Health Blueprint

### OBL-HEALTH-02 — Patient consent for health record access
- **requirement:** Patient health records may only be accessed with explicit, purpose-specific, time-bound patient consent. Consent must be given through the ABDM Consent Manager or an equivalent registered system.
- **applies_when:** Apps accessing or sharing patient health records
- **evidence_hints:** ABDM consent flow integration; consent artifact storage; `consent_artefact_id` in record requests; time-bound consent expiry logic
- **severity:** critical
- **remediation:** Integrate with ABDM Health Locker / PHR app for consent management. Never access patient records without a valid, non-expired consent artefact. Log all consent-gated accesses.
- **citation:** ABDM Health Data Management Policy §5; IT Act 2000 §43A

### OBL-HEALTH-03 — Telemedicine guidelines compliance
- **requirement:** Telemedicine services must comply with the Telemedicine Practice Guidelines 2020: registered medical practitioners only, first-consultation in-person where required, prescription limits (no schedule X drugs via telemedicine), patient identification.
- **applies_when:** Apps providing telemedicine or online doctor consultations
- **evidence_hints:** Doctor NMC registration verification; prescription generation logic; drug schedule check before prescribing; patient ID verification; consultation recording/notes
- **severity:** high
- **remediation:** Verify doctor NMC registration at nmc.org.in before allowing prescriptions. Implement drug schedule guard (block schedule H1/X prescriptions via telemedicine). Store consultation records for minimum 3 years.
- **citation:** Telemedicine Practice Guidelines 2020; NMC Act 2019

### OBL-HEALTH-04 — Health data retention and localization
- **requirement:** Patient health records must be retained for minimum 3 years (general) or 5 years for electronic records. Health data must be stored in India under ABDM policy.
- **applies_when:** All health apps
- **evidence_hints:** Record retention policy in codebase; storage region config; `HEALTH_DATA_RETENTION_YEARS` env var; cloud region for health database (must be India)
- **severity:** high
- **remediation:** Set record retention to minimum 3 years with soft-delete (not immediate hard-delete). Store health data in India cloud region (ap-south-1 / asia-south1). Add retention schedule to data management policy.
- **citation:** ABDM Health Data Management Policy; MoHFW guidelines
