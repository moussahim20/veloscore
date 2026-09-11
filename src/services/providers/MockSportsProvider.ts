import type { SportsProvider, SearchResults } from './SportsProvider';
import type {
  Sport,
  SportId,
  Competition,
  Team,
  Match,
  StandingRow,
} from '../../types/sports';
import {
  mockSports,
  mockCompetitions,
  mockTeams,
  mockMatches,
  mockPremierLeagueStandings,
  mockLaLigaStandings,
} from '../../data/mockSportsData';

export class MockSportsProvider implements SportsProvider {
  public readonly providerName = 'mock';

  private matches: Match[] = [...mockMatches];

  constructor() {
    // Dynamic copy so live ticks/events can be simulated
  }

  async getSports(): Promise<Sport[]> {
    return mockSports;
  }

  async getCompetitions(sportId: SportId = 'football'): Promise<Competition[]> {
    return mockCompetitions.filter((c) => c.sportId === sportId);
  }

  async getMatchesByDate(date: string, sportId: SportId = 'football'): Promise<Match[]> {
    return this.matches.filter((m) => m.sportId === sportId && (m.date === date || m.isLive));
  }

  async getLiveMatches(sportId: SportId = 'football'): Promise<Match[]> {
    return this.matches.filter((m) => m.isLive && m.sportId === sportId);
  }

  async getMatchById(id: string): Promise<Match | null> {
    const match = this.matches.find((m) => m.id === id || m.slug === id);
    return match || null;
  }

  async getStandings(competitionId: string): Promise<StandingRow[]> {
    if (competitionId.includes('la-liga')) {
      return mockLaLigaStandings;
    }
    return mockPremierLeagueStandings;
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    return mockTeams[teamId] || null;
  }

  async getTeamMatches(teamId: string): Promise<Match[]> {
    return this.matches.filter(
      (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
    );
  }

  async search(query: string): Promise<SearchResults> {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { teams: [], competitions: [], matches: [] };
    }

    const matchedTeams = Object.values(mockTeams).filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q)
    );

    const matchedCompetitions = mockCompetitions.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.countryName.toLowerCase().includes(q)
    );

    const matchedMatches = this.matches.filter(
      (m) =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.competition.name.toLowerCase().includes(q)
    );

    return {
      teams: matchedTeams,
      competitions: matchedCompetitions,
      matches: matchedMatches,
    };
  }

  /**
   * Helper for realtime simulations: update a match state
   */
  updateMatch(updated: Partial<Match> & { id: string }): Match | null {
    const index = this.matches.findIndex((m) => m.id === updated.id);
    if (index === -1) return null;
    this.matches[index] = { ...this.matches[index], ...updated };
    return this.matches[index];
  }
}

export const defaultMockProvider = new MockSportsProvider();
