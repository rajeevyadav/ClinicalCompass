# ClinicalCompass — Regulatory Source / Citation Verification Log

Every regulatory citation in ClinicalCompass carries a `verifiedAsOf` date in code (see the
`CC.cite(ref, verifiedAsOf)` calls in each `js/rules/*.js` file) so a future maintainer can
tell which citations are stale without re-checking everything. This log records the
project-level verification pass.

## Method

1. **Link resolves** — the primary-source URL is requested / browser-confirmed. Some
   publishers (iso.org, imdrf.org) block automated fetches but resolve in a browser.
2. **Citation accuracy** — the clause each rule rests on is checked against the named source
   at the section level. Exact sub-clause letters are intentionally cited at section level
   and the app directs users to verify against the current official text.

## Verified 2026-08-18 · verifier RY

| Source (used for) | Status |
|---|---|
| EU MDR (EU) 2017/745 — Art. 32 (SSCP), Art. 61(4–6) (strategy), Art. 83–86 (PMS/PSUR), Annexes I/III/VIII Rule 11/XIV/XV | OK |
| MDCG 2019-9 **Rev.1** (24 Mar 2022) — SSCP | OK (revision confirmed) |
| MDCG 2020-1 — SaMD clinical evaluation | OK |
| MDCG 2020-5 — equivalence (three pillars + access) | OK |
| MDCG 2020-6 Annex III — evidence-hierarchy analogy (Module 4) | OK |
| MDCG 2020-7 / 2020-8 — PMCF plan / report | OK (template section lists paraphrased — see below) |
| MDCG 2020-13 — CEAR (self-check) | OK (cited, not structurally verified) |
| MDCG 2022-21 — PSUR | OK |
| MDCG 2023-7 — clinical evaluation / Art. 61 exceptions | OK |
| MDCG 2024-3 / 2024-5 — clinical investigation plan / investigator's brochure | OK |
| MDCG 2025-6 — AI Act ↔ MDR interplay | OK |
| MEDDEV 2.7/1 Rev.4 — CER structure | OK |
| IMDRF SaMD WG/N41:2017 — three-pillar framework | OK (summary-level; not checked section-by-section) |
| 21 CFR 807 / 814 / 860.230 / 860.7 — FDA pathways | OK |
| FDA PCCP Final Guidance (Aug 2025, FD&C Act §515C); GMLP 10 Guiding Principles | OK (GMLP cited as one reference, not itemized) |
| Reg. (EU) 2024/1689 (AI Act) Art. 6(1) / Annex I | OK — **deadline 2 Aug 2028 (post Digital Omnibus)** — fastest-moving citation |
| IEC 62366-1 — human factors | OK |
| IEC 62304 §5.1 — SOUP A/B/C risk class | OK |

## Notes carried forward (for the next review)

- **AI Act Annex I deadline (2 Aug 2028)** — has already moved once; a unit test
  (`tests/rules/ai-act.test.js`) asserts the encoded `DEADLINE` so any change fails CI.
  Re-verify against EUR-Lex at every review.
- **FDA AI/ML guidance** — PCCP final (Aug 2025); a separate lifecycle-management draft was
  still draft at drafting time — check finalization status at each review.
- **Section-by-section not yet done** — IMDRF N41 / MDCG 2020-1 three pillars, MDCG 2020-7/8
  template section lists, MDCG 2020-13 structure, and the GMLP 10 principles are cited at
  reference level; deepen before treating those specific sub-items as line-verified.

## Next scheduled review

**Due 2026-11-18** — synchronised with RegCompass + CyberCompass + eIFUCompass (see
[`NEXT_REVIEW.md`](../NEXT_REVIEW.md)).
