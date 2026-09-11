import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Star,
  Activity,
  BarChart2,
  Users,
  Trophy,
  History,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import type { Match, MatchEvent, TeamLineup } from '../../types/sports';
import { AdSlot } from '../ads/AdSlot';

interface MatchDetailViewProps {
  match: Match;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenTeam: (teamId: string) => void;
  onOpenCompetition: (compId: string) => void;
}

type TabType = 'timeline' | 'stats' | 'lineups' | 'h2h';

export const MatchDetailView: React.FC<MatchDetailViewProps> = ({
  match,
  onBack,
  isFavorite,
  onToggleFavorite,
  onOpenTeam,
  onOpenCompetition,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('timeline');

  const isLive = match.status === 'LIVE';
  const isHT = match.status === 'HT';
  const isFT = match.status === 'FT';

  // JSON-LD SportsEvent Schema for SEO / AEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    startDate: `${match.date}T${match.startTime}:00Z`,
    eventStatus: isLive
      ? 'https://schema.org/EventLive'
      : isFT
      ? 'https://schema.org/EventPostponed'
      : 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: match.venue || 'Stadium',
      address: match.country.name,
    },
    competitor: [
      { '@type': 'SportsTeam', name: match.homeTeam.name },
      { '@type': 'SportsTeam', name: match.awayTeam.name },
    ],
  };

  return (
    <article
      id="match-detail-view"
      className="w-full max-w-4xl mx-auto bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-md overflow-hidden transition-colors mb-8"
    >
      {/* Invisible Schema script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Breadcrumb Navigation & Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/70">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
          aria-label="Return to live scores list"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCompetition(match.competition.id)}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline-offset-2 hover:underline truncate max-w-[200px]"
          >
            {match.competition.name}
          </button>
          <button
            onClick={() => onToggleFavorite(match.id)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition-colors"
            aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-amber-500 text-amber-500' : 'stroke-current'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Scoreboard Header */}
      <div className="px-4 py-6 sm:px-8 sm:py-8 bg-linear-to-b from-slate-50 dark:from-slate-900/40 to-white dark:to-[#0f172a] border-b border-slate-200 dark:border-slate-800/80">
        {/* Match Meta (Date, Venue, Referee) */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {match.date} • {match.startTime}
          </span>
          {match.venue && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {match.venue}
            </span>
          )}
          {match.referee && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {match.referee}
            </span>
          )}
        </div>

        {/* Big Teams & Score Section */}
        <div className="grid grid-cols-3 items-center gap-2 sm:gap-6">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center">
            <button
              onClick={() => onOpenTeam(match.homeTeam.id)}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-slate-200 group-hover:scale-105 group-hover:border-emerald-500 transition-all shadow-xs mb-2">
                {match.homeTeam.code?.substring(0, 3) || match.homeTeam.shortName.substring(0, 2)}
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                {match.homeTeam.name}
              </h1>
            </button>
            {match.redCards?.home ? (
              <span className="mt-1 text-[11px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                {match.redCards.home} Red Card
              </span>
            ) : null}
          </div>

          {/* Center Score & Match Status */}
          <div className="flex flex-col items-center text-center">
            {/* Status Pill */}
            <div className="mb-2">
              {isLive ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 font-extrabold text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-live-dot" />
                  <span>{match.minute}' LIVE</span>
                </div>
              ) : isHT ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-xs">
                  HALF TIME
                </span>
              ) : isFT ? (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                  FULL TIME
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  SCHEDULED
                </span>
              )}
            </div>

            {/* Score Digits */}
            <div className="flex items-center justify-center gap-3 font-mono tabular-nums text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
              <span>{isLive || isFT || isHT ? match.score.current.home : '-'}</span>
              <span className="text-slate-300 dark:text-slate-700 font-light">:</span>
              <span>{isLive || isFT || isHT ? match.score.current.away : '-'}</span>
            </div>

            {/* Halftime Detail */}
            {match.score.halftime && (isFT || isLive) && (
              <span className="mt-2 text-xs font-mono text-slate-400">
                HT: {match.score.halftime.home} - {match.score.halftime.away}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center">
            <button
              onClick={() => onOpenTeam(match.awayTeam.id)}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-slate-200 group-hover:scale-105 group-hover:border-emerald-500 transition-all shadow-xs mb-2">
                {match.awayTeam.code?.substring(0, 3) || match.awayTeam.shortName.substring(0, 2)}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                {match.awayTeam.name}
              </h2>
            </button>
            {match.redCards?.away ? (
              <span className="mt-1 text-[11px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                {match.redCards.away} Red Card
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* CLS-safe non-intrusive ad slot */}
      <div className="px-4">
        <AdSlot placement="match_header_below" />
      </div>

      {/* Tab Controls */}
      <div className="px-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timeline ({match.events?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'stats'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Match Statistics</span>
        </button>

        <button
          onClick={() => setActiveTab('lineups')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'lineups'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Lineups & Pitch</span>
        </button>

        <button
          onClick={() => setActiveTab('h2h')}
          className={`flex items-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'h2h'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Head-to-Head</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-6 min-h-[300px]">
        {/* 1. TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="max-w-2xl mx-auto">
            {(!match.events || match.events.length === 0) ? (
              <div className="text-center py-10 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No events recorded yet</p>
                <p className="text-xs text-slate-500">Live events will appear as the game unfolds.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-4">
                {match.events.map((event) => {
                  const isHome = event.teamId === match.homeTeam.id;
                  const isGoal = event.type === 'GOAL' || event.type === 'PENALTY_GOAL';
                  const isRedCard = event.type === 'RED_CARD' || event.type === 'SECOND_YELLOW';
                  const isYellow = event.type === 'YELLOW_CARD';
                  const isSub = event.type === 'SUBSTITUTION';
                  const isVar = event.type === 'VAR_DECISION';

                  return (
                    <div key={event.id} className="relative flex items-start gap-3 group">
                      {/* Event Icon Pin */}
                      <div
                        className={`absolute -left-[27px] sm:-left-[35px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white dark:ring-[#0f172a] shadow-xs ${
                          isGoal
                            ? 'bg-emerald-500 text-white'
                            : isRedCard
                            ? 'bg-red-500 text-white'
                            : isYellow
                            ? 'bg-amber-400 text-slate-950'
                            : isVar
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isGoal ? '⚽' : isRedCard ? '🟥' : isYellow ? '🟨' : isSub ? '🔄' : 'VAR'}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
                        <div className="flex flex-col min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {event.playerName}
                            </span>
                            <span className="text-[11px] px-1.5 py-0.2 rounded font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {isHome ? match.homeTeam.shortName : match.awayTeam.shortName}
                            </span>
                          </div>

                          {event.assistName && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Assist: {event.assistName}
                            </span>
                          )}
                          {event.playerIn && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                              ▲ IN: {event.playerIn} • ▼ OUT: {event.playerOut}
                            </span>
                          )}
                          {event.detail && (
                            <span className="text-[11px] text-slate-400 italic mt-0.5">
                              {event.detail}
                            </span>
                          )}
                        </div>

                        {/* Minute indicator */}
                        <div className="shrink-0 font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                          {event.minute}'
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. MATCH STATISTICS TAB */}
        {activeTab === 'stats' && (
          <div className="max-w-xl mx-auto space-y-4">
            {match.stats ? (
              <>
                <StatBar
                  label="Ball Possession"
                  home={match.stats.possession[0]}
                  away={match.stats.possession[1]}
                  suffix="%"
                />
                <StatBar
                  label="Expected Goals (xG)"
                  home={match.stats.expectedGoals[0]}
                  away={match.stats.expectedGoals[1]}
                />
                <StatBar
                  label="Total Shots"
                  home={match.stats.totalShots[0]}
                  away={match.stats.totalShots[1]}
                />
                <StatBar
                  label="Shots on Target"
                  home={match.stats.shotsOnTarget[0]}
                  away={match.stats.shotsOnTarget[1]}
                />
                <StatBar
                  label="Big Chances Created"
                  home={match.stats.bigChances[0]}
                  away={match.stats.bigChances[1]}
                />
                <StatBar
                  label="Corner Kicks"
                  home={match.stats.cornerKicks[0]}
                  away={match.stats.cornerKicks[1]}
                />
                <StatBar
                  label="Fouls"
                  home={match.stats.fouls[0]}
                  away={match.stats.fouls[1]}
                />
                <StatBar
                  label="Yellow Cards"
                  home={match.stats.yellowCards[0]}
                  away={match.stats.yellowCards[1]}
                />
                <StatBar
                  label="Goalkeeper Saves"
                  home={match.stats.goalkeeperSaves[0]}
                  away={match.stats.goalkeeperSaves[1]}
                />
              </>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Statistics not available yet</p>
              </div>
            )}
          </div>
        )}

        {/* 3. LINEUPS & PITCH TAB */}
        {activeTab === 'lineups' && (
          <div className="max-w-3xl mx-auto">
            {match.lineups ? (
              <div className="space-y-6">
                {/* Formations overview */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-semibold">
                  <div>
                    <span className="text-slate-500">{match.homeTeam.name}: </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{match.lineups.home.formation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{match.awayTeam.name}: </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{match.lineups.away.formation}</span>
                  </div>
                </div>

                {/* Tactical Pitch Visualizer */}
                <div
                  id="tactical-pitch-container"
                  className="relative w-full h-[420px] rounded-2xl bg-linear-to-b from-emerald-800 to-emerald-900 border-4 border-emerald-950/40 overflow-hidden shadow-inner flex flex-col justify-between p-4 select-none"
                >
                  {/* Pitch Markings */}
                  <div className="absolute inset-x-8 top-0 h-20 border-b-2 border-x-2 border-white/25 rounded-b-xl pointer-events-none" />
                  <div className="absolute inset-x-8 bottom-0 h-20 border-t-2 border-x-2 border-white/25 rounded-t-xl pointer-events-none" />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/25 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/25 pointer-events-none" />

                  {/* Home Team Players (Top half) */}
                  <div className="relative w-full h-1/2">
                    {match.lineups.home.starters.map((player) => (
                      <div
                        key={player.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
                        style={{ left: `${player.x || 50}%`, top: `${player.y || 50}%` }}
                        title={`${player.name} (${player.position}) - Rating ${player.rating}`}
                      >
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold flex items-center justify-center border-2 border-emerald-400 shadow-md group-hover:scale-110 transition-transform">
                          {player.number}
                        </div>
                        <span className="text-[10px] font-semibold text-white bg-slate-950/80 px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap shadow-xs">
                          {player.name.split(' ').pop()} {player.isCaptain ? '(C)' : ''}
                        </span>
                        {player.rating && (
                          <span className="text-[9px] font-bold text-amber-300 font-mono">
                            ★ {player.rating}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Away Team Players (Bottom half) */}
                  <div className="relative w-full h-1/2">
                    {match.lineups.away.starters.map((player) => (
                      <div
                        key={player.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
                        style={{ left: `${player.x || 50}%`, bottom: `${player.y || 50}%` }}
                        title={`${player.name} (${player.position}) - Rating ${player.rating}`}
                      >
                        <div className="w-7 h-7 rounded-full bg-white text-slate-900 font-mono text-[11px] font-bold flex items-center justify-center border-2 border-red-500 shadow-md group-hover:scale-110 transition-transform">
                          {player.number}
                        </div>
                        <span className="text-[10px] font-semibold text-white bg-slate-950/80 px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap shadow-xs">
                          {player.name.split(' ').pop()} {player.isCaptain ? '(C)' : ''}
                        </span>
                        {player.rating && (
                          <span className="text-[9px] font-bold text-amber-300 font-mono">
                            ★ {player.rating}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes Bench Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {match.homeTeam.name} Substitutes
                    </h4>
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {match.lineups.home.substitutes.map((sub) => (
                        <li key={sub.id} className="py-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-slate-400 w-5">{sub.number}</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{sub.name}</span>
                          </span>
                          <span className="text-[11px] text-slate-400">{sub.position}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {match.awayTeam.name} Substitutes
                    </h4>
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {match.lineups.away.substitutes.map((sub) => (
                        <li key={sub.id} className="py-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-slate-400 w-5">{sub.number}</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{sub.name}</span>
                          </span>
                          <span className="text-[11px] text-slate-400">{sub.position}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Official lineups not confirmed yet</p>
                <p className="text-xs text-slate-500">Usually announced 60 minutes before kickoff.</p>
              </div>
            )}
          </div>
        )}

        {/* 4. HEAD TO HEAD TAB */}
        {activeTab === 'h2h' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {match.h2h ? (
              <>
                {/* Win/Loss summary card */}
                <div className="grid grid-cols-3 gap-3 text-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="block text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {match.h2h.homeWins}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      {match.homeTeam.shortName} Wins
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black font-mono text-slate-500">
                      {match.h2h.draws}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      Draws
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {match.h2h.awayWins}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      {match.awayTeam.shortName} Wins
                    </span>
                  </div>
                </div>

                {/* Past Meetings List */}
                <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-500">
                    Recent Meetings
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {match.h2h.recentMeetings.map((m) => (
                      <div key={m.id} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-400">{m.date} • {m.competitionName}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {m.homeTeamName} vs {m.awayTeamName}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {m.homeScore} - {m.awayScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Head-to-head records not available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

// Reusable Stat Comparison Bar
interface StatBarProps {
  label: string;
  home: number;
  away: number;
  suffix?: string;
}

const StatBar: React.FC<StatBarProps> = ({ label, home, away, suffix = '' }) => {
  const total = home + away || 1;
  const homePercent = Math.round((home / total) * 100);
  const awayPercent = 100 - homePercent;

  return (
    <div className="flex flex-col gap-1.5 py-1">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="font-mono text-slate-900 dark:text-white">
          {home}{suffix}
        </span>
        <span className="text-slate-500 font-medium text-[11px] uppercase tracking-wider">
          {label}
        </span>
        <span className="font-mono text-slate-900 dark:text-white">
          {away}{suffix}
        </span>
      </div>
      <div className="flex h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="bg-emerald-500 transition-all duration-500"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="bg-slate-400 dark:bg-slate-600 transition-all duration-500"
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
};
