'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const psur = CC.rules.psurPms;

const full = { psurChecked: 6, psurTotal: 6 }; // completeness held constant

test('Class I -> PMS report only, no PSUR, kept in tech doc', () => {
  const r = psur.evaluate(Object.assign({ euClass: 'I', implant: false }, full));
  assert.ok(/PMS Report only/.test(r.tier));
  assert.ok(/technical documentation/.test(r.route));
  assert.ok(!/EUDAMED/.test(r.route));
});

test('Class IIa -> PSUR at least every 2 years, on request', () => {
  const r = psur.evaluate(Object.assign({ euClass: 'IIa', implant: false }, full));
  assert.ok(/every 2 years/.test(r.freq));
  assert.ok(!/EUDAMED/.test(r.route));
});

test('Class IIb (non-implant) -> annual PSUR, NOT routed via EUDAMED', () => {
  const r = psur.evaluate(Object.assign({ euClass: 'IIb', implant: false }, full));
  assert.ok(/annually/.test(r.freq));
  assert.ok(!/EUDAMED/.test(r.route), 'IIb non-implant stays on-request');
});

test('Class III -> annual PSUR, routed via EUDAMED (route gated on Class III)', () => {
  const r = psur.evaluate(Object.assign({ euClass: 'III', implant: false }, full));
  assert.ok(/annually/.test(r.freq));
  assert.ok(/EUDAMED/.test(r.route));
});

test('Class IIb implant -> annual PSUR, routed via EUDAMED (route gated on implant)', () => {
  const r = psur.evaluate(Object.assign({ euClass: 'IIb', implant: true }, full));
  assert.ok(/annually/.test(r.freq));
  assert.ok(/EUDAMED/.test(r.route), 'implant flag alone forces EUDAMED route independent of tier');
});

test('documentation completeness drives status independent of routing', () => {
  assert.strictEqual(psur.evaluate({ euClass: 'III', implant: false, psurChecked: 6, psurTotal: 6 }).status, CC.STATUS.GREEN);
  assert.strictEqual(psur.evaluate({ euClass: 'III', implant: false, psurChecked: 3, psurTotal: 6 }).status, CC.STATUS.AMBER);
  assert.strictEqual(psur.evaluate({ euClass: 'III', implant: false, psurChecked: 1, psurTotal: 6 }).status, CC.STATUS.RED);
});
