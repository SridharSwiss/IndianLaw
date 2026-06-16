---
description: Interactive non-code compliance checklist — business registration, DPO, GST, CERT-In, grievance officer, and more
---

# /india-checklist

Interactive non-code compliance checklist for Indian law items that cannot be verified
from the codebase — business registration, appointments, insurance, operational procedures.

## Usage

```
/india-checklist
/india-checklist <area>
```

Area values: `dpdp`, `cert-in`, `rbi`, `business`, `health`, `all`

## What this command does

Ask the user a series of yes/no/partial questions about non-code compliance items.
For each item:
- State the obligation in plain language
- State the law and section
- Ask: "Done / In progress / Not done / Not applicable"
- If "Not done": give a concrete first action to take

At the end: print a summary of gaps with severity and first-action steps.

## Checklist items (by area)

### DPDP Act — non-code items
- [ ] Data Protection Officer (DPO) appointed? (Required if designated Significant Data Fiduciary — check meity.gov.in for SDF list)
- [ ] Annual Data Protection Impact Assessment (DPIA) conducted? (SDF requirement)
- [ ] Consent Manager integration live? (All Data Fiduciaries — deadline verify at meity.gov.in)
- [ ] Privacy policy reviewed by legal counsel for DPDP Rules 2025 compliance?
- [ ] Breach notification template prepared for DPBI? (meity.gov.in for current DPBI contact)
- [ ] User consent records archived for 7 years?
- [ ] Data retention schedule documented and enforced? (delete data when purpose ends)
- [ ] Sub-processor contracts (Data Processing Agreements) in place with all third-party vendors?

### CERT-In — non-code items
- [ ] CERT-In incident report template prepared? (incident@cert-in.org.in)
- [ ] Security monitoring/alerting active with escalation path? (6-hour reporting window)
- [ ] NTP configured to NIC/NPL on all production servers?
- [ ] Log storage verified to be in India region with 180-day retention?
- [ ] Cloud provider KYC completed? (CERT-In Direction 7)

### RBI — non-code items (fintech)
- [ ] Payment data flow mapped — confirmed all stored in India (ap-south-1 / India Azure / India GCP)?
- [ ] Written confirmation from payment processor that data stays in India?
- [ ] KYC documentation audit completed?
- [ ] Credit bureau (CIC) reporting configured for all loans? (CIBIL, Equifax, Experian, CRIF)
- [ ] Key Fact Statement template prepared for loan products?

### Business / Tax — non-code items
- [ ] GST registration done? (required if turnover > ₹20 lakh for services)
- [ ] GST returns filed on time? (GSTR-1, GSTR-3B, GSTR-9)
- [ ] E-invoicing via IRP enabled? (required if turnover > ₹5 crore)
- [ ] IEC (Importer Exporter Code) obtained? (required if exporting services to foreign clients)
- [ ] PAN and TAN obtained?
- [ ] Cyber/E&O insurance in place? (strongly recommended given ₹250 crore DPDP penalty exposure)
- [ ] If company: ROC filings current? (MGT-7, AOC-4, DIR-3 KYC)

### Health — non-code items
- [ ] ABDM HIP/HIU registration completed? (abdm.gov.in)
- [ ] ABHA sandbox testing done before production?
- [ ] Provider NMC registration verification process in place?
- [ ] Patient consultation record retention for 3 years confirmed?
- [ ] Telemedicine consent form reviewed by legal counsel?

### General operational items
- [ ] Grievance Officer appointed and contact published in T&Cs and app?
- [ ] Internal grievance SLA tracking in place? (24h ack, 7-15 day resolution)
- [ ] Annual penetration test scheduled?
- [ ] Employee/contractor NDAs covering data confidentiality (IT Act §72A)?
- [ ] IS 17428 or ISO 27001 certification being pursued? (voluntary but reduces liability)

## Instructions for the AI

When the user runs /india-checklist:

1. Ask which area to cover first, or confirm "all" if no argument given.
2. For each item in the area, present it as a question:
   "**[Law §Section]** [Plain-language obligation] — Done / In progress / Not done / N/A?"
3. Accept free-text or choice answers.
4. For "Not done" answers: give one concrete first action, e.g., "Register at gst.gov.in > New Registration > Services category."
5. At the end: print a gap summary table with severity and first-action column.
6. Remind: "This is not legal advice. Consult a lawyer for compliance decisions."
