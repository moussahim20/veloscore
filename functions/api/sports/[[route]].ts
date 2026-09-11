// Cloudflare Pages Functions adapter for /api/sports/*
interface Env {
  SPORTS_API_KEY?: string;
  DB?: any;
}

export const onRequest = async (context: any) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const apiKey = env.SPORTS_API_KEY || 'ed24a8e631b79420a782b0879f5728bc';

  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=30, s-maxage=60',
  };

  try {
    if (path.includes('/status')) {
      return new Response(
        JSON.stringify({
          configured: true,
          provider: 'api-football',
          plan: 'Free',
          edge: 'Cloudflare Pages / Workers',
        }),
        { headers: jsonHeaders }
      );
    }

    if (path.includes('/live')) {
      const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        headers: { 'x-apisports-key': apiKey },
      });
      const data = await res.json();
      const list = (data.response || []).map(normalizeCloudflareFixture);
      return new Response(JSON.stringify(list), { headers: jsonHeaders });
    }

    if (path.includes('/matches')) {
      const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
      const res = await fetch(`https://v3.football.api-sports.io/fixtures?date=${date}`, {
        headers: { 'x-apisports-key': apiKey },
      });
      const data = await res.json();
      const list = (data.response || []).map(normalizeCloudflareFixture);
      return new Response(JSON.stringify(list), { headers: jsonHeaders });
    }

    if (path.includes('/standings')) {
      const segments = path.split('/');
      const compId = segments[segments.length - 1] || '39';
      const leagueId = parseInt(compId) || 39;
      const res = await fetch(`https://v3.football.api-sports.io/standings?league=${leagueId}&season=2026`, {
        headers: { 'x-apisports-key': apiKey },
      });
      const data = await res.json();
      const raw = data.response?.[0]?.league?.standings?.[0] || [];
      const standings = raw.map((r: any) => ({
        position: r.rank,
        team: {
          id: `af-team-${r.team.id}`,
          name: r.team.name,
          shortName: r.team.name.split(' ')[0],
          code: r.team.name.substring(0, 3).toUpperCase(),
          logo: r.team.logo,
        },
        played: r.all.played,
        won: r.all.win,
        drawn: r.all.draw,
        lost: r.all.lose,
        goalsFor: r.all.goals.for,
        goalsAgainst: r.all.goals.against,
        goalDifference: r.goalsDiff,
        points: r.points,
        form: (r.form || 'WDLWD').split(''),
      }));
      return new Response(JSON.stringify(standings), { headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ status: 'ok', service: 'veloscore-edge-api' }), {
      headers: jsonHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Edge proxy error' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};

function normalizeCloudflareFixture(item: any) {
  const f = item.fixture;
  const l = item.league;
  const t = item.teams;
  const g = item.goals;
  const s = item.score;

  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(f.status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(f.status.short);

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
      countryFlag: l.flag || (l.country ? `https://flagcdn.com/w40/${l.country.toLowerCase().substring(0, 2)}.png` : 'https://flagcdn.com/w40/un.png'),
      season: `${l.season || 2026}`,
      isTopLeague: [39, 140, 135, 78, 61, 2].includes(l.id),
    },
    country: {
      id: l.country ? l.country.substring(0, 3).toUpperCase() : 'INT',
      name: l.country || 'International',
      code: l.country ? l.country.substring(0, 3).toUpperCase() : 'INT',
      flag: l.flag || (l.country ? `https://flagcdn.com/w40/${l.country.toLowerCase().substring(0, 2)}.png` : 'https://flagcdn.com/w40/un.png'),
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
  };
}
