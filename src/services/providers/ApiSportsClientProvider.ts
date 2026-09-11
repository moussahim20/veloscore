import type {
  Sport,
  SportId,
  Competition,
  Match,
  StandingRow,
  Team,
} from '../../types/sports';
import type { SportsProvider, SearchResults } from './SportsProvider';
import { defaultMockProvider } from './MockSportsProvider';

export class ApiSportsClientProvider implements SportsProvider {
  public readonly providerName = 'api-football-client';

  async getSports(): Promise<Sport[]> {
    return defaultMockProvider.getSports();
  }

  async getCompetitions(sportId: SportId = 'football'): Promise<Competition[]> {
    return defaultMockProvider.getCompetitions(sportId);
  }

  async getMatchesByDate(date: string, sportId: SportId = 'football'): Promise<Match[]> {
    try {
      const res = await fetch(`/api/sports/matches?date=${date}&sport=${sportId}`);
      if (res.ok) {
        const matches = await res.json();
        if (Array.isArray(matches) && matches.length > 0) {
          return matches;
        }
      }
    } catch (e) {
      console.warn('Fallback to mock provider for matches:', e);
    }
    return defaultMockProvider.getMatchesByDate(date, sportId);
  }

  async getLiveMatches(sportId: SportId = 'football'): Promise<Match[]> {
    try {
      const res = await fetch(`/api/sports/live?sport=${sportId}`);
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) {
          return live;
        }
      }
    } catch (e) {
      console.warn('Fallback to mock provider for live matches:', e);
    }
    return defaultMockProvider.getLiveMatches(sportId);
  }

  async getMatchById(id: string): Promise<Match | null> {
    try {
      const res = await fetch(`/api/sports/match/${id}`);
      if (res.ok) {
        const match = await res.json();
        if (match && match.id) return match;
      }
    } catch (e) {
      console.warn('Fallback to mock provider for match detail:', e);
    }
    return defaultMockProvider.getMatchById(id);
  }

  async getStandings(competitionId: string): Promise<StandingRow[]> {
    try {
      const res = await fetch(`/api/sports/standings/${competitionId}`);
      if (res.ok) {
        const standings = await res.json();
        if (Array.isArray(standings) && standings.length > 0) return standings;
      }
    } catch (e) {
      console.warn('Fallback to mock provider for standings:', e);
    }
    return defaultMockProvider.getStandings(competitionId);
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    return defaultMockProvider.getTeamById(teamId);
  }

  async getTeamMatches(teamId: string): Promise<Match[]> {
    return defaultMockProvider.getTeamMatches(teamId);
  }

  async search(query: string): Promise<SearchResults> {
    return defaultMockProvider.search(query);
  }
}

export const defaultApiSportsProvider = new ApiSportsClientProvider();
