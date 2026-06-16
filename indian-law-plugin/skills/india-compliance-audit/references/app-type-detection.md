# App-Type Detection Reference

This reference tells the audit skill how to classify an unknown codebase into one or more
app profiles. Profiles control which law packs are selected from `rules/_index.md`.

## Profiles

| Profile ID | Label | Description |
|---|---|---|
| `generic` | Generic (any app with personal data) | Default — always included |
| `ecommerce` | E-commerce / Marketplace | Sells goods/services; has cart, orders, payments |
| `fintech` | Fintech / Payments / Lending | Processes payments, offers credit, wallets, UPI |
| `health` | Health / Telemedicine / EHR | Medical records, appointments, diagnoses, prescriptions |
| `ugc` | User-Generated Content / Platform | Users post content; forum, marketplace, social, messaging |
| `public-website` | Public / Government / Institutional website | School website, NGO, government portal, landing page |
| `erp` | ERP / Internal Business App | Handles employee data, HR, payroll, financials |
| `children` | App used by / targeting under-18 | School app, edtech, games, social for minors |
| `aadhaar` | Aadhaar eKYC / Auth | Integrates UIDAI eKYC or Aadhaar auth |

## Detection signals (read these files/patterns first)

### File signals
| File / Pattern | Suggests |
|---|---|
| `package.json`, `pom.xml`, `requirements.txt`, `build.gradle` | Language/framework |
| Routes containing `/cart`, `/order`, `/checkout`, `/product` | `ecommerce` |
| Routes or controllers containing `/pay`, `/payment`, `/upi`, `/wallet`, `/loan`, `/emi` | `fintech` |
| Routes/controllers containing `/patient`, `/doctor`, `/prescription`, `/appointment`, `/health`, `/ehr` | `health` |
| Routes/controllers containing `/post`, `/comment`, `/feed`, `/forum`, `/reply`, `/upload` | `ugc` |
| Code importing uidai, aadhaar, ekyc SDKs; strings like `uidai`, `AadhaarOTP`, `eKYC` | `aadhaar` |
| Keywords in code/config: `employee`, `payroll`, `hr`, `salary`, `inventory`, `ledger` | `erp` |
| Keywords: `student`, `parent`, `school`, `class`, `grade`, `teacher`, `edtech`, minimum-age check | `children` |
| `index.html` only, no server-side routes, no auth, static site | `public-website` |

### Dependency signals
| Dependency | Suggests |
|---|---|
| `razorpay`, `payu`, `cashfree`, `stripe`, `braintree`, `upi-sdk` | `fintech` |
| `aadhaar-api`, `uidai-sdk` | `aadhaar` |
| `@abdm/sdk`, `fhir.js`, `hapi-fhir` | `health` |
| `woocommerce`, `shopify`, `magento`, `medusa` | `ecommerce` |
| `age-verification`, `parental-consent` | `children` |

### Config / env signals
| Pattern | Suggests |
|---|---|
| Env vars like `RAZORPAY_KEY`, `PAYMENT_GATEWAY`, `UPI_*` | `fintech` |
| Env vars like `UIDAI_*`, `AADHAAR_*` | `aadhaar` |
| Env vars like `ABDM_*`, `ABHA_*` | `health` |

## How to apply

1. Read `package.json` / root build files for dependencies.
2. Glob for route files and scan for the keywords above.
3. Assign **all** matching profiles (an app can be both `ecommerce` and `fintech`).
4. `generic` is ALWAYS included regardless of other profiles.
5. If any profile matches signals for under-18 users (school, edtech, age-check present), add `children`.
6. Pass the profile list to `rules/_index.md` to select law packs.
