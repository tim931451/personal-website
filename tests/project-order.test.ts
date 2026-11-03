import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visibleSorted, splitFeatured } from '../src/lib/project-order.ts';

const entry = (id: string, order: number, draft = false, featured = false) => ({
  id,
  data: { order, draft, featured },
});

test('visibleSorted drops drafts and sorts by order ascending', () => {
  const input = [entry('c', 3), entry('draft', 0, true), entry('a', 1), entry('b', 2)];
  assert.deepEqual(
    visibleSorted(input).map((e) => e.id),
    ['a', 'b', 'c'],
  );
});

test('splitFeatured keeps order and separates featured from the rest', () => {
  const visible = [1, 2, 3, 4, 5, 6].map((n) => entry(`p${n}`, n, false, n <= 4));
  const { featured, more } = splitFeatured(visible);
  assert.deepEqual(featured.map((e) => e.id), ['p1', 'p2', 'p3', 'p4']);
  assert.deepEqual(more.map((e) => e.id), ['p5', 'p6']);
});
