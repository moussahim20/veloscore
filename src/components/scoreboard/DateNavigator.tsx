import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Radio } from 'lucide-react';

export type MatchFilterTab = 'ALL' | 'LIVE' | 'FINISHED' | 'SCHEDULED';

interface DateNavigatorProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  activeFilter: MatchFilterTab;
  onChangeFilter: (tab: MatchFilterTab) => void;
  liveCount: number;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onSelectDate,
  activeFilter,
  onChangeFilter,
  liveCount,
}) => {
  // Format today's date in YYYY-MM-DD
  const todayStr = '2026-09-11';
  const yesterdayStr = '2026-09-10';
  const tomorrowStr = '2026-09-12';

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === todayStr;

  return (
    <div
      id="date-filter-navigator"
      className="w-full bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800/80 p-2 sm:p-2.5 shadow-xs mb-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 transition-colors"
    >
      {/* Date Controls */}
      <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
        <button
          onClick={handlePrevDay}
          aria-label="Previous day"
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectDate(yesterdayStr)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              selectedDate === yesterdayStr
                ? 'bg-slate-800 dark:bg-slate-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Yesterday
          </button>

          <button
            onClick={() => onSelectDate(todayStr)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
              isToday
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Today</span>
            {isToday && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>

          <button
            onClick={() => onSelectDate(tomorrowStr)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              selectedDate === tomorrowStr
                ? 'bg-slate-800 dark:bg-slate-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Tomorrow
          </button>
        </div>

        <button
          onClick={handleNextDay}
          aria-label="Next day"
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Date picker input */}
        <div className="relative ml-1 flex items-center">
          <label htmlFor="custom-date-picker" className="sr-only">
            Select specific date
          </label>
          <input
            id="custom-date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && onSelectDate(e.target.value)}
            className="w-8 h-8 opacity-0 absolute inset-0 cursor-pointer z-10"
            aria-label="Choose match date"
          />
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter Tabs (All, LIVE, Finished, Upcoming) */}
      <div
        role="tablist"
        aria-label="Match status filters"
        className="flex items-center gap-1 w-full sm:w-auto bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200/70 dark:border-slate-800/60 justify-around sm:justify-start"
      >
        <button
          role="tab"
          aria-selected={activeFilter === 'ALL'}
          onClick={() => onChangeFilter('ALL')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'ALL'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All
        </button>

        <button
          role="tab"
          aria-selected={activeFilter === 'LIVE'}
          onClick={() => onChangeFilter('LIVE')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeFilter === 'LIVE'
              ? 'bg-red-500 text-white shadow-xs'
              : 'text-red-500 dark:text-red-400 hover:bg-red-500/10'
          }`}
        >
          <Radio className="w-3 h-3 animate-pulse" />
          <span>LIVE</span>
          {liveCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'LIVE'
                  ? 'bg-white text-red-600'
                  : 'bg-red-500 text-white'
              }`}
            >
              {liveCount}
            </span>
          )}
        </button>

        <button
          role="tab"
          aria-selected={activeFilter === 'FINISHED'}
          onClick={() => onChangeFilter('FINISHED')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'FINISHED'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Finished
        </button>

        <button
          role="tab"
          aria-selected={activeFilter === 'SCHEDULED'}
          onClick={() => onChangeFilter('SCHEDULED')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'SCHEDULED'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Upcoming
        </button>
      </div>
    </div>
  );
};
