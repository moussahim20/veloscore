import React, { useState } from 'react';
import { getCountryFlagUrl } from '../../utils/flags';

interface CountryFlagProps {
  countryName?: string;
  countryCode?: string;
  flagUrl?: string;
  className?: string;
  alt?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryName,
  countryCode,
  flagUrl,
  className = 'w-4 h-3',
  alt,
}) => {
  const [hasError, setHasError] = useState(false);
  const src = getCountryFlagUrl(countryName, countryCode, flagUrl);

  const displayName = alt || countryName || countryCode || 'Country';

  if (hasError) {
    return (
      <span
        className={`inline-flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-xs shrink-0 ${className}`}
        title={displayName}
      >
        {(countryCode || countryName || 'INT').substring(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={displayName}
      title={displayName}
      className={`inline-block object-cover rounded-xs border border-slate-300/60 dark:border-slate-700/60 shrink-0 shadow-2xs ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};
