import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBeforeHeading } from '../src/lib/split-html.ts';

test('splitBeforeHeading splits right before the h2 with the given id', () => {
  const html = '<h2 id="problem">Problem</h2><p>a</p><h2 id="my-role">My role</h2><p>b</p>';
  assert.deepEqual(splitBeforeHeading(html, 'my-role'), [
    '<h2 id="problem">Problem</h2><p>a</p>',
    '<h2 id="my-role">My role</h2><p>b</p>',
  ]);
});

test('splitBeforeHeading returns everything in the first part when the heading is missing', () => {
  const html = '<h2 id="problem">Problem</h2><p>a</p>';
  assert.deepEqual(splitBeforeHeading(html, 'my-role'), [html, '']);
});
