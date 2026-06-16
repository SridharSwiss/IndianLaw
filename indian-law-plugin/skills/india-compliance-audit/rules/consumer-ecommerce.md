---
id: consumer-ecommerce
title: Consumer Protection (E-Commerce) Rules 2020 + Consumer Protection Act 2019
applies_to: [ecommerce]
status: "Active; enforced by CCPA and state consumer forums"
penalty: "Up to ₹10 lakh fine; product recall; compensation orders"
sources:
  - https://consumeraffairs.nic.in/
  - https://consumeraffairs.nic.in/acts-and-rules/the-consumer-protection-e-commerce-rules-2020
---

## E-Commerce & Consumer Protection Obligations

### OBL-ECOM-01 — Mandatory seller/entity disclosure
- **requirement:** E-commerce entities must display on their website/app: legal name, registered address, customer care number (with working hours), PAN, GST number, and MCA registration.
- **applies_when:** E-commerce platforms operating in India
- **evidence_hints:** Footer with legal entity name and address; "About" or "Contact" page with registration details; `GSTIN`, `PAN`, `CIN` visible on the site
- **severity:** high
- **remediation:** Add a legal disclosures section to your footer and About/Contact page. Display: company legal name, CIN/LLP number, registered address, GSTIN, PAN, customer care number.
- **citation:** E-Commerce Rules 2020 r.5; Consumer Protection Act 2019 §2

### OBL-ECOM-02 — Grievance redressal mechanism
- **requirement:** Appoint a Grievance Officer with name and contact details visible on the platform. Acknowledge consumer complaints within 48 hours; resolve within 1 month.
- **applies_when:** E-commerce platforms
- **evidence_hints:** Grievance officer name/email in T&Cs or footer; complaint form; `/support` or `/grievance` route; acknowledgment email template
- **severity:** high
- **remediation:** REM-GRIEVANCE-01. Implement a complaint ticketing system with auto-acknowledgment and SLA monitoring.
- **citation:** E-Commerce Rules 2020 r.6; Consumer Protection Act 2019 §2(18)

### OBL-ECOM-03 — No fake reviews or dark patterns
- **requirement:** E-commerce entities must not promote or allow fake reviews. Manipulative dark patterns (fake countdown timers, hidden charges, forced subscription to cancel) are prohibited under CCPA guidelines.
- **applies_when:** E-commerce platforms with user reviews or promotional mechanics
- **evidence_hints:** Review verification mechanism; CCPA dark pattern check (countdown timers with false urgency, pre-ticked add-ons, hidden charges at checkout); unsubscribe flow that must be as easy as subscribe
- **severity:** medium
- **remediation:** Implement verified purchase badge for reviews. Remove artificial urgency timers unless countdown reflects a real deadline. Ensure all charges are disclosed before payment. Make unsubscription as simple as subscription.
- **citation:** CCPA Guidelines on Dark Patterns 2023; Consumer Protection Act 2019 §2(47)
