export function getImagePath(path: string): string {
  // In development, use the path as-is
  if (process.env.NODE_ENV === 'development') {
    return path;
  }

  // In production, prefix with the base path
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/bellecolleen';
  return `${basePath}${path}`;
}

// Fixed production origin (unlike getImagePath, this always resolves to the
// real deployed site regardless of env) - Open Graph/Twitter Card tags are
// only ever fetched by social crawlers hitting production, and they require
// fully-qualified absolute URLs, not paths relative to the current page.
const SITE_URL = 'https://lawrence-berry.github.io/bellecolleen';

export function getAbsoluteUrl(path: string): string {
  return encodeURI(`${SITE_URL}${path}`);
}
