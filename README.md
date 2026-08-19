# ClinicalCompass

**Clinical Evaluation (EU MDR) / Clinical Evidence (FDA) Navigator**

[![Latest release](https://img.shields.io/github/v/release/rajeevyadav/clinicalcompass?label=version&color=2ea44f&cacheSeconds=300)](https://github.com/rajeevyadav/clinicalcompass/releases/latest)
[![Download for Windows](https://img.shields.io/badge/Download-Windows%20installer-0078d6?logo=windows)](https://github.com/rajeevyadav/clinicalcompass/releases/latest/download/ClinicalCompass-Setup.exe)
[![Open the app](https://img.shields.io/badge/Open-web%20%2F%20mobile%20app-8250df)](https://rajeevyadav.github.io/clinicalcompass/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

_Last updated: **2026-08-18** · Next regulatory review: **2026-11-18** (see [NEXT_REVIEW.md](NEXT_REVIEW.md))_

🌐 **Use it now in your browser: https://rajeevyadav.github.io/clinicalcompass/**

ClinicalCompass is a free, offline, dual-market decision-support tool for medical-device
teams building a **clinical evaluation** (EU MDR) or **clinical evidence** dossier (FDA).
Enter a device profile and it works across **14 modules** — from the Art. 61 strategy tree
and equivalence to PMCF, PSUR/PMS, SaMD/AI, the FDA PCCP and EU AI Act intersection — giving
each item a **green / amber / red / N-A** status with the exact regulatory reference behind
it. Deterministic, rule-based and fully auditable: **no AI in the compliance logic**.

## Features

- **14 modules** — Device Profiler, Clinical Evaluation Strategy (EU MDR Art. 61 + FDA
  pathways), Equivalence (MDCG 2020-5), Data-gap analysis, CEP/CER completeness, PMCF,
  SSCP, PSUR/PMS, SaMD/AI, FDA PCCP, EU AI Act intersection, Human Factors, Cybersecurity,
  and SOUP/OTS software.
- **Weighted completeness score** — a live gap-score ring across the applicable modules
  (modules that don't apply are marked N/A and excluded, never counted against you).
- **Prioritized, cited action list** — the highest-severity gaps first, each with its clause
  reference.
- **Dual-market** — FDA, EU MDR, or a side-by-side "Both / Compare" view.
- **Master report** — a print/PDF Integrated Clinical Evaluation Master Report led by the
  action list and overall score, plus CSV export.
- **Runs anywhere** — light/dark, installable PWA, works fully offline.

## Coverage

FDA and EU MDR clinical-evaluation / clinical-evidence workflows. Not a substitute for a
qualified clinical evaluation, Notified Body assessment, or FDA interaction. The score
thresholds and profile-completeness heuristic are internal design choices for this
navigator, not regulatory pass/fail lines.

## How to use

1. Pick a market (FDA / EU MDR / Both).
2. Fill in the Device Profiler — class, pathway, intended purpose, and technology flags.
   Everything else reads from this profile.
3. Work through the module cards; watch the gap-score ring and prioritized action list on
   the right update live.
4. Export the Master Report (print / PDF) or a CSV summary.

## Run & build

A static single-page app (no build step for the web version) with an optional
[Electron](https://www.electronjs.org/) desktop wrapper that loads the same `index.html`.

```bash
# run the unit tests (Node's built-in test runner, no external deps)
npm test

# run the web app locally (a service worker needs http, not file://)
npx serve .            # or:  python3 -m http.server

# run the desktop app
npm install
npm start

# build the desktop installers
npm run dist:win       # Windows (NSIS installer + portable)
npm run dist:mac       # macOS (.dmg)
npm run dist:linux     # Linux (.AppImage)
```

The Windows installer is **per-user** (no admin/UAC needed).

## No AI inside

The shipped page and its build tooling contain **no AI or machine-learning code** —
every result is produced by fixed, human-written rules you can read in this repository's
source. The app runs entirely on your device, works offline, and transmits nothing. CI
guardrails fail the build if an AI-provider reference, an ML dependency, or an AI/bot
commit-authorship trailer is ever introduced.

## Verification

Every citation and link is checked against its primary official source; the audit trail
lives in [`verification/log.md`](verification/log.md). Sources move over time, so a lighter
review runs quarterly — see [`NEXT_REVIEW.md`](NEXT_REVIEW.md) (next due **2026-11-18**,
synchronised across the family). No silent edits — every change is reviewed and logged.

## Disclaimer

Decision-support only — provided "as is". ClinicalCompass is not a substitute for
professional regulatory or clinical-evaluation advice, Notified Body assessment or FDA
interaction. The clinical evaluation, clinical evidence, classification and compliance of a
device remain the sole responsibility of the manufacturer. Always verify against the current
official texts (EU MDR and its Implementing Regulations/MDCG guidance, FDA regulations and
guidance, and applicable ISO/IEC standards).

## Family

Part of the same family — same guardrails, same offline-first, no-black-box-AI philosophy:
[RegCompass](https://rajeevyadav.github.io/regcompass/) ·
[CyberCompass](https://rajeevyadav.github.io/cybercompass/) ·
[eIFUCompass](https://rajeevyadav.github.io/eifucompass/).

## License

MIT — see [`LICENSE`](LICENSE).

Maintainer: **Rajeev Yadav** · rajeevyadav@gmail.com
