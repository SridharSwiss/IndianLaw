---
id: security-safeguards
title: Reasonable Security Safeguards (DPDP §8 + IT Act §43A + CERT-In)
applies_to: [all]
status: "Active; required under multiple statutes"
penalty: "Compensation (IT Act §43A, unlimited); ₹250 crore (DPDP breach); criminal liability (IT Act §66)"
sources:
  - https://amlegals.com/reasonable-security-safeguards-under-dpdpa/
  - https://www.indiacode.nic.in/handle/123456789/2048
  - https://www.cert-in.org.in/
---

## Security Safeguards

Required by DPDP Act §8(1) ("reasonable security safeguards"), IT Act §43A (SPDI rules),
and CERT-In Directions. These are the technical controls developers must implement.

---

### OBL-SEC-01 — Encryption at rest for PII / SPDI
- **requirement:** Personal data (especially SPDI) stored in databases, files, or object storage must be encrypted at rest using a strong cipher (AES-256 or equivalent).
- **applies_when:** Any app storing personal data
- **evidence_hints:** Encrypted column decorators/wrappers in ORM models; aes/cipher references in storage code; database TDE enabled; cloud storage server-side encryption config; encryption key env vars
- **severity:** high
- **detector:** security patterns
- **remediation:** REM-ENCRYPT-01
- **citation:** DPDP Act 2023 §8(1); DPDP Rules 2025 r.6; SPDI Rules 2011 r.8

### OBL-SEC-02 — Encryption in transit (TLS 1.2+)
- **requirement:** All data in transit (API calls, browser-server, service-to-service, DB connections) must use TLS 1.2 or higher. Plain HTTP is not acceptable for any endpoint handling personal data.
- **applies_when:** All networked apps
- **evidence_hints:** HTTPS redirect middleware; HSTS header config; TLS version config in nginx/apache conf; database connection string with ssl=true; hardcoded plain-HTTP base URLs in config or code
- **severity:** high
- **detector:** security patterns
- **remediation:** REM-ENCRYPT-02
- **citation:** DPDP Act 2023 §8(1); SPDI Rules 2011 r.8

### OBL-SEC-03 — Password hashing with strong algorithm
- **requirement:** User passwords must be hashed with a slow, salted, modern algorithm: bcrypt, argon2id, or scrypt. MD5, SHA-1, or plain SHA-256 alone are insufficient for password storage.
- **applies_when:** Any app with user authentication
- **evidence_hints:** Password value passed to md5/sha1 digest function; hashlib.md5 or equivalent crypto hash applied to a password variable; lock file lacking bcrypt, argon2, or scrypt
- **severity:** critical
- **detector:** security patterns
- **remediation:** REM-HASH-01. Migrate weak hashes: on the user's next login, re-hash their password with bcrypt (cost >= 12).
- **citation:** DPDP Act 2023 §8(1); IT Act 2000 §43A

### OBL-SEC-04 — No hardcoded credentials or secrets
- **requirement:** API keys, passwords, database credentials, JWT secrets, and private keys must not be hardcoded in source code or committed to version control.
- **applies_when:** All apps
- **evidence_hints:** String literal assigned to variable named password/secret/api_key/token; PEM private key block embedded in source file; credentials not loaded from environment or a secrets manager
- **severity:** critical
- **detector:** security patterns
- **remediation:** Move all secrets to environment variables or a secrets manager (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager). Add .env to .gitignore. Use gitleaks or truffleHog in pre-commit hooks.
- **citation:** IT Act 2000 §§43A, 66; DPDP Act 2023 §8(1)

### OBL-SEC-05 — Input validation and injection prevention
- **requirement:** Protect against OWASP Top 10 injection attacks: SQL injection, command injection, cross-site scripting (XSS), and CSRF. These are the most common paths to unauthorized data access that trigger DPDP and CERT-In reporting.
- **applies_when:** All apps accepting user input
- **evidence_hints:** SQL built by concatenating user-supplied strings rather than parameterised queries; unsanitised user content rendered as raw HTML markup; state-changing forms without anti-forgery tokens; shell commands constructed from user-controlled input
- **severity:** high
- **detector:** security patterns
- **remediation:** Use parameterised queries or ORM query builders for all database calls. Use context-aware output encoding for HTML rendering. Add CSRF middleware (csurf, Django CSRF, Spring Security CSRF, etc.). Never pass unsanitised user data to shell calls or dynamic rendering.
- **citation:** IT Act 2000 §§43A, 66

### OBL-SEC-06 — Access control and least privilege
- **requirement:** Users and internal services should have access only to what they need. Authentication must be enforced on all protected routes. No unauthenticated access to personal data.
- **applies_when:** All apps with authentication
- **evidence_hints:** Auth/session middleware on all protected route handlers; RBAC guards distinguishing admin from regular users; debug or admin endpoints requiring authentication; service accounts scoped to minimal permissions
- **severity:** high
- **remediation:** Audit all routes: apply auth middleware to every protected route. Implement RBAC. Gate or remove debug/admin endpoints. Rotate service account credentials. Run a DAST scan to find unprotected endpoints.
- **citation:** DPDP Act 2023 §8(1); IT Act 2000 §43A
