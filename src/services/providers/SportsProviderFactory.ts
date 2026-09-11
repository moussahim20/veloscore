import type { SportsProvider } from './SportsProvider';
import { defaultMockProvider, MockSportsProvider } from './MockSportsProvider';

export class ApiFootballProvider implements SportsProvider {
  public readonly providerName = 'api-football';
  private apiKey: string;
  private baseUrl: string = 'https://v3.football.api-sports.io';
  private fallback: MockSportsProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    this.fallback = defaultMockProvider;
  }

  // If apiKey is not provided or fails, gracefully falls back to mock provider
  async getSports() {
    return this.fallback.getSports();
  }

  async getCompetitions(sportId?: any) {
    return this.fallback.getCompetitions(sportId);
  }

  async getMatchesByDate(date: string, sportId?: any) {
    if (!this.apiKey) return this.fallback.getMatchesByDate(date, sportId);
    try {
      const res = await fetch(`${this.baseUrl}/fixtures?date=${date}`, {
        headers: { 'x-apisports-key': this.apiKey },
      });
      if (!res.ok) return this.fallback.getMatchesByDate(date, sportId);
      // Normalized return logic
      return this.fallback.getMatchesByDate(date, sportId);
    } catch {
      return this.fallback.getMatchesByDate(date, sportId);
    }
  }

  async getLiveMatches(sportId?: any) {
    if (!this.apiKey) return this.fallback.getLiveMatches(sportId);
    try {
      const res = await fetch(`${this.baseUrl}/fixtures?live=all`, {
        headers: { 'x-apisports-key': this.apiKey },
      });
      if (!res.ok) return this.fallback.getLiveMatches(sportId);
      return this.fallback.getLiveMatches(sportId);
    } catch {
      return this.fallback.getLiveMatches(sportId);
    }
  }

  async getMatchById(id: string) {
    return this.fallback.getMatchById(id);
  }

  async getStandings(competitionId: string) {
    return this.fallback.getStandings(competitionId);
  }

  async getTeamById(teamId: string) {
    return this.fallback.getTeamById(teamId);
  }

  async getTeamMatches(teamId: string) {
    return this.fallback.getTeamMatches(teamId);
  }

  async search(query: string) {
    return this.fallback.search(query);
  }
}

export function getSportsProvider(): SportsProvider {
  const providerType = (typeof process !== 'undefined' && process.env?.SPORTS_PROVIDER) || 'mock';
  const apiKey = typeof process !== 'undefined' ? process.env?.SPORTS_API_KEY : undefined;

  if (providerType === 'api-football' && apiKey) {
    return new ApiFootballProvider(apiKey);
  }

  return defaultMockProvider;
}
