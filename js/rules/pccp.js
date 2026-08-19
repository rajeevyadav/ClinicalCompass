/* Module 8b — FDA Predetermined Change Control Plan (PCCP).
   FD&C Act §515C; FDA Final Guidance (Aug 2025); GMLP 10 Guiding Principles.
   Gated on the adaptive/continuous-learning flag: locked models → optional
   (N/A); adaptive models require the modification description/protocol/impact
   assessment. Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-19';

  function evaluate(p) {
    if (!p.samd) {
      return { status: S.NA, text: 'Not applicable — device not flagged as software/SaMD/AI-enabled.', cites: cites() };
    }
    if (p.samdAdaptive !== 'yes') {
      return {
        status: S.NA,
        text: 'Locked model — PCCP is optional. A PCCP may still be submitted proactively to pre-authorize a future retraining/version-update pathway; not required for a static/locked algorithm.',
        cites: cites()
      };
    }
    const pct = CC.pct(p.pccpChecked, p.pccpTotal);
    const status = pct === 100 ? S.GREEN : pct >= 50 ? S.AMBER : S.RED;
    return {
      status: status,
      text: 'Continuous-learning/adaptive model flagged — a PCCP is the expected mechanism to pre-authorize bounded post-market changes without a new submission. ' +
            p.pccpChecked + '/' + p.pccpTotal + ' PCCP elements present (' + pct + '%).',
      cites: cites()
    };
  }

  function cites() {
    return [CC.cite('FD&C Act §515C; FDA Final Guidance — Marketing Submission Recommendations for a PCCP for AI-Enabled Device Software Functions (Aug 2025); FDA/Health Canada/MHRA GMLP 10 Guiding Principles', V)];
  }

  CC.rules.pccp = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
