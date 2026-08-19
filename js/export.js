/* ClinicalCompass — export: CSV + the print-only Integrated Clinical Evaluation
   Master Report. The report LEADS with the prioritized action list and overall
   score, and keeps the "thresholds/heuristic are internal design choices"
   disclaimer intact. Browser-only (uses the DOM for the report body
   and Blob download); the report body is composed from already-rendered,
   rule-produced output HTML. */
(function (root) {
  'use strict';
  const CC = root.CC;
  const S = CC.STATUS;

  // profile/aiact outputs live in differently-named containers.
  const ID_MAP = { profile: 'profileOutputs', aiact: 'aiActOutput' };

  function buildMasterReport(ctx) {
    const dev = ctx.deviceName || '(unnamed device)';
    let html = '<p><strong>Device:</strong> ' + CC.escape(dev) +
      ' &nbsp; | &nbsp; <strong>Overall completeness:</strong> ' + ctx.pct + '%' +
      ' &nbsp; | &nbsp; <strong>Status:</strong> ' + ctx.overallStatus.toUpperCase() + '</p>' +
      '<p style="font-size:0.72rem; color:#6b6b6a;">Score thresholds (≥75% green / ≥45% amber / below red) and the profile-field-length completeness heuristic are internal design choices for this navigator, not regulatory requirements — treat as directional, not authoritative.</p>' +
      '<h2 style="font-size:1.05rem; margin-top:1.2rem;">Prioritized Action List</h2>';

    html += ctx.actions.map(function (a) {
      return '<div style="margin-bottom:0.5rem;"><strong>[' + a.status.toUpperCase() + ']</strong> ' +
        a.t + ' — ' + a.c + (a.cite ? ' (Ref: ' + a.cite + ')' : '') + '</div>';
    }).join('');

    Object.keys(ctx.labels).forEach(function (k) {
      const st = ctx.moduleStatuses[k];
      const outId = ID_MAP[k] || (k + 'Output');
      html += '<h3 style="font-size:0.95rem; margin-top:1rem;">' + ctx.labels[k] + ' — ' +
        (st === S.NA ? 'N/A' : String(st).toUpperCase()) + '</h3>';
      html += ctx.outputHtmlById(outId);
    });

    const body = document.getElementById('masterReportBody');
    if (body) body.innerHTML = html;
  }

  function downloadCsv(p, moduleStatuses, overallText) {
    const rows = [
      ['Field', 'Value'],
      ['Device name', p.deviceName],
      ['Previous regulatory history', p.prevHistory],
      ['EU MDR class', p.euClass],
      ['FDA pathway', p.fdaPath],
      ['Intended purpose', p.intendedPurpose],
      ['Population', p.population],
      ['Users / environment', p.userEnv],
      ['Data sufficiency claims (Module 4)', p.gapClaims],
      ['PMCF justification (Module 6, if no method selected)', p.pmcfJustify],
      ['SOUP risk classification', p.soupRiskClass],
      ['Overall completeness (%)', overallText]
    ];
    Object.keys(moduleStatuses).forEach(function (k) {
      rows.push(['Module: ' + k, moduleStatuses[k]]);
    });
    rows.push(['Disclaimer', 'Decision-support only — not legal/regulatory/clinical advice. FDA + EU MDR. Verify against the current official sources before submission use.']);

    const csv = rows.map(function (r) {
      return r.map(function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'clinicalcompass-summary.csv';
    a.click();
  }

  CC.exporter = { buildMasterReport: buildMasterReport, downloadCsv: downloadCsv };
})(typeof window !== 'undefined' ? window : global);
