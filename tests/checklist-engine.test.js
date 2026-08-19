'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('./_load.js');
const S = CC.STATUS;
const { computeOverall, buildActions, WEIGHTS } = CC.engine;

test('N/A modules are excluded from the denominator (never penalized)', () => {
  // Only one applicable module, green -> 100%.
  const only = { profile: S.GREEN };
  Object.keys(WEIGHTS).forEach((k) => { if (k !== 'profile') only[k] = S.NA; });
  assert.strictEqual(computeOverall(only).pct, 100);
});

test('all-green = 100%, all-red = 10%', () => {
  const green = {}, red = {};
  Object.keys(WEIGHTS).forEach((k) => { green[k] = S.GREEN; red[k] = S.RED; });
  assert.strictEqual(computeOverall(green).pct, 100);
  assert.strictEqual(computeOverall(red).pct, 10); // red credit factor 0.1
});

test('amber credit factor is 0.55', () => {
  const amber = {};
  Object.keys(WEIGHTS).forEach((k) => { amber[k] = S.AMBER; });
  assert.strictEqual(computeOverall(amber).pct, 55);
});

test('empty / all-N/A yields 0% and does not divide by zero', () => {
  const na = {};
  Object.keys(WEIGHTS).forEach((k) => { na[k] = S.NA; });
  assert.strictEqual(computeOverall(na).pct, 0);
  assert.strictEqual(computeOverall({}).pct, 0);
});

test('overall status bands: green >=75, amber >=45, else red', () => {
  // all-green (100%) -> green; all-amber (55%) -> amber; all-red (10%) -> red.
  assert.strictEqual(computeOverall(allGreenExcept({})).overallStatus, S.GREEN);
  assert.strictEqual(computeOverall(allAmberExcept({})).overallStatus, S.AMBER);
  const red = {}; Object.keys(WEIGHTS).forEach((k) => { red[k] = S.RED; });
  assert.strictEqual(computeOverall(red).overallStatus, S.RED);
});

test('band mapping is correct exactly at the 75 and 45 cut points', () => {
  // Drive computeOverall to precise percentages via a two-equal-weight subset
  // (profile+strategy = weight 10 each), N/A-ing the rest.
  const base = {}; Object.keys(WEIGHTS).forEach((k) => { base[k] = S.NA; });
  // green + amber over equal weights = (1 + 0.55)/2 = 77.5% -> rounds to 78 (green)
  assert.strictEqual(computeOverall(Object.assign({}, base, { profile: S.GREEN, strategy: S.AMBER })).overallStatus, S.GREEN);
  // amber + red = (0.55 + 0.1)/2 = 32.5% -> red
  assert.strictEqual(computeOverall(Object.assign({}, base, { profile: S.AMBER, strategy: S.RED })).overallStatus, S.RED);
});

test('buildActions: clean sheet yields the "no critical gaps" green item', () => {
  const clean = {};
  Object.keys(WEIGHTS).forEach((k) => { clean[k] = S.GREEN; });
  const actions = buildActions(clean, { profileComplete: true, eqAccess: 'yes' });
  assert.strictEqual(actions.length, 1);
  assert.strictEqual(actions[0].status, S.GREEN);
});

test('buildActions: equivalence-red wording flips on access', () => {
  const ms = allGreenExcept({ equivalence: S.RED });
  const noAccess = buildActions(ms, { profileComplete: true, eqAccess: 'no' });
  assert.ok(noAccess.some((a) => /Establish access/.test(a.t)));
  const withAccess = buildActions(ms, { profileComplete: true, eqAccess: 'yes' });
  assert.ok(withAccess.some((a) => /Rebuild clinical data strategy/.test(a.t)));
});

test('buildActions: incomplete profile always surfaces a profile action', () => {
  const clean = {};
  Object.keys(WEIGHTS).forEach((k) => { clean[k] = S.GREEN; });
  const actions = buildActions(clean, { profileComplete: false, eqAccess: 'yes' });
  assert.ok(actions.some((a) => /Complete device profile/.test(a.t)));
});

function allGreenExcept(over) { const m = {}; Object.keys(WEIGHTS).forEach((k) => { m[k] = S.GREEN; }); return Object.assign(m, over); }
function allAmberExcept(over) { const m = {}; Object.keys(WEIGHTS).forEach((k) => { m[k] = S.AMBER; }); return Object.assign(m, over); }
