import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { ApiFootballService } from './src/services/apiFootballService';
import { defaultMockProvider } from './src/services/providers/MockSportsProvider';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 2. Provider Quota & Status
  app.get('/api/sports/status', async (_req, res) => {
    try {
      const status = await ApiFootballService.getQuotaStatus();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Matches by Date
  app.get('/api/sports/matches', async (req, res) => {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const sport = (req.query.sport as string) || 'football';

    try {
      if (process.env.SPORTS_PROVIDER === 'api-football' && process.env.SPORTS_API_KEY && sport === 'football') {
        const liveMatches = await ApiFootballService.getLiveMatches();
        const dateMatches = await ApiFootballService.getMatchesByDate(date);

        // Merge live + date matches
        const map = new Map<string, any>();
        liveMatches.forEach((m) => map.set(m.id, m));
        dateMatches.forEach((m) => {
          if (!map.has(m.id)) map.set(m.id, m);
        });

        const merged = Array.from(map.values());
        if (merged.length > 0) {
          return res.json(merged);
        }
      }

      // Fallback to high-quality mock data
      const mockMatches = await defaultMockProvider.getMatchesByDate(date, sport as any);
      res.json(mockMatches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      const mockMatches = await defaultMockProvider.getMatchesByDate(date, sport as any);
      res.json(mockMatches);
    }
  });

  // 4. Live Matches
  app.get('/api/sports/live', async (req, res) => {
    const sport = (req.query.sport as string) || 'football';
    try {
      if (process.env.SPORTS_PROVIDER === 'api-football' && process.env.SPORTS_API_KEY && sport === 'football') {
        const live = await ApiFootballService.getLiveMatches();
        if (live.length > 0) return res.json(live);
      }
      const mockLive = await defaultMockProvider.getLiveMatches(sport as any);
      res.json(mockLive);
    } catch (err) {
      const mockLive = await defaultMockProvider.getLiveMatches(sport as any);
      res.json(mockLive);
    }
  });

  // 5. Match Detail
  app.get('/api/sports/match/:id', async (req, res) => {
    const { id } = req.params;
    try {
      if (id.startsWith('af-') && process.env.SPORTS_API_KEY) {
        const match = await ApiFootballService.getMatchById(id);
        if (match) return res.json(match);
      }
      const match = await defaultMockProvider.getMatchById(id);
      if (match) return res.json(match);
      res.status(404).json({ error: 'Match not found' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Standings
  app.get('/api/sports/standings/:competitionId', async (req, res) => {
    const { competitionId } = req.params;
    try {
      if (competitionId.startsWith('af-comp-') && process.env.SPORTS_API_KEY) {
        const compIdNum = parseInt(competitionId.replace('af-comp-', '')) || 39;
        const standings = await ApiFootballService.getStandings(compIdNum);
        if (standings.length > 0) return res.json(standings);
      }
      const standings = await defaultMockProvider.getStandings(competitionId);
      res.json(standings);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VeloScore server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
