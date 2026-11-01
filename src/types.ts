export interface League {
  id: string;
  name: string;
  country: string;
  flag: string;
  rho?: number;
}

export interface Team {
  name: string;
  short: string;
  rating: number;
  form?: string[];
  xgFor?: number;
  xgAgainst?: number;
  logo?: string;
  rank?: number;
  ppg?: number;
}

export interface PredictionOdds {
  hollywoodbets: number;
  betway: number;
  easybet: number;
}

export interface Prediction {
  rank?: number;
  market: string;
  selection: string;
  marketCategory?: string;
  probability: number;
  odds: PredictionOdds | number;
  marketEdge?: number;
  convictionScore?: number;
  isValueBet?: boolean;
  isLowOddsTrap?: boolean;
  result?: 'WON' | 'LOST' | 'VOID' | 'PENDING';
  deepVetting?: {
    status?: string;
    refereeClauseApproved?: boolean;
    tacticalLineupApproved?: boolean;
    isEliteDeepMarketTop20?: boolean;
    summary?: string;
    refereeName?: string;
    refereeCardRate?: string;
    lineupStatus?: string;
    wingersFullbacksLocked?: boolean;
  };
}

export interface H2HMeeting {
  meetingIndex?: number;
  date: string;
  season?: string;
  homeGoals: number;
  awayGoals: number;
  totalGoals: number;
  outcome: 'H' | 'D' | 'A';
  scoreline: string;
  venue?: string;
  btts?: boolean;
  over25?: boolean;
  label?: string;
}

export interface GoalDistribution {
  range: string;
  count: number;
  pct: number;
  color: string;
}

export interface H2HData {
  homeWins: number;
  draws: number;
  awayWins: number;
  lastFive?: string[];
  last8Meetings?: H2HMeeting[];
  rawRecent?: H2HMeeting[];
  totalGoals?: number;
  avgGoals?: number;
  over25Count?: number;
  over25Pct?: number;
  bttsCount?: number;
  bttsPct?: number;
  distribution?: GoalDistribution[];
  [key: string]: any;
}

export interface ModelBreakdownItem {
  name: string;
  prob: number;
  weight: number;
  category: string;
  signal: string;
}

export interface EnsembleData {
  consensusProbability: number;
  modelAgreementScore: number;
  standardDeviation?: number;
  totalModelsActive: number;
  confidenceTier: string;
  categoryAverages?: Array<{ category: string; modelCount: number; weightedProb: number }>;
  dissentingModels?: Array<{ name: string; prob: number; deltaFromConsensus: number; direction: string; signal: string }>;
  breakdown?: ModelBreakdownItem[];
  [key: string]: any;
}

export interface BeastMeta {
  beastScore: number;
  brierScore: number;
  calibratedProbability: number;
  fairOdds?: number;
  expectedValuePct?: number;
  trustScore?: number;
  valueClassification?: string;
  ensemble?: EnsembleData;
  derbyInfo?: { isDerby: boolean; derbyName: string | null };
  strictVetting?: any;
  outlierFilters?: any;
  [key: string]: any;
}

export interface Fixture {
  id: string;
  league: League;
  matchDate?: string;
  kickoff: string;
  kickoffTime?: string;
  kickoffRsa?: string;
  home: Team;
  away: Team;
  venue?: string;
  round?: string;
  isBig?: boolean;
  score?: { home: number; away: number };
  finalScore?: string;
  matchStatus?: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'FINISHED';
  dataQuality?: string;
  probabilityIndex?: number;
  rationale?: string;
  topPick: Prediction;
  predictions: Prediction[];
  h2h?: H2HData;
  beastMeta?: BeastMeta;
  strictVetting?: any;
  refereeReport?: any;
  cornerVolatilityProfile?: any;
  situationalFactors?: any;
  marketPsychology?: any;
  thirdPartySyndicate?: any;
  engineVerifier?: any;
  approvalStatus?: string;
  approvalBadge?: string;
  isVettedApproved?: boolean;
  advancedRiskValidation?: any;
}

export interface DayTab {
  key: string;
  date: Date;
  offset: number;
  label: string;
  sub: string;
  year?: number;
  fullLabel?: string;
  fixtureCount?: number;
}

export interface TopBankerPick {
  id: string;
  matchId: string;
  rank: number;
  rankLabel: string;
  match: string;
  home: Team;
  away: Team;
  league: League;
  kickoff: string;
  kickoffTime: string;
  matchDate: string;
  market: string;
  marketCategory: string;
  selection: string;
  probability: number;
  calibratedProb: number;
  odds: number;
  allOdds?: PredictionOdds;
  bankerScore: number;
  modelAgreement: number;
  modelsActive: number;
  trustScore: number;
  safetyTier: string;
  safetyBadge: string;
  badgeBg: string;
  whySafe: string;
  isFinished?: boolean;
  finalScore?: string;
  settledResult?: 'WON' | 'LOST' | 'VOID' | 'PENDING';
  evPct?: number;
  advancedRiskValidation?: any;
}

export interface AccumulatorLeg {
  id: string;
  matchId: string;
  fixture: string;
  league: string;
  selection: string;
  market: string;
  probability: number;
  odds: number;
}

export interface AccumulatorAnalysis {
  legsCount: number;
  compoundOdds: number;
  compoundTrueProbabilityPct: number;
  compoundImpliedProbabilityPct: number;
  houseVigPct: number;
  netEdgePct: number;
  riskRating: 'EXTREME' | 'HIGH' | 'MODERATE' | 'SAFE';
  weakestLink: any;
  legs: any[];
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  grounding?: {
    searchSources?: Array<{ title: string; uri: string }>;
    mapSources?: Array<{ title: string; uri: string; reviewSnippets?: string[] }>;
  };
  timestamp?: string;
}
