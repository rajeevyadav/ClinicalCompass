/* Module 1 — Device & Intended Purpose Profiler.
   Foundation: computes profile completeness (a navigator-level proxy, NOT a
   clinical-sufficiency judgment), suggested evidence intensity, and the
   Annex VIII Rule 11 auto-flag (SaMD + Class I → warn). Pure function. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-19';

  function evaluate(p) {
    const fields = [p.deviceName, p.intendedPurpose, p.population, p.userEnv];
    const filled = fields.filter(function (f) { return String(f || '').trim().length > 3; }).length;
    const complete = filled === 4;

    let intensity = 'Moderate';
    if (p.euClass === 'III' || p.implant) intensity = 'High — Class III / implantable';
    else if (p.euClass === 'IIb') intensity = 'Moderate-High — Class IIb';
    else if (p.euClass === 'I' || p.euClass === 'Im') intensity = 'Low-Moderate — Class I';
    if (p.novel) intensity += ' (elevated further: novel technology)';

    // Annex VIII Rule 11: software driving diagnosis/therapy is pushed to
    // IIa/IIb/III — a SaMD flagged as Class I is a classification red flag.
    const rule11 = !!(p.samd && (p.euClass === 'I' || p.euClass === 'Im'));

    return {
      status: complete ? S.GREEN : S.AMBER,
      filled: filled,
      complete: complete,
      evidenceIntensity: intensity,
      rule11: rule11,
      cites: [CC.cite('MDR Annex VIII Rule 11', V)]
    };
  }

  CC.rules.profile = { evaluate: evaluate };
})(typeof window !== 'undefined' ? window : global);
