import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import '../styles/components/fullscreen.css';
import '../styles/pages/exhibitions.css';
import '../styles/components/layout.css';
import '../styles/pages/about.css';
import { getImagePath, getAbsoluteUrl } from '../utils/imagePath';

const SITE_TITLE = 'BelleColleen - Art Collection';
const SITE_DESCRIPTION = "BelleColleen - Authenticated paintings by Colleen Godley (1951-2011)";
// One representative, landscape-ish painting as the default share-card
// image - most artworks here are portrait, which crops awkwardly to the
// ~1.91:1 social card ratio, so this one was picked for its aspect ratio.
const OG_IMAGE = getAbsoluteUrl('/images/artworks/Secret of the Golden Flower.jpg');
const OG_IMAGE_WIDTH = 645;
const OG_IMAGE_HEIGHT = 457;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        {/* Explicit, basePath-aware favicon link - the browser's implicit
            "/favicon.ico" lookup is always relative to the domain root,
            which 404s once the site is deployed under /bellecolleen/. */}
        <link rel="icon" href={getImagePath('/favicon.ico')} />

        {/* Open Graph / Twitter Card defaults. Individual pages can
            override og:title and og:url (matching their <title>) via a
            <Head> of their own using the same `key`s - Next dedupes meta
            tags sharing a key, keeping the more specific one. There's no
            per-page og:image: this is a single static export with no
            per-artwork pages to generate distinct share images for. */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:site_name" property="og:site_name" content="BelleColleen" />
        <meta key="og:title" property="og:title" content={SITE_TITLE} />
        <meta key="og:description" property="og:description" content={SITE_DESCRIPTION} />
        <meta key="og:url" property="og:url" content={getAbsoluteUrl('/')} />
        <meta key="og:image" property="og:image" content={OG_IMAGE} />
        <meta key="og:image:width" property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
        <meta key="og:image:height" property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
        <meta key="og:image:alt" property="og:image:alt" content="A painting from the BelleColleen collection" />

        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content={SITE_TITLE} />
        <meta key="twitter:description" name="twitter:description" content={SITE_DESCRIPTION} />
        <meta key="twitter:image" name="twitter:image" content={OG_IMAGE} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
