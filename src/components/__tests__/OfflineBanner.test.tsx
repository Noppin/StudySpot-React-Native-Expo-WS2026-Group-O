import { render, screen } from '@testing-library/react-native';

import { OfflineBanner, formatCacheAge } from '../OfflineBanner';

describe('formatCacheAge', () => {
  const now = Date.UTC(2026, 10, 8, 12, 0);

  it.each([
    [now - 20_000, 'just now'],
    [now - 5 * 60_000, '5 min ago'],
    [now - 3 * 3_600_000, '3 h ago'],
  ])('formats %p as %p', (timestamp, expected) => {
    expect(formatCacheAge(timestamp, now)).toBe(expected);
  });
});

it('tells the user that cached data is shown', async () => {
  await render(<OfflineBanner cachedAt={Date.now() - 5 * 60_000} />);
  expect(screen.getByText('Offline · showing saved data from 5 min ago')).toBeOnTheScreen();
});
