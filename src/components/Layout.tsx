import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getImagePath } from '../utils/imagePath';
import { hashString } from '../utils/hash';
import collectionData from '../data/collection.json';

interface LayoutProps {
  children: ReactNode;
}

// SSR-safe fallback for the copyright year. This is a fully static export
// (built once, not per-request), so reading the real year during render
// would bake in whatever year the site was last built in - fine until the
// clock actually ticks over to the next year without a rebuild, at which
// point it would mismatch the client's real year and hydration would
// error. Read after mount instead, same as the hero image/background
// wash's day-based picks.
const FALLBACK_YEAR = 2026;

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const bgItems = collectionData.items;
  const bgImage = bgItems[hashString(router.pathname) % bgItems.length].image;

  const [year, setYear] = useState(FALLBACK_YEAR);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="container">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div
        className="body-bg"
        style={{ backgroundImage: `url("${getImagePath(bgImage)}")` }}
        aria-hidden="true"
      />
      <div className="page-content">
        <nav className="nav">
          <div className="nav-brand">
            <Link href="/" className="nav-brand-link">
              <div className="site-logo">
                <Image
                  src={getImagePath("/images/main-logo.png")}
                  alt=""
                  width={48}
                  height={48}
                  priority
                />
              </div>
              <span>BelleColleen</span>
            </Link>
          </div>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/collection">Collection</Link>
            <Link href="/exhibitions">Exhibitions</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>
        <main id="main-content" tabIndex={-1}>{children}</main>
        <footer className="footer">
          <p>© {year} BelleColleen. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
