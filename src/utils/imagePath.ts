export function getImagePath(path: string): string {
  // In development, use the path as-is
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
  
  // In production, prefix with the base path
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/bellecolleen';
  return `${basePath}${path}`;
}
