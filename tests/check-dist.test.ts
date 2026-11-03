import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const page = (body: string, head = '<meta name="description" content="d"><link rel="canonical" href="https://x/"><meta property="og:image" content="https://x/og.png">') =>
  `<!doctype html><html lang="en"><head><title>T</title>${head}</head><body>${body}</body></html>`;

function site(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'dist-'));
  for (const [path, html] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), html);
  }
  return dir;
}
const check = (dir: string) => spawnSync('node', ['scripts/check-dist.mjs', dir], { encoding: 'utf8' });

test('check-dist passes a clean site', () => {
  const dir = site({
    'index.html': page('<a href="/about/">About</a> <a href="#x">X</a><h2 id="x">X</h2> <img src="/a.png" alt="A">'),
    'about/index.html': page('<p>© 2026 Tim</p><a href="/#x">Back</a>'),
  });
  const r = check(dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('check-dist rejects long dashes in visible text', () => {
  assert.equal(check(site({ 'index.html': page('<p>a — b</p>') })).status, 1);
});

test('check-dist rejects placeholder words', () => {
  assert.equal(check(site({ 'index.html': page('<p>TODO write intro</p>') })).status, 1);
});

test('check-dist rejects a broken internal link', () => {
  assert.equal(check(site({ 'index.html': page('<a href="/missing/">x</a>') })).status, 1);
});

test('check-dist rejects a link to a missing anchor', () => {
  assert.equal(check(site({ 'index.html': page('<a href="#nowhere">x</a>') })).status, 1);
});

test('check-dist rejects a page without meta description', () => {
  assert.equal(check(site({ 'index.html': page('<p>ok</p>', '<link rel="canonical" href="https://x/">') })).status, 1);
});

test('check-dist rejects an image without alt', () => {
  assert.equal(check(site({ 'index.html': page('<img src="/a.png">') })).status, 1);
});

test('check-dist rejects a Swiss phone number', () => {
  assert.equal(check(site({ 'index.html': page('<p>Call +41 79 000 00 00</p>') })).status, 1);
});

test('check-dist rejects links to draft projects', () => {
  assert.equal(check(site({ 'index.html': page('<a href="/projects/ad-campaign-prediction/">x</a>'), 'projects/ad-campaign-prediction/index.html': page('<p>x</p>') })).status, 1);
});
