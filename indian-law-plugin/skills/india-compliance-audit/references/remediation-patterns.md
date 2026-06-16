# Remediation Patterns

Reusable fix guidance. Reference these by ID in findings (e.g., "see REM-CONSENT-01").

---

## REM-CONSENT-01 — Granular per-purpose consent UI

**Problem:** Bundled or pre-ticked consent; no per-purpose breakdown.

**Fix:**
- One checkbox per data-collection purpose (e.g., "Allow analytics", "Allow marketing emails").
- Each must be unchecked by default (opt-in).
- Show a plain-language description of what data is used for.
- Store `{userId, purpose, timestamp, consentVersion}` in a consent ledger table.

```js
// Example consent record schema
{
  userId: "uuid",
  purpose: "analytics" | "marketing" | "account_operation",
  granted: true,
  timestamp: "2026-06-11T10:00:00Z",
  consentVersion: "1.0",
  withdrawnAt: null
}
```

---

## REM-DELETE-01 — Account & data deletion endpoint

**Problem:** No mechanism to delete a user's personal data (Right to Erasure).

**Fix:**
- Add `DELETE /api/user/me` or equivalent.
- Hard-delete or pseudonymise PII: name, email, phone, address, behavioral data.
- Keep only legally-mandated retention (e.g., GST invoice data for 7 years) in a separate compliance store.
- Send confirmation email after deletion.
- Log the deletion event (without PII) for audit.

---

## REM-ACCESS-01 — Data export / Right to Access endpoint

**Problem:** No way for a user to see what personal data is held.

**Fix:**
- Add `GET /api/user/me/data-export` → returns JSON/PDF of all personal data fields.
- Respond within 7 days of request.
- Do NOT expose other users' data.

---

## REM-GRIEVANCE-01 — Grievance officer / contact

**Problem:** No grievance officer contact or mechanism visible.

**Fix:**
- Add a `Grievance` section to your privacy policy / T&Cs: name, email, postal address.
- Add an in-app "Report a concern" form or email link.
- Set up a ticketing system to track acknowledgment (24h) and resolution (15–30 days depending on law).

---

## REM-PRIVACY-POLICY-01 — Privacy policy missing or insufficient

**Problem:** No privacy policy, or policy doesn't cover required fields.

**Fix (DPDP-compliant policy must include):**
1. Legal name of Data Fiduciary + contact
2. What personal data is collected (exhaustive list)
3. Purpose of each collection (separate items)
4. Retention period per data type
5. Third parties data is shared with
6. Cross-border transfer disclosure (if any)
7. How to exercise rights: access, correction, deletion, grievance
8. Consent Managers link (when operational)
9. Breach notification procedure
10. Plain language — avoid legalese; aim for 8th-grade reading level

---

## REM-BREACH-01 — Breach notification process

**Problem:** No documented breach detection or notification flow.

**Fix:**
1. Define what constitutes a "breach" (unauthorized access, exfiltration, loss of data).
2. Implement alerting (Sentry, CloudWatch, etc.) to detect anomalous data access.
3. Prepare DPBI notification template (see DPDP Rules 2025 Schedule — verify current form at meity.gov.in).
4. Prepare user notification email template.
5. Document: detection → 72h DPBI report → user notification if high risk.
6. CERT-In: reportable cybersecurity incidents must also go to incident@cert-in.org.in within 6 hours.

---

## REM-ENCRYPT-01 — Encryption at rest

**Problem:** PII or sensitive data stored without encryption.

**Fix:**
- Use AES-256 for field-level encryption of: Aadhaar (token/reference only, not raw), PAN, financial data, health records.
- For database columns: use application-level encryption or database transparent data encryption (TDE).
- Never log PII in plaintext; mask in logs (show last 4 digits, redact full values).

---

## REM-ENCRYPT-02 — Encryption in transit

**Problem:** HTTP instead of HTTPS; TLS < 1.2.

**Fix:**
- Enforce HTTPS everywhere; redirect HTTP → HTTPS.
- Configure TLS 1.2 minimum (TLS 1.3 preferred).
- Set HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
- Check: `openssl s_client -connect yourapp.in:443 -tls1_1` should reject.

---

## REM-HASH-01 — Password hashing

**Problem:** MD5, SHA-1, or unsalted hashes for passwords.

**Fix:**
- Use bcrypt (cost ≥ 12), argon2id, or scrypt.
- Never use MD5/SHA1/SHA256 alone for passwords.
- Migration: on next login, re-hash the password with the new algorithm.

---

## REM-CERTLN-01 — CERT-In log retention (180 days, India-stored)

**Problem:** Logs not retained 180 days or stored outside India.

**Fix:**
1. Set log retention policy to 180 days (rolling).
2. Confirm log storage region = India (AWS `ap-south-1`, Azure India, GCP `asia-south1`).
3. Include in logs: timestamp (synced to NIC/NPL NTP), user ID, action, IP address, resource accessed.
4. Use a structured format (JSON lines) for machine-parseable export to CERT-In on demand.

---

## REM-NTP-01 — NTP synchronization to NIC/NPL

**Problem:** Server clocks not synced to Indian government NTP.

**Fix (Linux/Docker):**
```bash
# /etc/chrony.conf (or /etc/ntp.conf)
server time.nic.in iburst
server time.nplindia.org iburst
```
Docker: NTP is inherited from the host — ensure the host is configured as above.

---

## REM-A11Y-01 — Accessibility basics

**Problem:** Missing alt text, missing labels, no language attribute, low contrast.

**Fix checklist:**
- `<html lang="en">` (or `lang="hi"` etc.)
- All `<img>` have descriptive `alt="..."` (or `alt=""` for decorative images)
- All form `<input>` have associated `<label>` (not placeholder-only)
- Color contrast ≥ 4.5:1 for body text, 3:1 for large text (test with WebAIM Contrast Checker)
- Keyboard: all interactive elements reachable via Tab; visible focus outline
- Publish an accessibility statement on the website

---

## REM-AGE-01 — Age verification and parental consent

**Problem:** App may be used by under-18 users; no age check or parental consent flow.

**Fix:**
1. Add DOB/age field to registration.
2. If age < 18: block account creation and route to parental consent flow.
3. Parental consent: email parent's address, send OTP or approval link, link parent account.
4. For confirmed minor accounts: disable analytics tracking pixels, disable behavioral advertising, disable recommendations based on behavior.
5. Store consent record with parent's contact, timestamp, and consent version.

---

## REM-LOCALIZE-01 — Payment / personal data storage in India

**Problem:** Data or payment records stored in a non-India cloud region.

**Fix:**
- Move storage to `ap-south-1` (AWS Mumbai), `asia-south1` (GCP Mumbai), or Azure India Central.
- For payment data: must reach India storage within 24 hours of transaction per RBI mandate.
- Update `AWS_REGION`, `GCP_REGION`, or equivalent env vars.
- Add IaC (Terraform/CDK) region constraint.
- Privacy policy must disclose the storage location.
