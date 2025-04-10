import { useEffect, useState } from 'react';
import Image from 'next/image';

const Splash = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`splash ${!isVisible ? 'splash-exit' : ''}`}>
      <div className="splash-content">
        <Image
          src="/images/logo.png"
          alt="BelleColleen Logo"
          width={120}
          height={120}
          priority
        />
        <h1 className="splash-title">BelleColleen</h1>
      </div>
    </div>
  );
};

export default Splash;
