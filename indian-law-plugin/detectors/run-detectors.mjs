#!/usr/bin/env node
/**
 * India Compliance Detectors — zero-dependency scanner
 * Usage: node run-detectors.mjs <project-root> [--pack <name>] [--json]
 *
 * Scans source files for India-specific PII, data-residency signals,
 * missing policy artifacts, security weaknesses, and accessibility issues.
 *
 * Exits with code 0 (audit tool, not a CI gate).
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, resolve, relative } from 'path';
import { createHash } from 'crypto';

// ── Verhoeff checksum for Aadhaar validation ─────────────────────────────────
const D = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],
  [7,6,5,9,8,2,1,0,4,3],
  [8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0],
];
const P = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8],
];
const INV = [0,4,3,2,1,5,6,7,8,9];

function verhoeff(num) {
  const digits = String(num).replace(/\s/g, '').split('').reverse().map(Number);
  let c = 0;
  for (let i = 0; i < digits.length; i++) c = D[c][P[i % 8][digits[i]]];
  return c === 0;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const UPI_EMAIL_DOMAINS = new Set([
  'gmail','yahoo','outlook','hotmail','proton','icloud','me','mac',
  'live','msn','rediffmail','ymail','aol','zoho','fastmail',
]);

function isUpiVpa(match) {
  const parts = match.split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase().replace(/\.(com|in|org|net|gov|co)$/, '');
  return !UPI_EMAIL_DOMAINS.has(domain);
}

const SCRIPT_DIR = new URL('.', import.meta.url).pathname;

function loadPattern(name) {
  const p = join(SCRIPT_DIR, 'patterns', `${name}.json`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

// ── File walker ───────────────────────────────────────────────────────────────
function* walkFiles(dir, excludeDirs, excludeExts) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (!excludeDirs.includes(e.name)) yield* walkFiles(full, excludeDirs, excludeExts);
    } else if (e.isFile()) {
      if (!excludeExts.includes(extname(e.name))) yield full;
    }
  }
}

// ── Pattern scanner ───────────────────────────────────────────────────────────
function scanPii(projectRoot) {
  const pack = loadPattern('india-pii');
  const findings = [];
  const seen = new Set();

  for (const file of walkFiles(projectRoot, pack.exclude_dirs, pack.exclude_extensions)) {
    let content;
    try { content = readFileSync(file, 'utf8'); } catch { continue; }
    const lines = content.split('\n');

    for (const pat of pack.patterns) {
      const re = new RegExp(pat.regex, 'g');
      let m;
      while ((m = re.exec(content)) !== null) {
        const lineNum = content.slice(0, m.index).split('\n').length;
        const raw = m[0];

        if (pat.verify === 'verhoeff') {
          const digits = raw.replace(/\s/g, '');
          if (!verhoeff(digits)) continue;
        }
        if (pat.id === 'IPII-04' && !isUpiVpa(raw)) continue;

        const key = `${pat.id}|${file}|${lineNum}`;
        if (seen.has(key)) continue;
        seen.add(key);

        findings.push({
          pack: 'india-pii',
          id: pat.id,
          name: pat.name,
          severity: pat.severity,
          obligation: pat.obligation,
          file: relative(projectRoot, file),
          line: lineNum,
          match: raw.slice(0, 40),
          note: pat.note,
        });
      }
    }
  }
  return findings;
}

function scanDataResidency(projectRoot) {
  const pack = loadPattern('data-residency');
  const findings = [];
  const seen = new Set();

  for (const file of walkFiles(projectRoot, pack.exclude_dirs, pack.exclude_extensions)) {
    let content;
    try { content = readFileSync(file, 'utf8'); } catch { continue; }

    for (const pat of pack.patterns) {
      const flags = pat.case_insensitive ? 'gi' : 'g';
      const re = new RegExp(pat.regex, flags);
      let m;
      while ((m = re.exec(content)) !== null) {
        const lineNum = content.slice(0, m.index).split('\n').length;
        const key = `${pat.id}|${file}|${lineNum}`;
        if (seen.has(key)) continue;
        seen.add(key);

        findings.push({
          pack: 'data-residency',
          id: pat.id,
          name: pat.name,
          severity: pat.severity,
          obligation: pat.obligation,
          file: relative(projectRoot, file),
          line: lineNum,
          match: m[0].slice(0, 60),
        });
      }
    }
  }
  return findings;
}

function scanSecurity(projectRoot) {
  const pack = loadPattern('security');
  const findings = [];
  const seen = new Set();

  for (const file of walkFiles(projectRoot, pack.exclude_dirs, pack.exclude_extensions)) {
    if (pack.exclude_files) {
      const base = file.split('/').pop();
      if (pack.exclude_files.some(p => p.startsWith('*') ? base.endsWith(p.slice(1)) : base === p)) continue;
    }
    let content;
    try { content = readFileSync(file, 'utf8'); } catch { continue; }

    for (const pat of pack.patterns) {
      const flags = (pat.case_insensitive ? 'i' : '') + 'g';
      const re = new RegExp(pat.regex, flags);
      let m;
      while ((m = re.exec(content)) !== null) {
        const lineNum = content.slice(0, m.index).split('\n').length;
        const raw = m[0];

        if (pat.false_positive_filters) {
          const lineContent = content.split('\n')[lineNum - 1] || '';
          if (pat.false_positive_filters.some(fp => new RegExp(fp).test(lineContent))) continue;
        }

        const key = `${pat.id}|${file}|${lineNum}`;
        if (seen.has(key)) continue;
        seen.add(key);

        findings.push({
          pack: 'security',
          id: pat.id,
          name: pat.name,
          severity: pat.severity,
          obligation: pat.obligation,
          file: relative(projectRoot, file),
          line: lineNum,
          match: raw.slice(0, 80),
        });
      }
    }
  }
  return findings;
}

function scanAccessibility(projectRoot) {
  const pack = loadPattern('accessibility');
  const findings = [];
  const seen = new Set();

  for (const file of walkFiles(projectRoot, pack.exclude_dirs, pack.exclude_extensions)) {
    const ext = extname(file);
    let content;
    try { content = readFileSync(file, 'utf8'); } catch { continue; }

    for (const pat of pack.patterns) {
      if (pat.file_types && !pat.file_types.includes(ext)) continue;
      const re = new RegExp(pat.regex, 'g');
      let m;
      while ((m = re.exec(content)) !== null) {
        const lineNum = content.slice(0, m.index).split('\n').length;
        const key = `${pat.id}|${file}|${lineNum}`;
        if (seen.has(key)) continue;
        seen.add(key);

        findings.push({
          pack: 'accessibility',
          id: pat.id,
          name: pat.name,
          severity: pat.severity,
          obligation: pat.obligation,
          file: relative(projectRoot, file),
          line: lineNum,
          match: m[0].slice(0, 80),
        });
      }
    }
  }
  return findings;
}

function scanPolicyArtifacts(projectRoot) {
  const pack = loadPattern('policy-artifacts');
  const findings = [];

  for (const check of pack.file_presence_checks) {
    let found = false;

    if (check.look_for_files) {
      for (const name of check.look_for_files) {
        for (const ext of ['', '.md', '.html', '.txt', '.rst']) {
          if (existsSync(join(projectRoot, name + ext)) ||
              existsSync(join(projectRoot, 'docs', name + ext)) ||
              existsSync(join(projectRoot, 'public', name + ext))) {
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    if (!found && check.look_for_patterns) {
      try {
        for (const file of walkFiles(projectRoot, pack.exclude_dirs, [])) {
          let content;
          try { content = readFileSync(file, 'utf8'); } catch { continue; }
          if (check.look_for_patterns.some(p => new RegExp(p, 'i').test(content))) {
            found = true;
            break;
          }
        }
      } catch { /* ignore */ }
    }

    if (!found && check.required) {
      findings.push({
        pack: 'policy-artifacts',
        id: check.id,
        name: check.name,
        severity: check.severity,
        obligation: check.obligation,
        file: null,
        line: null,
        match: null,
        description: check.description,
      });
    }
  }
  return findings;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const projectRoot = resolve(args[0] || process.cwd());
const packFilter = args.includes('--pack') ? args[args.indexOf('--pack') + 1] : null;
const jsonMode = args.includes('--json') || !process.stdout.isTTY;

const allFindings = [
  ...scanPii(projectRoot),
  ...scanDataResidency(projectRoot),
  ...scanSecurity(projectRoot),
  ...scanAccessibility(projectRoot),
  ...scanPolicyArtifacts(projectRoot),
].filter(f => !packFilter || f.pack === packFilter);

if (jsonMode) {
  process.stdout.write(JSON.stringify({ projectRoot, findings: allFindings }, null, 2) + '\n');
} else {
  const bySeverity = { critical: [], high: [], medium: [], low: [], info: [] };
  for (const f of allFindings) (bySeverity[f.severity] || bySeverity.info).push(f);

  console.log(`\nIndia Compliance Detectors — ${allFindings.length} finding(s) in ${projectRoot}\n`);
  for (const [sev, items] of Object.entries(bySeverity)) {
    if (!items.length) continue;
    console.log(`\n── ${sev.toUpperCase()} (${items.length}) ──`);
    for (const f of items) {
      const loc = f.file ? `  ${f.file}:${f.line}` : '  (file not found)';
      console.log(`[${f.id}] ${f.name}`);
      console.log(loc);
      if (f.match) console.log(`  Match: ${f.match}`);
      if (f.description) console.log(`  ${f.description}`);
    }
  }
  console.log('\nNOT LEGAL ADVICE. Run /india-audit for full analysis.\n');
}

process.exit(0);
