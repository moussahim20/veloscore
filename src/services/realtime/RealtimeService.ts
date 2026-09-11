import type { Match, RealtimeScoreDelta, MatchEvent } from '../../types/sports';
import { defaultMockProvider } from '../providers/MockSportsProvider';

type DeltaListener = (delta: RealtimeScoreDelta) => void;

class RealtimeService {
  private listeners: Set<DeltaListener> = new Set();
  private intervalId: any = null;
  private soundEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.startSimulation();
  }

  public subscribe(listener: DeltaListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public playGoalSound() {
    if (!this.soundEnabled || typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // First beep: 880Hz (A5)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Second beep: 1320Hz (E6) harmonic goal ping
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, now + 0.15);
      gain2.gain.setValueAtTime(0.3, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  private broadcast(delta: RealtimeScoreDelta) {
    if (delta.type === 'score_update') {
      this.playGoalSound();
    }
    this.listeners.forEach((listener) => {
      try {
        listener(delta);
      } catch (err) {
        console.error('Realtime listener error:', err);
      }
    });
  }

  private startSimulation() {
    if (typeof window === 'undefined') return;

    let tickCounter = 0;

    this.intervalId = setInterval(async () => {
      tickCounter++;
      const liveMatches = await defaultMockProvider.getLiveMatches('football');
      if (!liveMatches.length) return;

      // Select one match to advance or update
      const targetMatch = liveMatches[tickCounter % liveMatches.length];
      if (!targetMatch || targetMatch.status !== 'LIVE') return;

      const newMinute = Math.min(90, (targetMatch.minute || 60) + 1);

      // Every 6 ticks, simulate a goal or card event
      if (tickCounter % 6 === 0) {
        const isArsenalGame = targetMatch.id === 'm-ars-liv-1';
        const scoringTeam = isArsenalGame ? 'arsenal' : 'realmadrid';
        const isHome = scoringTeam === targetMatch.homeTeam.id;

        const newHomeScore = isHome
          ? targetMatch.score.current.home + 1
          : targetMatch.score.current.home;
        const newAwayScore = !isHome
          ? targetMatch.score.current.away + 1
          : targetMatch.score.current.away;

        const newEvent: MatchEvent = {
          id: `live-ev-${Date.now()}`,
          matchId: targetMatch.id,
          minute: newMinute,
          type: 'GOAL',
          teamId: scoringTeam,
          playerName: isArsenalGame ? 'Kai Havertz' : 'Jude Bellingham',
          assistName: isArsenalGame ? 'Bukayo Saka' : 'Vinicius Jr',
          detail: 'Thunderous finish into the bottom corner!',
        };

        const updatedEvents = [...(targetMatch.events || []), newEvent];

        defaultMockProvider.updateMatch({
          id: targetMatch.id,
          minute: newMinute,
          score: {
            ...targetMatch.score,
            current: { home: newHomeScore, away: newAwayScore },
          },
          events: updatedEvents,
        });

        this.broadcast({
          type: 'score_update',
          matchId: targetMatch.id,
          score: {
            ...targetMatch.score,
            current: { home: newHomeScore, away: newAwayScore },
          },
          minute: newMinute,
          event: newEvent,
          hasJustScored: isHome ? 'home' : 'away',
        });
      } else {
        // Just minute tick
        defaultMockProvider.updateMatch({
          id: targetMatch.id,
          minute: newMinute,
        });

        this.broadcast({
          type: 'minute_tick',
          matchId: targetMatch.id,
          minute: newMinute,
        });
      }
    }, 12000); // Ticks every 12 seconds
  }

  public destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService();
