import React from 'react';
import { ArrowLeft, MapPin, Users, Calendar, Award } from 'lucide-react';
import type { Team, Match } from '../../types/sports';
import { MatchRow } from '../scoreboard/MatchRow';
import { AdSlot } from '../ads/AdSlot';
import { CountryFlag } from '../common/CountryFlag';

interface TeamViewProps {
  team: Team;
  matches: Match[];
  favoriteMatches: string[];
  onToggleFavorite: (id: string) => void;
  onSelectMatch: (match: Match) => void;
  onBack: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  team,
  matches,
  favoriteMatches,
  onToggleFavorite,
  onSelectMatch,
  onBack,
}) => {
  return (
    <div
      id={`team-view-${team.id}`}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-md overflow-hidden transition-colors mb-8"
    >
      {/* Back bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/70">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          {team.countryName}
        </span>
      </div>

      {/* Team Header */}
      <div className="px-4 py-6 sm:px-8 bg-linear-to-b from-slate-50 dark:from-slate-900/40 to-white dark:to-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs p-2 overflow-hidden">
          {team.logo ? (
            <img
              src={team.logo}
              alt={team.name}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
                const fallback = (e.currentTarget as HTMLElement).nextElementSibling;
                if (fallback) (fallback as HTMLElement).style.display = 'block';
              }}
            />
          ) : null}
          <span className={team.logo ? 'hidden' : 'block'}>
            {team.code || team.shortName.substring(0, 3)}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {team.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              {team.code}
            </span>
          </div>

          {/* Meta Details */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
            {team.countryName && (
              <span className="flex items-center gap-1.5 font-medium">
                <CountryFlag
                  countryName={team.countryName}
                  countryCode={team.countryId}
                  className="w-4 h-3 shadow-2xs"
                />
                <span>{team.countryName}</span>
              </span>
            )}
            {team.stadium && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {team.stadium} ({team.stadiumCapacity?.toLocaleString()} cap.)
              </span>
            )}
            {team.manager && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Manager: {team.manager}
              </span>
            )}
            {team.founded && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Founded: {team.founded}
              </span>
            )}
          </div>

          {/* Form Pills */}
          {team.form && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-semibold text-slate-500">Recent Form:</span>
              <div className="flex items-center gap-1">
                {team.form.map((res, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${
                      res === 'W'
                        ? 'bg-emerald-500'
                        : res === 'D'
                        ? 'bg-slate-400'
                        : 'bg-red-500'
                    }`}
                  >
                    {res}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-500" />
          <span>Matches & Fixtures</span>
        </h2>

        {matches.length > 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
            {matches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                isFavorite={favoriteMatches.includes(match.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectMatch={onSelectMatch}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">No recent matches recorded.</p>
        )}
      </div>

      <div className="px-4 pb-4">
        <AdSlot placement="team_page_mid" />
      </div>
    </div>
  );
};
