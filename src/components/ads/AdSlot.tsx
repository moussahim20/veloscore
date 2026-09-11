import React from 'react';
import { AD_PLACEMENTS, ADS_CONFIG } from '../../config/ads';
import type { AdPlacement } from '../../types/ads';

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const config = AD_PLACEMENTS[placement];

  if (!config || !config.enabled || !ADS_CONFIG.enabled) {
    return null;
  }

  return (
    <aside
      id={config.id}
      aria-label="Advertisement"
      className={`relative w-full my-4 flex flex-col items-center justify-center overflow-hidden rounded-md border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 text-center transition-all ${className}`}
      style={{ minHeight: `${config.minHeight}px` }}
    >
      {/* Policy compliant header indicator */}
      <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 dark:text-slate-500 select-none py-1 block w-full border-b border-slate-200/60 dark:border-slate-800/50">
        {config.label || 'Advertisement'}
      </span>

      <div className="flex-1 w-full flex items-center justify-center p-3">
        {ADS_CONFIG.isDevelopmentMode ? (
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <div className="w-8 h-8 mb-1.5 rounded border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs">
              AD
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Reserved Ad Placement ({config.format.replace('_', ' ')})
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              CLS-safe zero-shift container • Ready for Google AdSense
            </p>
          </div>
        ) : (
          /* Live AdSense tag container */
          <ins
            className="adsbygoogle block w-full"
            style={{ display: 'block' }}
            data-ad-client={ADS_CONFIG.publisherId}
            data-ad-slot={config.id}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </aside>
  );
};
