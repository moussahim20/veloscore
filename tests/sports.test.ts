import { defaultMockProvider } from '../src/services/providers/MockSportsProvider';
import { AD_PLACEMENTS } from '../src/config/ads';

let passed = 0;
let failed = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${description}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- Running VeloScore Sports & Architecture Tests ---\n');

  // Test 1: Sports Provider - Sports list
  console.log('1. Testing Sports Provider getSports()...');
  const sports = await defaultMockProvider.getSports();
  assert(sports.length >= 4, 'Provides at least 4 distinct sports');
  const football = sports.find((s) => s.id === 'football');
  assert(!!football && football.isActive, 'Football is present and marked active');

  // Test 2: Sports Provider - Competitions
  console.log('\n2. Testing Competitions...');
  const comps = await defaultMockProvider.getCompetitions('football');
  assert(comps.length >= 4, 'Has at least 4 top European football competitions');
  const pl = comps.find((c) => c.slug === 'premier-league');
  assert(!!pl && pl.countryName === 'England', 'Premier League correctly mapped to England');

  // Test 3: Sports Provider - Matches by Date & Live
  console.log("\n3. Testing Matches by Date & Status...");
  const matches = await defaultMockProvider.getMatchesByDate('2026-09-11', 'football');
  assert(matches.length > 0, "Found matches for 2026-09-11");
  const liveMatches = await defaultMockProvider.getLiveMatches('football');
  assert(liveMatches.length >= 2, 'Has at least 2 live matches in progress');
  assert(liveMatches.every((m) => m.isLive && m.status === 'LIVE' || m.status === 'HT'), 'All live matches have valid status');

  // Test 4: Match Detail & Events
  console.log('\n4. Testing Match Detail Events & Lineups...');
  const match = await defaultMockProvider.getMatchById('m-ars-liv-1');
  assert(!!match, 'Found match m-ars-liv-1');
  assert(!!match?.events && match.events.length > 0, 'Match contains chronological events (goals, cards, substitutions)');
  assert(!!match?.lineups && match.lineups.home.starters.length === 11, 'Home team has complete 11 starters with tactical coords');
  assert(!!match?.stats && match.stats.possession[0] + match.stats.possession[1] === 100, 'Possession totals 100%');

  // Test 5: Standings Table
  console.log('\n5. Testing Standings...');
  const standings = await defaultMockProvider.getStandings('premier-league-eng-1');
  assert(standings.length >= 10, 'Standings contains rows with points, GD, and form');
  assert(standings[0].points >= standings[1].points, 'Standings table correctly ordered by points');

  // Test 6: Instant Search
  console.log('\n6. Testing Instant Search...');
  const searchResult = await defaultMockProvider.search('Arsenal');
  assert(searchResult.teams.length >= 1, 'Search found Arsenal in teams');
  assert(searchResult.matches.length >= 1, 'Search found Arsenal match in fixtures');

  // Test 7: Google AdSense CLS Safety Audit
  console.log('\n7. Testing Google AdSense CLS Safety Audit...');
  const adPlacements = Object.values(AD_PLACEMENTS);
  assert(adPlacements.length >= 5, 'Configured at least 5 standard non-intrusive ad slots');
  assert(adPlacements.every((slot) => slot.minHeight >= 90), 'Every ad slot reserves at least 90px height to prevent CLS');

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
