import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import '../styles/components/fullscreen.css';
import '../styles/pages/exhibitions.css';
import '../styles/components/layout.css';
import '../styles/pages/about.css';
import { getImagePath } from '../utils/imagePath';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BelleColleen - Art Collection</title>
        <meta name="description" content="BelleColleen - Authenticated paintings by Colleen Godley (1951-2011)" />
        {/* Explicit, basePath-aware favicon link - the browser's implicit
            "/favicon.ico" lookup is always relative to the domain root,
            which 404s once the site is deployed under /bellecolleen/. */}
        <link rel="icon" href={getImagePath('/favicon.ico')} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
