import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visibleSkills, ownStack } from '../src/lib/skills.ts';

const groups = [
  {
    group: 'Engineering',
    items: [
      { name: 'Git and GitHub', general: true },
      { name: 'FastAPI' },
      { name: 'Google Cloud Run' },
      { name: 'CI/CD on render.com', match: ['render.com'] },
    ],
  },
  { group: 'Only drafts', items: [{ name: 'Tableau Prep' }] },
];

test('visibleSkills keeps general skills and skills backed by a visible stack', () => {
  assert.deepEqual(visibleSkills(groups, [['FastAPI', 'render.com']]), [
    { group: 'Engineering', items: ['Git and GitHub', 'FastAPI', 'CI/CD on render.com'] },
  ]);
});

test('visibleSkills matches stack entries case-insensitively', () => {
  assert.deepEqual(visibleSkills(groups, [['fastapi']])[0].items, ['Git and GitHub', 'FastAPI']);
});

test('visibleSkills drops groups without any visible skill', () => {
  assert.equal(visibleSkills(groups, [[]]).some((g) => g.group === 'Only drafts'), false);
});

test('ownStack removes the stack entries built by teammates', () => {
  assert.deepEqual(ownStack({ stack: ['AgentCore', 'Streamlit'], teamStack: ['Streamlit'] }), ['AgentCore']);
  assert.deepEqual(ownStack({ stack: ['FastAPI'] }), ['FastAPI']);
});
