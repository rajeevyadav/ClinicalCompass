/* Module 9 — Human Factors / Usability Linkage (IEC 62366-1).
   Two yes/no gates; escalates to red when critical-task mapping is incomplete
   AND high use-error risk was flagged in the profile. Pure function.
   Note (a candidate for a future revision): does not yet prompt for critical-task-
   analysis or summative-study-design content beyond these two gates. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    let status, text;
    if (p.hfMapped === 'yes' && p.hfSummative === 'yes') {
      status = S.GREEN;
      text = 'Critical tasks/use errors mapped to residual risk; summative validation evidence in place where required.';
    } else if (p.hfMapped === 'no') {
      status = p.highUseRisk ? S.RED : S.AMBER;
      text = 'Critical-task/use-error mapping not yet complete.' +
        (p.highUseRisk ? ' High use-error risk scenarios were flagged in the profile — this is a priority gap.' : '');
    } else {
      status = S.AMBER;
      text = 'Task mapping complete, but summative usability validation evidence is missing for flagged high-risk scenarios.';
    }
    return { status: status, text: text, cites: [CC.cite('IEC 62366-1', V)] };
  }

  CC.rules.humanFactors = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
