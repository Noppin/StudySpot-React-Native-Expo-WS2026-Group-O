import { InfoBanner } from './InfoBanner';

interface OfflineBannerProps {
  /** Timestamp of the cached data that is currently shown. */
  cachedAt?: number | null;
}

export function formatCacheAge(cachedAt: number, now = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - cachedAt) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(cachedAt).toLocaleDateString();
}

export function OfflineBanner({ cachedAt }: OfflineBannerProps) {
  const age = cachedAt ? ` from ${formatCacheAge(cachedAt)}` : '';
  return <InfoBanner tone="warning" message={`Offline · showing saved data${age}`} />;
}
