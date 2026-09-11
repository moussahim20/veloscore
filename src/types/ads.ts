export type AdPlacement =
  | 'home_feed_top'
  | 'home_feed_mid'
  | 'sidebar_right'
  | 'match_header_below'
  | 'match_timeline_mid'
  | 'competition_table_below'
  | 'team_page_mid';

export type AdFormat = 'banner_728x90' | 'rectangle_300x250' | 'leaderboard_970x90' | 'responsive' | 'mobile_banner_320x50';

export interface AdSlotConfig {
  id: string;
  placement: AdPlacement;
  format: AdFormat;
  minWidth?: number;
  minHeight: number;
  label?: string;
  enabled: boolean;
}
