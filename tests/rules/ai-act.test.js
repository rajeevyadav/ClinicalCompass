'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const aiAct = CC.rules.aiAct;

// FASTEST-MOVING CITATION. If this assertion fails, the AI Act
// Annex I deadline has changed — RE-VERIFY against EUR-Lex / the Digital Omnibus
// and update js/rules/ai-act.js and the verification log together.
test('Annex I high-risk deadline is the expected value (re-verify if this fails)', () => {
  assert.strictEqual(aiAct.DEADLINE, '2 August 2028');
});

test('not SaMD -> N/A', () => {
  assert.strictEqual(aiAct.evaluate({ samd: false }).status, S.NA);
});

test('SaMD Class I -> amber, references Rule 11 re-check', () => {
  const r = aiAct.evaluate({ samd: true, euClass: 'I' });
  assert.strictEqual(r.status, S.AMBER);
  assert.ok(/Rule 11/.test(r.text));
});

test('SaMD Class IIa+ -> amber, presumptively high-risk, states the deadline', () => {
  const r = aiAct.evaluate({ samd: true, euClass: 'IIb' });
  assert.strictEqual(r.status, S.AMBER);
  assert.ok(/high-risk/.test(r.text));
  assert.ok(r.text.indexOf(aiAct.DEADLINE) !== -1);
});

test('carries the 2024/1689 citation with a verifiedAsOf date', () => {
  const r = aiAct.evaluate({ samd: true, euClass: 'III' });
  assert.ok(/2024\/1689/.test(r.cites[0].ref));
  assert.ok(r.cites[0].verifiedAsOf);
});
