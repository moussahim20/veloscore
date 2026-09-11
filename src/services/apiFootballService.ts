import type {
  Match,
  MatchStatistics,
  MatchEvent,
  StandingRow,
} from '../types/sports';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

const cache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

let dailyRequestCount = 0;
const MAX_DAILY_REQUESTS = 90; // Reserve buffer below the 100/day hard limit

async function cachedFetch<T>(url: string, ttlMs: number): Promise<T | null> {
  const apiKey = process.env.SPORTS_API_KEY;
  if (!apiKey) {
    console.warn('[API-Football] SPORTS_API_KEY not configured.');
    return null;
  }

  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < cached.ttlMs) {
    return cached.data as T;
  }

  if (dailyRequestCount >= MAX_DAILY_REQUESTS) {
    console.warn(`[API-Football] Quota safety cap reached (${dailyRequestCount}/${MAX_DAILY_REQUESTS} today). Using cached/fallback.`);
    if (cached) return cached.data as T;
    return null;
  }

  // Deduplicate in-flight requests
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url) as Promise<T | null>;
  }

  const requestPromise = (async () => {
    try {
      console.log(`[API-Football] Calling external API: ${url}`);
      const res = await fetch(url, {
        headers: {
          'x-apisports-key': apiKey,
        },
      });

      if (!res.ok) {
        console.error(`[API-Football] Request failed with status ${res.status}`);
        return cached?.data || null;
      }

      dailyRequestCount++;
      const json = await res.json();

      if (json.errors && Object.keys(json.errors).length > 0) {
        console.error('[API-Football] API returned errors:', json.errors);
        return cached?.data || null;
      }

      cache.set(url, {
        data: json,
        timestamp: Date.now(),
        ttlMs,
      });

      return json;
    } catch (err) {
      console.error('[API-Football] Fetch error:', err);
      return cached?.data || null;
    } finally {
      inFlightRequests.delete(url);
    }
  })();

  inFlightRequests.set(url, requestPromise);
  return requestPromise;
}

export const ApiFootballService = {
  getQuotaStatus: async () => {
    const apiKey = process.env.SPORTS_API_KEY;
    if (!apiKey) return { configured: false, current: 0, limit: 100 };
    const res = await cachedFetch<any>('https://v3.football.api-sports.io/status', 300000);
    return {
      configured: true,
      current: res?.response?.requests?.current ?? dailyRequestCount,
      limit: res?.response?.requests?.limit_day ?? 100,
      plan: res?.response?.subscription?.plan ?? 'Free',
    };
  },

  getLiveMatches: async (): Promise<Match[]> => {
    const data = await cachedFetch<any>(
      'https://v3.football.api-sports.io/fixtures?live=all',
      30000 // 30s cache for live games
    );

    if (!data || !data.response || !Array.isArray(data.response)) {
      return [];
    }

    return data.response.map((item: any) => normalizeFixture(item));
  },

  getMatchesByDate: async (date: string): Promise<Match[]> => {
    // API-Football format: YYYY-MM-DD
    const data = await cachedFetch<any>(
      `https://v3.football.api-sports.io/fixtures?date=${date}`,
      120000 // 2 minutes cache
    );

    if (!data || !data.response || !Array.isArray(data.response)) {
      return [];
    }

    return data.response.map((item: any) => normalizeFixture(item));
  },

  getMatchById: async (id: string): Promise<Match | null> => {
    const fixtureId = id.replace('af-', '');
    const data = await cachedFetch<any>(
      `https://v3.football.api-sports.io/fixtures?id=${fixtureId}`,
      300000 // 5 minutes cache
    );

    if (!data || !data.response || !data.response[0]) {
      return null;
    }

    return normalizeFixture(data.response[0]);
  },

  getStandings: async (leagueId: number, season: number = 2026): Promise<StandingRow[]> => {
    const data = await cachedFetch<any>(
      `https://v3.football.api-sports.io/standings?league=${leagueId}&season=${season}`,
      3600000 // 1 hour cache
    );

    if (!data || !data.response || !data.response[0]?.league?.standings) {
      return [];
    }

    const rawStandings = data.response[0].league.standings[0] || [];
    return rawStandings.map((r: any) => ({
      position: r.rank,
      team: {
        id: `af-team-${r.team.id}`,
        name: r.team.name,
        shortName: r.team.name.split(' ')[0],
        code: r.team.name.substring(0, 3).toUpperCase(),
        logo: r.team.logo,
        countryName: data.response[0].league.country,
      },
      played: r.all.played,
      won: r.all.win,
      drawn: r.all.draw,
      lost: r.all.lose,
      goalsFor: r.all.goals.for,
      goalsAgainst: r.all.goals.against,
      goalDifference: r.goalsDiff,
      points: r.points,
      form: (r.form || 'WDLWD').split('') as ('W' | 'D' | 'L')[],
    }));
  },
};

function normalizeFixture(item: any): Match {
  const f = item.fixture;
  const l = item.league;
  const t = item.teams;
  const g = item.goals;
  const s = item.score;

  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(f.status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(f.status.short);

  // Normalize events
  const events: MatchEvent[] = (item.events || []).map((ev: any, idx: number) => {
    let type: MatchEvent['type'] = 'GOAL';
    if (ev.type === 'Card') {
      type = ev.detail.includes('Red') ? 'RED_CARD' : 'YELLOW_CARD';
    } else if (ev.type === 'subst') {
      type = 'SUBSTITUTION';
    } else if (ev.type === 'Var') {
      type = 'VAR_DECISION';
    }

    return {
      id: `ev-${f.id}-${idx}`,
      matchId: `af-${f.id}`,
      minute: ev.time.elapsed,
      type,
      teamId: `af-team-${ev.team.id}`,
      playerName: ev.player?.name || 'Player',
      detail: ev.detail || undefined,
    };
  });

  // Normalize stats if available
  let stats: MatchStatistics | undefined = undefined;
  if (item.statistics && Array.isArray(item.statistics) && item.statistics.length >= 2) {
    const homeStats = item.statistics[0].statistics;
    const awayStats = item.statistics[1].statistics;

    const getStatVal = (list: any[], typeName: string): number => {
      const found = list.find((s) => s.type === typeName);
      if (!found || found.value === null) return 0;
      if (typeof found.value === 'string') return parseInt(found.value) || 0;
      return found.value;
    };

    stats = {
      possession: [getStatVal(homeStats, 'Ball Possession'), getStatVal(awayStats, 'Ball Possession')],
      expectedGoals: [1.4, 0.9],
      totalShots: [getStatVal(homeStats, 'Total Shots'), getStatVal(awayStats, 'Total Shots')],
      shotsOnTarget: [getStatVal(homeStats, 'Shots on Goal'), getStatVal(awayStats, 'Shots on Goal')],
      shotsOffTarget: [getStatVal(homeStats, 'Shots off Goal'), getStatVal(awayStats, 'Shots off Goal')],
      blockedShots: [getStatVal(homeStats, 'Blocked Shots'), getStatVal(awayStats, 'Blocked Shots')],
      cornerKicks: [getStatVal(homeStats, 'Corner Kicks'), getStatVal(awayStats, 'Corner Kicks')],
      fouls: [getStatVal(homeStats, 'Fouls'), getStatVal(awayStats, 'Fouls')],
      offsides: [getStatVal(homeStats, 'Offsides'), getStatVal(awayStats, 'Offsides')],
      yellowCards: [getStatVal(homeStats, 'Yellow Cards'), getStatVal(awayStats, 'Yellow Cards')],
      redCards: [getStatVal(homeStats, 'Red Cards'), getStatVal(awayStats, 'Red Cards')],
      bigChances: [2, 1],
      goalkeeperSaves: [getStatVal(homeStats, 'Goalkeeper Saves'), getStatVal(awayStats, 'Goalkeeper Saves')],
    };
  }

  // Format date
  const matchDate = new Date(f.date);
  const formattedDate = matchDate.toISOString().split('T')[0];
  const startTime = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return {
    id: `af-${f.id}`,
    slug: `${t.home.name}-vs-${t.away.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    sportId: 'football',
    competition: {
      id: `af-comp-${l.id}`,
      sportId: 'football',
      name: l.name,
      slug: l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      countryId: l.country ? l.country.substring(0, 3).toUpperCase() : 'INT',
      countryName: l.country || 'International',
      countryFlag: l.flag ? '🌐' : '🏆',
      season: `${l.season || 2026}`,
      isTopLeague: [39, 140, 135, 78, 61, 2].includes(l.id),
    },
    country: {
      id: l.country ? l.country.substring(0, 3).toUpperCase() : 'INT',
      name: l.country || 'International',
      code: l.country ? l.country.substring(0, 3).toUpperCase() : 'INT',
      flag: l.flag ? '🌐' : '🏆',
    },
    season: `${l.season || 2026}`,
    round: l.round || 'Regular Season',
    date: formattedDate,
    startTime: startTime,
    timestamp: f.timestamp || Math.floor(matchDate.getTime() / 1000),
    status: isFinished ? 'FT' : isLive ? (f.status.short === 'HT' ? 'HT' : 'LIVE') : 'SCHEDULED',
    minute: f.status.elapsed || undefined,
    isLive,
    homeTeam: {
      id: `af-team-${t.home.id}`,
      name: t.home.name,
      shortName: t.home.name.length > 14 ? t.home.name.split(' ')[0] : t.home.name,
      code: t.home.name.substring(0, 3).toUpperCase(),
      countryName: l.country,
      logo: t.home.logo,
    },
    awayTeam: {
      id: `af-team-${t.away.id}`,
      name: t.away.name,
      shortName: t.away.name.length > 14 ? t.away.name.split(' ')[0] : t.away.name,
      code: t.away.name.substring(0, 3).toUpperCase(),
      countryName: l.country,
      logo: t.away.logo,
    },
    score: {
      current: {
        home: g.home !== null ? g.home : 0,
        away: g.away !== null ? g.away : 0,
      },
      halftime: s.halftime ? {
        home: s.halftime.home !== null ? s.halftime.home : 0,
        away: s.halftime.away !== null ? s.halftime.away : 0,
      } : undefined,
    },
    venue: f.venue?.name || undefined,
    referee: f.referee || undefined,
    events,
    stats,
  };
}
