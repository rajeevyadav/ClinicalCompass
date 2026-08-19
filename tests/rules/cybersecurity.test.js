'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const cyber = CC.rules.cybersecurity;

test('not networked and not software -> N/A', () => {
  assert.strictEqual(cyber.evaluate({ networked: false, samd: false }).status, S.NA);
});
test('applicable via networked flag; 100% -> green', () => {
  assert.strictEqual(cyber.evaluate({ networked: true, cyberChecked: 4, cyberTotal: 4 }).status, S.GREEN);
});
test('applicable via samd flag; partial -> amber; none -> red', () => {
  assert.strictEqual(cyber.evaluate({ samd: true, cyberChecked: 2, cyberTotal: 4 }).status, S.AMBER);
  assert.strictEqual(cyber.evaluate({ samd: true, cyberChecked: 0, cyberTotal: 4 }).status, S.RED);
});
