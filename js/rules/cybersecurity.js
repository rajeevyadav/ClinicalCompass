/* Module 10 — Cybersecurity Considerations in Clinical Evaluation
   (MDCG 2019-16; FDA cybersecurity guidance). Applicable when the device is
   networked/connected OR software-enabled. Cross-links to CyberCompass for the
   jurisdiction-by-jurisdiction detail rather than duplicating it. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    const applicable = !!(p.networked || p.samd);
    if (!applicable) {
      return { status: S.NA, text: 'Not applicable — device not flagged as networked/connected or software-enabled.', cites: cites() };
    }
    const pct = CC.pct(p.cyberChecked, p.cyberTotal);
    const status = pct === 100 ? S.GREEN : pct > 0 ? S.AMBER : S.RED;
    return {
      status: status,
      text: p.cyberChecked + '/' + p.cyberTotal + ' cybersecurity considerations addressed in the clinical evaluation (' + pct + '%).',
      cites: cites()
    };
  }

  function cites() { return [CC.cite('MDCG 2019-16; FDA cybersecurity guidance', V)]; }

  CC.rules.cybersecurity = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
