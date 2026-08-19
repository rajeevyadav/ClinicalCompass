'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const eq = CC.rules.equivalence;
const EQ = { eqTech: 'equivalent', eqBio: 'equivalent', eqClin: 'equivalent', eqAccess: 'yes' };

test('no access -> red regardless of pillars', () => {
  assert.strictEqual(eq.evaluate(Object.assign({}, EQ, { eqAccess: 'no' })).status, S.RED);
});

test('all pillars equivalent + access -> green', () => {
  assert.strictEqual(eq.evaluate(EQ).status, S.GREEN);
});

test('any not-equivalent pillar -> red', () => {
  assert.strictEqual(eq.evaluate(Object.assign({}, EQ, { eqBio: 'not-equivalent' })).status, S.RED);
});

test('minor differences (no not-equivalent) -> amber', () => {
  assert.strictEqual(eq.evaluate(Object.assign({}, EQ, { eqClin: 'minor-diff' })).status, S.AMBER);
});
