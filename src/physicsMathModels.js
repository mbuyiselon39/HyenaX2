/* ============================================================
   HYENAX PHYSICS, BIOMECHANICS, INFORMATION THEORY & TIME-HAZARD SUITE
   Pure mathematical & physical modeling modules with zero external deps:
   1. Matchday Atmospheric Physics & Aerodynamic Drag Engine
   2. Non-Homogeneous Weibull Early-Tempo First-15-Min Draw Model
   3. Negative Binomial Overdispersed Team Corner Siege Engine
   4. Shannon Information Entropy & Exact Skellam Goal-Margin Engine
   ============================================================ */

function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

function poissonPm(lambda, k) {
  if (lambda <= 0 || k < 0) return k === 0 ? 1 : 0;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

function dixonColesTau(x, y, lh, la, rho) {
  if (x === 0 && y === 0) return Math.max(0.05, 1 - lh * la * rho);
  if (x === 0 && y === 1) return Math.max(0.05, 1 + lh * rho);
  if (x === 1 && y === 0) return Math.max(0.05, 1 + la * rho);
  if (x === 1 && y === 1) return Math.max(0.05, 1 - rho);
  return 1.0;
}

function besselI(k, z) {
  const absK = Math.abs(k);
  let sum = 0;
  let term = Math.pow(z / 2, absK) / factorial(absK);
  sum += term;
  for (let m = 1; m < 28; m++) {
    term *= (z * z) / (4 * m * (m + absK));
    sum += term;
    if (term < 1e-13 * sum) break;
  }
  return sum;
}

function skellamPmLocal(k, l1, l2) {
  const safe1 = Math.max(0.05, l1);
  const safe2 = Math.max(0.05, l2);
  const z = 2 * Math.sqrt(safe1 * safe2);
  return Math.exp(-(safe1 + safe2)) * Math.pow(safe1 / safe2, k / 2) * besselI(k, z);
}

// Log-Gamma approximation (Lanczos) for Negative Binomial PMF
function logGamma(z) {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1;
  let x = p[0];
  for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

export function negativeBinomialPm(mean, k, r = 12.5) {
  if (mean <= 0 || k < 0) return k === 0 ? 1 : 0;
  const p = r / (r + mean);
  const logCoef = logGamma(k + r) - logGamma(k + 1) - logGamma(r);
  const logProb = logCoef + r * Math.log(p) + k * Math.log(1 - p);
  return Math.exp(logProb);
}

/**
 * 1. Matchday Atmospheric Physics & Fluid Drag Engine
 */
export function calculateAtmosphericPhysics({
  altitudeM = 120,
  temperatureC = 17,
  windKmh = 12,
  precipitationPct = 15,
  humidityPct = 62,
  travelKm = 180
} = {}) {
  const alt = Math.max(0, Math.min(3800, Number(altitudeM) || 0));
  const tempC = Math.max(-10, Math.min(45, Number(temperatureC) || 17));
  const wind = Math.max(0, Math.min(90, Number(windKmh) || 10));
  const rain = Math.max(0, Math.min(100, Number(precipitationPct) || 0));
  const hum = Math.max(10, Math.min(100, Number(humidityPct) || 60));

  // Barometric formula (International Standard Atmosphere)
  const pressurePa = 101325 * Math.pow(1 - 2.25577e-5 * alt, 5.25588);
  const tempK = tempC + 273.15;
  // Saturation vapor pressure (Tetens equation) & moist gas density adjustment
  const eSatPa = 610.78 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const pv = (hum / 100) * eSatPa;
  const pd = Math.max(1000, pressurePa - pv);
  const airDensityKgM3 = +((pd / (287.058 * tempK)) + (pv / (461.495 * tempK))).toFixed(4);

  const seaLevelRho = 1.225;
  const airDensityRatio = +(airDensityKgM3 / seaLevelRho).toFixed(3);
  const dragReductionPct = +((1 - airDensityRatio) * 100).toFixed(1);

  // Reduced air density at altitude increases free-kick/long-shot flight velocity
  const ballVelocityMultiplier = +(1 + Math.max(0, 1 - airDensityRatio) * 0.35).toFixed(3);

  // Wet surface hydroplaning/skid index reduces turf rolling friction (more deflected shots & corners)
  const wetTurfSkidIndex = +(1 + (rain / 100) * 0.22).toFixed(3);

  // Altitude hypoxia VO2max stamina decay above 1100m & heat WBGT fatigue above 27C
  const altitudeHypoxia = alt > 1100 ? ((alt - 1100) / 1000) * 4.2 : 0;
  const thermalStress = tempC > 26 ? (tempC - 26) * 0.55 : 0;
  const altitudeStaminaDecayPct = +Math.min(14.0, altitudeHypoxia + thermalStress + (Number(travelKm) > 900 ? 1.4 : 0)).toFixed(1);

  // Wind turbulence increases cross-field long-pass dispersion
  const windTurbulenceIndex = +(wind > 20 ? 1 + (wind - 20) * 0.008 : 1.0).toFixed(3);

  // Combined bounded multipliers for downstream xG and corner models
  const goalHazardPhysicsMult = +Math.min(1.12, Math.max(0.92,
    (1 + Math.max(0, 1 - airDensityRatio) * 0.14) *
    (rain > 35 ? 1.02 : 1.0) *
    (wind > 32 ? 0.96 : 1.0)
  )).toFixed(3);

  const cornerDeflectionMult = +Math.min(1.14, Math.max(0.94,
    (1 + (rain / 100) * 0.09) *
    (1 + Math.max(0, 1 - airDensityRatio) * 0.08) *
    (wind > 28 ? 1.03 : 1.0)
  )).toFixed(3);

  let physicsVerdict = 'NOMINAL_AERODYNAMIC_BASELINE';
  if (alt >= 1400) physicsVerdict = 'HIGH_ALTITUDE_LOW_DRAG_SHOT_BOOST';
  else if (rain >= 45) physicsVerdict = 'WET_TURF_SKID_CORNER_SURGE';
  else if (wind >= 28) physicsVerdict = 'CROSSWIND_PASS_DISPERSION';
  else if (tempC >= 29) physicsVerdict = 'THERMAL_FATIGUE_2ND_HALF_DECAY';

  return {
    airDensityKgM3,
    airDensityRatio,
    dragReductionPct,
    ballVelocityMultiplier,
    wetTurfSkidIndex,
    altitudeStaminaDecayPct,
    windTurbulenceIndex,
    goalHazardPhysicsMult,
    cornerDeflectionMult,
    physicsVerdict
  };
}

/**
 * 2. Non-Homogeneous Weibull Early-Tempo First-15-Min Draw & Outcome Model (00:00–14:59)
 */
export function calculateFirst15MinDistribution({
  lambdaHome = 1.45,
  lambdaAway = 1.15,
  rho = -0.125,
  ppdaHome = 10.5,
  ppdaAway = 11.2,
  isDerby = false,
  physicsMetrics = null
} = {}) {
  // Empirical fraction of 90-min goals occurring inside [0', 15'] is ~0.132 due to fresh tactical discipline
  const avgPpda = (Number(ppdaHome || 10.5) + Number(ppdaAway || 11.2)) / 2;
  const pressHazardFactor = Math.min(1.18, Math.max(0.86, 1 + (10.5 - avgPpda) * 0.022));
  const derbyCautionFactor = isDerby ? 0.89 : 1.0;
  const physHazardFactor = physicsMetrics?.goalHazardPhysicsMult || 1.0;

  const baseEarlyShare = 0.132 * pressHazardFactor * derbyCautionFactor * physHazardFactor;
  const lH15 = Math.max(0.05, Math.min(0.65, Number(lambdaHome) * baseEarlyShare));
  const lA15 = Math.max(0.04, Math.min(0.55, Number(lambdaAway) * baseEarlyShare));

  let totalNorm = 0;
  for (let x = 0; x <= 4; x++) {
    for (let y = 0; y <= 4; y++) {
      totalNorm += poissonPm(lH15, x) * poissonPm(lA15, y) * dixonColesTau(x, y, lH15, lA15, rho);
    }
  }
  const invNorm = totalNorm > 0 ? 1 / totalNorm : 1;

  let pDraw15 = 0;
  let pHomeLead15 = 0;
  let pAwayLead15 = 0;
  let pNoGoal15 = 0;

  for (let x = 0; x <= 4; x++) {
    for (let y = 0; y <= 4; y++) {
      const p = poissonPm(lH15, x) * poissonPm(lA15, y) * dixonColesTau(x, y, lH15, lA15, rho) * invNorm;
      if (x === y) pDraw15 += p;
      else if (x > y) pHomeLead15 += p;
      else pAwayLead15 += p;
      if (x === 0 && y === 0) pNoGoal15 = p;
    }
  }

  return {
    lambdaHome15: +lH15.toFixed(3),
    lambdaAway15: +lA15.toFixed(3),
    earlyHazardShare: +baseEarlyShare.toFixed(3),
    pDraw15: +Math.min(0.89, Math.max(0.48, pDraw15)).toFixed(3),
    pHomeLead15: +Math.min(0.40, Math.max(0.06, pHomeLead15)).toFixed(3),
    pAwayLead15: +Math.min(0.35, Math.max(0.05, pAwayLead15)).toFixed(3),
    pNoGoal15: +Math.min(0.86, Math.max(0.44, pNoGoal15)).toFixed(3),
    pGoal15: +Math.min(0.56, Math.max(0.14, 1 - pNoGoal15)).toFixed(3)
  };
}

/**
 * 3. Correlated Negative Binomial Team & Match Corner Siege Engine
 */
export function calculateNegativeBinomialCorners({
  totalLambda = 2.6,
  lambdaHome = 1.45,
  lambdaAway = 1.15,
  homeWingFreq = 70,
  awayWingFreq = 65,
  homeBlocksPct = 44,
  awayBlocksPct = 46,
  isDerby = false,
  physicsMetrics = null
} = {}) {
  const cornerDefMult = physicsMetrics?.cornerDeflectionMult || 1.0;
  const avgWing = ((Number(homeWingFreq) || 70) + (Number(awayWingFreq) || 65)) / 2;
  const avgBlocks = ((Number(homeBlocksPct) || 44) + (Number(awayBlocksPct) || 46)) / 2;

  const tacticalCornerLift = (avgWing / 68) * (0.92 + (avgBlocks - 40) * 0.004) * cornerDefMult * (isDerby ? 1.04 : 1.0);
  const totalCornersExp = Math.max(7.6, Math.min(13.4, Number(totalLambda) * 3.45 * tacticalCornerLift));

  const homeForce = (Number(lambdaHome) * 1.10) * ((Number(homeWingFreq) || 70) / 70);
  const awayForce = (Number(lambdaAway) * 1.00) * ((Number(awayWingFreq) || 65) / 70);
  const homeCornerShare = Math.min(0.69, Math.max(0.39, homeForce / Math.max(0.1, homeForce + awayForce)));

  const lambdaFirstHalfCorners = +(totalCornersExp * 0.45).toFixed(2);
  const lambdaSecondHalfCorners = +(totalCornersExp * 0.55).toFixed(2);
  const lambdaHomeCorners = +(totalCornersExp * homeCornerShare).toFixed(2);
  const lambdaAwayCorners = +(totalCornersExp * (1 - homeCornerShare)).toFixed(2);

  const calcCdf = (mu, maxLine, rDisp = 12.5) => {
    let underProb = 0;
    for (let c = 0; c <= maxLine; c++) {
      // Negative binomial captures clustered corner siege variance better than pure Poisson
      const pm = 0.65 * negativeBinomialPm(mu, c, rDisp) + 0.35 * poissonPm(mu, c);
      underProb += pm;
    }
    underProb = Math.min(0.96, Math.max(0.04, underProb));
    return {
      under: +underProb.toFixed(3),
      over: +(1 - underProb).toFixed(3)
    };
  };

  // Playable Sportsbook Corner Lines:
  // Match Total Corners strictly start at 7.5+ (7.5, 8.5, 9.5, 10.5, 11.5 Over/Under)
  // Team Total Corners start at 5.5+ or Under (Home also gets 7+ Over 6.5 & 8+ Over 7.5)
  const home55 = calcCdf(lambdaHomeCorners, 5, 10.5);
  const home65 = calcCdf(lambdaHomeCorners, 6, 10.5); // 7+ Corners (Over 6.5) / Under 6.5
  const home75 = calcCdf(lambdaHomeCorners, 7, 10.5); // 8+ Corners (Over 7.5) / Under 7.5

  // Away Team playable 5.5 Over/Under line only (no <5.5 and no 7+/8+ milestone options for Away)
  const away55 = calcCdf(lambdaAwayCorners, 5, 10.5);

  // Market-Ready Match Total Corner Lines strictly starting at 7.5+ (7.5, 8.5, 9.5, 10.5, 11.5)
  const match75 = calcCdf(totalCornersExp, 7, 14.0);
  const match85 = calcCdf(totalCornersExp, 8, 14.0);
  const match95 = calcCdf(totalCornersExp, 9, 14.0);
  const match105 = calcCdf(totalCornersExp, 10, 14.0);
  const match115 = calcCdf(totalCornersExp, 11, 14.0);

  // 1st-Half ("First Corners") strictly 3.5 & 4.5 Over/Under
  const firstHalf35 = calcCdf(lambdaFirstHalfCorners, 3, 11.0);
  const firstHalf45 = calcCdf(lambdaFirstHalfCorners, 4, 11.0);

  return {
    totalCornersExp: +totalCornersExp.toFixed(2),
    homeCornerShare: +homeCornerShare.toFixed(3),
    lambdaHomeCorners,
    lambdaAwayCorners,
    lambdaFirstHalfCorners,
    lambdaSecondHalfCorners,
    varianceInflationFactor: +(1 + totalCornersExp / 14.0).toFixed(2),
    home: {
      over55: home55.over, under55: home55.under,
      over65: home65.over, under65: home65.under, // 7+ Corners / Under 6.5
      over75: home75.over, under75: home75.under  // 8+ Corners / Under 7.5
    },
    away: {
      over55: away55.over, under55: away55.under
    },
    match: {
      over75: match75.over, under75: match75.under,
      over85: match85.over, under85: match85.under,
      over95: match95.over, under95: match95.under,
      over105: match105.over, under105: match105.under,
      over115: match115.over, under115: match115.under
    },
    firstHalf: {
      over35: firstHalf35.over, under35: firstHalf35.under,
      over45: firstHalf45.over, under45: firstHalf45.under
    }
  };
}

/**
 * 4. Shannon Information Entropy & Exact Skellam Goal-Difference Distribution
 */
export function calculateEntropyAndSkellam({
  lambdaHome = 1.45,
  lambdaAway = 1.15,
  pHome = 0.50,
  pDraw = 0.25,
  pAway = 0.25
} = {}) {
  const sum = (pHome + pDraw + pAway) || 1;
  const probs = [pHome / sum, pDraw / sum, pAway / sum].map(p => Math.max(1e-6, p));
  const shannonEntropyBits = +(-probs.reduce((acc, p) => acc + p * Math.log2(p), 0)).toFixed(3);
  const maxEntropyBits = Math.log2(3); // ~1.585 bits
  const certaintyIndexPct = +(Math.min(100, Math.max(0, (1 - shannonEntropyBits / maxEntropyBits) * 100))).toFixed(1);

  let skellamDrawProb = 0;
  let homeWinBy2PlusProb = 0;
  let awayWinBy2PlusProb = 0;
  let awayPlus15HandicapProb = 0;

  for (let k = -6; k <= 6; k++) {
    const pk = skellamPmLocal(k, lambdaHome, lambdaAway);
    if (k === 0) skellamDrawProb = pk;
    if (k >= 2) homeWinBy2PlusProb += pk;
    if (k <= -2) awayWinBy2PlusProb += pk;
    if (k <= 1) awayPlus15HandicapProb += pk; // Away +1.5 handicap covers away win, draw, or 1-goal loss
  }

  return {
    shannonEntropyBits,
    maxEntropyBits: +maxEntropyBits.toFixed(3),
    certaintyIndexPct,
    entropyRegime: certaintyIndexPct >= 28 ? 'LOW_ENTROPY_PREDICTABLE' : certaintyIndexPct >= 14 ? 'BALANCED_ENTROPY' : 'HIGH_ENTROPY_CHAOS',
    skellamDrawProb: +Math.min(0.42, Math.max(0.12, skellamDrawProb)).toFixed(3),
    homeWinBy2PlusProb: +Math.min(0.65, Math.max(0.05, homeWinBy2PlusProb)).toFixed(3),
    awayWinBy2PlusProb: +Math.min(0.55, Math.max(0.03, awayWinBy2PlusProb)).toFixed(3),
    awayPlus15HandicapProb: +Math.min(0.95, Math.max(0.35, awayPlus15HandicapProb)).toFixed(3),
    expectedGoalMargin: +(Number(lambdaHome) - Number(lambdaAway)).toFixed(2)
  };
}

/**
 * 5. Non-Homogeneous Early-Tempo First 10 Minutes Result (00:00–09:59) - Market #21
 */
export function calculateFirst10MinResult({
  lambdaHome = 1.45,
  lambdaAway = 1.15,
  rho = -0.125,
  ppdaHome = 10.5,
  ppdaAway = 11.2,
  isDerby = false,
  physicsMetrics = null
} = {}) {
  // Empirical ~8.4% of 90-min goals happen inside 00:00-09:59
  const avgPpda = (Number(ppdaHome || 10.5) + Number(ppdaAway || 11.2)) / 2;
  const pressFactor = Math.min(1.16, Math.max(0.86, 1 + (10.5 - avgPpda) * 0.02));
  const derbyCaution = isDerby ? 0.88 : 1.0;
  const physMult = physicsMetrics?.goalHazardPhysicsMult || 1.0;

  const share10 = 0.084 * pressFactor * derbyCaution * physMult;
  const lH10 = Math.max(0.03, Math.min(0.42, Number(lambdaHome) * share10));
  const lA10 = Math.max(0.02, Math.min(0.38, Number(lambdaAway) * share10));

  let totalNorm = 0;
  for (let x = 0; x <= 3; x++) {
    for (let y = 0; y <= 3; y++) {
      totalNorm += poissonPm(lH10, x) * poissonPm(lA10, y) * dixonColesTau(x, y, lH10, lA10, rho);
    }
  }
  const invNorm = totalNorm > 0 ? 1 / totalNorm : 1;

  let pDraw10 = 0;
  let pHomeLead10 = 0;
  let pAwayLead10 = 0;
  let pNoGoal10 = 0;

  for (let x = 0; x <= 3; x++) {
    for (let y = 0; y <= 3; y++) {
      const p = poissonPm(lH10, x) * poissonPm(lA10, y) * dixonColesTau(x, y, lH10, lA10, rho) * invNorm;
      if (x === y) pDraw10 += p;
      else if (x > y) pHomeLead10 += p;
      else pAwayLead10 += p;
      if (x === 0 && y === 0) pNoGoal10 = p;
    }
  }

  return {
    lambdaHome10: +lH10.toFixed(3),
    lambdaAway10: +lA10.toFixed(3),
    pDraw10: +Math.min(0.92, Math.max(0.58, pDraw10)).toFixed(3),
    pHomeLead10: +Math.min(0.28, Math.max(0.04, pHomeLead10)).toFixed(3),
    pAwayLead10: +Math.min(0.24, Math.max(0.03, pAwayLead10)).toFixed(3),
    pNoGoal10: +Math.min(0.90, Math.max(0.55, pNoGoal10)).toFixed(3),
    pGoal10: +Math.min(0.45, Math.max(0.10, 1 - pNoGoal10)).toFixed(3)
  };
}

/**
 * 6. First Goal Interval (10-Minute Brackets) - Market #20
 * Models P(T_first_goal in [a, b]) using inhomogeneous Weibull match hazard.
 */
export function calculateFirstGoalIntervals10m({
  lambdaHome = 1.45,
  lambdaAway = 1.15,
  isDerby = false,
  physicsMetrics = null
} = {}) {
  const totalL = Math.max(0.8, Number(lambdaHome) + Number(lambdaAway)) * (physicsMetrics?.goalHazardPhysicsMult || 1.0);
  // 9 intervals calibrated to football match scoring curve (slightly suppressed 1-10, higher 31-40, 76-90)
  const intervalWeights = [
    { label: '1-10 Min', share: 0.084 },
    { label: '11-20 Min', share: 0.102 },
    { label: '21-30 Min', share: 0.108 },
    { label: '31-40 Min', share: 0.114 },
    { label: '41-50 Min', share: 0.118 },
    { label: '51-60 Min', share: 0.112 },
    { label: '61-70 Min', share: 0.116 },
    { label: '71-80 Min', share: 0.118 },
    { label: '81-90+ Min', share: 0.128 }
  ];
  const derbyFactor = isDerby ? 0.94 : 1.0;

  let survivalProb = 1.0;
  const brackets = [];
  for (const iv of intervalWeights) {
    const rate = totalL * iv.share * derbyFactor;
    const pGoalInBucket = 1 - Math.exp(-rate);
    const pFirstInBucket = survivalProb * pGoalInBucket;
    brackets.push({
      bracket: iv.label,
      probability: +pFirstInBucket.toFixed(4)
    });
    survivalProb *= Math.exp(-rate);
  }
  const pNoGoal = +survivalProb.toFixed(4);
  const topBracket = [...brackets].sort((a, b) => b.probability - a.probability)[0];

  return {
    brackets,
    noGoalProbability: pNoGoal,
    mostLikelyBracket: topBracket.bracket,
    mostLikelyBracketProb: topBracket.probability,
    goalBefore30MinProb: +(brackets[0].probability + brackets[1].probability + brackets[2].probability).toFixed(3),
    goalBefore45MinProb: +(brackets[0].probability + brackets[1].probability + brackets[2].probability + brackets[3].probability + brackets[4].probability * 0.5).toFixed(3)
  };
}

/**
 * 7. Exact Skellam Winning Margins (Market #8) & Handicaps (Market #7)
 */
export function calculateMatchWinningMarginsAndHandicaps(lambdaHome = 1.45, lambdaAway = 1.15) {
  let homeBy1 = 0, homeBy2 = 0, homeBy3Plus = 0;
  let awayBy1 = 0, awayBy2 = 0, awayBy3Plus = 0;
  let draw = 0;

  for (let k = -7; k <= 7; k++) {
    const pk = skellamPmLocal(k, lambdaHome, lambdaAway);
    if (k === 0) draw += pk;
    else if (k === 1) homeBy1 += pk;
    else if (k === 2) homeBy2 += pk;
    else if (k >= 3) homeBy3Plus += pk;
    else if (k === -1) awayBy1 += pk;
    else if (k === -2) awayBy2 += pk;
    else if (k <= -3) awayBy3Plus += pk;
  }

  return {
    margins: {
      draw: +draw.toFixed(3),
      homeBy1: +homeBy1.toFixed(3),
      homeBy2: +homeBy2.toFixed(3),
      homeBy3Plus: +homeBy3Plus.toFixed(3),
      awayBy1: +awayBy1.toFixed(3),
      awayBy2: +awayBy2.toFixed(3),
      awayBy3Plus: +awayBy3Plus.toFixed(3)
    },
    handicaps: {
      homeMinus15: +(homeBy2 + homeBy3Plus).toFixed(3),   // Home -1.5
      awayPlus15: +(awayBy1 + awayBy2 + awayBy3Plus + draw + homeBy1).toFixed(3), // Away +1.5
      awayMinus15: +(awayBy2 + awayBy3Plus).toFixed(3),   // Away -1.5
      homePlus15: +(homeBy1 + homeBy2 + homeBy3Plus + draw + awayBy1).toFixed(3), // Home +1.5
      homeMinus05: +(homeBy1 + homeBy2 + homeBy3Plus).toFixed(3),
      awayPlus05: +(draw + awayBy1 + awayBy2 + awayBy3Plus).toFixed(3)
    }
  };
}

/**
 * 8. Correlated Negative Binomial Total Match Shots Engine (#34)
 */
export function calculateTotalMatchShotsDistribution({
  matchTotalShotsExp = 23.5,
  homeTotalShotsExp = 13.5,
  awayTotalShotsExp = 10.0,
  isDerby = false,
  physicsMetrics = null
} = {}) {
  const physBoost = physicsMetrics?.ballVelocityMultiplier ? Math.min(1.06, Math.max(0.95, physicsMetrics.ballVelocityMultiplier)) : 1.0;
  const meanShots = Math.max(17.5, Math.min(31.5, Number(matchTotalShotsExp || 23.5) * physBoost * (isDerby ? 1.03 : 1.0)));

  const calcShotCdf = (mu, maxLine, rDisp = 20.0) => {
    let underProb = 0;
    for (let s = 0; s <= maxLine; s++) {
      underProb += negativeBinomialPm(mu, s, rDisp);
    }
    underProb = Math.min(0.95, Math.max(0.05, underProb));
    return {
      under: +underProb.toFixed(3),
      over: +(1 - underProb).toFixed(3)
    };
  };

  const line195 = calcShotCdf(meanShots, 19);
  const line215 = calcShotCdf(meanShots, 21);
  const line235 = calcShotCdf(meanShots, 23);
  const line255 = calcShotCdf(meanShots, 25);
  const line275 = calcShotCdf(meanShots, 27);

  return {
    expectedTotalShots: +meanShots.toFixed(1),
    homeShotsExp: +Number(homeTotalShotsExp || meanShots * 0.56).toFixed(1),
    awayShotsExp: +Number(awayTotalShotsExp || meanShots * 0.44).toFixed(1),
    match: {
      over195: line195.over, under195: line195.under,
      over215: line215.over, under215: line215.under,
      over235: line235.over, under235: line235.under,
      over255: line255.over, under255: line255.under,
      over275: line275.over, under275: line275.under
    }
  };
}


