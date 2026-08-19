/* Shared test loader — requires the app's universal modules in dependency order
   so they attach to Node's `global.CC`, exactly as the browser attaches them to
   `window.CC`. Tests import the same shipped code, no duplication. */
'use strict';
require('../js/utils.js');
[
  'profile', 'strategy-eu', 'strategy-fda', 'equivalence', 'data-gap', 'cep-cer',
  'pmcf', 'sscp', 'psur-pms', 'samd-ai', 'pccp', 'ai-act', 'human-factors',
  'cybersecurity', 'soup'
].forEach(function (m) { require('../js/rules/' + m + '.js'); });
require('../js/checklist-engine.js');

module.exports = global.CC;
