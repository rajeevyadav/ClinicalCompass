# ClinicalCompass — Regulatory Review Schedule

ClinicalCompass cites primary regulatory sources (EU MDR Art. 32/61/83–86 and Annexes
I/III/VIII/XIV/XV, MDCG 2019-9 Rev.1 / 2020-1 / 2020-5 / 2020-6 / 2020-7 / 2020-8 /
2020-13 / 2022-21 / 2023-7 / 2024-3 / 2024-5 / 2025-6, MEDDEV 2.7/1 Rev.4, IMDRF N41,
21 CFR 807/814/860, FDA PCCP Final Guidance, Reg. (EU) 2024/1689 (AI Act), IEC 62366-1 /
62304). Those sources move and get superseded, so a **lighter quarterly review** runs on a
fixed cadence — **synchronised with RegCompass, CyberCompass and eIFUCompass to a single
family review date**.

## Next review

| Field | Value |
|---|---|
| **Next review due** | **2026-11-18** (synced with the family) |
| Cadence | Every 3 months (family-synced dates) |
| Tracking | GitHub issue (label `review`) once the repo is public/launched |

## What a quarterly review covers

A **link-check + awareness-check** (escalate to a full re-read only if something looks off).
Re-check the cited sources (see `verification/log.md`) for:

1. **Dead / moved links** — every cited source still resolves.
2. **Superseded guidance / standards** — MDCG documents (watch revision numbers, e.g.
   MDCG 2019-9 **Rev.1**), MEDDEV, ISO/IEC updates.
3. **Fastest-moving citations (re-verify every review):**
   - **EU AI Act Annex I deadline** — currently **2 August 2028** (post Digital Omnibus).
     Encoded as `DEADLINE` in `js/rules/ai-act.js`; a unit test asserts the value so a
     change fails CI loudly. It has moved once already.
   - **FDA AI/ML guidance** — PCCP finalized Aug 2025; check whether the separate lifecycle
     draft guidance has since been finalized.
4. **Candidate refinements for a future revision** — deeper PMCF justification-linkage
   (tying it to the Module 4 gap conclusions) and richer Human-Factors critical-task /
   summative-study prompts.

## After each review

- Update **Next review due** (+3 months → keep synced with the family).
- Record the outcome in `verification/log.md`.
- Open the next tracking issue.

---

_Family-synced cadence: RegCompass · CyberCompass · eIFUCompass · ClinicalCompass all review
on the same date (currently 2026-11-18)._
