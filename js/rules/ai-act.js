/* Module 8c — EU AI Act intersection (Reg. (EU) 2024/1689 Art. 6(1)/Annex I;
   MDR Art. 43(3); MDCG 2025-6; MDR Annex VIII Rule 11). Auto-derived from the
   EU MDR class. Pure function.

   FASTEST-MOVING CITATION IN THE TOOL: the Annex I high-risk
   application deadline has already moved once (Digital Omnibus). It is exposed
   as DEADLINE so the test flags a re-check whenever this file is touched. */
(function (root) {
  'use strict';
  const CC = root.CC; const S = CC.STATUS; const V = '2026-08-19';
  const DEADLINE = '2 August 2028'; // Annex I regulated-product AI systems, post Digital Omnibus, 2026

  function evaluate(p) {
    if (!p.samd) {
      return { status: S.NA, text: 'Not applicable — device not flagged as software/SaMD/AI-enabled.', deadline: DEADLINE, cites: cites() };
    }
    let status, text;
    if (p.euClass === 'I' || p.euClass === 'Im') {
      status = S.AMBER;
      text = 'Class I (self-certified, no Notified Body) — likely outside the Art. 6(1) Annex I high-risk trigger, but re-check if classification changes (Annex VIII Rule 11 pushes most diagnostic/therapeutic software to IIa+).';
    } else {
      status = S.AMBER;
      text = 'Class ' + p.euClass + ' requires Notified Body involvement — this AI system is presumptively high-risk under AI Act Art. 6(1)/Annex I. Compliance deadline: ' + DEADLINE +
             ' (Digital Omnibus, 2026). Assessment is folded into the existing MDR conformity assessment per Art. 43(3) and MDCG 2025-6 — not a separate parallel review.';
    }
    return { status: status, text: text, deadline: DEADLINE, cites: cites() };
  }

  function cites() { return [CC.cite('Reg. (EU) 2024/1689 Art. 6(1), Annex I; MDR Art. 43(3); MDCG 2025-6; MDR Annex VIII Rule 11', V)]; }

  CC.rules.aiAct = { evaluate: evaluate, DEADLINE: DEADLINE };
})(typeof window !== 'undefined' ? window : global);
