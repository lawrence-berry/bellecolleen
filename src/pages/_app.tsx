import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import '../styles/components/fullscreen.css';
import '../styles/pages/exhibitions.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BelleColleen - Art Collection</title>
        <meta name="description" content="BelleColleen - Authenticated paintings by Colleen Godley (1951-2011)" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
