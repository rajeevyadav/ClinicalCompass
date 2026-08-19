'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const gap = CC.rules.dataGap;

test('0 sources -> red', () => {
  assert.strictEqual(gap.evaluate({ gapSourcesChecked: 0, gapSourcesTotal: 5 }).status, S.RED);
});
test('1-2 sources -> amber', () => {
  assert.strictEqual(gap.evaluate({ gapSourcesChecked: 2, gapSourcesTotal: 5 }).status, S.AMBER);
});
test('3+ sources -> green', () => {
  assert.strictEqual(gap.evaluate({ gapSourcesChecked: 3, gapSourcesTotal: 5 }).status, S.GREEN);
});
test('prompts for claims when none entered', () => {
  assert.ok(/Add claimed/.test(gap.evaluate({ gapSourcesChecked: 3, gapSourcesTotal: 5, gapClaims: '' }).text));
});
