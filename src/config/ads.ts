import type { AdSlotConfig, AdPlacement } from '../types/ads';

export const ADS_CONFIG = {
  // Toggle demo preview placeholders or real Google AdSense scripts
  isDevelopmentMode: true,
  publisherId: 'pub-XXXXXXXXXXXXXXXX', // Replace with real AdSense pub ID upon approval
  enabled: true,
};

export const AD_PLACEMENTS: Record<AdPlacement, AdSlotConfig> = {
  home_feed_top: {
    id: 'ad-slot-feed-top',
    placement: 'home_feed_top',
    format: 'banner_728x90',
    minHeight: 90,
    label: 'Advertisement',
    enabled: true,
  },
  home_feed_mid: {
    id: 'ad-slot-feed-mid',
    placement: 'home_feed_mid',
    format: 'banner_728x90',
    minHeight: 90,
    label: 'Advertisement',
    enabled: true,
  },
  sidebar_right: {
    id: 'ad-slot-sidebar-right',
    placement: 'sidebar_right',
    format: 'rectangle_300x250',
    minWidth: 300,
    minHeight: 250,
    label: 'Advertisement',
    enabled: true,
  },
  match_header_below: {
    id: 'ad-slot-match-header',
    placement: 'match_header_below',
    format: 'leaderboard_970x90',
    minHeight: 90,
    label: 'Advertisement',
    enabled: true,
  },
  match_timeline_mid: {
    id: 'ad-slot-match-timeline',
    placement: 'match_timeline_mid',
    format: 'responsive',
    minHeight: 100,
    label: 'Advertisement',
    enabled: true,
  },
  competition_table_below: {
    id: 'ad-slot-competition-table',
    placement: 'competition_table_below',
    format: 'banner_728x90',
    minHeight: 90,
    label: 'Advertisement',
    enabled: true,
  },
  team_page_mid: {
    id: 'ad-slot-team-mid',
    placement: 'team_page_mid',
    format: 'responsive',
    minHeight: 120,
    label: 'Advertisement',
    enabled: true,
  },
};
