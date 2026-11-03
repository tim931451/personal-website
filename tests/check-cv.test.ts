import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';

// Das Original-PDF (mit Adresse) liegt nur lokal in OneDrive und wird nie ins Repo kopiert.
const ORIGINAL = `${homedir()}/Library/CloudStorage/OneDrive-Personal/HS26/Claude outputs/Lebenslauf_Tim_Rusch_2026-11.pdf`;
const run = (pdf: string, env: Record<string, string> = {}) =>
  spawnSync('sh', ['scripts/check-cv.sh', pdf], { env: { ...process.env, ...env }, encoding: 'utf8' });

// .private-patterns ist gitignored; auf einem frischen Clone fehlt sie (siehe CLAUDE.md).
const hasPatterns = existsSync('.private-patterns');

test('check-cv accepts the web CV in public/', { skip: !hasPatterns }, () => {
  assert.equal(run('public/cv.pdf').status, 0);
});

test('check-cv rejects the original CV with private data', { skip: !existsSync(ORIGINAL) || !hasPatterns }, () => {
  assert.equal(run(ORIGINAL).status, 1);
});

test('check-cv fails when the private pattern file is missing', () => {
  assert.equal(run('public/cv.pdf', { PRIVATE_PATTERNS: '/nonexistent/.private-patterns' }).status, 1);
});

test('check-cv fails when the file cannot be read as PDF', { skip: !hasPatterns }, () => {
  assert.equal(run('package.json').status, 1);
});
