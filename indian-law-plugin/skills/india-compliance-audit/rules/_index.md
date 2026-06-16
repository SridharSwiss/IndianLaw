# Rules Index — Applicability Matrix

This index lists every law pack and which app profiles trigger it.
The audit SKILL.md reads this first to select which packs to load.

## Applicability matrix

| Pack file | Always | ecommerce | fintech | health | ugc | public-website | erp | children | aadhaar |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `dpdp-act.md` | ✓ | | | | | | | | |
| `dpdp-children.md` | | | | | | | | ✓ | |
| `it-act.md` | ✓ | | | | | | | | |
| `spdi-rules.md` | ✓ | | | | | | | | |
| `cert-in.md` | ✓ | | | | | | | | |
| `security-safeguards.md` | ✓ | | | | | | | | |
| `accessibility.md` | ✓ | | | | | ✓ priority | | | |
| `intermediary-rules.md` | | | | | ✓ | | | | |
| `rbi-fintech.md` | | | ✓ | | | | | | |
| `consumer-ecommerce.md` | | ✓ | | | | | | | |
| `aadhaar-uidai.md` | | | | | | | | | ✓ |
| `health-abdm.md` | | | | ✓ | | | | | |
| `business-tax.md` | ✓ info | | | | | | | | |
| `standards.md` | ✓ info | | | | | | | | |

**Notes:**
- `✓` = include this pack.
- `✓ priority` = include and escalate severity (public websites have stronger accessibility duty).
- `✓ info` = include as informational (business-tax and standards are not code-checkable; shown in manual-review section).
- Always-included packs apply to every app — they cover obligations that hit any software touching personal data.

## Pack obligation count reference

| Pack | Obligations | Key penalties |
|---|---|---|
| dpdp-act | 12 | ₹250 crore |
| dpdp-children | 4 | ₹200 crore |
| it-act | 4 | ₹5 lakh + imprisonment |
| spdi-rules | 3 | ₹5 lakh |
| cert-in | 5 | ₹1 lakh |
| security-safeguards | 6 | Civil/criminal liability |
| accessibility | 6 | ₹1–5 lakh (SEBI entities) |
| intermediary-rules | 3 | Loss of safe harbor |
| rbi-fintech | 3 | License cancellation |
| consumer-ecommerce | 3 | ₹10 lakh fine |
| aadhaar-uidai | 4 | ₹1 crore |
| health-abdm | 4 | ₹5 lakh |
| business-tax | 5 | Tax penalties + interest |
| standards | 2 | Voluntary |

*All penalties are indicative; verify current schedules at official sources before citing.*
