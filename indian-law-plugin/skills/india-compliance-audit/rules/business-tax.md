---
id: business-tax
title: Business & Tax Compliance (GST, ROC, IEC)
applies_to: [all — informational]
status: "Active; enforced by GSTN, MCA, DGFT"
penalty: "Tax penalties, late fees, interest, ROC filing penalties"
note: "Informational pack — these obligations are not verifiable from code. All items go to manual review checklist."
sources:
  - https://www.gst.gov.in/
  - https://www.mca.gov.in/
  - https://www.dgft.gov.in/
---

## Business & Tax Obligations (Manual Review Items)

These obligations cannot be verified from the codebase. All findings go to the Manual Review section of the audit report.

### OBL-BIZ-01 — GST registration
- **requirement:** Register for GST if annual aggregate turnover exceeds: ₹20 lakh (services) or ₹40 lakh (goods only). Special category states: ₹10 lakh threshold. Mandatory for any interstate supply regardless of turnover.
- **not-auto-verifiable:** true
- **first-action:** Check turnover threshold. Register at gst.gov.in > Services > Registration > New Registration.
- **citation:** CGST Act 2017 §22

### OBL-BIZ-02 — GST e-invoicing
- **requirement:** Generate e-invoices through the Invoice Registration Portal (IRP) if annual turnover exceeds ₹5 crore. Mandatory for B2B invoices.
- **not-auto-verifiable:** true
- **first-action:** Check if turnover > ₹5 crore. If yes, integrate with IRP (einvoice1.gst.gov.in) via GST Suvidha Provider.
- **citation:** CGST Rule 48(4)

### OBL-BIZ-03 — ROC filings (for companies and LLPs)
- **requirement:** Companies must file annual returns (MGT-7), financial statements (AOC-4), and director KYC (DIR-3 KYC) with MCA. LLPs must file Form 11 (annual return) and Form 8 (financial statement).
- **not-auto-verifiable:** true
- **first-action:** Log in to mca.gov.in and check filing status. File overdue returns before incurring additional penalties.
- **citation:** Companies Act 2013 §92, §137; LLP Act 2008 §35

### OBL-BIZ-04 — IEC (Importer Exporter Code)
- **requirement:** Required if exporting software or IT services to foreign clients and receiving payment in foreign currency. Obtain from DGFT.
- **not-auto-verifiable:** true
- **first-action:** If exporting: apply for IEC at dgft.gov.in > Services > IEC.
- **citation:** Foreign Trade (Development & Regulation) Act 1992 §7

### OBL-BIZ-05 — Cyber/E&O insurance
- **requirement:** Not legally mandated, but strongly recommended given ₹250 crore DPDP penalty exposure and IT Act compensation liability. Covers breach response costs, legal fees, and regulatory fines.
- **not-auto-verifiable:** true
- **first-action:** Get a cyber/E&O insurance quote from: ICICI Lombard, HDFC Ergo, Bajaj Allianz, or New India Assurance.
- **citation:** Recommended practice; DPDP Act 2023 §33 (penalty schedule)
