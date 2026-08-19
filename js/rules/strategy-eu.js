/* Module 2 (EU) — Clinical Evaluation Strategy, MDR Art. 61(4–6) decision tree.
   Ports the 4-way exception sub-type awareness (the specific legal route matters
   to Notified Bodies) and surfaces the Annex XV / ISO 14155 downstream note when
   a dedicated clinical investigation is triggered. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    let status = S.AMBER, text = '';
    const implantSel = p.art61Implant;   // 'yes' | 'no'
    const exceptionSel = p.art61Exception; // 'yes' | 'no'

    if (implantSel === 'yes' && exceptionSel !== 'yes') {
      status = S.RED;
      text = 'A dedicated clinical investigation is likely required under Art. 61(4)/(6) — device is Class III/implantable and no exception has been established.';
    } else if (implantSel === 'yes' && exceptionSel === 'yes') {
      status = S.AMBER;
      const route = p.art61SubtypeLabel || 'an unspecified exception route';
      text = 'Exception claimed via ' + route + ' — clinical investigation may be avoidable, but this specific legal route’s documentation burden must be met in full; Notified Bodies scrutinize exactly which basis is being claimed, not a generic "exception applies".';
    } else {
      status = S.GREEN;
      text = 'Device is not Class III/implantable — literature + clinical data + PMCF combination strategy is generally viable, proportionate to claims.';
    }

    // Annex XV downstream note surfaces only when an investigation is triggered.
    const annexXV = (status === S.RED);

    return {
      status: status,
      text: text,
      annexXV: annexXV,
      cites: [CC.cite('Reg. (EU) 2017/745 Art. 61(4–6); MDCG 2023-7', V)],
      annexXVCites: [CC.cite('MDR Annex XV; ISO 14155; MDCG 2024-3 (Clinical Investigation Plan); MDCG 2024-5 (Investigator’s Brochure)', V)]
    };
  }

  CC.rules.strategyEU = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
