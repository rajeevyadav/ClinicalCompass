'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const profile = CC.rules.profile;

test('all four fields >3 chars -> complete/green', () => {
  const r = profile.evaluate({ deviceName: 'ABCD', intendedPurpose: 'diagnose X', population: 'adults', userEnv: 'clinic', euClass: 'IIa' });
  assert.strictEqual(r.complete, true);
  assert.strictEqual(r.status, S.GREEN);
});

test('missing field -> amber', () => {
  const r = profile.evaluate({ deviceName: 'ABCD', intendedPurpose: '', population: 'adults', userEnv: 'clinic' });
  assert.strictEqual(r.status, S.AMBER);
});

test('Rule 11 auto-flag fires for SaMD + Class I only', () => {
  assert.strictEqual(profile.evaluate({ samd: true, euClass: 'I' }).rule11, true);
  assert.strictEqual(profile.evaluate({ samd: true, euClass: 'Im' }).rule11, true);
  assert.strictEqual(profile.evaluate({ samd: true, euClass: 'IIa' }).rule11, false);
  assert.strictEqual(profile.evaluate({ samd: false, euClass: 'I' }).rule11, false);
});

test('evidence intensity escalates with class/implant/novelty', () => {
  assert.ok(/High/.test(profile.evaluate({ euClass: 'III' }).evidenceIntensity));
  assert.ok(/implantable/.test(profile.evaluate({ implant: true, euClass: 'IIa' }).evidenceIntensity));
  assert.ok(/novel/.test(profile.evaluate({ euClass: 'IIb', novel: true }).evidenceIntensity));
});
