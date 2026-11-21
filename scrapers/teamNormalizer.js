/* ============================================================
   HYENAX CANONICAL TEAM NORMALIZER & ALIAS RESOLVER
   Prevents exact-match misses and false substring collisions
   across ESPN, football-data.org, UnderStat, Transfermarkt,
   WhoScored, SoccerWiki, and Tactical Feed adapters.
   ============================================================ */

export function normalizeTeamKey(name) {
  if (!name) return '';
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\bfc\b|\bcf\b|\bsc\b|\bac\b|\bafc\b|\bssc\b|\bca\b|\brc\b|\brcd\b|\bvfb\b|\brb\b|\btsg\b|\bfsv\b|\bvfl\b|\bas\b|\bogc\b|\bsv\b|\bfk\b|\bbv\b|\bfsa\b|\bnk\b|\brsc\b|\bks\b|\bgnk\b|\bsk\b|\bud\b|\bsd\b|\bcd\b|\bus\b|\buc\b|\bkks\b|\bclub\b|\bde\b|\b1909\b|\b1913\b|\b1899\b|\b04\b|\b05\b/gi, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const TEAM_ALIAS_MAP = {
  // Premier League
  'man utd': 'manchester united',
  'manchester utd': 'manchester united',
  'man city': 'manchester city',
  'spurs': 'tottenham',
  'tottenham hotspur': 'tottenham',
  'newcastle united': 'newcastle',
  'brighton and hove albion': 'brighton',
  'west ham united': 'west ham',
  'wolverhampton wanderers': 'wolves',
  'leicester city': 'leicester',
  'ipswich town': 'ipswich',
  'nottingham forest': 'nottingham forest',
  'afc bournemouth': 'bournemouth',

  // LaLiga
  'real madrid': 'real madrid',
  'barcelona': 'barcelona',
  'atletico madrid': 'atletico madrid',
  'atletico de madrid': 'atletico madrid',
  'athletic bilbao': 'athletic club',
  'athletic club bilbao': 'athletic club',
  'real sociedad futbol': 'real sociedad',
  'real betis balompie': 'real betis',
  'celta de vigo': 'celta vigo',
  'celta vigo': 'celta vigo',
  'espanyol barcelona': 'espanyol',
  'deportivo alaves': 'alaves',

  // Serie A
  'inter': 'inter',
  'inter milan': 'inter',
  'internazionale': 'inter',
  'internazionale milano': 'inter',
  'milan': 'ac milan',
  'ac milan': 'ac milan',
  'roma': 'roma',
  'hellas verona': 'verona',

  // Bundesliga
  'bayern munchen': 'bayern munich',
  'bayern munich': 'bayern munich',
  'bayer leverkusen': 'bayer leverkusen',
  'leverkusen': 'bayer leverkusen',
  'bvb': 'borussia dortmund',
  'dortmund': 'borussia dortmund',
  'stuttgart': 'vfb stuttgart',
  'monchengladbach': 'borussia monchengladbach',
  'gladbach': 'borussia monchengladbach',
  'frankfurt': 'eintracht frankfurt',
  'leipzig': 'rb leipzig',

  // Ligue 1 & Europe
  'psg': 'paris saint germain',
  'paris saint germain': 'paris saint germain',
  'paris sg': 'paris saint germain',
  'olympique marseille': 'marseille',
  'olympique lyonnais': 'lyon',
  'losc lille': 'lille',
  'losc': 'lille',
  'stade rennais': 'rennes',
  'sporting cp': 'sporting cp',
  'sporting lisbon': 'sporting cp',
  'porto': 'fc porto',
  'sl benfica': 'benfica',
  'ajax amsterdam': 'ajax',
  'psv': 'psv eindhoven',
  'galatasaray': 'galatasaray',
  'fenerbahce': 'fenerbahce',
  'besiktas': 'besiktas',
  'bodo glimt': 'bodo glimt',

  // South Africa (Betway Premiership)
  'sundowns': 'mamelodi sundowns',
  'mamelodi sundowns': 'mamelodi sundowns',
  'pirates': 'orlando pirates',
  'orlando pirates': 'orlando pirates',
  'chiefs': 'kaizer chiefs',
  'kaizer chiefs': 'kaizer chiefs',
  'stellenbosch': 'stellenbosch',
  'supersport united': 'supersport united',
  'lamontville golden arrows': 'golden arrows',
  'golden arrows': 'golden arrows',
  'amazulu': 'amazulu',
  'sekhukhune united': 'sekhukhune united',
  'polokwane city': 'polokwane city',
  'ts galaxy': 'ts galaxy',
  'cape town city': 'cape town city',
  'richards bay': 'richards bay',
  'chippa united': 'chippa united',
  'marumo gallants': 'marumo gallants'
};

export function canonicalizeTeamKey(rawName) {
  const norm = normalizeTeamKey(rawName);
  if (!norm) return '';
  return TEAM_ALIAS_MAP[norm] || norm;
}

/**
 * Safely finds an entry in a dictionary keyed by club name without substring collisions.
 */
export function lookupByTeamName(table, rawName) {
  if (!table || !rawName) return null;
  const trimmed = String(rawName).trim();
  if (table[trimmed]) {
    return { key: trimmed, data: table[trimmed] };
  }

  const queryCanon = canonicalizeTeamKey(trimmed);
  if (!queryCanon) return null;

  const queryTokens = queryCanon.split(' ').filter(t => t.length >= 2);
  let bestCandidate = null;

  for (const [key, value] of Object.entries(table)) {
    if (key === '_meta' || value == null) continue;
    const keyCanon = canonicalizeTeamKey(key);
    if (!keyCanon) continue;

    if (keyCanon === queryCanon) {
      return { key, data: value };
    }

    // Token-set exact match (e.g. "United Manchester" or extra descriptor token)
    const keyTokens = keyCanon.split(' ').filter(t => t.length >= 2);
    if (queryTokens.length >= 2 && keyTokens.length >= 2) {
      const qInK = queryTokens.every(t => keyTokens.includes(t));
      const kInQ = keyTokens.every(t => queryTokens.includes(t));
      if (qInK || kInQ) {
        bestCandidate = { key, data: value };
      }
    }
  }

  return bestCandidate;
}
