import fs from 'fs';
import { resolveTeamIdentity, OFFICIAL_TEAM_NAMES } from '../src/teamDatabase.js';

const fixturesPath = './data/fixtures.json';
const data = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

let updatedTeamsCount = 0;
let updatedLogosCount = 0;

data.matches = data.matches.map(m => {
  const homeResolved = resolveTeamIdentity(m.home.name, m.league?.id, m.home.logo);
  const awayResolved = resolveTeamIdentity(m.away.name, m.league?.id, m.away.logo);

  if (homeResolved.name !== m.home.name || awayResolved.name !== m.away.name) {
    updatedTeamsCount++;
  }
  if (!m.home.logo || !m.away.logo) {
    updatedLogosCount++;
  }

  m.home.name = homeResolved.name;
  m.home.short = homeResolved.short;
  m.home.logo = homeResolved.logo;

  m.away.name = awayResolved.name;
  m.away.short = awayResolved.short;
  m.away.logo = awayResolved.logo;

  // Also update rationale string if it references old names
  if (m.rationale) {
    m.rationale = `${m.home.name} (Elo ${m.home.rating}, xG ${m.home.xgFor}) vs ${m.away.name} (Elo ${m.away.rating}, xG ${m.away.xgFor}) in ${m.league.name}. Dixon-Coles model favors ${m.topPick.selection} (${m.topPick.probability}% calibrated probability).`;
  }

  return m;
});

data.meta.generated_at = new Date().toISOString();
fs.writeFileSync(fixturesPath, JSON.stringify(data, null, 2));

console.log(`Enriched ${data.matches.length} matches across ${data.meta.league_count || 54} leagues.`);
console.log(`Total teams enriched: ${updatedTeamsCount}, missing logos resolved: ${updatedLogosCount}`);

// Verify sample LaLiga matches (from user's attachment)
const laliga = data.matches.filter(m => m.league.id === 'laliga');
console.log('\n--- Verified LaLiga Fixtures matching attachment ---');
laliga.forEach(m => {
  console.log(`• ${m.home.name} [logo: ${!!m.home.logo}] vs ${m.away.name} [logo: ${!!m.away.logo}]`);
});
