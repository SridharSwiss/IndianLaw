---
id: accessibility
title: Accessibility — WCAG 2.1 AA, IS 17802, RPwD Act §40
applies_to: [all, public-website priority]
status: "Active; mandatory for government portals and SEBI-regulated entities; best practice for all"
penalty: "₹1–5 lakh for SEBI entities; civil liability under RPwD Act"
sources:
  - https://www.w3.org/WAI/WCAG21/quickref/
  - https://bis.gov.in/other/standards.php
  - https://rpwd.gov.in/
---

## Accessibility Obligations

### OBL-A11Y-01 — Document language declaration
- **requirement:** Every HTML document must declare its primary language using the `lang` attribute on the `<html>` element. Required by WCAG 2.1 SC 3.1.1.
- **applies_when:** All web apps
- **evidence_hints:** `<html lang="en">` or `<html lang="hi">` in root HTML template; Next.js `<Html lang="en">` in `_document.js`; `lang` attribute in base layout
- **severity:** medium
- **detector:** accessibility patterns
- **remediation:** Add `lang="en"` (or appropriate IETF language tag) to the root `<html>` element in all HTML templates.
- **citation:** WCAG 2.1 SC 3.1.1; IS 17802:2018

### OBL-A11Y-02 — Images have alternative text
- **requirement:** All meaningful images must have descriptive `alt` text. Decorative images must have `alt=""`. Required by WCAG 2.1 SC 1.1.1.
- **applies_when:** All web apps with images
- **evidence_hints:** `<img>` elements without `alt` attribute in HTML/JSX templates
- **severity:** medium
- **detector:** accessibility patterns
- **remediation:** Add `alt="[descriptive text]"` to all informational images. Use `alt=""` for purely decorative images so screen readers skip them.
- **citation:** WCAG 2.1 SC 1.1.1; IS 17802:2018

### OBL-A11Y-03 — Form inputs have labels
- **requirement:** Every form input must have a programmatically associated label (not just a placeholder). Placeholder text alone disappears when the user types.
- **applies_when:** All web apps with forms
- **evidence_hints:** `<input>` elements with placeholder but no `id` (and therefore no associated `<label for="">`) in HTML/JSX templates
- **severity:** medium
- **detector:** accessibility patterns
- **remediation:** Add `<label for="field-id">Label text</label>` for every `<input id="field-id">`. Alternatively use `aria-label` or `aria-labelledby`.
- **citation:** WCAG 2.1 SC 1.3.1, 3.3.2; IS 17802:2018

### OBL-A11Y-04 — Keyboard accessibility
- **requirement:** All interactive elements must be operable by keyboard. Focus outline must be visible. Custom interactive elements (div/span with onClick) must have `role`, `tabIndex`, and keyboard event handlers.
- **applies_when:** All web apps
- **evidence_hints:** `outline: none` or `outline: 0` in CSS without a custom focus indicator replacement; `onClick` on `<div>` or `<span>` without `role="button"` and `onKeyDown`
- **severity:** medium
- **detector:** accessibility patterns
- **remediation:** REM-A11Y-01. Never suppress focus outline without providing a visible custom indicator. Replace `<div onClick>` with `<button>` or add `role="button" tabIndex={0} onKeyDown`.
- **citation:** WCAG 2.1 SC 2.1.1, 2.4.7

### OBL-A11Y-05 — Colour contrast ratio
- **requirement:** Body text must have a contrast ratio of at least 4.5:1 against its background. Large text (18pt or 14pt bold) requires 3:1.
- **applies_when:** All web apps
- **evidence_hints:** Not auto-detectable from code. Check with browser DevTools accessibility panel or WebAIM Contrast Checker. Flag as not-auto-verifiable.
- **severity:** medium
- **remediation:** Test colour combinations with WebAIM Contrast Checker. Common failures: grey text on white (#767676 on #fff is 4.48:1 — borderline). Use a design linter (Storybook a11y addon, Figma A11y plugin) to catch during design.
- **citation:** WCAG 2.1 SC 1.4.3

### OBL-A11Y-06 — Publish an accessibility statement
- **requirement:** Public-facing websites should publish an accessibility statement declaring conformance level (WCAG 2.1 AA), known limitations, and contact for accessibility issues. Mandatory for government portals; strongly recommended for all.
- **applies_when:** All public-facing web apps; mandatory for public-website profile
- **evidence_hints:** Accessibility statement page or file in codebase; `/accessibility` or `/a11y` route; WCAG mention in footer
- **severity:** low
- **remediation:** Publish an accessibility statement at `/accessibility`. Include: WCAG conformance level, date of last review, known exceptions, and email for reporting accessibility issues.
- **citation:** IS 17802:2018; Government web accessibility guidelines; RPwD Act 2016 §40
