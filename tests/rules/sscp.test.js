'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const sscp = CC.rules.sscp;

test('not Class III / not implant -> N/A', () => {
  assert.strictEqual(sscp.evaluate({ euClass: 'IIa', implant: false, sscpChecked: 0, sscpTotal: 6 }).status, S.NA);
});
test('applicable but not consistent with CER -> red', () => {
  assert.strictEqual(sscp.evaluate({ euClass: 'III', sscpConsistency: 'no', sscpChecked: 6, sscpTotal: 6 }).status, S.RED);
});
test('consistent + >=85% -> green', () => {
  assert.strictEqual(sscp.evaluate({ implant: true, sscpConsistency: 'yes', sscpChecked: 6, sscpTotal: 6 }).status, S.GREEN);
});
test('consistent but incomplete -> amber', () => {
  assert.strictEqual(sscp.evaluate({ euClass: 'III', sscpConsistency: 'yes', sscpChecked: 3, sscpTotal: 6 }).status, S.AMBER);
});
