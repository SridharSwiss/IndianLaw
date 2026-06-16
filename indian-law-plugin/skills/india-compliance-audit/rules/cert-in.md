---
id: cert-in
title: CERT-In Directions 2022 — Cybersecurity Incident Reporting & Logging
applies_to: [all]
status: "Active and enforced since June 2022"
penalty: "Up to ₹1 lakh fine; repeated non-compliance may result in regulatory action"
sources:
  - https://www.cert-in.org.in/
  - https://www.cert-in.org.in/PDF/CERT-In_Directions_70B.pdf
---

## CERT-In Directions 2022 — Obligations

Under §70B(6) of the IT Act 2000, these directions apply to all service providers, intermediaries, data centres, body corporates, and government organizations operating ICT systems in India.

### OBL-CERT-01 — Cybersecurity incident reporting within 6 hours
- **requirement:** Report cybersecurity incidents to CERT-In within 6 hours of becoming aware. Report to: incident@cert-in.org.in. Covered incidents: unauthorized access, data exfiltration, malware/ransomware, DDoS, website defacement, phishing attacks, credential compromise, vulnerability exploitation, data breaches.
- **applies_when:** All ICT entities operating in India
- **evidence_hints:** Incident response runbook or document; `CERT-In` or `cert-in` references in docs; security monitoring setup (Sentry, PagerDuty, CloudWatch alarms); breach notification handler code
- **severity:** critical
- **remediation:** REM-BREACH-01. Prepare an incident report template pre-filled for CERT-In. Establish an on-call rotation with escalation within 6 hours.
- **citation:** CERT-In Directions 2022 Direction 6; IT Act 2000 §70B

### OBL-CERT-02 — Log retention for 180 rolling days
- **requirement:** Maintain all ICT system logs for a minimum of 180 rolling days. Required logs: authentication events, data access/modification, administrative actions, network traffic, application events, system events.
- **applies_when:** All ICT entities
- **evidence_hints:** Logging configuration files (log4j, winston, pino, python logging); log retention policy in infrastructure config; CloudWatch log retention setting; Elasticsearch index lifecycle policy; `LOG_RETENTION` env var
- **severity:** high
- **remediation:** REM-CERTLN-01. Set log retention to ≥180 days. Use structured logging (JSON lines).
- **citation:** CERT-In Directions 2022 Direction 4

### OBL-CERT-03 — Log storage within India
- **requirement:** All logs must be stored within India. Acceptable regions: AWS ap-south-1 (Mumbai), AWS ap-south-2 (Hyderabad), GCP asia-south1 (Mumbai), GCP asia-south2 (Delhi), Azure India Central, Azure South India. Offshore log storage does not comply.
- **applies_when:** All ICT entities
- **evidence_hints:** Cloud region config in infrastructure code; `AWS_REGION`, `LOG_REGION`, `LOGGING_ENDPOINT` env vars; Terraform/CDK resource region; logging service endpoint URL
- **severity:** high
- **remediation:** REM-CERTLN-01. Move log storage to an India-region cloud service.
- **citation:** CERT-In Directions 2022 Direction 4

### OBL-CERT-04 — NTP clock synchronization to Indian government servers
- **requirement:** Synchronize all system clocks to Indian government NTP: `time.nic.in` (NIC) or `time.nplindia.org` (NPL/CSIR). Accurate timestamps are required for legally valid log records.
- **applies_when:** All servers and VMs in production
- **evidence_hints:** `/etc/ntp.conf`, `/etc/chrony.conf`, docker-compose NTP settings, infrastructure setup scripts referencing NTP servers; `time.nic.in` or `time.nplindia.org` in config
- **severity:** medium
- **remediation:** REM-NTP-01. Add `server time.nic.in iburst` to chrony/NTP config. For cloud VMs: AWS, GCP, Azure sync to local time servers by default — verify or override.
- **citation:** CERT-In Directions 2022 Direction 5

### OBL-CERT-05 — KYC for cloud and VPN services
- **requirement:** Complete KYC with all cloud service providers and VPN/proxy service providers used by the organization. Providers must be able to identify the subscriber.
- **applies_when:** All ICT entities using cloud or VPN
- **evidence_hints:** Not auto-verifiable from code. Add to manual review checklist: confirm cloud account KYC completed (AWS: account verification; Azure: subscription identity; GCP: billing account identity).
- **severity:** medium
- **remediation:** Verify KYC status with each cloud provider account. Ensure organizational PAN/TAN/GST is on file with the provider.
- **citation:** CERT-In Directions 2022 Direction 7
