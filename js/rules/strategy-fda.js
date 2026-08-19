/* Module 2 (FDA) — pathway clinical-data expectation, driven by the FDA
   classification/pathway selected in Module 1. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    let text;
    switch (p.fdaPath) {
      case 'I':
        text = 'Class I — clinical data expectations are typically minimal; general controls apply, most Class I devices are 510(k)-exempt.';
        break;
      case 'II-510k':
        text = 'Substantial equivalence via 510(k) — clinical data needed only if bench/analytical/performance data cannot establish equivalence to the predicate on technological characteristics.';
        break;
      case 'II-denovo':
        text = 'De Novo — no predicate exists; evidentiary expectations proportionate to risk, with special controls likely requiring targeted clinical or performance data.';
        break;
      default:
        text = 'PMA — valid scientific evidence required (21 CFR 860.7), typically including a pivotal clinical study under an IDE; benefit-risk factors per FDA guidance apply directly.';
    }
    return {
      status: S.AMBER, // informational expectation, not a pass/fail gate
      text: text,
      cites: [CC.cite('21 CFR 807 (510(k)); 21 CFR 814 (PMA); 21 CFR 860.230 (De Novo); 21 CFR 860.7 (valid scientific evidence); FDA Benefit-Risk in Premarket Submissions guidance', V)]
    };
  }

  CC.rules.strategyFDA = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
