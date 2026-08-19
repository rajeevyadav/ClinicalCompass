/* Module 7b — PSUR & Post-Market Surveillance (MDR Art. 83–86, Annex III;
   MDCG 2022-21). Class-driven tier/frequency; EUDAMED/NB route gated on
   (implant OR Class III), independent of the annual/biennial tier — this exact
   gating was confirmed against an external audit; do not "simplify" it.
   Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    let tier, freq, route;

    if (p.euClass === 'I' || p.euClass === 'Im') {
      tier = 'PMS Report only — no PSUR required';
      freq = 'Update whenever necessary; recommended at least every 3 years';
      route = 'Kept in technical documentation (Annex III §1.2); available to authorities on request';
    } else if (p.euClass === 'IIa') {
      tier = 'PSUR required';
      freq = 'At least every 2 years (Art. 86(1))';
      route = 'Part of technical documentation (Annexes II/III); available to Notified Body and competent authorities on request';
    } else { // IIb / III
      tier = 'PSUR required';
      freq = 'At least annually (Art. 86(1))';
      // Route gate is independent of the frequency tier above.
      route = (p.implant || p.euClass === 'III')
        ? 'Submitted to Notified Body via EUDAMED electronic system (Art. 86(2))'
        : 'Part of technical documentation; available to Notified Body on request';
    }

    const pct = CC.pct(p.psurChecked, p.psurTotal);
    const status = pct >= 85 ? S.GREEN : pct >= 40 ? S.AMBER : S.RED;

    return {
      status: status, tier: tier, freq: freq, route: route, pct: pct,
      text: tier + '. Frequency: ' + freq + '. Route: ' + route + '. Documentation ' +
            p.psurChecked + '/' + p.psurTotal + ' elements present (' + pct + '%).',
      cites: [CC.cite('MDR Art. 83–86; Annex III; MDCG 2022-21', V)]
    };
  }

  CC.rules.psurPms = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
