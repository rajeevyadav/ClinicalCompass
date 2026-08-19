/* ClinicalCompass — shared utilities and the CC namespace.
   Universal module: attaches to `window` in the browser and to `global` in
   Node (so the rules engine and its tests import the exact same code). No DOM
   access here — rules stay pure and testable. */
(function (root) {
  'use strict';
  const CC = root.CC = root.CC || {};
  CC.rules = CC.rules || {};

  // Status vocabulary used everywhere: green | amber | red | gray (N/A).
  CC.STATUS = { GREEN: 'green', AMBER: 'amber', RED: 'red', NA: 'gray' };

  // Percentage of checked items, integer 0..100 (0 when the list is empty).
  CC.pct = function (checked, total) {
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  CC.clamp = function (n, lo, hi) { return Math.max(lo, Math.min(hi, n)); };

  CC.escape = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  // A citation is { ref, verifiedAsOf }. verifiedAsOf lets a future maintainer
  // see which citations are stale without re-checking everything.
  CC.cite = function (ref, verifiedAsOf) { return { ref: ref, verifiedAsOf: verifiedAsOf }; };

})(typeof window !== 'undefined' ? window : global);
