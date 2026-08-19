'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const hf = CC.rules.humanFactors;

test('mapped + summative -> green', () => {
  assert.strictEqual(hf.evaluate({ hfMapped: 'yes', hfSummative: 'yes' }).status, S.GREEN);
});
test('not mapped + high use-risk -> red', () => {
  assert.strictEqual(hf.evaluate({ hfMapped: 'no', hfSummative: 'yes', highUseRisk: true }).status, S.RED);
});
test('not mapped without high use-risk -> amber', () => {
  assert.strictEqual(hf.evaluate({ hfMapped: 'no', hfSummative: 'yes', highUseRisk: false }).status, S.AMBER);
});
test('mapped but no summative -> amber', () => {
  assert.strictEqual(hf.evaluate({ hfMapped: 'yes', hfSummative: 'no' }).status, S.AMBER);
});
