import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts any media URL to use the local /api/media/ proxy.
 * This fixes SSL certificate issues on mobile when accessing R2 directly.
 *
 * Handles:
 *  - https://<accountId>.r2.cloudflarestorage.com/<bucket>/<key>
 *  - https://pub-<hash>.r2.dev/<key>
 *  - /api/media/<key>   → returned as-is
 *  - relative paths     → returned as-is
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url || url === 'null' || url.trim() === '') return '';

  // Already a proxy URL
  if (url.startsWith('/api/media/')) return url;

  // Pattern: https://<accountId>.r2.cloudflarestorage.com[/<bucket>]/<key...>
  const storageMatch = url.match(/r2\.cloudflarestorage\.com\/[^/]+\/(.+)/);
  if (storageMatch) {
    return `/api/media/${storageMatch[1]}`;
  }

  // Pattern: https://pub-<hash>.r2.dev/<key...>
  const pubMatch = url.match(/pub-[a-f0-9]+\.r2\.dev\/(.+)/);
  if (pubMatch) {
    return `/api/media/${pubMatch[1]}`;
  }

  // Unknown URL (external CDN etc.) — return as-is
  return url;
}
