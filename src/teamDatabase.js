/* ============================================================
   NDLELA MILLIONAIRES - TEAM INTELLIGENCE & OFFICIAL ASSETS REGISTRY
   Provides authoritative full club names, official crest logos,
   and dynamic SVG heraldic crest fallbacks for all 54 competitions.
   ============================================================ */

export const OFFICIAL_TEAM_NAMES = {
  // Spanish LALIGA & LALIGA 2 (Exact official registration matching attachment)
  'Rayo Vallecano': 'Rayo Vallecano de Madrid',
  'Espanyol': 'RCD Espanyol de Barcelona',
  'Alavés': 'Deportivo Alavés',
  'Valencia': 'Valencia CF',
  'Elche': 'Elche CF',
  'Real Madrid': 'Real Madrid CF',
  'Barcelona': 'FC Barcelona',
  'Atlético Madrid': 'Club Atlético de Madrid',
  'Athletic Club': 'Athletic Club Bilbao',
  'Real Sociedad': 'Real Sociedad de Fútbol',
  'Real Betis': 'Real Betis Balompié',
  'Sevilla': 'Sevilla FC',
  'Villarreal': 'Villarreal CF',
  'Celta Vigo': 'RC Celta de Vigo',
  'Osasuna': 'CA Osasuna',
  'Mallorca': 'RCD Mallorca',
  'Getafe': 'Getafe CF',
  'Girona': 'Girona FC',
  'Las Palmas': 'UD Las Palmas',
  'Leganés': 'CD Leganés',
  'Valladolid': 'Real Valladolid CF',
  'Levante': 'Levante UD',
  'Eibar': 'SD Eibar',
  'Sporting Gijon': 'Real Sporting de Gijón',
  'Real Zaragoza': 'Real Zaragoza',
  'Almería': 'UD Almería',
  'Granada': 'Granada CF',
  'Cadiz': 'Cádiz CF',
  'Racing Santander': 'Real Racing Club de Santander',
  'Tenerife': 'CD Tenerife',
  'Oviedo': 'Real Oviedo',

  // English Premier League, Championship, League One, League Two
  'Arsenal': 'Arsenal FC',
  'Chelsea': 'Chelsea FC',
  'Liverpool': 'Liverpool FC',
  'Manchester City': 'Manchester City FC',
  'Manchester United': 'Manchester United FC',
  'Tottenham': 'Tottenham Hotspur FC',
  'Tottenham Hotspur': 'Tottenham Hotspur FC',
  'Aston Villa': 'Aston Villa FC',
  'Newcastle United': 'Newcastle United FC',
  'Brighton': 'Brighton & Hove Albion FC',
  'West Ham United': 'West Ham United FC',
  'Everton': 'Everton FC',
  'Fulham': 'Fulham FC',
  'Brentford': 'Brentford FC',
  'Crystal Palace': 'Crystal Palace FC',
  'Wolverhampton Wanderers': 'Wolverhampton Wanderers FC',
  'Bournemouth': 'AFC Bournemouth',
  'Leicester City': 'Leicester City FC',
  'Southampton': 'Southampton FC',
  'Ipswich Town': 'Ipswich Town FC',
  'Leeds United': 'Leeds United FC',
  'Sunderland': 'Sunderland AFC',
  'Sheffield United': 'Sheffield United FC',
  'Burnley': 'Burnley FC',
  'Watford': 'Watford FC',
  'Norwich City': 'Norwich City FC',
  'Birmingham City': 'Birmingham City FC',
  'Wrexham': 'Wrexham AFC',

  // Betway Premiership (South Africa)
  'Mamelodi Sundowns': 'Mamelodi Sundowns FC',
  'Orlando Pirates': 'Orlando Pirates FC',
  'Kaizer Chiefs': 'Kaizer Chiefs FC',
  'AmaZulu': 'AmaZulu FC',
  'Stellenbosch': 'Stellenbosch FC',
  'Sekhukhune United FC': 'Sekhukhune United FC',
  'Golden Arrows': 'Lamontville Golden Arrows FC',
  'Polokwane City FC': 'Polokwane City FC',
  'Cape Town City': 'Cape Town City FC',
  'SuperSport United': 'SuperSport United FC',
  'TS Galaxy FC': 'TS Galaxy FC',
  'Richards Bay FC': 'Richards Bay FC',
  'Chippa United': 'Chippa United FC',
  'Marumo Gallants': 'Marumo Gallants FC',
  'Durban City': 'Durban City FC',
  'Milford FC': 'Milford FC',
  'Kruger United': 'Kruger United FC',

  // Italian Serie A & Serie B
  'Inter': 'FC Internazionale Milano',
  'Internazionale': 'FC Internazionale Milano',
  'Milan': 'AC Milan',
  'Juventus': 'Juventus FC',
  'Napoli': 'SSC Napoli',
  'Roma': 'AS Roma',
  'Lazio': 'SS Lazio',
  'Atalanta': 'Atalanta BC',
  'Fiorentina': 'ACF Fiorentina',
  'Bologna': 'Bologna FC 1909',
  'Torino': 'Torino FC',
  'Como': 'Como 1907',
  'Parma': 'Parma Calcio 1913',
  'Udinese': 'Udinese Calcio',
  'Monza': 'AC Monza',
  'Genoa': 'Genoa CFC',
  'Cagliari': 'Cagliari Calcio',
  'Empoli': 'Empoli FC',
  'Verona': 'Hellas Verona FC',
  'Lecce': 'US Lecce',
  'Venezia': 'Venezia FC',
  'Palermo': 'Palermo FC',
  'Sampdoria': 'UC Sampdoria',
  'Sassuolo': 'US Sassuolo Calcio',
  'Brescia': 'Brescia Calcio',

  // German Bundesliga & 2. Bundesliga
  'Bayern Munich': 'FC Bayern München',
  'Bayern Munchen': 'FC Bayern München',
  'Borussia Dortmund': 'Borussia Dortmund',
  'Bayer Leverkusen': 'Bayer 04 Leverkusen',
  'RB Leipzig': 'RB Leipzig',
  'Eintracht Frankfurt': 'Eintracht Frankfurt',
  'VfB Stuttgart': 'VfB Stuttgart',
  'Wolfsburg': 'VfL Wolfsburg',
  'Borussia Monchengladbach': 'Borussia Mönchengladbach',
  'Werder Bremen': 'SV Werder Bremen',
  'Freiburg': 'SC Freiburg',
  'Union Berlin': '1. FC Union Berlin',
  'Mainz 05': '1. FSV Mainz 05',
  'Hoffenheim': 'TSG 1899 Hoffenheim',
  'Augsburg': 'FC Augsburg',
  'Heidenheim': '1. FC Heidenheim',
  'St. Pauli': 'FC St. Pauli',
  'Holstein Kiel': 'Holstein Kiel',
  'Bochum': 'VfL Bochum',
  'Hamburger SV': 'Hamburger SV',
  'FC Koln': '1. FC Köln',
  'Hertha BSC': 'Hertha BSC',
  'Schalke 04': 'FC Schalke 04',
  'Fortuna Dusseldorf': 'Fortuna Düsseldorf',
  'Hannover 96': 'Hannover 96',

  // French Ligue 1 & Ligue 2
  'PSG': 'Paris Saint-Germain FC',
  'Paris Saint Germain': 'Paris Saint-Germain FC',
  'Marseille': 'Olympique de Marseille',
  'Monaco': 'AS Monaco FC',
  'Lyon': 'Olympique Lyonnais',
  'Lille': 'LOSC Lille',
  'Rennes': 'Stade Rennais FC',
  'Lens': 'RC Lens',
  'Nice': 'OGC Nice',
  'Toulouse': 'Toulouse FC',
  'Strasbourg': 'RC Strasbourg Alsace',
  'Reims': 'Stade de Reims',
  'Nantes': 'FC Nantes',
  'Brest': 'Stade Brestois 29',
  'Saint-Etienne': 'AS Saint-Étienne',
  'Auxerre': 'AJ Auxerre',
  'Angers': 'Angers SCO',
  'Metz': 'FC Metz',
  'Lorient': 'FC Lorient',

  // UEFA European Competitions & Other Continental Powerhouses
  'Dynamo Kyiv': 'FC Dynamo Kyiv',
  'Shakhtar Donetsk': 'FC Shakhtar Donetsk',
  'Lech Poznań': 'KKS Lech Poznań',
  'Legia Warsaw': 'Legia Warszawa',
  'Jagiellonia Białystok': 'Jagiellonia Białystok',
  'Raków Częstochowa': 'Raków Częstochowa',
  'Pogoń Szczecin': 'Pogoń Szczecin',
  'Cracovia': 'Cracovia Kraków',
  'Oleksandriya': 'FC Oleksandriya',
  'Polissya Zhytomyr': 'FC Polissya Zhytomyr',
  'Kryvbas Kryvyi Rih': 'FC Kryvbas Kryvyi Rih',
  'Karpaty Lviv': 'FC Karpaty Lviv',
  'Al Ahly': 'Al Ahly SC',
  'Zamalek': 'Zamalek SC',
  'Pyramids FC': 'Pyramids FC',
  'Al Masry': 'Al Masry SC',
  'Ceramica Cleopatra': 'Ceramica Cleopatra FC',
  'Smouha': 'Smouha SC',
  'Raja Casablanca': 'Raja Club Athletic',
  'Wydad AC': 'Wydad Athletic Club',
  'RS Berkane': 'Renaissance Sportive de Berkane',
  'AS FAR Rabat': 'AS FAR Rabat',
  'Maghreb Fès': 'Maghreb Association Sportive de Fès',
  'FUS Rabat': 'Fath Union Sport de Rabat',
  'Simba SC': 'Simba Sports Club',
  'ASEC Mimosas': 'ASEC Mimosas',
  'Horoya': 'Horoya AC',
  'Stade Malien': 'Stade Malien de Bamako',
  'Vipers SC': 'Vipers SC',
  'Gor Mahia': 'Gor Mahia FC',
  'Daejeon Hana Citizen': 'Daejeon Hana Citizen FC',
  'Cong An Hanoi': 'Cong An Hanoi FC'
};

// Known verified ESPN CDN Logo IDs
export const CLUB_LOGO_MAP = {
  // Spanish LALIGA (Exact matching attachment)
  'Rayo Vallecano de Madrid': 'https://a.espncdn.com/i/teamlogos/soccer/500/101.png',
  'RCD Espanyol de Barcelona': 'https://a.espncdn.com/i/teamlogos/soccer/500/88.png',
  'Deportivo Alavés': 'https://a.espncdn.com/i/teamlogos/soccer/500/96.png',
  'Valencia CF': 'https://a.espncdn.com/i/teamlogos/soccer/500/94.png',
  'Elche CF': 'https://a.espncdn.com/i/teamlogos/soccer/500/3751.png',
  'Real Madrid CF': 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png',
  'FC Barcelona': 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
  'Club Atlético de Madrid': 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
  'Athletic Club Bilbao': 'https://a.espncdn.com/i/teamlogos/soccer/500/93.png',
  'Real Sociedad de Fútbol': 'https://a.espncdn.com/i/teamlogos/soccer/500/89.png',
  'Real Betis Balompié': 'https://a.espncdn.com/i/teamlogos/soccer/500/244.png',
  'Sevilla FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/243.png',
  'Villarreal CF': 'https://a.espncdn.com/i/teamlogos/soccer/500/102.png',
  'RC Celta de Vigo': 'https://a.espncdn.com/i/teamlogos/soccer/500/85.png',
  'CA Osasuna': 'https://a.espncdn.com/i/teamlogos/soccer/500/97.png',
  'Getafe CF': 'https://a.espncdn.com/i/teamlogos/soccer/500/2922.png',
  'RCD Mallorca': 'https://a.espncdn.com/i/teamlogos/soccer/500/84.png',
  'Girona FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/9812.png',
  'UD Las Palmas': 'https://a.espncdn.com/i/teamlogos/soccer/500/99.png',
  'CD Leganés': 'https://a.espncdn.com/i/teamlogos/soccer/500/2926.png',
  'Real Valladolid CF': 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png',

  // Premier League
  'Arsenal FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
  'Chelsea FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png',
  'Liverpool FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
  'Manchester City FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
  'Manchester United FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png',
  'Tottenham Hotspur FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/367.png',
  'Aston Villa FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/362.png',
  'Newcastle United FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/361.png',
  'Leeds United FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/357.png',

  // European & Global
  'FC Dynamo Kyiv': 'https://a.espncdn.com/i/teamlogos/soccer/500/435.png',
  'FC Shakhtar Donetsk': 'https://a.espncdn.com/i/teamlogos/soccer/500/438.png',
  'KKS Lech Poznań': 'https://a.espncdn.com/i/teamlogos/soccer/500/627.png',
  'Legia Warszawa': 'https://a.espncdn.com/i/teamlogos/soccer/500/628.png',
  'FC Bayern München': 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
  'Borussia Dortmund': 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png',
  'Bayer 04 Leverkusen': 'https://a.espncdn.com/i/teamlogos/soccer/500/131.png',
  'Juventus FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/111.png',
  'FC Internazionale Milano': 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png',
  'AC Milan': 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png',
  'Paris Saint-Germain FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
  'Sporting CP': 'https://a.espncdn.com/i/teamlogos/soccer/500/228.png',
  'Benfica': 'https://a.espncdn.com/i/teamlogos/soccer/500/226.png',
  'FC Porto': 'https://a.espncdn.com/i/teamlogos/soccer/500/227.png',
  'Ajax': 'https://a.espncdn.com/i/teamlogos/soccer/500/139.png',
  'PSV Eindhoven': 'https://a.espncdn.com/i/teamlogos/soccer/500/148.png',
  'Feyenoord': 'https://a.espncdn.com/i/teamlogos/soccer/500/141.png',
  'Celtic': 'https://a.espncdn.com/i/teamlogos/soccer/500/299.png',
  'Rangers': 'https://a.espncdn.com/i/teamlogos/soccer/500/300.png',
  'Galatasaray': 'https://a.espncdn.com/i/teamlogos/soccer/500/432.png',
  'Fenerbahce': 'https://a.espncdn.com/i/teamlogos/soccer/500/430.png',
  'Besiktas': 'https://a.espncdn.com/i/teamlogos/soccer/500/428.png',

  // South African Betway Premiership
  'Mamelodi Sundowns FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/10380.png',
  'Orlando Pirates FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/10379.png',
  'Kaizer Chiefs FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/10381.png',
  'AmaZulu FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/10385.png',
  'Stellenbosch FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/18167.png',
  'SuperSport United FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/10383.png',
  'Cape Town City FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/18163.png',
  'Chippa United FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/18164.png',
  'TS Galaxy FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/20268.png',
  'Polokwane City FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/18171.png',
  'Lamontville Golden Arrows FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/10384.png',
  'Richards Bay FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/19514.png',
  'Sekhukhune United FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/21568.png',
  'Marumo Gallants FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/21569.png',
  'Durban City FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/18172.png',
  'Milford FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/22081.png',
  'Kruger United FC': 'https://a.espncdn.com/i/teamlogos/soccer/500/22082.png'
};

// Club primary & secondary color palettes for authentic heraldic badges
export const CLUB_COLORS = {
  'Rayo Vallecano de Madrid': ['#E11D48', '#FFFFFF', '#0F172A'],
  'RCD Espanyol de Barcelona': ['#0284C7', '#FFFFFF', '#F59E0B'],
  'Deportivo Alavés': ['#1D4ED8', '#FFFFFF', '#93C5FD'],
  'Valencia CF': ['#EA580C', '#000000', '#FACC15'],
  'Elche CF': ['#059669', '#FFFFFF', '#D97706'],
  'Real Madrid CF': ['#FFFFFF', '#3B82F6', '#F59E0B'],
  'FC Barcelona': ['#991B1B', '#1E40AF', '#FBBF24'],
  'Club Atlético de Madrid': ['#DC2626', '#FFFFFF', '#1E3A8A'],
  'Arsenal FC': ['#DC2626', '#FFFFFF', '#F59E0B'],
  'Chelsea FC': ['#1D4ED8', '#FFFFFF', '#F59E0B'],
  'Liverpool FC': ['#B91C1C', '#FFFFFF', '#047857'],
  'Manchester City FC': ['#67E8F9', '#FFFFFF', '#0F172A'],
  'Manchester United FC': ['#DC2626', '#FACC15', '#000000'],
  'Mamelodi Sundowns FC': ['#FACC15', '#16A34A', '#2563EB'],
  'Orlando Pirates FC': ['#000000', '#FFFFFF', '#DC2626'],
  'Kaizer Chiefs FC': ['#F59E0B', '#000000', '#FFFFFF'],
  'Al Ahly SC': ['#DC2626', '#FFFFFF', '#F59E0B'],
  'Zamalek SC': ['#FFFFFF', '#DC2626', '#000000'],
  'Raja Club Athletic': ['#15803D', '#FFFFFF', '#F59E0B'],
  'Wydad Athletic Club': ['#DC2626', '#FFFFFF', '#F59E0B'],
  'FC Dynamo Kyiv': ['#2563EB', '#FFFFFF', '#F59E0B'],
  'FC Shakhtar Donetsk': ['#EA580C', '#000000', '#FFFFFF'],
  'Legia Warszawa': ['#15803D', '#000000', '#FFFFFF'],
  'KKS Lech Poznań': ['#1D4ED8', '#FFFFFF', '#93C5FD']
};

/**
 * Generates an SVG Data URI heraldic club crest
 * Used when an image is missing or offline so that no broken box ever shows up.
 */
export function generateSvgCrest(teamName, colors = null) {
  const c = colors || CLUB_COLORS[teamName] || ['#1E293B', '#F59E0B', '#FFFFFF'];
  const p1 = c[0] || '#1E293B';
  const p2 = c[1] || '#F59E0B';
  const p3 = c[2] || '#FFFFFF';

  // Compute 2-3 letter monogram
  const words = teamName.replace(/\bfc\b|\bcf\b|\bsc\b|\bac\b|\brcd\b|\brc\b/gi, '').trim().split(/\s+/);
  const initials = words.length === 1 
    ? words[0].slice(0, 3).toUpperCase() 
    : (words[0][0] + (words[1] ? words[1][0] : '') + (words[2] ? words[2][0] : '')).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p1}"/>
        <stop offset="100%" stop-color="${p2}"/>
      </linearGradient>
      <filter id="sh" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Heraldic Shield Body -->
    <path d="M32 4 C48 4 56 12 56 24 C56 42 32 58 32 58 C32 58 8 42 8 24 C8 12 16 4 32 4 Z" fill="url(#g)" stroke="#CBD5E1" stroke-width="2.5" filter="url(#sh)"/>
    <!-- Diagonal Sash or Chevron Accent -->
    <path d="M12 20 L52 40 L48 46 L8 26 Z" fill="${p3}" opacity="0.3"/>
    <!-- Gold / White Crown or Star Top -->
    <circle cx="32" cy="14" r="3" fill="#F59E0B" stroke="#B45309" stroke-width="0.8"/>
    <!-- Club Monogram -->
    <text x="32" y="38" font-family="'Space Grotesk', 'Arial Black', sans-serif" font-size="14" font-weight="900" fill="${p3}" text-anchor="middle" letter-spacing="0.5">${initials}</text>
  </svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/**
 * Resolves a team to its authoritative official name and logo
 */
export function resolveTeamIdentity(rawName, leagueId = '', existingLogo = null) {
  if (!rawName) return { name: 'Unknown', officialName: 'Unknown', short: 'UNK', logo: generateSvgCrest('Unknown') };

  const trimmed = rawName.trim();
  const officialName = OFFICIAL_TEAM_NAMES[trimmed] || trimmed;
  
  // 1. Check known logo map
  let logo = CLUB_LOGO_MAP[officialName] || CLUB_LOGO_MAP[trimmed] || existingLogo;

  // 2. If existing logo is valid ESPN or URL, keep it
  if (logo && (logo.startsWith('http') || logo.startsWith('data:'))) {
    // Valid URL
  } else {
    // 3. Fall back to high-res SVG crest
    logo = generateSvgCrest(officialName);
  }

  // Generate clean short abbreviation
  const words = officialName.replace(/\bfc\b|\bcf\b|\bsc\b|\bac\b|\brcd\b/gi, '').trim().split(/\s+/);
  const short = words.length === 1 
    ? words[0].slice(0, 3).toUpperCase() 
    : (words[0][0] + (words[1] ? words[1][0] : '') + (words[2] ? words[2][0] : '')).toUpperCase();

  return {
    name: officialName,
    officialName,
    short: short.slice(0, 3),
    logo
  };
}
