'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const eu = CC.rules.strategyEU;

test('implant/Class III + no exception -> red, and triggers Annex XV note', () => {
  const r = eu.evaluate({ art61Implant: 'yes', art61Exception: 'no' });
  assert.strictEqual(r.status, S.RED);
  assert.strictEqual(r.annexXV, true);
  assert.ok(/Annex XV/.test(r.annexXVCites[0].ref));
});

test('implant + exception -> amber, echoes the specific claimed sub-type', () => {
  const label = 'Art. 61(6)(a) — legacy MDD/AIMDD device ...';
  const r = eu.evaluate({ art61Implant: 'yes', art61Exception: 'yes', art61SubtypeLabel: label });
  assert.strictEqual(r.status, S.AMBER);
  assert.strictEqual(r.annexXV, false);
  assert.ok(r.text.indexOf(label) !== -1, 'names the exact sub-type route');
});

test('all four exception sub-types produce distinct amber text', () => {
  const labels = ['61-5', '61-6a', '61-6b', 'equiv-competitor'].map((v) => 'route:' + v);
  const texts = labels.map((l) => eu.evaluate({ art61Implant: 'yes', art61Exception: 'yes', art61SubtypeLabel: l }).text);
  assert.strictEqual(new Set(texts).size, 4);
});

test('not implant/Class III -> green, no Annex XV note', () => {
  const r = eu.evaluate({ art61Implant: 'no', art61Exception: 'no' });
  assert.strictEqual(r.status, S.GREEN);
  assert.strictEqual(r.annexXV, false);
});

test('carries an Art. 61 citation', () => {
  const r = eu.evaluate({ art61Implant: 'no', art61Exception: 'no' });
  assert.ok(/Art\. 61/.test(r.cites[0].ref));
  assert.ok(r.cites[0].verifiedAsOf);
});
