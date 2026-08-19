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

## Independent source audit — 2026-08-19 · verifier RY

Fourth, independent verification pass: every citation was checked against its **primary or
authoritative public source** (EUR-Lex, health.ec.europa.eu, fda.gov, and the publishers'
records). All citations confirmed; **two minor wording corrections applied** (below).

| Source (used for) | Result |
|---|---|
| EU MDR (EU) 2017/745 — Art. 32 (SSCP), Art. 61(4–6) (strategy), Art. 43(3), Art. 83–86 (PMS/PSUR), Annexes I/III/VIII Rule 11/XIV/XV | **Confirmed** |
| MDCG 2019-9 **Rev.1** (24 Mar 2022) — SSCP | **Confirmed** — revision + date exact (health.ec.europa.eu) |
| MDCG 2020-1 — clinical evaluation of MDSW (SaMD) | **Confirmed** |
| MDCG 2020-5 — equivalence (three pillars + access) | **Confirmed** |
| MDCG 2020-6 — evidence-hierarchy analogy (Module 4) | **Confirmed** — corrected "Annex III" → **"Appendix III"** (the document's own term) |
| MDCG 2020-7 / 2020-8 — PMCF plan / report | **Confirmed** (template section lists paraphrased) |
| MDCG 2020-13 — CEAR (Notified-Body self-check) | **Confirmed** |
| MDCG 2022-21 — PSUR (Dec 2022, Art. 86) | **Confirmed** |
| MDCG 2023-7 — Art. 61(4–6) exemptions & equivalence (Dec 2023) | **Confirmed** — also confirms the 4-way exception sub-typing (61(6)(a) legacy, 61(6)(b) WET, third-party contract) |
| MDCG 2024-3 / 2024-5 — clinical investigation plan / investigator's brochure (2024) | **Confirmed** |
| MDCG 2025-6 — MDR/IVDR ↔ AI Act interplay (with AIB 2025-1) | **Confirmed** |
| MEDDEV 2.7/1 Rev.4 — CER structure | **Confirmed** |
| IMDRF SaMD WG/N41:2017 — three-pillar framework | **Confirmed** (framework/name; not re-mapped clause-by-clause) |
| 21 CFR 807 / 814 / 860.230 / 860.7 — FDA pathways | **Confirmed** |
| FDA PCCP Final Guidance (**Aug 2025**), FD&C Act §515C (via FDORA, Dec 2022); GMLP 10 Guiding Principles | **Confirmed** — exact title match; GMLP cited as one reference (not itemized) |
| Reg. (EU) 2024/1689 (AI Act) Art. 6(1) / Annex I — high-risk deadline **2 Aug 2028** | **Confirmed** via the Digital Omnibus (2026); corrected imprecise "June 2026" → "2026" |
| IEC 62366-1 — human factors | **Confirmed** (standard identity) |
| IEC 62304 §5.1 — SOUP A/B/C risk class | **Confirmed** (standard identity) |
| ISO 14155 — clinical investigation conduct | **Confirmed** (standard identity) |

### Corrections applied this pass
1. **MDCG 2020-6** — the clinical-evidence hierarchy lives in **Appendix III**, not "Annex III".
   Fixed in `js/rules/data-gap.js` and `index.html`.
2. **EU AI Act** — the deadline **2 Aug 2028** is correct; the Digital Omnibus political
   agreement was 2026 (not specifically "June"), so the imprecise month was dropped in
   `js/rules/ai-act.js` and `index.html`. The `2 August 2028` value remains pinned and
   asserted by `tests/rules/ai-act.test.js`.

## Notes carried forward (for the next review)

- **AI Act Annex I deadline (2 Aug 2028)** — has already moved once; the unit test asserts the
  encoded `DEADLINE` so any change fails CI. Re-verify against EUR-Lex at every review.
- **FDA AI/ML guidance** — PCCP final (Aug 2025); a separate lifecycle-management draft was
  still draft at drafting time — check finalization status at each review.
- **Depth caveat** — standards behind paywalls (ISO/IEC) were confirmed by identity/scope, not
  by reading the paywalled clause text; MDCG template section-lists are paraphrased.

## Next scheduled review

**Due 2026-11-18** — synchronised with RegCompass + CyberCompass + eIFUCompass (see
[`NEXT_REVIEW.md`](../NEXT_REVIEW.md)).
