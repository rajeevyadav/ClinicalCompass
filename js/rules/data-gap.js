/* Module 4 — Clinical Data Sufficiency & Gap Analyzer.
   Status from breadth of available data-source categories. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-19';

  function evaluate(p) {
    const checked = p.gapSourcesChecked;
    const total = p.gapSourcesTotal;
    const claims = String(p.gapClaims || '').trim();
    const status = checked >= 3 ? S.GREEN : checked >= 1 ? S.AMBER : S.RED;
    const text = checked === 0
      ? 'No data sources identified — critical gap, cannot demonstrate conformity or reasonable assurance of safety and effectiveness.'
      : checked + '/' + total + ' data source categories available. ' +
        (claims ? 'Claims mapped for analysis.' : 'Add claimed benefit/safety/performance endpoints to complete the mapping.');

    return { status: status, text: text, cites: [CC.cite('MDR Annex XIV; MDCG 2020-6 Appendix III (evidence hierarchy analogy)', V)] };
  }

  CC.rules.dataGap = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
