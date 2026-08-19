/* Module 7 — SSCP Generator Support (MDR Art. 32; MDCG 2019-9 Rev.1).
   Applicable only to Class III / implantable devices; gated on CER consistency.
   Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-18';

  function evaluate(p) {
    const applicable = !!(p.implant || p.euClass === 'III');
    if (!applicable) {
      return { status: S.NA, text: 'Not applicable — device is not flagged as implantable / Class III.', cites: cites() };
    }
    const pct = CC.pct(p.sscpChecked, p.sscpTotal);
    let status, text;
    if (p.sscpConsistency !== 'yes') {
      status = S.RED;
      text = 'SSCP not yet confirmed consistent with CER conclusions (' + pct + '% sections present). Consistency check required before finalization.';
    } else if (pct >= 85) {
      status = S.GREEN;
      text = 'SSCP structure ' + pct + '% complete and confirmed consistent with CER conclusions.';
    } else {
      status = S.AMBER;
      text = 'SSCP ' + pct + '% complete — consistent with CER so far, but sections remain outstanding.';
    }
    return { status: status, text: text, cites: cites() };
  }

  function cites() { return [CC.cite('MDR Article 32; MDCG 2019-9 Rev.1 (24 Mar 2022)', V)]; }

  CC.rules.sscp = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
