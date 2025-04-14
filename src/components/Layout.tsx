import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImagePath } from '../utils/imagePath';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <nav className="nav">
        <div className="nav-brand">
          <Link href="/" className="nav-brand-link">
            <div className="site-logo">
              <Image
                src={getImagePath("/images/main-logo.png")}
                alt="BelleColleen Logo"
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
      <main>{children}</main>
      <footer className="footer">
        <p>© 2025 BelleColleen. All rights reserved.</p>
      </footer>
    </div>
  );
}
