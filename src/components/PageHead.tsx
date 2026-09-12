import Head from 'next/head';
import { getAbsoluteUrl } from '../utils/imagePath';

interface PageHeadProps {
  title: string;
  path: string;
}

// Per-page <title> plus matching og:title/og:url overrides, so sharing a
// link to e.g. /collection previews as "Collection | BelleColleen" rather
// than always falling back to the site-wide default in _app.tsx. Next
// dedupes meta tags across Head calls that share a `key`, keeping this
// (more specific, rendered later in the tree) one.
export default function PageHead({ title, path }: PageHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta key="og:title" property="og:title" content={title} />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta key="og:url" property="og:url" content={getAbsoluteUrl(path)} />
    </Head>
  );
}
