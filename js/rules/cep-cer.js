/* Module 5 — CEP / CER Structure & Completeness Checker.
   Averages CEP and CER section completeness. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-19';

  function evaluate(p) {
    const cepPct = CC.pct(p.cepChecked, p.cepTotal);
    const cerPct = CC.pct(p.cerChecked, p.cerTotal);
    const avg = (cepPct + cerPct) / 2;
    const status = avg >= 85 ? S.GREEN : avg >= 50 ? S.AMBER : S.RED;

    return {
      status: status,
      cepPct: cepPct,
      cerPct: cerPct,
      text: 'CEP: ' + p.cepChecked + '/' + p.cepTotal + ' sections (' + cepPct + '%). CER: ' +
            p.cerChecked + '/' + p.cerTotal + ' sections (' + cerPct + '%).',
      cites: [CC.cite('MDR Annex XIV Part A; Annex I (GSPRs); Annex II (technical documentation cross-reference); MEDDEV 2.7/1 Rev.4; MDCG 2020-13 (Clinical Evaluation Assessment Report)', V)]
    };
  }

  CC.rules.cepCer = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
