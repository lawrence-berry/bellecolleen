import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getImagePath } from '../utils/imagePath';
import collectionData from '../data/collection.json';

interface LayoutProps {
  children: ReactNode;
}

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const bgItems = collectionData.items;
  const bgImage = bgItems[hashString(router.pathname) % bgItems.length].image;

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
          <p>© 2025 BelleColleen. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
