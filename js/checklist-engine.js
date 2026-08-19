/* ClinicalCompass — scoring engine.
   Weighted rollup across the applicable modules (N/A modules are excluded from
   the denominator, never penalized for inapplicability), plus the prioritized,
   cited action-list generator. Pure and testable. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS;

  // Module weights (keys match the moduleStatuses object the app builds).
  // Foundational modules carry the most weight; niche/conditional ones least.
  const WEIGHTS = {
    profile: 10, strategy: 10, equivalence: 10, gap: 10, cep: 10,
    pmcf: 8, sscp: 8, psur: 8, samd: 7, pccp: 6, aiact: 6,
    hf: 4, cyber: 2, soup: 1
  };

  const MODULE_LABELS = {
    profile: '1 · Profiler', strategy: '2 · Strategy', equivalence: '3 · Equivalence',
    gap: '4 · Data Gap', cep: '5 · CEP/CER', pmcf: '6 · PMCF', sscp: '7 · SSCP',
    psur: '7b · PSUR/PMS', samd: '8 · SaMD/AI', pccp: '8b · PCCP (FDA)',
    aiact: '8c · AI Act (EU)', hf: '9 · Human Factors', cyber: '10 · Cybersecurity',
    soup: '11 · SOUP/OTS'
  };

  // Credit per status: green = full weight, amber = 0.55, red = 0.1, N/A excluded.
  function creditFactor(status) {
    if (status === S.GREEN) return 1;
    if (status === S.AMBER) return 0.55;
    return 0.1; // red
  }

  function computeOverall(moduleStatuses) {
    let earned = 0, possible = 0;
    Object.keys(WEIGHTS).forEach(function (k) {
      const st = moduleStatuses[k];
      if (st === S.NA || st == null) return; // excluded from denominator
      possible += WEIGHTS[k];
      earned += WEIGHTS[k] * creditFactor(st);
    });
    const pct = possible > 0 ? Math.round((earned / possible) * 100) : 0;
    const overallStatus = pct >= 75 ? S.GREEN : pct >= 45 ? S.AMBER : S.RED;
    return { pct: pct, overallStatus: overallStatus, possible: possible, earned: earned };
  }

  // ctx carries the few extra fields action wording needs (e.g. equivalence
  // access), so the generator stays a pure function of explicit inputs.
  function buildActions(moduleStatuses, ctx) {
    ctx = ctx || {};
    const a = [];
    if (!ctx.profileComplete) a.push({ t: 'Complete device profile', c: 'Fill intended purpose, population, and use-environment fields.', status: S.AMBER, cite: 'Foundation for all downstream modules' });
    if (moduleStatuses.strategy === S.RED) a.push({ t: 'Plan clinical investigation or establish Art.61(4)/(6) exception', c: 'Class III/implantable route currently requires a dedicated clinical investigation unless an exception is documented.', status: S.RED, cite: 'MDR Art. 61(4–6); MDCG 2023-7' });
    if (moduleStatuses.equivalence === S.RED) a.push({ t: ctx.eqAccess !== 'yes' ? 'Establish access to equivalent device documentation' : 'Rebuild clinical data strategy without equivalence route', c: ctx.eqAccess !== 'yes' ? 'Without documented access, the equivalence route cannot be used at all.' : 'One or more pillars show substantive differences — equivalence is not viable.', status: S.RED, cite: 'MDCG 2020-5' });
    if (moduleStatuses.gap === S.RED) a.push({ t: 'Identify at least one clinical data source', c: 'No data sources currently selected — this blocks the entire clinical evaluation.', status: S.RED, cite: 'MDR Annex XIV' });
    if (moduleStatuses.cep !== S.GREEN) a.push({ t: 'Close CEP/CER structural gaps', c: 'One or more required CEP/CER sections are missing.', status: moduleStatuses.cep, cite: 'MDR Annex XIV Part A; MEDDEV 2.7/1 Rev.4' });
    if (moduleStatuses.pmcf === S.RED) a.push({ t: 'Select a PMCF method or document justification', c: 'No PMCF method selected and no justification entered.', status: S.RED, cite: 'MDCG 2020-7/2020-8' });
    if (moduleStatuses.sscp === S.RED) a.push({ t: 'Confirm SSCP consistency with CER', c: 'Class III/implantable device requires SSCP consistency confirmation before finalization.', status: S.RED, cite: 'MDR Art. 32; MDCG 2019-9 Rev.1' });
    if (moduleStatuses.psur === S.RED) a.push({ t: 'Build out PSUR/PMS documentation', c: 'Core post-market surveillance elements (data collection, trend analysis, benefit-risk update) are largely missing.', status: S.RED, cite: 'MDR Art. 83–86; Annex III' });
    if (moduleStatuses.samd === S.RED) a.push({ t: 'Close SaMD/AI pillar gaps', c: 'At least one IMDRF pillar (clinical association, analytical validation, clinical validation) is not established.', status: S.RED, cite: 'IMDRF N41; MDCG 2020-1' });
    if (moduleStatuses.pccp === S.RED) a.push({ t: 'Complete PCCP for adaptive model', c: 'Continuous-learning model flagged but modification protocol / impact assessment not documented — required before relying on bounded post-market updates without new submission.', status: S.RED, cite: 'FD&C Act §515C; FDA PCCP Final Guidance (Aug 2025)' });
    if (moduleStatuses.hf === S.RED) a.push({ t: 'Complete human factors task mapping', c: 'High use-error risk scenarios flagged but critical-task mapping is not complete.', status: S.RED, cite: 'IEC 62366-1' });
    if (moduleStatuses.cyber === S.RED) a.push({ t: 'Address cybersecurity residual risk in the clinical evaluation', c: 'Networked/software device with no cybersecurity considerations documented yet.', status: S.RED, cite: 'MDCG 2019-16' });
    if (moduleStatuses.soup === S.RED) a.push({ t: 'Begin SOUP/OTS documentation', c: 'SOUP flagged but little to no documentation captured.', status: S.RED, cite: 'IEC 62304' });
    if (a.length === 0) a.push({ t: 'No critical gaps detected', c: 'Continue refining amber-status modules toward full completeness.', status: S.GREEN, cite: '' });
    return a;
  }

  CC.engine = {
    WEIGHTS: WEIGHTS,
    MODULE_LABELS: MODULE_LABELS,
    computeOverall: computeOverall,
    buildActions: buildActions
  };
})(typeof window !== 'undefined' ? window : global);
