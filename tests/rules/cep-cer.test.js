'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const cep = CC.rules.cepCer;

test('avg >=85 -> green', () => {
  assert.strictEqual(cep.evaluate({ cepChecked: 8, cepTotal: 8, cerChecked: 8, cerTotal: 9 }).status, S.GREEN);
});
test('avg in [50,85) -> amber', () => {
  assert.strictEqual(cep.evaluate({ cepChecked: 5, cepTotal: 8, cerChecked: 5, cerTotal: 9 }).status, S.AMBER);
});
test('avg <50 -> red', () => {
  assert.strictEqual(cep.evaluate({ cepChecked: 2, cepTotal: 8, cerChecked: 2, cerTotal: 9 }).status, S.RED);
});
test('reports both percentages', () => {
  const r = cep.evaluate({ cepChecked: 4, cepTotal: 8, cerChecked: 3, cerTotal: 9 });
  assert.strictEqual(r.cepPct, 50);
  assert.strictEqual(r.cerPct, 33);
});
