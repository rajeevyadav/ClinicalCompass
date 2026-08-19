'use strict';
const test = require('node:test');
const assert = require('node:assert');
const CC = require('../_load.js');
const S = CC.STATUS;
const soup = CC.rules.soup;

test('not flagged -> N/A', () => {
  assert.strictEqual(soup.evaluate({ soup: false }).status, S.NA);
});

test('Class C is held to a stricter bar than A/B at the same completeness', () => {
  // 4/5 = 80%: Class C -> amber (needs 100 for green); Class B -> amber too but
  // the discriminating case is at 2/5 = 40%.
  const cAt99 = soup.evaluate({ soup: true, soupRiskClass: 'C', soupChecked: 4, soupTotal: 5 });
  assert.strictEqual(cAt99.status, S.AMBER); // <100 never green for C

  // 40% floor: A/B pass to amber, C drops to red.
  const bAt40 = soup.evaluate({ soup: true, soupRiskClass: 'B', soupChecked: 2, soupTotal: 5 });
  const cAt40 = soup.evaluate({ soup: true, soupRiskClass: 'C', soupChecked: 2, soupTotal: 5 });
  assert.strictEqual(bAt40.status, S.AMBER);
  assert.strictEqual(cAt40.status, S.RED, 'Class C fails where A/B would pass');
});

test('100% -> green for every class', () => {
  ['A', 'B', 'C'].forEach((cls) => {
    assert.strictEqual(soup.evaluate({ soup: true, soupRiskClass: cls, soupChecked: 5, soupTotal: 5 }).status, S.GREEN);
  });
});

test('Class C at 70% is the amber floor; below it is red', () => {
  assert.strictEqual(soup.evaluate({ soup: true, soupRiskClass: 'C', soupChecked: 7, soupTotal: 10 }).status, S.AMBER); // 70%
  assert.strictEqual(soup.evaluate({ soup: true, soupRiskClass: 'C', soupChecked: 2, soupTotal: 3 }).status, S.RED);   // 67% -> red
});

test('carries an IEC 62304 citation', () => {
  assert.ok(/62304/.test(soup.evaluate({ soup: true, soupChecked: 0, soupTotal: 5 }).cites[0].ref));
});
