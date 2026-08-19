'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const samd = CC.rules.samdAi;
const P = { samd: true, samdAssoc: 'established', samdAnalytical: 'established', samdClinical: 'established' };

test('not SaMD -> N/A', () => {
  assert.strictEqual(samd.evaluate({ samd: false }).status, S.NA);
});
test('all three pillars established -> green', () => {
  assert.strictEqual(samd.evaluate(P).status, S.GREEN);
});
test('any pillar not established -> red', () => {
  assert.strictEqual(samd.evaluate(Object.assign({}, P, { samdClinical: 'not-established' })).status, S.RED);
});
test('a partial pillar -> amber', () => {
  assert.strictEqual(samd.evaluate(Object.assign({}, P, { samdAnalytical: 'partial' })).status, S.AMBER);
});
test('adaptive model appends change-control note', () => {
  assert.ok(/adaptive/.test(samd.evaluate(Object.assign({}, P, { samdAdaptive: 'yes' })).text));
});
