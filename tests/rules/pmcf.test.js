'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const pmcf = CC.rules.pmcf;

test('a method selected -> green', () => {
  assert.strictEqual(pmcf.evaluate({ pmcfChecked: 1, pmcfJustify: '' }).status, S.GREEN);
});
test('no method but substantial justification -> amber', () => {
  assert.strictEqual(pmcf.evaluate({ pmcfChecked: 0, pmcfJustify: 'Low residual risk, well-established tech' }).status, S.AMBER);
});
test('no method, trivial/empty justification -> red', () => {
  assert.strictEqual(pmcf.evaluate({ pmcfChecked: 0, pmcfJustify: 'n/a' }).status, S.RED);
});
