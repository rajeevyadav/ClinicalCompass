/* ClinicalCompass — DOM controller.
   Wires the UI, gathers inputs into a plain profile object, calls the pure rules
   engine, and renders results/score/action-list. No compliance logic lives here
   — every status decision is made in js/rules/*.js and js/checklist-engine.js. */
(function () {
  'use strict';
  const CC = window.CC;
  const S = CC.STATUS;
  const $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  const $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  /* ---- UI chrome ---- */
  $('#themeToggle').addEventListener('click', function () {
    const b = document.body;
    b.setAttribute('data-theme', b.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  $$('#marketTabs button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('#marketTabs button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.body.setAttribute('data-market', btn.dataset.market);
      recompute();
    });
  });

  $$('#moduleNav button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('#moduleNav button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      $$('.module-section').forEach(function (s) { s.style.display = 'none'; });
      $('#' + btn.dataset.target).style.display = 'block';
    });
  });

  $$('[data-collapsible] .card-header').forEach(function (h) {
    h.addEventListener('click', function () { h.closest('.card').classList.toggle('collapsed'); });
  });

  $$('.pill-select').forEach(function (group) {
    group.addEventListener('click', function (e) {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      $$('.pill', group).forEach(function (p) { p.classList.remove('selected'); });
      pill.classList.add('selected');
      if (group.dataset.pillgroup === 'art61-exception') {
        $('#art61SubtypeField').style.display = pill.dataset.value === 'yes' ? 'block' : 'none';
      }
      recompute();
    });
  });

  document.addEventListener('input', recompute);
  document.addEventListener('change', recompute);

  /* ---- helpers ---- */
  function pillValue(name) {
    const group = $('.pill-select[data-pillgroup="' + name + '"]');
    if (!group) return null;
    const sel = $('.pill.selected', group);
    return sel ? sel.dataset.value : null;
  }
  function countChecked(sel) { return $$(sel).filter(function (el) { return el.checked; }).length; }
  function totalOf(sel) { return $$(sel).length; }

  function badge(status, text) {
    const cls = status === S.GREEN ? 'status-green' : status === S.AMBER ? 'status-amber' : status === S.RED ? 'status-red' : 'status-gray';
    return '<span class="status-badge ' + cls + '"><span class="dot"></span>' + text + '</span>';
  }
  function citeLine(cites) {
    if (!cites || !cites.length) return '';
    return '<span class="cite">Ref: ' + cites.map(function (c) { return c.ref; }).join(' · ') + '.</span>';
  }
  function block(status, headline, text, cites, extraClass) {
    return '<div class="result-block ' + (extraClass || '') + '"><h4>' + badge(status, headline) + '</h4><p>' + text + ' ' + citeLine(cites) + '</p></div>';
  }

  let moduleStatuses = {};
  let lastActions = [];

  /* ---- gather all inputs into a plain profile object ---- */
  function gather() {
    return {
      deviceName: $('#deviceName').value.trim(),
      prevHistory: $('#prevHistory').value,
      euClass: $('#euClass').value,
      fdaPath: $('#fdaPath').value,
      intendedPurpose: $('#intendedPurpose').value.trim(),
      population: $('#population').value.trim(),
      userEnv: $('#userEnv').value.trim(),
      novel: $('#flagNovel').checked,
      samd: $('#flagSamd').checked,
      implant: $('#flagImplant').checked,
      soup: $('#flagSoup').checked,
      networked: $('#flagNetworked').checked,
      highUseRisk: $('#flagHighUseRisk').checked,

      art61Implant: pillValue('art61-implant'),
      art61Exception: pillValue('art61-exception'),
      art61SubtypeLabel: (function () {
        const sel = $('#art61Subtype');
        return sel ? sel.options[sel.selectedIndex].text : null;
      })(),

      eqTech: pillValue('eq-tech'), eqBio: pillValue('eq-bio'),
      eqClin: pillValue('eq-clin'), eqAccess: pillValue('eq-access'),

      gapSourcesChecked: countChecked('.gap-src'), gapSourcesTotal: totalOf('.gap-src'),
      gapClaims: $('#gapClaims').value.trim(),

      cepChecked: countChecked('.cep-item'), cepTotal: totalOf('.cep-item'),
      cerChecked: countChecked('.cer-item'), cerTotal: totalOf('.cer-item'),

      pmcfChecked: countChecked('.pmcf-method'), pmcfJustify: $('#pmcfJustify').value.trim(),

      sscpChecked: countChecked('.sscp-item'), sscpTotal: totalOf('.sscp-item'),
      sscpConsistency: pillValue('sscp-consistency'),

      psurChecked: countChecked('.psur-item'), psurTotal: totalOf('.psur-item'),

      samdAssoc: pillValue('samd-assoc'), samdAnalytical: pillValue('samd-analytical'),
      samdClinical: pillValue('samd-clinical'), samdAdaptive: pillValue('samd-adaptive'),

      pccpChecked: countChecked('.pccp-item'), pccpTotal: totalOf('.pccp-item'),

      hfMapped: pillValue('hf-mapped'), hfSummative: pillValue('hf-summative'),

      cyberChecked: countChecked('.cyber-item'), cyberTotal: totalOf('.cyber-item'),

      soupRiskClass: ($('#soupRiskClass') || {}).value || 'B',
      soupChecked: countChecked('.soup-item'), soupTotal: totalOf('.soup-item')
    };
  }

  /* ---- main recompute ---- */
  function recompute() {
    const p = gather();
    const R = CC.rules;
    const market = document.body.getAttribute('data-market');

    // 1 Profile
    const prof = R.profile.evaluate(p);
    moduleStatuses.profile = prof.status;
    let profHtml = block(prof.status, prof.complete ? 'Profile sufficiently complete' : 'Profile incomplete — add missing fields',
      'Suggested clinical evidence intensity: <strong>' + prof.evidenceIntensity + '</strong>. Based on EU MDR class, implantable status, and novelty flag.', null);
    if (prof.rule11) {
      profHtml += block(S.AMBER, 'Check Annex VIII Rule 11 classification',
        'Device is flagged SaMD/AI-enabled but classed as EU MDR Class I — most software driving diagnostic or therapeutic decisions is pushed to Class IIa/IIb/III under Rule 11. Re-verify this classification before relying on Class I self-certification pathway (no Notified Body, no AI Act high-risk trigger).', prof.cites);
    }
    $('#profileOutputs').innerHTML = profHtml;

    // 2 Strategy (EU + FDA)
    const eu = R.strategyEU.evaluate(p);
    const fda = R.strategyFDA.evaluate(p);
    moduleStatuses.strategy = eu.status;
    let strat = block(eu.status, 'EU MDR Art. 61 outcome', eu.text, eu.cites, 'market-only-eu');
    if (eu.annexXV) strat += block(S.AMBER, 'Annex XV applies to the investigation itself',
      'Once a clinical investigation is confirmed necessary, its design, conduct, and documentation (investigation plan, investigator’s brochure, informed consent, safety reporting) are governed by <strong>MDR Annex XV</strong> and ISO 14155 — this module flags the trigger only; investigation planning is a separate downstream workstream.', eu.annexXVCites, 'market-only-eu');
    strat += block(S.AMBER, 'FDA pathway data expectation', fda.text, fda.cites, 'market-only-fda');
    if (market === 'both') {
      strat += '<div class="compare-cols"><div class="col-eu"><h5>EU MDR</h5><p style="font-size:0.78rem; color:var(--text-muted);">' + eu.text + '</p></div><div class="col-fda"><h5>FDA</h5><p style="font-size:0.78rem; color:var(--text-muted);">' + fda.text + '</p></div></div>';
    }
    $('#strategyOutput').innerHTML = strat;

    // 3 Equivalence
    const eq = R.equivalence.evaluate(p);
    moduleStatuses.equivalence = eq.status;
    $('#equivalenceOutput').innerHTML = block(eq.status, eq.headline, eq.text, eq.cites);

    // 4 Data gap
    const gap = R.dataGap.evaluate(p);
    moduleStatuses.gap = gap.status;
    $('#gapOutput').innerHTML = block(gap.status, 'Data sufficiency', gap.text, gap.cites);

    // 5 CEP/CER
    const cep = R.cepCer.evaluate(p);
    moduleStatuses.cep = cep.status;
    $('#cepOutput').innerHTML = block(cep.status, 'CEP/CER completeness', cep.text, cep.cites);

    // 6 PMCF
    const pmcf = R.pmcf.evaluate(p);
    moduleStatuses.pmcf = pmcf.status;
    $('#pmcfOutput').innerHTML = block(pmcf.status, 'PMCF plan status', pmcf.text, pmcf.cites);

    // 7 SSCP
    const sscp = R.sscp.evaluate(p);
    moduleStatuses.sscp = sscp.status;
    $('#sscpOutput').innerHTML = block(sscp.status, 'SSCP status', sscp.text, sscp.cites);

    // 7b PSUR
    const psur = R.psurPms.evaluate(p);
    moduleStatuses.psur = psur.status;
    $('#psurOutput').innerHTML = block(psur.status, 'PSUR/PMS status',
      '<strong>' + psur.tier + '.</strong> Frequency: ' + psur.freq + '. Route: ' + psur.route + '. Documentation ' + p.psurChecked + '/' + p.psurTotal + ' elements present (' + psur.pct + '%).', psur.cites);

    // 8 SaMD
    const samd = R.samdAi.evaluate(p);
    moduleStatuses.samd = samd.status;
    $('#samdOutput').innerHTML = block(samd.status, 'SaMD/AI pillar status', samd.text, samd.cites);

    // 8b PCCP
    const pccp = R.pccp.evaluate(p);
    moduleStatuses.pccp = pccp.status;
    $('#pccpOutput').innerHTML = block(pccp.status, 'PCCP status', pccp.text, pccp.cites, 'market-only-fda');

    // 8c AI Act
    const aiact = R.aiAct.evaluate(p);
    moduleStatuses.aiact = aiact.status;
    $('#aiActOutput').innerHTML = block(aiact.status, 'AI Act status', aiact.text, aiact.cites);

    // 9 Human factors
    const hf = R.humanFactors.evaluate(p);
    moduleStatuses.hf = hf.status;
    $('#hfOutput').innerHTML = block(hf.status, 'Human factors linkage', hf.text, hf.cites);

    // 10 Cyber
    const cyber = R.cybersecurity.evaluate(p);
    moduleStatuses.cyber = cyber.status;
    $('#cyberOutput').innerHTML = block(cyber.status, 'Cybersecurity linkage', cyber.text, cyber.cites);

    // 11 SOUP
    const soup = R.soup.evaluate(p);
    moduleStatuses.soup = soup.status;
    $('#soupOutput').innerHTML = block(soup.status, 'SOUP/OTS clinical impact', soup.text, soup.cites);

    // ---- overall score ----
    const overall = CC.engine.computeOverall(moduleStatuses);
    const ring = $('#ringFg');
    const circumference = 2 * Math.PI * 46;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference * (1 - overall.pct / 100);
    ring.style.stroke = overall.pct >= 75 ? 'var(--green)' : overall.pct >= 45 ? 'var(--amber)' : 'var(--red)';
    $('#gapScoreNum').textContent = overall.pct + '%';
    $('#overallStatusBadge').innerHTML = badge(overall.overallStatus,
      overall.overallStatus === S.GREEN ? 'Clinical evaluation package on track' :
      overall.overallStatus === S.AMBER ? 'Gaps present — review flagged items' :
      'Critical gaps — package not defensible yet');

    const labels = CC.engine.MODULE_LABELS;
    $('#statusBreakdown').innerHTML = Object.keys(labels).map(function (k) {
      const st = moduleStatuses[k];
      const cls = st === S.GREEN ? 'status-green' : st === S.AMBER ? 'status-amber' : st === S.RED ? 'status-red' : 'status-gray';
      const label = st === S.NA ? 'N/A' : st.charAt(0).toUpperCase() + st.slice(1);
      return '<div class="breakdown-row"><span>' + labels[k] + '</span><span class="module-score-tag ' + cls + '">' + label + '</span></div>';
    }).join('');

    // ---- action list ----
    const actions = CC.engine.buildActions(moduleStatuses, { profileComplete: prof.complete, eqAccess: p.eqAccess });
    lastActions = actions;
    $('#actionList').innerHTML = actions.map(function (a) {
      return '<div class="action-item"><span class="marker">' + badge(a.status, '') + '</span><span><strong style="font-size:0.8rem;">' + a.t + '</strong><br>' + a.c + (a.cite ? '<span class="cite">Ref: ' + a.cite + '</span>' : '') + '</span></div>';
    }).join('');

    CC.exporter.buildMasterReport({
      deviceName: p.deviceName, pct: overall.pct, overallStatus: overall.overallStatus,
      moduleStatuses: moduleStatuses, labels: labels, actions: actions,
      outputHtmlById: function (id) { const el = document.getElementById(id); return el ? el.innerHTML : ''; }
    });
  }

  /* ---- export buttons ---- */
  $('#printBtn').addEventListener('click', function () { window.print(); });
  $('#exportBtn').addEventListener('click', function () { window.print(); });
  $('#csvBtn').addEventListener('click', function () {
    const p = gather();
    CC.exporter.downloadCsv(p, moduleStatuses, $('#gapScoreNum').textContent);
  });

  /* ---- service worker ---- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function () {});
    });
  }

  recompute();
})();
