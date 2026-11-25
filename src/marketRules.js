/* ============================================================
   HYENAX - AUTHORITATIVE 35-MARKET SPECIFICATION & GATEKEEPER
   Single source of truth for approved sportsbook markets,
   goal over line discipline (Match Over 1.5+, Team Over 0.5+),
   booking Under-only discipline, league corner availability,
   and cross-league coefficient calibration.
   ============================================================ */

export const APPROVED_MARKETS_32 = [
  { id: 1, key: 'FULL_TIME_1X2', name: 'Full Time / Match Result (1X2)', group: 'RESULT', description: 'Home win, Draw, or Away win over 90 minutes plus injury time.' },
  { id: 2, key: 'HALF_TIME_1X2', name: 'Half Time Result', group: 'HALVES', description: 'Home win, Draw, or Away win at halftime.' },
  { id: 3, key: 'SECOND_HALF_1X2', name: '2nd Half 1X2', group: 'HALVES', description: 'Home win, Draw, or Away win based strictly on second-half goals.' },
  { id: 4, key: 'DOUBLE_CHANCE', name: 'Double Chance', group: 'RESULT', description: 'Combines two of the three match outcomes (1X, X2) over 90 minutes.' },
  { id: 5, key: 'DRAW_NO_BET', name: 'Draw No Bet (DNB)', group: 'RESULT', description: 'Home or Away to win; stake refunded if the match ends in a draw.' },
  { id: 6, key: 'FIRST_HALF_DNB', name: '1st Half Draw No Bet', group: 'HALVES', description: 'Home or Away to win the first half; stake refunded on a drawn first half.' },
  { id: 7, key: 'HANDICAP', name: 'Handicap', group: 'HANDICAP_MARGIN', description: 'Virtual goal advantage or deficit applied before settling the result.' },
  { id: 8, key: 'WINNING_MARGINS', name: 'Winning Margins', group: 'HANDICAP_MARGIN', description: 'Exact goal difference (by 1, 2, or 3+ goals) for Home/Away, or Draw.' },
  { id: 9, key: 'HT_FT', name: 'Half Time / Full Time (HT/FT)', group: 'HALVES', description: 'Predict both the halftime result and final full-time result.' },
  { id: 10, key: 'CORRECT_SCORE', name: 'Correct Score', group: 'EXACT_SCORE', description: 'Exact final scoreline over 90 minutes plus stoppage time.' },
  { id: 11, key: 'TOTALS_OU', name: 'Totals (Over/Under Goals)', group: 'GOALS', description: 'Total match goals Over (starting from 1.5+) or Under (1.5 to 4.5).' },
  { id: 12, key: 'FIRST_HALF_TOTALS', name: '1st Half Totals', group: 'HALVES', description: 'Over/Under goal lines settled strictly on first-half goals.' },
  { id: 13, key: 'BTTS', name: 'Both Teams to Score (BTTS)', group: 'BTTS_COMBO', description: 'Yes or No on whether both teams score at least one goal.' },
  { id: 14, key: 'MATCHBET_BTTS', name: 'Matchbet & BTTS', group: 'BTTS_COMBO', description: 'Combined bet on match outcome (1X2 / Double Chance) and BTTS.' },
  { id: 15, key: 'MATCHBET_TOTALS', name: 'Matchbet + Totals', group: 'BTTS_COMBO', description: 'Combined bet on match outcome and Over/Under total goals (Over 1.5+).' },
  { id: 16, key: 'BTTS_TOTALS', name: 'BTTS and Totals', group: 'BTTS_COMBO', description: 'Combined bet on Both Teams to Score and Over/Under goal lines (Over 1.5+).' },
  { id: 17, key: 'ODD_EVEN_GOALS', name: 'Odd/Even Goals', group: 'GOALS', description: 'Total match goals odd or even (0 counts as even).' },
  { id: 18, key: 'WHICH_TEAM_TO_SCORE', name: 'Which Team to Score', group: 'GOALS', description: 'Home only, Away only, Both teams, or No goals scored.' },
  { id: 19, key: 'FIRST_LAST_TO_SCORE', name: 'First / Last Team to Score', group: 'TIMING', description: 'Which team scores the first or last goal (or no goal).' },
  { id: 20, key: 'FIRST_GOAL_INTERVAL', name: 'First Goal Interval (10-Minute Brackets)', group: 'TIMING', description: '10-minute window (1-10 up to 81-90, or No Goal) for the first goal.' },
  { id: 21, key: 'FIRST_10_MIN_RESULT', name: 'First 10 Minutes Result', group: 'TIMING', description: 'Team leading or Draw at the 10-minute mark (00:00 to 09:59).' },
  { id: 22, key: 'HIGHEST_SCORING_HALF', name: 'Highest Scoring Half', group: 'HALVES', description: 'More goals in 1st half, 2nd half, or equal goals in both halves.' },
  { id: 23, key: 'MULTIGOALS', name: 'Multigoals (Match, Half, or Team)', group: 'GOALS', description: 'Goal ranges (0, 1-2, 1-3, 2-3, 4+) for match, half, or specific team.' },
  { id: 24, key: 'CLEAN_SHEET', name: 'Clean Sheet', group: 'TEAM_PERF', description: 'Yes or No on whether a team concedes zero goals.' },
  { id: 25, key: 'WIN_TO_NIL', name: 'Win to Nil', group: 'TEAM_PERF', description: 'Team wins while keeping a clean sheet.' },
  { id: 26, key: 'HALF_PERFORMANCE', name: 'Win Both Halves / Win Either Half / Score Both Halves', group: 'TEAM_PERF', description: 'Team-specific half win or scoring performance markets.' },
  { id: 27, key: 'GOAL_SCORER', name: 'Goal Scorer Markets', group: 'SCORER_FLOW', description: 'First Goalscorer or Anytime Goalscorer for key attackers.' },
  { id: 28, key: 'MATCHFLOW', name: 'Matchflow', group: 'SCORER_FLOW', description: 'Combined bet on first team/player to score and final match winner.' },
  { id: 29, key: 'TOTAL_CORNERS', name: 'Corner Markets Suite (9 Markets)', group: 'CORNERS', description: 'Total Match Corners, Corner Winner, Corner Handicap, 1st/2nd Half Corners, Match/Half/Team Corner Ranges (strictly in corner-eligible leagues).' },
  { id: 30, key: 'BOOKINGS_CARDS', name: 'Bookings / Cards Markets', group: 'BOOKINGS', description: 'Booking points Unders only (Yellow=1pt, Red=2pt), Most Bookings, First Team Booked.' },
  { id: 31, key: 'KNOCKOUT_CUP', name: 'Knockout / Cup Markets', group: 'CUP_OUTRIGHT', description: 'To Qualify, Overtime/Extra Time, or Penalty Shootout in cup ties.' },
  { id: 32, key: 'ANTE_POST_OUTRIGHT', name: 'Ante-Post / Outright Markets', group: 'CUP_OUTRIGHT', description: 'Long-term bets on league winners, tournament champions, or seasonal titles.' },
  { id: 33, key: 'FIRST_15_MIN_DRAW', name: 'First 15 Minutes Draw / Result', group: 'TIMING', description: 'Draw or outcome at the 15-minute mark (00:00 to 14:59).' },
  { id: 34, key: 'TOTAL_MATCH_SHOTS', name: 'Total Match Shots', group: 'SHOOTING', description: 'Over/Under lines on total match shots taken over 90 minutes.' },
  { id: 35, key: 'TEAM_GOAL_TOTALS', name: 'Team Goal Totals', group: 'GOALS', description: 'Individual team Over/Under goal lines (team Overs starting from Over 0.5 Goals).' }
];

export const APPROVED_MARKETS_35 = APPROVED_MARKETS_32;

/**
 * Tier 1 Global Broadcast Competitions:
 * Betting apps (Hollywoodbets, Betway, EasyBet, Bet365) price the FULL market menu
 * including Total Match Shots, Anytime/First Goalscorers, Matchflow, First Team Booked,
 * First 10m/15m Result, and all 9 Corner market variants.
 */
export const ELITE_FULL_SPORTSBOOK_LEAGUES = new Set([
  // Top European Leagues
  'epl', 'laliga', 'seriea', 'bundesliga', 'ligue1',
  'championship', 'eredivisie', 'ligaportugal', 'jupiler', 'scotprem',
  'superlig', 'greece', 'austria', 'superliga', 'swiss',
  // UEFA & Major Continental / International
  'ucl', 'uel', 'uecl', 'uefa_nations', 'afcon', 'world_cup', 'euro', 'copa_america',
  'libertadores', 'sudamericana', 'caf_cl',
  // Global Tier 1 & South Africa
  'psl', 'egypt', 'botola', 'brasileirao', 'argliga', 'mls', 'ligamx',
  'saudi', 'j1', 'kleague1', 'aleague',
  // Top Women's & Domestic FA Cups with full props
  'wsl', 'nwsl', 'liga_f', 'frauen_bundesliga', 'premiere_ligue',
  'uwcl', 'fifa_wwc', 'uefa_w_euro', 'uefa_w_nations', 'olympic_w_football',
  'mens_fa_cup', 'womens_fa_cup'
]);

/**
 * Authoritative Corner-Eligible Leagues Set (Tier 1 + Tier 2):
 * Betting apps reliably offer Corner markets (Winner, Handicap, Match/1H/2H Totals, Ranges)
 * in these Tier 1/2, continental, major women's, and established leagues.
 * Friendlies, college NCAA, micro-leagues, and unsupported women's/regional leagues are EXCLUDED.
 */
export const CORNER_ELIGIBLE_LEAGUES = new Set([
  // Top European & UK
  'epl', 'laliga', 'seriea', 'bundesliga', 'ligue1',
  'championship', 'eng_l1', 'eng_l2', 'laliga2', 'serieb', 'bundesliga2', 'ligue2',
  'eredivisie', 'ligaportugal', 'jupiler', 'scotprem', 'superlig', 'greece',
  'austria', 'superliga', 'swiss', 'ekstraklasa', 'czech', 'croatia', 'serbia',
  'romania', 'hungary', 'russia', 'ukraine', 'eliteserien', 'allsvenskan',
  'finland', 'ireland', 'israel', 'cyprus', 'bulgaria', 'slovakia', 'slovenia',
  'netherlands_eerste', 'germany_3liga', 'iceland_urvalsdeild',
  // Continental & Major International
  'ucl', 'uel', 'uecl', 'uefa_nations', 'afcon', 'world_cup', 'euro', 'copa_america',
  'libertadores', 'sudamericana', 'caf_cl', 'caf_cc', 'afc_cl',
  // South Africa & Global Tier 1/2
  'psl', 'egypt', 'botola', 'tunisia', 'algeria',
  'brasileirao', 'brasileiro_serieb', 'argliga', 'mls', 'usl_championship', 'ligamx',
  'colombia', 'chile', 'ecuador', 'uruguay', 'paraguay', 'peru',
  'saudi', 'j1', 'kleague1', 'aleague', 'csl',
  // Major Women's & FA Cup Competitions with Bookmaker Corner Coverage
  'wsl', 'nwsl', 'liga_f', 'frauen_bundesliga', 'premiere_ligue',
  'uwcl', 'fifa_wwc', 'uefa_w_euro', 'uefa_w_nations', 'olympic_w_football',
  'mens_fa_cup', 'womens_fa_cup'
]);

export function isCornerMarketAvailable(leagueId) {
  if (!leagueId) return false;
  return CORNER_ELIGIBLE_LEAGUES.has(String(leagueId).toLowerCase());
}

/**
 * Returns exact Sportsbook Market Coverage capabilities for a competition.
 * Prevents the engine from ever predicting markets that sportsbooks don't offer on that match.
 */
export function getLeagueMarketCoverage(leagueId = '') {
  const id = String(leagueId || '').toLowerCase();
  if (ELITE_FULL_SPORTSBOOK_LEAGUES.has(id)) {
    return {
      tier: 'FULL',
      hasCorners: true,
      hasTotalShots: true,
      hasGoalscorersAndMatchflow: true,
      hasBookings: true,
      hasFirstTeamBooked: true,
      hasFirstHalfBookings: true,
      hasEarlyTimeSegments: true
    };
  }
  if (CORNER_ELIGIBLE_LEAGUES.has(id)) {
    return {
      tier: 'CORNER_STANDARD',
      hasCorners: true,
      hasTotalShots: false,
      hasGoalscorersAndMatchflow: false,
      hasBookings: true,
      hasFirstTeamBooked: false,
      hasFirstHalfBookings: false,
      hasEarlyTimeSegments: true
    };
  }
  return {
    tier: 'CORE_ONLY',
    hasCorners: false,
    hasTotalShots: false,
    hasGoalscorersAndMatchflow: false,
    hasBookings: false,
    hasFirstTeamBooked: false,
    hasFirstHalfBookings: false,
    hasEarlyTimeSegments: false
  };
}

export function isKnockoutMatch(leagueId = '', roundStr = '') {
  const id = String(leagueId).toLowerCase();
  const rnd = String(roundStr).toLowerCase();
  if (/cup|fa_cup|dfb_pokal|coupe_de_france|copa_de_la_reina/.test(id)) return true;
  if (/quarter|semi|final|knockout|round of|play-?off|eliminat|tiebreak|leg/.test(rnd)) return true;
  if (/(ucl|uel|uecl|uwcl|caf_cl|caf_cc|afc_cl|libertadores|sudamericana)/.test(id) && /knockout|round|16|quarter|semi|final|play/.test(rnd)) return true;
  return false;
}

/**
 * Cross-Border League Quality Tier Coefficients (Used for UCL/UEL/UECL/Cups)
 * Ensures strong domestic clubs in elite top-5 leagues (e.g. Serie A's Como 1907)
 * are calibrated fairly against top clubs in smaller domestic coefficients (e.g. Greece's AEK Athens).
 */
export const LEAGUE_TIER_COEFFICIENT = {
  epl: 5.5,
  laliga: 4.5,
  bundesliga: 4.0,
  seriea: 4.5,
  ligue1: 3.0,
  brasileirao: 1.5,
  ligaportugal: 1.5,
  eredivisie: 1.5,
  jupiler: 0.5,
  championship: -0.5,
  superlig: 0.0,
  argliga: 0.5,
  saudi: 0.0,
  mls: -1.0,
  ligamx: -0.5,
  austria: -0.5,
  czech: -0.5,
  russia: -0.5,
  greece: -2.0,
  scotprem: -1.5,
  swiss: -1.5,
  superliga: -1.5,
  croatia: -2.0,
  serbia: -2.5,
  ukraine: -2.0,
  ekstraklasa: -2.0,
  egypt: -1.5,
  botola: -2.0,
  psl: -2.5,
  eliteserien: -2.5,
  allsvenskan: -2.5,
  romania: -3.0,
  hungary: -3.0,
  israel: -3.0,
  cyprus: -4.0,
  bulgaria: -4.5,
  slovakia: -4.0,
  slovenia: -4.5,
  bosnia: -5.5,
  kazakhstan: -5.5,
  azerbaijan: -4.5,
  armenia: -6.0,
  finland: -5.0
};

export function getCrossLeagueRatingOffset(domesticLeagueId = '') {
  const key = String(domesticLeagueId || '').toLowerCase();
  return LEAGUE_TIER_COEFFICIENT[key] ?? -2.0;
}

/**
 * Strict Market Gatekeeper Check:
 * 1. NEVER allow Bookings/Cards OVER markets (ONLY Unders + Most Bookings + First Team Booked).
 * 2. NEVER allow Corners in leagues without bookmaker corner coverage.
 * 3. NEVER allow Total Match Shots, Goalscorers, Matchflow, Bookings, or 10m/15m micro-props in leagues where sportsbooks don't offer them.
 * 4. NEVER allow Match Goal Overs below 1.5 (e.g. Match Over 0.5 Goals is forbidden; ONLY Team Total Goal Overs can start from Over 0.5).
 * 5. Disallow unsupported player/micro markets outside the 35 Approved Sportsbook Markets (Player Tackles, Shots on Target, Shot-Creating Actions, Goalkeeper Saves, 1UP/2UP/3UP, 12).
 */
export function isBannedOrDisallowedMarket(market = '', selection = '', leagueId = null) {
  const m = String(market || '').trim();
  const s = String(selection || '').trim();
  const mLow = m.toLowerCase();
  const sLow = s.toLowerCase();
  const combined = `${mLow} ${sLow}`;

  // Rule 1: Disallow ALL Bookings / Cards Over picks (Yellow = 1pt, Red = 2pt -> Unders only)
  if (/booking|card/i.test(combined)) {
    const isNonOverSidePick = /most\s+bookings|first\s+team\s+booked/i.test(combined);
    if (!isNonOverSidePick && (/\bover\b/i.test(s) || /\d+\+/.test(s))) {
      return { banned: true, reason: 'BOOKINGS_OVER_FORBIDDEN_UNDERS_ONLY' };
    }
  }

  // Rule 2: Disallow Corners on leagues without bookmaker corner offerings
  if (/corner/i.test(combined)) {
    if (leagueId && !isCornerMarketAvailable(leagueId)) {
      return { banned: true, reason: 'CORNERS_UNAVAILABLE_IN_LEAGUE' };
    }
  }

  // Rule 3: Strictly gate league-specific sportsbook availability (never predict unavailable props)
  if (leagueId) {
    const cov = getLeagueMarketCoverage(leagueId);
    if (!cov.hasTotalShots && (/match\s+total\s+shots|total\s+match\s+shots/i.test(mLow) || /\btotal\s+shots\b/i.test(sLow))) {
      return { banned: true, reason: 'SPORTSBOOK_MARKET_UNAVAILABLE_IN_LEAGUE' };
    }
    if (!cov.hasGoalscorersAndMatchflow && (/goalscorer|matchflow/i.test(combined))) {
      return { banned: true, reason: 'SPORTSBOOK_MARKET_UNAVAILABLE_IN_LEAGUE' };
    }
    if (!cov.hasFirstTeamBooked && /first\s+team\s+booked/i.test(combined)) {
      return { banned: true, reason: 'SPORTSBOOK_MARKET_UNAVAILABLE_IN_LEAGUE' };
    }
    if (!cov.hasFirstHalfBookings && /1st[- ]?half\s+bookings/i.test(combined)) {
      return { banned: true, reason: 'SPORTSBOOK_MARKET_UNAVAILABLE_IN_LEAGUE' };
    }
    if (!cov.hasBookings && /booking|card/i.test(combined)) {
      return { banned: true, reason: 'SPORTSBOOK_MARKET_UNAVAILABLE_IN_LEAGUE' };
    }
    if (!cov.hasEarlyTimeSegments && (/first\s*10\s*min|first\s*15\s*min|first\s*goal\s*interval|0-10m|0-15m/i.test(combined))) {
      return { banned: true, reason: 'SPORTSBOOK_MARKET_UNAVAILABLE_IN_LEAGUE' };
    }
  }

  // Rule 4: Goal Over Discipline — Match/Half goal overs must NOT be Over 0.5; ONLY Team Total Goals can start from Over 0.5
  const isTeamGoalMarket = /team\s+total\s+goals|team\s+goal\s+totals/i.test(mLow);
  const isGoalOverZeroFive = /\bover\s+0\.5\b/i.test(sLow) && !/corner|card|booking|shot/i.test(combined);
  if (isGoalOverZeroFive && !isTeamGoalMarket) {
    return { banned: true, reason: 'GOAL_OVER_0_5_ONLY_ALLOWED_FOR_TEAM_TOTALS' };
  }

  // Rule 5: Disallow unsupported player micro-props, early payouts & 12 draw traps
  if (/player\s+tackles|tackles\s+over/i.test(combined)) {
    return { banned: true, reason: 'PLAYER_TACKLES_REMOVED' };
  }
  if (/shots\s+on\s+target|shot-creating\s+actions|player\s+chance\s+creation|goalkeeper\s+saves/i.test(combined)) {
    return { banned: true, reason: 'UNSUPPORTED_PLAYER_MICROPROP_REMOVED' };
  }
  if (/early\s+payout|[123]up/i.test(combined)) {
    return { banned: true, reason: 'EARLY_PAYOUT_NOT_IN_APPROVED_MARKETS' };
  }
  if (/^12\s*·|either\s+to\s+win/i.test(s)) {
    return { banned: true, reason: '12_DRAW_TRAP_DISALLOWED' };
  }

  return { banned: false, reason: null };
}

export function filterPredictionsByMarketRules(predictions = [], leagueId = null) {
  if (!Array.isArray(predictions)) return [];
  return predictions.filter(p => !isBannedOrDisallowedMarket(p?.market, p?.selection, leagueId).banned);
}
