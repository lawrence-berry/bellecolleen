import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getImagePath } from '../utils/imagePath';

// Matches the "hold" delay plus the .splash opacity transition duration
// in splash.css, so the component unmounts only once it's fully faded.
const HOLD_MS = 2000;
const FADE_MS = 500;

export default function Splash() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsVisible(false), HOLD_MS);
    const unmountTimer = setTimeout(() => setIsMounted(false), HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    // Purely decorative branding moment, not page content - hidden from
    // assistive tech for its whole (brief) lifetime rather than left as
    // a lingering, invisible-but-announceable duplicate of the real
    // page heading once it fades out.
    <div className={`splash ${!isVisible ? 'splash-exit' : ''}`} aria-hidden="true">
      <div className="splash-content">
        <Image
          src={getImagePath("/images/main-logo.png")}
          alt=""
          width={120}
          height={120}
          priority
        />
        <p className="splash-title">BelleColleen</p>
      </div>
    </div>
  );
}
