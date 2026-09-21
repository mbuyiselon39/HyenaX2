import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Extract Script 2 (app logic)
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let appScript = null;

while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  if (count === 2) {
    appScript = match[1];
    break;
  }
}

console.log('Found appScript, length:', appScript?.length);

// Mock browser globals
globalThis.window = globalThis;
globalThis.addEventListener = () => {};
globalThis.window.addEventListener = () => {};
globalThis.window.innerWidth = 1200;
globalThis.document = {
  getElementById: (id) => null,
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => []
};
try {
  Object.defineProperty(globalThis.navigator, 'serviceWorker', {
    value: { register: () => Promise.resolve() },
    configurable: true
  });
} catch (e) {}
globalThis.location = {
  protocol: 'https:',
  hostname: 'localhost',
  search: ''
};
globalThis.URLSearchParams = class {
  get() { return null; }
};

// Mock BeastEngine
import('./js/beastClient.js').then(module => {
  if (!globalThis.BeastEngine) {
    globalThis.BeastEngine = module.default || module;
  }

  try {
    // Run app script
    const fn = new Function(appScript + '\nreturn app;');
    const appFactory = fn();
    console.log('appFactory created successfully');

    const instance = appFactory();
    console.log('app instance created successfully');

    // Run init
    console.log('Testing init()...');
    instance.init();
    console.log('init() completed successfully!');

    // Test getters and methods
    console.log('Testing filteredBeastPicks...');
    const beastPicks = instance.filteredBeastPicks;
    console.log('filteredBeastPicks length:', beastPicks?.length);

    console.log('Testing dailyTop15Matches...');
    const top15 = instance.dailyTop15Matches;
    console.log('dailyTop15Matches length:', top15?.length);

    console.log('Testing dayMatches...');
    const dm = instance.dayMatches(instance.selectedDate);
    console.log('dayMatches length:', dm?.length);

    console.log('Testing selectedMatch...');
    const sm = instance.selectedMatch;
    console.log('selectedMatch:', sm?.home?.name, 'vs', sm?.away?.name);

    console.log('Testing quantRiskAudit...');
    const qra = instance.quantRiskAudit;
    console.log('quantRiskAudit status:', qra?.status);

    console.log('Testing valueOpportunityCount...');
    const voc = instance.valueOpportunityCount;
    console.log('valueOpportunityCount:', voc);

    console.log('ALL INLINE TESTS PASSED WITH ZERO EXCEPTIONS!');
  } catch (err) {
    console.error('EXCEPTION in app execution:', err);
  }
});
