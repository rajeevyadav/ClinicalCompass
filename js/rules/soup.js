/* Module 11 — SOUP / OTS Software Clinical Impact (IEC 62304 §5.1).
   A/B/C risk-class selector with a stricter completeness bar for Class C
   (death/serious injury possible): Class C requires 100% for green and escalates
   to red faster, where A/B pass at a 40% amber floor. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    if (!p.soup) {
      return { status: S.NA, text: 'Not applicable — device not flagged as containing SOUP/OTS software.', cites: cites() };
    }
    const pct = CC.pct(p.soupChecked, p.soupTotal);
    const cls = p.soupRiskClass || 'B';
    let status;
    if (cls === 'C') {
      status = pct === 100 ? S.GREEN : pct >= 70 ? S.AMBER : S.RED;
    } else {
      status = pct === 100 ? S.GREEN : pct >= 40 ? S.AMBER : S.RED;
    }
    const text = p.soupChecked + '/' + p.soupTotal + ' SOUP/OTS documentation items complete (' + pct + '%). SOUP risk classification: Class ' + cls +
      (cls === 'C' ? ' — held to a stricter completeness bar given potential for death/serious injury.' : '.');

    return { status: status, riskClass: cls, text: text, cites: cites() };
  }

  function cites() { return [CC.cite('IEC 62304 §5.1 (SOUP risk classification A/B/C)', V)]; }

  CC.rules.soup = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
