/* Module 6 — PMCF Planning & Report. Pure function.
   Note (a candidate for a future revision): the "no method + justification" path does
   not yet verify the justification is risk-based and tied to Module 4's gap
   conclusions — it accepts a non-trivial justification as amber. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    const checked = p.pmcfChecked;
    const justify = String(p.pmcfJustify || '').trim();
    let status, text;

    if (checked > 0) {
      status = S.GREEN;
      text = checked + ' PMCF method(s) selected — proportionate to residual risk and data gaps identified in Module 4.';
    } else if (justify.length > 15) {
      status = S.AMBER;
      text = 'No PMCF method selected, but a justification has been entered — must withstand Notified Body / FDA scrutiny.';
    } else {
      status = S.RED;
      text = 'No PMCF method selected and no justification provided. MDR requires a documented justification when no PMCF is claimed.';
    }

    return { status: status, text: text, cites: [CC.cite('MDCG 2020-7; MDCG 2020-8; MDR Annex XIV Part B', V)] };
  }

  CC.rules.pmcf = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
