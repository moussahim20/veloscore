import React from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import type { Competition, StandingRow } from '../../types/sports';
import { AdSlot } from '../ads/AdSlot';
import { CountryFlag } from '../common/CountryFlag';

interface CompetitionViewProps {
  competition: Competition;
  standings: StandingRow[];
  onBack: () => void;
  onOpenTeam: (teamId: string) => void;
}

export const CompetitionView: React.FC<CompetitionViewProps> = ({
  competition,
  standings,
  onBack,
  onOpenTeam,
}) => {
  return (
    <div
      id={`competition-view-${competition.id}`}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-md overflow-hidden transition-colors mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/70">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </button>

        <span className="text-xs font-mono font-semibold text-slate-400">
          Season: {competition.season}
        </span>
      </div>

      {/* Competition Info Header */}
      <div className="px-4 py-6 sm:px-8 bg-linear-to-b from-slate-50 dark:from-slate-900/40 to-white dark:to-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center p-2 shadow-xs border border-slate-200 dark:border-slate-700">
          <CountryFlag
            countryName={competition.countryName}
            countryCode={competition.countryId}
            flagUrl={competition.countryFlag}
            className="w-10 h-7 object-cover shadow-xs"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <CountryFlag
              countryName={competition.countryName}
              countryCode={competition.countryId}
              flagUrl={competition.countryFlag}
              className="w-3.5 h-2.5 shadow-xs"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {competition.countryName}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {competition.name}
          </h1>
        </div>
      </div>

      {/* Standings Table */}
      <div className="p-4 sm:p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>League Table Standings</span>
          </h2>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <th className="py-2.5 px-2 w-8 text-center">#</th>
              <th className="py-2.5 px-2">Team</th>
              <th className="py-2.5 px-2 text-center">P</th>
              <th className="py-2.5 px-2 text-center">W</th>
              <th className="py-2.5 px-2 text-center">D</th>
              <th className="py-2.5 px-2 text-center">L</th>
              <th className="py-2.5 px-2 text-center hidden sm:table-cell">GF</th>
              <th className="py-2.5 px-2 text-center hidden sm:table-cell">GA</th>
              <th className="py-2.5 px-2 text-center">GD</th>
              <th className="py-2.5 px-2 text-center font-bold text-slate-900 dark:text-white">PTS</th>
              <th className="py-2.5 px-2 text-center hidden md:table-cell">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {standings.map((row) => {
              const isChampionsLeague = row.position <= 4;
              const isEuropa = row.position === 5;
              const isConference = row.position === 6;
              const isRelegation = row.position >= 18;

              return (
                <tr
                  key={row.position}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Position number with zone color indicator */}
                  <td className="py-2.5 px-2 text-center font-mono font-bold">
                    <span
                      className={`inline-block w-5 h-5 rounded-md leading-5 text-center text-[11px] ${
                        isChampionsLeague
                          ? 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 font-bold'
                          : isEuropa
                          ? 'bg-amber-500/10 text-amber-500 font-bold'
                          : isConference
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : isRelegation
                          ? 'bg-red-500/10 text-red-500 font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>

                  {/* Team Name & Logo */}
                  <td className="py-2.5 px-2">
                    <button
                      onClick={() => onOpenTeam(row.team.id)}
                      className="flex items-center gap-2 text-left font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-500 transition-colors truncate max-w-[160px] sm:max-w-none group"
                    >
                      <div className="w-5 h-5 shrink-0 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-0.5 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                        {row.team.logo ? (
                          <img
                            src={row.team.logo}
                            alt={row.team.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-[9px] font-mono text-slate-500">
                            {row.team.code?.substring(0, 2) || row.team.shortName.substring(0, 2)}
                          </span>
                        )}
                      </div>
                      <span className="truncate">{row.team.name}</span>
                    </button>
                  </td>

                  {/* Stats */}
                  <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">{row.played}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">{row.won}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">{row.drawn}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">{row.lost}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-400 hidden sm:table-cell">{row.goalsFor}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-400 hidden sm:table-cell">{row.goalsAgainst}</td>
                  <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                    {row.points}
                  </td>

                  {/* Form Pills */}
                  <td className="py-2.5 px-2 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.map((res, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center ${
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> UEFA Champions League
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> UEFA Europa League
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Relegation Zone
          </span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <AdSlot placement="competition_table_below" />
      </div>
    </div>
  );
};
