import type { SportsProvider } from './SportsProvider';
import { defaultMockProvider } from './MockSportsProvider';
import { defaultApiSportsProvider } from './ApiSportsClientProvider';

export function getSportsProvider(): SportsProvider {
  // If running in browser environment, use ApiSportsClientProvider which proxies /api/sports/*
  if (typeof window !== 'undefined') {
    return defaultApiSportsProvider;
  }
  return defaultMockProvider;
}

export { defaultApiSportsProvider };
