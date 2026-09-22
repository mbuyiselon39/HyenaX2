/**
 * Authoritative Configuration, Calibration Registry & Calendar Schedule
 * for the 33 Requested Women's & Cup Competitions.
 * Aligned to South African Standard Time (SAST, UTC+2) and the 2026/2027 Calendar.
 */

export const WOMENS_AND_CUPS_LEAGUES = [
  { id: 'nwsl', espn: 'usa.nwsl', name: 'National Women’s Soccer League (NWSL)', country: 'USA', flag: '🇺🇸', rho: -0.110, avgGoals: 2.75, homeAdv: 1.22, tierBase: 82, minElo: 74, maxElo: 88, category: 'womens' },
  { id: 'wsl', espn: 'eng.w.1', name: 'Barclays Women’s Super League (WSL)', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rho: -0.115, avgGoals: 3.10, homeAdv: 1.20, tierBase: 84, minElo: 76, maxElo: 91, category: 'womens' },
  { id: 'frauen_bundesliga', espn: 'ger.w.1', name: 'Google Pixel Frauen-Bundesliga', country: 'Germany', flag: '🇩🇪', rho: -0.100, avgGoals: 3.25, homeAdv: 1.18, tierBase: 82, minElo: 74, maxElo: 90, category: 'womens' },
  { id: 'liga_f', espn: 'esp.w.1', name: 'Liga F / Primera División Femenina', country: 'Spain', flag: '🇪🇸', rho: -0.090, avgGoals: 3.35, homeAdv: 1.24, tierBase: 83, minElo: 74, maxElo: 93, category: 'womens' },
  { id: 'premiere_ligue', espn: 'fra.w.1', name: 'Première Ligue', country: 'France', flag: '🇫🇷', rho: -0.095, avgGoals: 3.30, homeAdv: 1.22, tierBase: 82, minElo: 73, maxElo: 92, category: 'womens' },
  { id: 'serie_a_fem', espn: 'ita.w.1', name: 'Serie A Femminile', country: 'Italy', flag: '🇮🇹', rho: -0.120, avgGoals: 2.85, homeAdv: 1.20, tierBase: 80, minElo: 72, maxElo: 87, category: 'womens' },
  { id: 'damallsvenskan', espn: 'swe.w.1', name: 'Damallsvenskan', country: 'Sweden', flag: '🇸🇪', rho: -0.105, avgGoals: 3.00, homeAdv: 1.22, tierBase: 80, minElo: 72, maxElo: 85, category: 'womens' },
  { id: 'ligamx_fem', espn: 'mex.w.1', name: 'Liga MX Femenil', country: 'Mexico', flag: '🇲🇽', rho: -0.110, avgGoals: 3.05, homeAdv: 1.26, tierBase: 79, minElo: 71, maxElo: 85, category: 'womens' },
  { id: 'aleague_w', espn: 'aus.w.1', name: 'A-League Women', country: 'Australia', flag: '🇦🇺', rho: -0.095, avgGoals: 3.20, homeAdv: 1.20, tierBase: 77, minElo: 70, maxElo: 81, category: 'womens' },
  { id: 'brasileirao_fem', espn: 'bra.w.1', name: 'Brasileirão Feminino and Paulistão', country: 'Brazil', flag: '🇧🇷', rho: -0.130, avgGoals: 2.70, homeAdv: 1.30, tierBase: 80, minElo: 73, maxElo: 87, category: 'womens' },
  { id: 'vrouwen_eredivisie', espn: 'ned.w.1', name: 'Vrouwen Eredivisie', country: 'Netherlands', flag: '🇳🇱', rho: -0.090, avgGoals: 3.28, homeAdv: 1.20, tierBase: 78, minElo: 71, maxElo: 84, category: 'womens' },
  { id: 'usl_super_league', espn: 'usa.usl.w', name: 'USL Super League', country: 'USA', flag: '🇺🇸', rho: -0.115, avgGoals: 2.80, homeAdv: 1.24, tierBase: 77, minElo: 71, maxElo: 81, category: 'womens' },
  { id: 'northern_super_league', espn: 'can.w.nsl', name: 'Northern Super League', country: 'Canada', flag: '🇨🇦', rho: -0.120, avgGoals: 2.65, homeAdv: 1.25, tierBase: 76, minElo: 70, maxElo: 79, category: 'womens' },
  { id: 'hollywoodbets_super_league', espn: 'rsa.w.1', name: 'Hollywoodbets Super League / SAFA Women’s League', country: 'South Africa', flag: '🇿🇦', rho: -0.140, avgGoals: 2.60, homeAdv: 1.32, tierBase: 76, minElo: 68, maxElo: 84, category: 'womens' },
  { id: 'uwcl', espn: 'uefa.w.champions', name: 'UEFA Women’s Champions League', country: 'Europe', flag: '⭐', rho: -0.090, avgGoals: 3.40, homeAdv: 1.18, tierBase: 86, minElo: 78, maxElo: 93, category: 'womens' },
  { id: 'copa_libertadores_fem', espn: 'conmebol.libertadores.fem', name: 'CONMEBOL Copa Libertadores Femenina', country: 'South America', flag: '🏆', rho: -0.125, avgGoals: 2.85, homeAdv: 1.30, tierBase: 81, minElo: 73, maxElo: 87, category: 'womens' },
  { id: 'afc_wcl', espn: 'afc.w.champions', name: 'AFC Women’s Champions League', country: 'Asia', flag: '🌏', rho: -0.105, avgGoals: 3.10, homeAdv: 1.22, tierBase: 79, minElo: 71, maxElo: 85, category: 'womens' },
  { id: 'fifa_wwc', espn: 'fifa.wwc', name: 'FIFA Women’s World Cup', country: 'World', flag: '🌍', rho: -0.110, avgGoals: 2.80, homeAdv: 1.05, tierBase: 86, minElo: 75, maxElo: 92, category: 'womens' },
  { id: 'uefa_w_euro', espn: 'uefa.w.euro', name: 'UEFA Women’s Championship / Women’s Euros', country: 'Europe', flag: '🇪🇺', rho: -0.115, avgGoals: 2.88, homeAdv: 1.10, tierBase: 85, minElo: 75, maxElo: 91, category: 'womens' },
  { id: 'uefa_w_nations', espn: 'uefa.w.nations', name: 'UEFA Women’s Nations League', country: 'Europe', flag: '🇪🇺', rho: -0.115, avgGoals: 2.90, homeAdv: 1.15, tierBase: 83, minElo: 74, maxElo: 91, category: 'womens' },
  { id: 'copa_america_fem', espn: 'conmebol.copa.america.femenina', name: 'CONMEBOL Copa América Femenina', country: 'South America', flag: '🏆', rho: -0.120, avgGoals: 2.95, homeAdv: 1.12, tierBase: 81, minElo: 71, maxElo: 88, category: 'womens' },
  { id: 'wafcon', espn: 'caf.w.nations', name: 'CAF Women’s Africa Cup of Nations / WAFCON', country: 'Africa', flag: '🌍', rho: -0.145, avgGoals: 2.45, homeAdv: 1.15, tierBase: 78, minElo: 68, maxElo: 85, category: 'womens' },
  { id: 'afc_w_asian_cup', espn: 'afc.w.asian.cup', name: 'AFC Women’s Asian Cup', country: 'Asia', flag: '🌏', rho: -0.105, avgGoals: 3.15, homeAdv: 1.12, tierBase: 80, minElo: 70, maxElo: 88, category: 'womens' },
  { id: 'concacaf_w_gold_cup', espn: 'concacaf.w.gold_cup', name: 'CONCACAF W Championship / Gold Cup', country: 'North America', flag: '🏆', rho: -0.100, avgGoals: 3.25, homeAdv: 1.14, tierBase: 82, minElo: 71, maxElo: 90, category: 'womens' },
  { id: 'olympic_w_football', espn: 'fifa.w.olympics', name: 'Summer Olympic Games Women’s Football Tournament', country: 'World', flag: '🥇', rho: -0.105, avgGoals: 2.95, homeAdv: 1.05, tierBase: 87, minElo: 76, maxElo: 92, category: 'womens' },
  { id: 'womens_fa_cup', espn: 'eng.w.fa', name: 'Women’s FA Cup – England', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rho: -0.100, avgGoals: 3.40, homeAdv: 1.22, tierBase: 81, minElo: 70, maxElo: 91, category: 'womens' },
  { id: 'mens_fa_cup', espn: 'eng.fa', name: 'Men’s FA Cup', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rho: -0.115, avgGoals: 2.95, homeAdv: 1.24, tierBase: 78, minElo: 68, maxElo: 92, category: 'england' },
  { id: 'womens_league_cup', espn: 'eng.w.league_cup', name: 'FA Women’s Continental League Cup – England', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rho: -0.105, avgGoals: 3.25, homeAdv: 1.20, tierBase: 81, minElo: 72, maxElo: 90, category: 'womens' },
  { id: 'womens_championship', espn: 'eng.w.2', name: 'Women’s Championship – England Tier 2', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rho: -0.120, avgGoals: 2.85, homeAdv: 1.24, tierBase: 75, minElo: 68, maxElo: 81, category: 'womens' },
  { id: 'copa_de_la_reina', espn: 'esp.copa_de_la_reina', name: 'Copa de la Reina – Spain', country: 'Spain', flag: '🇪🇸', rho: -0.095, avgGoals: 3.30, homeAdv: 1.25, tierBase: 80, minElo: 70, maxElo: 93, category: 'womens' },
  { id: 'dfb_pokal_frauen', espn: 'ger.w.dfb_pokal', name: 'DFB-Pokal Frauen – Germany', country: 'Germany', flag: '🇩🇪', rho: -0.090, avgGoals: 3.45, homeAdv: 1.22, tierBase: 80, minElo: 70, maxElo: 90, category: 'womens' },
  { id: 'coupe_de_france_fem', espn: 'fra.w.coupe_de_france', name: 'Coupe de France Féminine – France', country: 'France', flag: '🇫🇷', rho: -0.090, avgGoals: 3.35, homeAdv: 1.22, tierBase: 80, minElo: 70, maxElo: 92, category: 'womens' },
  { id: 'ncaa_w_soccer', espn: 'usa.ncaa.w.1', name: 'NCAA Women’s Soccer', country: 'USA', flag: '🇺🇸', rho: -0.100, avgGoals: 2.90, homeAdv: 1.26, tierBase: 75, minElo: 66, maxElo: 82, category: 'womens' }
];

export const WOMENS_AND_CUPS_TEAMS = {
  // South Africa: Hollywoodbets Super League
  'mamelodi sundowns ladies': { name: 'Mamelodi Sundowns Ladies', rating: 83, domestic: 'hollywoodbets_super_league', form: ['W','W','W','W','W'], xgFor: 2.65, xgAgainst: 0.65 },
  'sundowns ladies': { name: 'Mamelodi Sundowns Ladies', rating: 83, domestic: 'hollywoodbets_super_league', form: ['W','W','W','W','W'], xgFor: 2.65, xgAgainst: 0.65 },
  'jvw fc': { name: 'JVW FC', rating: 78, domestic: 'hollywoodbets_super_league', form: ['W','W','D','W','L'], xgFor: 1.85, xgAgainst: 1.10 },
  'jvw': { name: 'JVW FC', rating: 78, domestic: 'hollywoodbets_super_league', form: ['W','W','D','W','L'], xgFor: 1.85, xgAgainst: 1.10 },
  'university of the western cape': { name: 'University of the Western Cape', rating: 79, domestic: 'hollywoodbets_super_league', form: ['W','W','W','D','W'], xgFor: 2.10, xgAgainst: 0.90 },
  'uwc ladies': { name: 'University of the Western Cape', rating: 79, domestic: 'hollywoodbets_super_league', form: ['W','W','W','D','W'], xgFor: 2.10, xgAgainst: 0.90 },
  'ts galaxy queens': { name: 'TS Galaxy Queens', rating: 76, domestic: 'hollywoodbets_super_league', form: ['W','L','W','D','W'], xgFor: 1.65, xgAgainst: 1.20 },
  'copperbelt ladies': { name: 'Copperbelt Ladies', rating: 74, domestic: 'hollywoodbets_super_league', form: ['L','W','D','L','W'], xgFor: 1.35, xgAgainst: 1.40 },
  'richmond united ladies': { name: 'Richmond United Ladies', rating: 73, domestic: 'hollywoodbets_super_league', form: ['L','D','W','L','L'], xgFor: 1.25, xgAgainst: 1.55 },
  'royal am ladies': { name: 'Royal AM Ladies', rating: 75, domestic: 'hollywoodbets_super_league', form: ['W','D','L','W','D'], xgFor: 1.55, xgAgainst: 1.30 },
  'tut ladies': { name: 'TUT Football Club', rating: 75, domestic: 'hollywoodbets_super_league', form: ['D','W','L','W','D'], xgFor: 1.50, xgAgainst: 1.25 },
  'tut football club': { name: 'TUT Football Club', rating: 75, domestic: 'hollywoodbets_super_league', form: ['D','W','L','W','D'], xgFor: 1.50, xgAgainst: 1.25 },
  'first touch academy': { name: 'First Touch Academy', rating: 74, domestic: 'hollywoodbets_super_league', form: ['L','W','D','L','W'], xgFor: 1.40, xgAgainst: 1.35 },
  'city lads': { name: 'City Lads', rating: 72, domestic: 'hollywoodbets_super_league', form: ['L','L','D','W','L'], xgFor: 1.15, xgAgainst: 1.65 },
  'university of johannesburg': { name: 'University of Johannesburg', rating: 76, domestic: 'hollywoodbets_super_league', form: ['W','D','W','L','D'], xgFor: 1.60, xgAgainst: 1.20 },
  'uj ladies': { name: 'University of Johannesburg', rating: 76, domestic: 'hollywoodbets_super_league', form: ['W','D','W','L','D'], xgFor: 1.60, xgAgainst: 1.20 },
  'durban ladies': { name: 'Durban Ladies', rating: 73, domestic: 'hollywoodbets_super_league', form: ['L','D','L','W','L'], xgFor: 1.20, xgAgainst: 1.50 },
  'lindelani ladies': { name: 'Lindelani Ladies', rating: 71, domestic: 'hollywoodbets_super_league', form: ['L','L','L','D','W'], xgFor: 1.05, xgAgainst: 1.80 },

  // USA: NWSL
  'orlando pride': { name: 'Orlando Pride', rating: 86, domestic: 'nwsl', form: ['W','W','W','D','W'], xgFor: 2.30, xgAgainst: 0.85 },
  'washington spirit': { name: 'Washington Spirit', rating: 85, domestic: 'nwsl', form: ['W','W','D','W','W'], xgFor: 2.15, xgAgainst: 0.95 },
  'kansas city current': { name: 'Kansas City Current', rating: 85, domestic: 'nwsl', form: ['W','W','W','L','W'], xgFor: 2.40, xgAgainst: 1.10 },
  'gotham fc': { name: 'NJ/NY Gotham FC', rating: 84, domestic: 'nwsl', form: ['W','D','W','W','D'], xgFor: 1.95, xgAgainst: 0.90 },
  'nj/ny gotham fc': { name: 'NJ/NY Gotham FC', rating: 84, domestic: 'nwsl', form: ['W','D','W','W','D'], xgFor: 1.95, xgAgainst: 0.90 },
  'portland thorns': { name: 'Portland Thorns', rating: 84, domestic: 'nwsl', form: ['W','L','W','W','D'], xgFor: 2.10, xgAgainst: 1.15 },
  'portland thorns fc': { name: 'Portland Thorns', rating: 84, domestic: 'nwsl', form: ['W','L','W','W','D'], xgFor: 2.10, xgAgainst: 1.15 },
  'san diego wave': { name: 'San Diego Wave FC', rating: 83, domestic: 'nwsl', form: ['D','W','L','W','D'], xgFor: 1.85, xgAgainst: 1.05 },
  'san diego wave fc': { name: 'San Diego Wave FC', rating: 83, domestic: 'nwsl', form: ['D','W','L','W','D'], xgFor: 1.85, xgAgainst: 1.05 },
  'north carolina courage': { name: 'North Carolina Courage', rating: 82, domestic: 'nwsl', form: ['W','D','L','W','W'], xgFor: 1.90, xgAgainst: 1.15 },
  'racing louisville': { name: 'Racing Louisville FC', rating: 81, domestic: 'nwsl', form: ['D','L','W','D','W'], xgFor: 1.70, xgAgainst: 1.25 },
  'racing louisville fc': { name: 'Racing Louisville FC', rating: 81, domestic: 'nwsl', form: ['D','L','W','D','W'], xgFor: 1.70, xgAgainst: 1.25 },
  'chicago red stars': { name: 'Chicago Red Stars', rating: 81, domestic: 'nwsl', form: ['L','W','D','W','L'], xgFor: 1.65, xgAgainst: 1.35 },
  'angel city fc': { name: 'Angel City FC', rating: 81, domestic: 'nwsl', form: ['W','L','D','L','W'], xgFor: 1.75, xgAgainst: 1.30 },
  'bay fc': { name: 'Bay FC', rating: 80, domestic: 'nwsl', form: ['W','L','L','W','W'], xgFor: 1.60, xgAgainst: 1.45 },
  'houston dash': { name: 'Houston Dash', rating: 79, domestic: 'nwsl', form: ['L','L','D','W','L'], xgFor: 1.30, xgAgainst: 1.55 },
  'seattle reign': { name: 'Seattle Reign FC', rating: 80, domestic: 'nwsl', form: ['D','W','L','L','D'], xgFor: 1.50, xgAgainst: 1.35 },
  'utah royals': { name: 'Utah Royals FC', rating: 78, domestic: 'nwsl', form: ['L','W','L','L','D'], xgFor: 1.25, xgAgainst: 1.65 },

  // England: WSL
  'chelsea women': { name: 'Chelsea Women', rating: 90, domestic: 'wsl', form: ['W','W','W','W','D'], xgFor: 2.70, xgAgainst: 0.75 },
  'manchester city women': { name: 'Manchester City Women', rating: 89, domestic: 'wsl', form: ['W','W','W','D','W'], xgFor: 2.60, xgAgainst: 0.80 },
  'arsenal women': { name: 'Arsenal Women', rating: 89, domestic: 'wsl', form: ['W','W','D','W','W'], xgFor: 2.50, xgAgainst: 0.85 },
  'manchester united women': { name: 'Manchester United Women', rating: 85, domestic: 'wsl', form: ['W','D','W','W','L'], xgFor: 2.15, xgAgainst: 1.05 },
  'brighton & hove albion women': { name: 'Brighton & Hove Albion Women', rating: 82, domestic: 'wsl', form: ['W','W','L','D','W'], xgFor: 1.85, xgAgainst: 1.25 },
  'brighton women': { name: 'Brighton & Hove Albion Women', rating: 82, domestic: 'wsl', form: ['W','W','L','D','W'], xgFor: 1.85, xgAgainst: 1.25 },
  'tottenham hotspur women': { name: 'Tottenham Hotspur Women', rating: 82, domestic: 'wsl', form: ['D','W','W','L','D'], xgFor: 1.80, xgAgainst: 1.30 },
  'liverpool women': { name: 'Liverpool Women', rating: 82, domestic: 'wsl', form: ['W','D','L','W','D'], xgFor: 1.75, xgAgainst: 1.25 },
  'aston villa women': { name: 'Aston Villa Women', rating: 80, domestic: 'wsl', form: ['L','D','W','L','D'], xgFor: 1.60, xgAgainst: 1.45 },
  'everton women': { name: 'Everton Women', rating: 79, domestic: 'wsl', form: ['D','L','D','L','W'], xgFor: 1.40, xgAgainst: 1.50 },
  'west ham united women': { name: 'West Ham United Women', rating: 79, domestic: 'wsl', form: ['L','L','W','D','L'], xgFor: 1.35, xgAgainst: 1.60 },
  'leicester city women': { name: 'Leicester City Women', rating: 78, domestic: 'wsl', form: ['L','D','L','W','L'], xgFor: 1.30, xgAgainst: 1.65 },
  'crystal palace women': { name: 'Crystal Palace Women', rating: 77, domestic: 'wsl', form: ['L','L','D','L','W'], xgFor: 1.25, xgAgainst: 1.80 },

  // Germany: Frauen-Bundesliga
  'bayern munich frauen': { name: 'Bayern Munich Frauen', rating: 90, domestic: 'frauen_bundesliga', form: ['W','W','W','W','W'], xgFor: 2.75, xgAgainst: 0.70 },
  'vfl wolfsburg frauen': { name: 'VfL Wolfsburg Frauen', rating: 88, domestic: 'frauen_bundesliga', form: ['W','W','D','W','W'], xgFor: 2.50, xgAgainst: 0.85 },
  'eintracht frankfurt frauen': { name: 'Eintracht Frankfurt Frauen', rating: 85, domestic: 'frauen_bundesliga', form: ['W','W','L','W','D'], xgFor: 2.20, xgAgainst: 1.05 },
  'tsg hoffenheim frauen': { name: 'TSG Hoffenheim Frauen', rating: 82, domestic: 'frauen_bundesliga', form: ['W','D','W','L','D'], xgFor: 1.85, xgAgainst: 1.25 },
  'bayer leverkusen frauen': { name: 'Bayer Leverkusen Frauen', rating: 82, domestic: 'frauen_bundesliga', form: ['W','W','D','L','W'], xgFor: 1.90, xgAgainst: 1.20 },
  'sc freiburg frauen': { name: 'SC Freiburg Frauen', rating: 80, domestic: 'frauen_bundesliga', form: ['D','L','W','W','L'], xgFor: 1.60, xgAgainst: 1.40 },
  'sgs essen': { name: 'SGS Essen', rating: 79, domestic: 'frauen_bundesliga', form: ['L','W','D','L','D'], xgFor: 1.45, xgAgainst: 1.45 },
  'werder bremen frauen': { name: 'Werder Bremen Frauen', rating: 79, domestic: 'frauen_bundesliga', form: ['L','D','W','L','W'], xgFor: 1.50, xgAgainst: 1.50 },
  'rb leipzig frauen': { name: 'RB Leipzig Frauen', rating: 79, domestic: 'frauen_bundesliga', form: ['W','L','L','W','D'], xgFor: 1.55, xgAgainst: 1.55 },
  'fc koln frauen': { name: '1. FC Köln Frauen', rating: 78, domestic: 'frauen_bundesliga', form: ['L','L','D','W','L'], xgFor: 1.30, xgAgainst: 1.65 },
  'carl zeiss jena frauen': { name: 'Carl Zeiss Jena Frauen', rating: 75, domestic: 'frauen_bundesliga', form: ['L','L','L','D','L'], xgFor: 1.05, xgAgainst: 1.95 },
  'turbine potsdam': { name: '1. FFC Turbine Potsdam', rating: 74, domestic: 'frauen_bundesliga', form: ['L','L','L','L','D'], xgFor: 0.95, xgAgainst: 2.10 },

  // Spain: Liga F
  'barcelona femeni': { name: 'FC Barcelona Femení', rating: 93, domestic: 'liga_f', form: ['W','W','W','W','W'], xgFor: 3.40, xgAgainst: 0.50 },
  'real madrid femenino': { name: 'Real Madrid Femenino', rating: 88, domestic: 'liga_f', form: ['W','W','W','D','W'], xgFor: 2.50, xgAgainst: 0.85 },
  'atletico madrid femenino': { name: 'Atlético Madrid Femenino', rating: 85, domestic: 'liga_f', form: ['W','D','W','W','D'], xgFor: 2.10, xgAgainst: 0.95 },
  'levante ud femenino': { name: 'Levante UD Femenino', rating: 82, domestic: 'liga_f', form: ['W','L','W','D','L'], xgFor: 1.80, xgAgainst: 1.30 },
  'madrid cff': { name: 'Madrid CFF', rating: 82, domestic: 'liga_f', form: ['L','W','W','L','W'], xgFor: 1.85, xgAgainst: 1.35 },
  'athletic club fem': { name: 'Athletic Club Femenino', rating: 82, domestic: 'liga_f', form: ['D','W','D','W','L'], xgFor: 1.70, xgAgainst: 1.20 },
  'real sociedad fem': { name: 'Real Sociedad Femenino', rating: 81, domestic: 'liga_f', form: ['D','L','W','D','W'], xgFor: 1.65, xgAgainst: 1.30 },
  'sevilla fc fem': { name: 'Sevilla FC Femenino', rating: 80, domestic: 'liga_f', form: ['L','W','L','D','W'], xgFor: 1.55, xgAgainst: 1.45 },
  'valencia cf fem': { name: 'Valencia CF Femenino', rating: 78, domestic: 'liga_f', form: ['L','L','D','L','W'], xgFor: 1.30, xgAgainst: 1.60 },
  'eibar fem': { name: 'SD Eibar Femenino', rating: 78, domestic: 'liga_f', form: ['W','L','D','L','D'], xgFor: 1.35, xgAgainst: 1.55 },
  'granada cf fem': { name: 'Granada CF Femenino', rating: 77, domestic: 'liga_f', form: ['L','L','W','L','D'], xgFor: 1.25, xgAgainst: 1.70 },
  'deportivo abanca': { name: 'Deportivo Abanca', rating: 76, domestic: 'liga_f', form: ['L','W','L','L','D'], xgFor: 1.20, xgAgainst: 1.75 },

  // France: Première Ligue
  'lyon feminin': { name: 'Olympique Lyonnais Féminin', rating: 92, domestic: 'premiere_ligue', form: ['W','W','W','W','W'], xgFor: 3.20, xgAgainst: 0.55 },
  'paris saint-germain fem': { name: 'Paris Saint-Germain Féminin', rating: 89, domestic: 'premiere_ligue', form: ['W','W','W','D','W'], xgFor: 2.65, xgAgainst: 0.75 },
  'paris fc feminin': { name: 'Paris FC Féminin', rating: 85, domestic: 'premiere_ligue', form: ['W','W','D','W','L'], xgFor: 2.25, xgAgainst: 1.00 },
  'montpellier hsc fem': { name: 'Montpellier HSC Féminin', rating: 81, domestic: 'premiere_ligue', form: ['D','W','L','W','D'], xgFor: 1.75, xgAgainst: 1.30 },
  'fleury 91': { name: 'FC Fleury 91 Féminin', rating: 81, domestic: 'premiere_ligue', form: ['W','L','W','D','W'], xgFor: 1.80, xgAgainst: 1.25 },
  'dijon fco fem': { name: 'Dijon FCO Féminin', rating: 79, domestic: 'premiere_ligue', form: ['L','W','D','L','W'], xgFor: 1.50, xgAgainst: 1.50 },
  'stade de reims fem': { name: 'Stade de Reims Féminin', rating: 79, domestic: 'premiere_ligue', form: ['L','L','W','W','D'], xgFor: 1.45, xgAgainst: 1.55 },
  'strasbourg fem': { name: 'RC Strasbourg Féminin', rating: 77, domestic: 'premiere_ligue', form: ['W','L','D','L','L'], xgFor: 1.30, xgAgainst: 1.70 },
  'guingamp fem': { name: 'En Avant Guingamp Féminin', rating: 76, domestic: 'premiere_ligue', form: ['L','L','L','D','L'], xgFor: 1.10, xgAgainst: 1.90 },

  // Italy: Serie A Femminile
  'juventus women': { name: 'Juventus Women', rating: 87, domestic: 'serie_a_fem', form: ['W','W','W','W','D'], xgFor: 2.50, xgAgainst: 0.85 },
  'roma women': { name: 'AS Roma Women', rating: 87, domestic: 'serie_a_fem', form: ['W','W','W','D','W'], xgFor: 2.45, xgAgainst: 0.90 },
  'fiorentina women': { name: 'ACF Fiorentina Femminile', rating: 83, domestic: 'serie_a_fem', form: ['W','D','W','L','W'], xgFor: 1.95, xgAgainst: 1.20 },
  'inter milan women': { name: 'Inter Milan Women', rating: 83, domestic: 'serie_a_fem', form: ['W','W','L','D','W'], xgFor: 2.00, xgAgainst: 1.15 },
  'milan women': { name: 'AC Milan Women', rating: 81, domestic: 'serie_a_fem', form: ['D','L','W','W','L'], xgFor: 1.65, xgAgainst: 1.35 },
  'sassuolo women': { name: 'Sassuolo Femminile', rating: 80, domestic: 'serie_a_fem', form: ['L','W','D','L','W'], xgFor: 1.55, xgAgainst: 1.45 },
  'como women': { name: 'FC Como Women', rating: 78, domestic: 'serie_a_fem', form: ['D','L','L','W','D'], xgFor: 1.35, xgAgainst: 1.60 },
  'lazio women': { name: 'SS Lazio Women', rating: 78, domestic: 'serie_a_fem', form: ['W','L','D','L','D'], xgFor: 1.40, xgAgainst: 1.55 },
  'sampdoria women': { name: 'UC Sampdoria Women', rating: 77, domestic: 'serie_a_fem', form: ['L','D','L','L','W'], xgFor: 1.20, xgAgainst: 1.70 },
  'napoli women': { name: 'Napoli Femminile', rating: 76, domestic: 'serie_a_fem', form: ['L','L','D','L','L'], xgFor: 1.10, xgAgainst: 1.85 },

  // Sweden: Damallsvenskan
  'fc rosengard': { name: 'FC Rosengård', rating: 85, domestic: 'damallsvenskan', form: ['W','W','W','W','W'], xgFor: 2.65, xgAgainst: 0.80 },
  'bk hacken women': { name: 'BK Häcken Women', rating: 84, domestic: 'damallsvenskan', form: ['W','W','D','W','W'], xgFor: 2.35, xgAgainst: 0.90 },
  'hammarby if': { name: 'Hammarby IF', rating: 83, domestic: 'damallsvenskan', form: ['W','D','W','W','L'], xgFor: 2.15, xgAgainst: 1.05 },
  'linkoping fc': { name: 'Linköping FC', rating: 81, domestic: 'damallsvenskan', form: ['D','W','L','W','D'], xgFor: 1.75, xgAgainst: 1.30 },
  'pitea if': { name: 'Piteå IF', rating: 80, domestic: 'damallsvenskan', form: ['W','L','D','D','W'], xgFor: 1.60, xgAgainst: 1.35 },
  'vittsjo gik': { name: 'Vittsjö GIK', rating: 79, domestic: 'damallsvenskan', form: ['L','W','D','L','W'], xgFor: 1.45, xgAgainst: 1.40 },

  // Mexico: Liga MX Femenil
  'tigres uanl fem': { name: 'Tigres UANL Femenil', rating: 85, domestic: 'ligamx_fem', form: ['W','W','W','W','D'], xgFor: 2.55, xgAgainst: 0.75 },
  'monterrey fem': { name: 'CF Monterrey Rayadas', rating: 84, domestic: 'ligamx_fem', form: ['W','W','D','W','W'], xgFor: 2.40, xgAgainst: 0.85 },
  'club america fem': { name: 'Club América Femenil', rating: 84, domestic: 'ligamx_fem', form: ['W','W','W','L','W'], xgFor: 2.50, xgAgainst: 0.95 },
  'chivas guadalajara fem': { name: 'Guadalajara Chivas Femenil', rating: 82, domestic: 'ligamx_fem', form: ['W','D','L','W','W'], xgFor: 2.05, xgAgainst: 1.15 },
  'pachuca fem': { name: 'CF Pachuca Femenil', rating: 83, domestic: 'ligamx_fem', form: ['W','W','W','W','D'], xgFor: 2.30, xgAgainst: 1.00 },

  // Brazil: Brasileirao Feminino
  'corinthians fem': { name: 'SC Corinthians Femenino', rating: 86, domestic: 'brasileirao_fem', form: ['W','W','W','W','W'], xgFor: 2.60, xgAgainst: 0.70 },
  'ferroviaria fem': { name: 'Ferroviária Femenino', rating: 83, domestic: 'brasileirao_fem', form: ['W','W','D','W','D'], xgFor: 2.10, xgAgainst: 0.95 },
  'sao paulo fem': { name: 'São Paulo FC Femenino', rating: 83, domestic: 'brasileirao_fem', form: ['W','D','W','L','W'], xgFor: 2.00, xgAgainst: 1.05 },
  'palmeiras fem': { name: 'SE Palmeiras Femenino', rating: 83, domestic: 'brasileirao_fem', form: ['W','W','L','W','D'], xgFor: 2.15, xgAgainst: 1.10 },
  'internacional fem': { name: 'SC Internacional Femenino', rating: 81, domestic: 'brasileirao_fem', form: ['D','W','L','W','D'], xgFor: 1.70, xgAgainst: 1.25 },

  // Netherlands: Vrouwen Eredivisie
  'fc twente vrouwen': { name: 'FC Twente Vrouwen', rating: 83, domestic: 'vrouwen_eredivisie', form: ['W','W','W','D','W'], xgFor: 2.50, xgAgainst: 0.90 },
  'ajax vrouwen': { name: 'AFC Ajax Vrouwen', rating: 84, domestic: 'vrouwen_eredivisie', form: ['W','W','D','W','W'], xgFor: 2.60, xgAgainst: 0.85 },
  'psv vrouwen': { name: 'PSV Eindhoven Vrouwen', rating: 82, domestic: 'vrouwen_eredivisie', form: ['W','D','W','L','W'], xgFor: 2.20, xgAgainst: 1.10 },
  'fortuna sittard vrouwen': { name: 'Fortuna Sittard Vrouwen', rating: 79, domestic: 'vrouwen_eredivisie', form: ['L','W','D','W','L'], xgFor: 1.65, xgAgainst: 1.45 },
  'feyenoord vrouwen': { name: 'Feyenoord Vrouwen', rating: 79, domestic: 'vrouwen_eredivisie', form: ['W','L','D','L','W'], xgFor: 1.55, xgAgainst: 1.40 },

  // Australia: A-League Women
  'melbourne city w': { name: 'Melbourne City FC Women', rating: 81, domestic: 'aleague_w', form: ['W','W','D','W','W'], xgFor: 2.20, xgAgainst: 0.95 },
  'sydney fc w': { name: 'Sydney FC Women', rating: 81, domestic: 'aleague_w', form: ['W','D','W','L','W'], xgFor: 2.10, xgAgainst: 1.05 },
  'central coast mariners w': { name: 'Central Coast Mariners Women', rating: 79, domestic: 'aleague_w', form: ['D','W','L','W','D'], xgFor: 1.75, xgAgainst: 1.30 },
  'western united w': { name: 'Western United Women', rating: 78, domestic: 'aleague_w', form: ['L','W','W','D','L'], xgFor: 1.65, xgAgainst: 1.45 },

  // USA: USL Super League
  'carolina ascent fc': { name: 'Carolina Ascent FC', rating: 78, domestic: 'usl_super_league', form: ['W','W','D','W','D'], xgFor: 1.85, xgAgainst: 1.05 },
  'tampa bay sun fc': { name: 'Tampa Bay Sun FC', rating: 78, domestic: 'usl_super_league', form: ['W','D','W','L','W'], xgFor: 1.80, xgAgainst: 1.15 },
  'dallas trinity fc': { name: 'Dallas Trinity FC', rating: 77, domestic: 'usl_super_league', form: ['D','W','L','W','D'], xgFor: 1.65, xgAgainst: 1.25 },
  'fort lauderdale united fc': { name: 'Fort Lauderdale United FC', rating: 76, domestic: 'usl_super_league', form: ['L','W','D','L','W'], xgFor: 1.50, xgAgainst: 1.35 },
  'spokane zephyr fc': { name: 'Spokane Zephyr FC', rating: 76, domestic: 'usl_super_league', form: ['D','L','W','D','L'], xgFor: 1.40, xgAgainst: 1.40 },
  'brooklyn fc': { name: 'Brooklyn FC Women', rating: 77, domestic: 'usl_super_league', form: ['W','D','L','W','L'], xgFor: 1.60, xgAgainst: 1.30 },
  'dc power fc': { name: 'DC Power FC', rating: 75, domestic: 'usl_super_league', form: ['L','L','D','W','L'], xgFor: 1.25, xgAgainst: 1.60 },
  'lexington sc': { name: 'Lexington SC Women', rating: 75, domestic: 'usl_super_league', form: ['L','D','L','L','W'], xgFor: 1.30, xgAgainst: 1.65 },

  // Canada: Northern Super League
  'afc toronto': { name: 'AFC Toronto', rating: 77, domestic: 'northern_super_league', form: ['W','D','W','L','W'], xgFor: 1.70, xgAgainst: 1.15 },
  'vancouver rise fc': { name: 'Vancouver Rise FC', rating: 77, domestic: 'northern_super_league', form: ['W','W','L','D','W'], xgFor: 1.75, xgAgainst: 1.20 },
  'calgary wild fc': { name: 'Calgary Wild FC', rating: 76, domestic: 'northern_super_league', form: ['D','W','D','L','W'], xgFor: 1.55, xgAgainst: 1.25 },
  'halifax tides fc': { name: 'Halifax Tides FC', rating: 75, domestic: 'northern_super_league', form: ['L','W','L','W','D'], xgFor: 1.40, xgAgainst: 1.45 },
  'ottawa rapid fc': { name: 'Ottawa Rapid FC', rating: 75, domestic: 'northern_super_league', form: ['D','L','W','L','D'], xgFor: 1.35, xgAgainst: 1.40 },
  'roses de montreal': { name: 'Roses de Montréal', rating: 76, domestic: 'northern_super_league', form: ['W','L','D','W','L'], xgFor: 1.50, xgAgainst: 1.35 },

  // Women's Championship England Tier 2
  'london city lionesses': { name: 'London City Lionesses', rating: 80, domestic: 'womens_championship', form: ['W','W','W','D','W'], xgFor: 2.15, xgAgainst: 0.90 },
  'birmingham city women': { name: 'Birmingham City Women', rating: 79, domestic: 'womens_championship', form: ['W','W','D','L','W'], xgFor: 1.95, xgAgainst: 1.10 },
  'charlton athletic women': { name: 'Charlton Athletic Women', rating: 78, domestic: 'womens_championship', form: ['W','D','W','W','L'], xgFor: 1.80, xgAgainst: 1.15 },
  'durham cwefc': { name: 'Durham Women FC', rating: 77, domestic: 'womens_championship', form: ['L','W','D','W','D'], xgFor: 1.55, xgAgainst: 1.30 },
  'sheffield united women': { name: 'Sheffield United Women', rating: 76, domestic: 'womens_championship', form: ['L','D','L','W','L'], xgFor: 1.30, xgAgainst: 1.55 },
  'newcastle united women': { name: 'Newcastle United Women', rating: 78, domestic: 'womens_championship', form: ['W','W','L','D','W'], xgFor: 1.90, xgAgainst: 1.20 },
  'hb koge women': { name: 'HB Køge Women', rating: 76, domestic: 'uwcl', form: ['W','L','W','D','L'], xgFor: 1.30, xgAgainst: 1.60 },
  'benfica women': { name: 'Benfica Women', rating: 82, domestic: 'uwcl', form: ['W','W','W','D','L'], xgFor: 1.85, xgAgainst: 1.15 },
  'oh leuven women': { name: 'OH Leuven Women', rating: 77, domestic: 'uwcl', form: ['W','D','L','W','D'], xgFor: 1.40, xgAgainst: 1.50 },
  'servette chenois feminin': { name: 'Servette Chênois Féminin', rating: 77, domestic: 'uwcl', form: ['W','W','D','L','W'], xgFor: 1.45, xgAgainst: 1.45 },
  'austria wien women': { name: 'Austria Wien Women', rating: 76, domestic: 'uwcl', form: ['W','L','W','D','L'], xgFor: 1.30, xgAgainst: 1.65 },
  'watford women': { name: 'Watford Women', rating: 74, domestic: 'womens_championship', form: ['L','D','L','W','L'], xgFor: 1.15, xgAgainst: 1.70 },
  'sunderland women': { name: 'Sunderland Women', rating: 75, domestic: 'womens_championship', form: ['D','W','L','W','D'], xgFor: 1.30, xgAgainst: 1.50 },
  'nottingham forest women': { name: 'Nottingham Forest Women', rating: 74, domestic: 'womens_championship', form: ['W','L','W','L','D'], xgFor: 1.25, xgAgainst: 1.60 },
  'dc power fc': { name: 'DC Power FC', rating: 76, domestic: 'usl_super_league', form: ['W','D','L','W','D'], xgFor: 1.40, xgAgainst: 1.30 },
  'fort lauderdale united fc': { name: 'Fort Lauderdale United FC', rating: 76, domestic: 'usl_super_league', form: ['D','W','W','L','D'], xgFor: 1.45, xgAgainst: 1.35 },
  'vfl wolfsburg frauen': { name: 'VfL Wolfsburg Frauen', rating: 85, domestic: 'frauen_bundesliga', form: ['W','W','W','D','W'], xgFor: 2.45, xgAgainst: 0.85 },
  'acf fiorentina femminile': { name: 'ACF Fiorentina Femminile', rating: 78, domestic: 'serie_a_fem', form: ['W','D','W','L','W'], xgFor: 1.70, xgAgainst: 1.25 },
  'galatasaray petrol ofisi kadin': { name: 'Galatasaray Petrol Ofisi Kadın', rating: 77, domestic: 'uwcl', form: ['W','W','D','W','L'], xgFor: 1.85, xgAgainst: 1.20 },
  'sk slavia praha zeny': { name: 'SK Slavia Praha Ženy', rating: 77, domestic: 'uwcl', form: ['W','W','W','D','L'], xgFor: 1.80, xgAgainst: 1.15 }
};

export const WOMENS_AND_CUPS_CALENDAR_FIXTURES = [
  // South Africa: Hollywoodbets Super League
  { leagueId: 'hollywoodbets_super_league', h: 'Mamelodi Sundowns Ladies', a: 'City Lads', date: '2026-09-20', hh: 15, mm: 0, big: true, finished: true, homeScore: 3, awayScore: 0 },
  { leagueId: 'hollywoodbets_super_league', h: 'University of the Western Cape', a: 'Richmond United Ladies', date: '2026-09-20', hh: 15, mm: 0, big: false, finished: true, homeScore: 2, awayScore: 0 },
  { leagueId: 'hollywoodbets_super_league', h: 'JVW FC', a: 'TS Galaxy Queens', date: '2026-09-21', hh: 15, mm: 0, big: true, finished: true, homeScore: 2, awayScore: 1 },
  { leagueId: 'hollywoodbets_super_league', h: 'University of Johannesburg', a: 'Copperbelt Ladies', date: '2026-09-26', hh: 15, mm: 0, big: false, finished: false },
  { leagueId: 'hollywoodbets_super_league', h: 'TUT Football Club', a: 'Royal AM Ladies', date: '2026-09-26', hh: 15, mm: 0, big: false, finished: false },
  { leagueId: 'hollywoodbets_super_league', h: 'Mamelodi Sundowns Ladies', a: 'JVW FC', date: '2026-09-27', hh: 15, mm: 0, big: true, finished: false },
  { leagueId: 'hollywoodbets_super_league', h: 'City Lads', a: 'First Touch Academy', date: '2026-09-27', hh: 15, mm: 0, big: false, finished: false },

  // USA: NWSL
  { leagueId: 'nwsl', h: 'Washington Spirit', a: 'Orlando Pride', date: '2026-09-20', hh: 2, mm: 0, big: true, finished: true, homeScore: 1, awayScore: 1 },
  { leagueId: 'nwsl', h: 'Kansas City Current', a: 'NJ/NY Gotham FC', date: '2026-09-21', hh: 1, mm: 30, big: true, finished: true, homeScore: 2, awayScore: 0 },
  { leagueId: 'nwsl', h: 'Portland Thorns', a: 'San Diego Wave FC', date: '2026-09-26', hh: 4, mm: 0, big: true, finished: false },
  { leagueId: 'nwsl', h: 'North Carolina Courage', a: 'Bay FC', date: '2026-09-27', hh: 1, mm: 0, big: false, finished: false },
  { leagueId: 'nwsl', h: 'Orlando Pride', a: 'Chicago Red Stars', date: '2026-09-27', hh: 23, mm: 30, big: true, finished: false },

  // England: WSL
  { leagueId: 'wsl', h: 'Arsenal Women', a: 'Manchester City Women', date: '2026-09-20', hh: 13, mm: 30, big: true, finished: true, homeScore: 2, awayScore: 2 },
  { leagueId: 'wsl', h: 'Chelsea Women', a: 'Aston Villa Women', date: '2026-09-20', hh: 15, mm: 0, big: true, finished: true, homeScore: 1, awayScore: 0 },
  { leagueId: 'wsl', h: 'Manchester United Women', a: 'West Ham United Women', date: '2026-09-21', hh: 13, mm: 0, big: false, finished: true, homeScore: 3, awayScore: 0 },
  { leagueId: 'wsl', h: 'Manchester City Women', a: 'Brighton & Hove Albion Women', date: '2026-09-26', hh: 13, mm: 30, big: true, finished: false },
  { leagueId: 'wsl', h: 'Chelsea Women', a: 'Tottenham Hotspur Women', date: '2026-09-27', hh: 15, mm: 0, big: true, finished: false },
  { leagueId: 'wsl', h: 'Arsenal Women', a: 'Liverpool Women', date: '2026-09-27', hh: 16, mm: 0, big: false, finished: false },

  // Germany: Google Pixel Frauen-Bundesliga
  { leagueId: 'frauen_bundesliga', h: 'Bayern Munich Frauen', a: 'TSG Hoffenheim Frauen', date: '2026-09-20', hh: 14, mm: 0, big: true, finished: true, homeScore: 3, awayScore: 0 },
  { leagueId: 'frauen_bundesliga', h: 'VfL Wolfsburg Frauen', a: '1. FC Köln Frauen', date: '2026-09-21', hh: 18, mm: 0, big: false, finished: true, homeScore: 5, awayScore: 1 },
  { leagueId: 'frauen_bundesliga', h: 'Eintracht Frankfurt Frauen', a: 'SC Freiburg Frauen', date: '2026-09-26', hh: 14, mm: 0, big: true, finished: false },
  { leagueId: 'frauen_bundesliga', h: 'Bayern Munich Frauen', a: 'VfL Wolfsburg Frauen', date: '2026-09-27', hh: 17, mm: 0, big: true, finished: false },

  // Spain: Liga F
  { leagueId: 'liga_f', h: 'FC Barcelona Femení', a: 'Sevilla FC Femenino', date: '2026-09-20', hh: 18, mm: 0, big: true, finished: true, homeScore: 4, awayScore: 0 },
  { leagueId: 'liga_f', h: 'Real Madrid Femenino', a: 'Athletic Club Femenino', date: '2026-09-21', hh: 19, mm: 0, big: true, finished: true, homeScore: 2, awayScore: 0 },
  { leagueId: 'liga_f', h: 'Atlético Madrid Femenino', a: 'Madrid CFF', date: '2026-09-26', hh: 16, mm: 0, big: true, finished: false },
  { leagueId: 'liga_f', h: 'FC Barcelona Femení', a: 'Real Sociedad Femenino', date: '2026-09-27', hh: 18, mm: 30, big: true, finished: false },

  // France: Première Ligue
  { leagueId: 'premiere_ligue', h: 'Olympique Lyonnais Féminin', a: 'FC Fleury 91 Féminin', date: '2026-09-20', hh: 15, mm: 0, big: true, finished: true, homeScore: 4, awayScore: 1 },
  { leagueId: 'premiere_ligue', h: 'Paris Saint-Germain Féminin', a: 'Montpellier HSC Féminin', date: '2026-09-21', hh: 21, mm: 0, big: true, finished: true, homeScore: 3, awayScore: 1 },
  { leagueId: 'premiere_ligue', h: 'Paris FC Féminin', a: 'Stade de Reims Féminin', date: '2026-09-26', hh: 17, mm: 0, big: false, finished: false },
  { leagueId: 'premiere_ligue', h: 'Olympique Lyonnais Féminin', a: 'Paris Saint-Germain Féminin', date: '2026-09-27', hh: 21, mm: 0, big: true, finished: false },

  // Italy: Serie A Femminile
  { leagueId: 'serie_a_fem', h: 'AS Roma Women', a: 'Sassuolo Femminile', date: '2026-09-20', hh: 15, mm: 0, big: true, finished: true, homeScore: 3, awayScore: 1 },
  { leagueId: 'serie_a_fem', h: 'Juventus Women', a: 'ACF Fiorentina Femminile', date: '2026-09-21', hh: 18, mm: 0, big: true, finished: true, homeScore: 2, awayScore: 0 },
  { leagueId: 'serie_a_fem', h: 'Inter Milan Women', a: 'AC Milan Women', date: '2026-09-26', hh: 14, mm: 30, big: true, finished: false },
  { leagueId: 'serie_a_fem', h: 'Juventus Women', a: 'AS Roma Women', date: '2026-09-27', hh: 15, mm: 0, big: true, finished: false },

  // Sweden: Damallsvenskan
  { leagueId: 'damallsvenskan', h: 'FC Rosengård', a: 'Linköping FC', date: '2026-09-20', hh: 15, mm: 0, big: true, finished: true, homeScore: 4, awayScore: 0 },
  { leagueId: 'damallsvenskan', h: 'BK Häcken Women', a: 'Hammarby IF', date: '2026-09-26', hh: 15, mm: 0, big: true, finished: false },

  // Mexico: Liga MX Femenil
  { leagueId: 'ligamx_fem', h: 'Tigres UANL Femenil', a: 'CF Monterrey Rayadas', date: '2026-09-21', hh: 3, mm: 0, big: true, finished: true, homeScore: 1, awayScore: 1 },
  { leagueId: 'ligamx_fem', h: 'Club América Femenil', a: 'CF Pachuca Femenil', date: '2026-09-27', hh: 1, mm: 0, big: true, finished: false },

  // Brazil: Brasileirao Feminino
  { leagueId: 'brasileirao_fem', h: 'SC Corinthians Femenino', a: 'SE Palmeiras Femenino', date: '2026-09-20', hh: 21, mm: 0, big: true, finished: true, homeScore: 2, awayScore: 1 },
  { leagueId: 'brasileirao_fem', h: 'São Paulo FC Femenino', a: 'Ferroviária Femenino', date: '2026-09-27', hh: 19, mm: 0, big: true, finished: false },

  // Netherlands: Vrouwen Eredivisie
  { leagueId: 'vrouwen_eredivisie', h: 'AFC Ajax Vrouwen', a: 'Feyenoord Vrouwen', date: '2026-09-21', hh: 14, mm: 30, big: true, finished: true, homeScore: 3, awayScore: 1 },
  { leagueId: 'vrouwen_eredivisie', h: 'FC Twente Vrouwen', a: 'PSV Eindhoven Vrouwen', date: '2026-09-27', hh: 14, mm: 30, big: true, finished: false },

  // USL Super League
  { leagueId: 'usl_super_league', h: 'Carolina Ascent FC', a: 'Tampa Bay Sun FC', date: '2026-09-20', hh: 1, mm: 0, big: true, finished: true, homeScore: 1, awayScore: 0 },
  { leagueId: 'usl_super_league', h: 'Dallas Trinity FC', a: 'Brooklyn FC Women', date: '2026-09-26', hh: 2, mm: 0, big: false, finished: false },

  // Northern Super League
  { leagueId: 'northern_super_league', h: 'AFC Toronto', a: 'Vancouver Rise FC', date: '2026-09-20', hh: 20, mm: 0, big: true, finished: true, homeScore: 2, awayScore: 1 },
  { leagueId: 'northern_super_league', h: 'Calgary Wild FC', a: 'Roses de Montréal', date: '2026-09-26', hh: 21, mm: 0, big: false, finished: false },

  // England Tier 2: Women’s Championship
  { leagueId: 'womens_championship', h: 'London City Lionesses', a: 'Birmingham City Women', date: '2026-09-20', hh: 15, mm: 0, big: true, finished: true, homeScore: 1, awayScore: 0 },
  { leagueId: 'womens_championship', h: 'Newcastle United Women', a: 'Charlton Athletic Women', date: '2026-09-27', hh: 15, mm: 0, big: false, finished: false },

  // USL Super League (USA)
  { leagueId: 'usl_super_league', h: 'DC Power FC', a: 'Fort Lauderdale United FC', date: '2026-09-22', hh: 17, mm: 0, big: false, finished: false },

  // UEFA Women's Champions League (UWCL Qualifiers & Group Stage)
  // Tuesday 22 September 2026
  { leagueId: 'uwcl', h: 'Bayern Munich Frauen', a: 'Manchester City Women', date: '2026-09-22', hh: 18, mm: 45, big: true, finished: false },
  { leagueId: 'uwcl', h: 'Inter Milan Women', a: 'BK Häcken Women', date: '2026-09-22', hh: 18, mm: 45, big: true, finished: false },
  { leagueId: 'uwcl', h: 'Arsenal Women', a: 'HB Køge Women', date: '2026-09-22', hh: 21, mm: 0, big: true, finished: false },
  { leagueId: 'uwcl', h: 'Juventus Women', a: 'Benfica Women', date: '2026-09-22', hh: 21, mm: 0, big: true, finished: false },
  { leagueId: 'uwcl', h: 'Real Madrid Femenino', a: 'Paris Saint-Germain Féminin', date: '2026-09-22', hh: 21, mm: 0, big: true, finished: false },

  // Wednesday 23 September 2026
  { leagueId: 'uwcl', h: 'OH Leuven Women', a: 'AS Roma Women', date: '2026-09-23', hh: 18, mm: 45, big: false, finished: false },
  { leagueId: 'uwcl', h: 'Servette Chênois Féminin', a: 'Olympique Lyonnais Féminin', date: '2026-09-23', hh: 18, mm: 45, big: true, finished: false },
  { leagueId: 'uwcl', h: 'FC Barcelona Femení', a: 'Paris FC Féminin', date: '2026-09-23', hh: 21, mm: 0, big: true, finished: false },
  { leagueId: 'uwcl', h: 'Chelsea Women', a: 'Austria Wien Women', date: '2026-09-23', hh: 21, mm: 0, big: true, finished: false },

  // Thursday 24 September 2026
  { leagueId: 'uwcl', h: 'VfL Wolfsburg Frauen', a: 'ACF Fiorentina Femminile', date: '2026-09-24', hh: 18, mm: 45, big: true, finished: false },
  { leagueId: 'uwcl', h: 'Galatasaray Petrol Ofisi Kadın', a: 'SK Slavia Praha Ženy', date: '2026-09-24', hh: 20, mm: 0, big: false, finished: false },

  // English Subway Women's League Cup (Wednesday 23 September 2026)
  { leagueId: 'womens_league_cup', h: 'Tottenham Hotspur Women', a: 'West Ham United Women', date: '2026-09-23', hh: 20, mm: 0, big: true, finished: false },
  { leagueId: 'womens_league_cup', h: 'Crystal Palace Women', a: 'Watford Women', date: '2026-09-23', hh: 20, mm: 0, big: false, finished: false },
  { leagueId: 'womens_league_cup', h: 'Nottingham Forest Women', a: 'Aston Villa Women', date: '2026-09-23', hh: 20, mm: 0, big: false, finished: false },
  { leagueId: 'womens_league_cup', h: 'Manchester United Women', a: 'Sheffield United Women', date: '2026-09-23', hh: 20, mm: 0, big: true, finished: false },
  { leagueId: 'womens_league_cup', h: 'Liverpool Women', a: 'Sunderland Women', date: '2026-09-23', hh: 20, mm: 0, big: true, finished: false },
  { leagueId: 'womens_league_cup', h: 'Everton Women', a: 'Birmingham City Women', date: '2026-09-23', hh: 20, mm: 0, big: false, finished: false },
  { leagueId: 'womens_league_cup', h: 'Leicester City Women', a: 'London City Lionesses', date: '2026-09-23', hh: 20, mm: 30, big: false, finished: false },
  { leagueId: 'womens_league_cup', h: 'Brighton & Hove Albion Women', a: 'Charlton Athletic Women', date: '2026-09-23', hh: 20, mm: 45, big: false, finished: false }
];
