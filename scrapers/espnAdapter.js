/* ============================================================
   ESPN LIVE SCOREBOARD & STANDINGS + API-FOOTBALL MAPPING ADAPTER
   Wraps ESPN REST v2 public scoreboard/standings endpoints with
   timeout guards, API-Football competition ID translation, and
   league goal-environment baseline resolution.
   ============================================================ */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EspnLiveAdapter {
  constructor() {
    this.name = 'ESPN Soccer Live API & Standings Adapter';
    this.sourceUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
    this.status = 'ONLINE';
    this.lastSync = new Date().toISOString();
    this.apiFootballMap = {};
    this.leagueBaselines = {};
    this.loadConfigs();
  }

  loadConfigs() {
    try {
      const mapPath = path.join(__dirname, '../data/api_football_league_map.json');
      if (fs.existsSync(mapPath)) {
        this.apiFootballMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
      }
      const basePath = path.join(__dirname, '../data/league_baselines.json');
      if (fs.existsSync(basePath)) {
        this.leagueBaselines = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
      }
    } catch (err) {
      console.warn('[EspnLiveAdapter] Config load warning:', err.message);
    }
  }

  getApiFootballLeagueId(internalOrFdId) {
    return this.apiFootballMap[String(internalOrFdId)] || null;
  }

  getLeagueBaseline(key) {
    const rec = this.leagueBaselines[String(key)];
    if (rec && typeof rec.avgGoals === 'number') return rec;
    return null;
  }

  async fetchScoreboard(espnSlug, dateStr = null, timeoutMs = 6000) {
    if (!espnSlug || typeof fetch !== 'function') return [];
    const q = dateStr ? `?dates=${dateStr}` : '';
    const url = `${this.sourceUrl}/${espnSlug}/scoreboard${q}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'HyenaX-Intelligence-Engine/1.0' },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.events) ? data.events : [];
  }

  async syncAll() {
    const start = Date.now();
    this.lastSync = new Date().toISOString();
    let probeEvents = 0;
    let reachable = true;

    try {
      const eplEvents = await this.fetchScoreboard('eng.1', null, 4500);
      probeEvents = eplEvents.length;
    } catch (_) {
      reachable = false;
    }

    return {
      scraper: this.name,
      status: reachable ? 'OK' : 'DEGRADED',
      latencyMs: Date.now() - start,
      recordsIngested: probeEvents,
      apiFootballMappings: Object.keys(this.apiFootballMap).length,
      leagueBaselinesLoaded: Object.keys(this.leagueBaselines).length,
      syncedAt: this.lastSync
    };
  }
}
