/* Module 3 — Equivalence Assessment (MDCG 2020-5). Three-pillar comparison
   gated by the technical-documentation access requirement. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    const pillars = [p.eqTech, p.eqBio, p.eqClin];
    let status, text, headline;

    if (p.eqAccess !== 'yes') {
      status = S.RED;
      headline = 'Equivalence not possible';
      text = "Equivalence route not viable regardless of pillar match — sufficient access to the equivalent device's technical documentation has not been established (MDCG 2020-5 access requirement).";
    } else if (pillars.every(function (x) { return x === 'equivalent'; })) {
      status = S.GREEN;
      headline = 'Equivalence possible';
      text = 'Equivalence claim appears supportable across all three pillars, subject to full documentary justification.';
    } else if (pillars.some(function (x) { return x === 'not-equivalent'; })) {
      status = S.RED;
      headline = 'Equivalence not possible';
      text = 'Equivalence not possible — at least one pillar shows a substantive difference. A full clinical data strategy (own data / literature / PMCF) will be required instead.';
    } else {
      status = S.AMBER;
      headline = 'Equivalence partial';
      text = 'Partial equivalence — minor differences identified in one or more pillars. Justification must demonstrate the differences do not affect clinical performance/safety.';
    }

    return { status: status, headline: headline, text: text, cites: [CC.cite('MDCG 2020-5', V)] };
  }

  CC.rules.equivalence = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
