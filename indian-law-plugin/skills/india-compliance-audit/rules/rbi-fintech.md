---
id: rbi-fintech
title: RBI Payment and Fintech Obligations
applies_to: [fintech]
status: "Active; strictly enforced"
penalty: "License cancellation; ₹1–10 lakh fine; regulatory action"
sources:
  - https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx
  - https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12932
  - https://www.rbi.org.in/scripts/FS_PressRelease.aspx?prid=52365
---

## RBI — Fintech Obligations

### OBL-RBI-01 — Payment data localization
- **requirement:** All payment transaction data must be stored within India. If processed abroad initially, the foreign copy must be purged within 24 hours, leaving only the India-stored copy. Covered data: customer identifiers, transaction details, tokenization data.
- **applies_when:** All apps processing payments or handling payment data
- **evidence_hints:** Cloud region config; `AWS_REGION`, `DATABASE_URL`, `STORAGE_REGION` env vars; data residency IaC; payment gateway SDK config (Razorpay, PayU, Cashfree, Stripe); any payment data sent to non-India endpoints
- **severity:** critical
- **remediation:** REM-LOCALIZE-01. Move payment database to ap-south-1 (AWS Mumbai). Confirm with payment processor that their stored data is in India region.
- **citation:** RBI Circular on Storage of Payment System Data (April 2018); updated circulars — verify at rbi.org.in

### OBL-RBI-02 — KYC (Customer Due Diligence)
- **requirement:** Fintech services must perform mandatory KYC using government-issued ID: name, DOB, address, PAN, photo ID (Aadhaar eKYC, passport, voter ID, or driving licence). Enhanced DD for transactions > ₹10 lakh.
- **applies_when:** Apps offering financial services (lending, wallets, payment aggregators)
- **evidence_hints:** KYC form/flow in onboarding; integration with UIDAI eKYC, KRA, CKYC registry; PAN verification API; `kyc_status`, `kyc_verified` in user model; document upload endpoint
- **severity:** high
- **remediation:** Implement CKYC lookup first. Add video KYC (V-CIP) for remote onboarding. Verify PAN against IT database. For Aadhaar eKYC: use only UIDAI-authorized KUA.
- **citation:** RBI Master Directions on KYC 2016 (as updated); PMLA 2002

### OBL-RBI-03 — Digital Lending Guidelines compliance
- **requirement:** Loan apps must: (1) provide a Key Fact Statement (KFS) before loan offer, (2) implement a 3-day cooling-off period for loan cancellation, (3) report to all four credit bureaus (CIBIL, Equifax, Experian, CRIF High Mark), (4) restrict borrower data use to underwriting only — no marketing.
- **applies_when:** Lending / BNPL / credit apps
- **evidence_hints:** KFS template or component; `cooling_off_period`, `loan_cancellation` logic; credit bureau integration code (`cibil_api`, `equifax_api`, `experian_api`, `crif_api`); data-use consent limited to underwriting
- **severity:** high
- **remediation:** Implement KFS as a mandatory pre-loan disclosure screen. Add a loan cancellation route active for 3 days post-disbursal. Integrate all four CICs for credit reporting. Review data-sharing agreements to limit use to underwriting.
- **citation:** RBI Digital Lending Guidelines 2022; RBI Master Directions on Credit Information Companies
