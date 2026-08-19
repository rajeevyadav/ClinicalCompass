'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const pccp = CC.rules.pccp;

test('not SaMD -> N/A', () => {
  assert.strictEqual(pccp.evaluate({ samd: false }).status, S.NA);
});
test('locked model -> N/A (PCCP optional)', () => {
  assert.strictEqual(pccp.evaluate({ samd: true, samdAdaptive: 'no', pccpChecked: 0, pccpTotal: 4 }).status, S.NA);
});
test('adaptive + all elements -> green', () => {
  assert.strictEqual(pccp.evaluate({ samd: true, samdAdaptive: 'yes', pccpChecked: 4, pccpTotal: 4 }).status, S.GREEN);
});
test('adaptive + partial -> amber; adaptive + few -> red', () => {
  assert.strictEqual(pccp.evaluate({ samd: true, samdAdaptive: 'yes', pccpChecked: 2, pccpTotal: 4 }).status, S.AMBER);
  assert.strictEqual(pccp.evaluate({ samd: true, samdAdaptive: 'yes', pccpChecked: 1, pccpTotal: 4 }).status, S.RED);
});
