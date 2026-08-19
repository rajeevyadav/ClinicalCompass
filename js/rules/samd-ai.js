/* Module 8 — SaMD / AI Clinical Evaluation (IMDRF N41; MDCG 2020-1).
   Three-pillar: valid clinical association / analytical validation / clinical
   validation. Applicable only when the SaMD/AI flag is set. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-19';

  function evaluate(p) {
    if (!p.samd) {
      return { status: S.NA, text: 'Not applicable — device not flagged as software/SaMD/AI-enabled.', cites: cites() };
    }
    const vals = [p.samdAssoc, p.samdAnalytical, p.samdClinical];
    let status, text;
    if (vals.every(function (v) { return v === 'established'; })) {
      status = S.GREEN; text = 'All three IMDRF pillars established.';
    } else if (vals.some(function (v) { return v === 'not-established'; })) {
      status = S.RED; text = 'At least one IMDRF pillar not established — clinical evaluation for the SaMD/AI component is not yet defensible.';
    } else {
      status = S.AMBER; text = 'One or more pillars only partially established — additional evidence needed.';
    }
    if (p.samdAdaptive === 'yes') {
      text += ' Continuous-learning/adaptive model flagged — additional change-control and re-validation evidence expected.';
    }
    return { status: status, text: text, cites: cites() };
  }

  function cites() { return [CC.cite('IMDRF SaMD WG/N41:2017; MDCG 2020-1', V)]; }

  CC.rules.samdAi = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
