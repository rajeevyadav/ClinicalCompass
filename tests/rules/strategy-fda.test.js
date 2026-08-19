'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const fda = CC.rules.strategyFDA;

test('each pathway yields distinct, on-topic guidance text', () => {
  assert.ok(/510\(k\)-exempt/.test(fda.evaluate({ fdaPath: 'I' }).text));
  assert.ok(/Substantial equivalence/.test(fda.evaluate({ fdaPath: 'II-510k' }).text));
  assert.ok(/De Novo/.test(fda.evaluate({ fdaPath: 'II-denovo' }).text));
  assert.ok(/PMA/.test(fda.evaluate({ fdaPath: 'III-pma' }).text));
});

test('carries CFR citations', () => {
  assert.ok(/21 CFR/.test(fda.evaluate({ fdaPath: 'II-510k' }).cites[0].ref));
});
