import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getImagePath } from '../utils/imagePath';

export default function Splash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash ${!isVisible ? 'splash-exit' : ''}`}>
      <div className="splash-content">
        <Image
          src={getImagePath("/images/main-logo.png")}
          alt="BelleColleen Logo"
          width={120}
          height={120}
          priority
        />
        <h1 className="splash-title">BelleColleen</h1>
      </div>
    </div>
  );
}
