import Layout from '../components/Layout';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import collectionData from '../data/collection.json';
import { useRouter } from 'next/router';
import { getImagePath } from '../utils/imagePath';

// Replace the hardcoded allItems with the imported data
const allItems = collectionData.items;

export default function Collection() {
  const router = useRouter();
  const { artwork } = router.query;

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  let controlsTimer: NodeJS.Timeout;

  const toggleSlideshow = useCallback(() => {
    if (!selectedImage) {
      setSelectedImage(1); // Start with first image if none selected
    }
    setIsSlideshowActive(prev => !prev);
  }, [selectedImage]);

  const nextSlide = useCallback(() => {
    setSelectedImage(current => {
      if (!current) return 1;
      return current === allItems.length ? 1 : current + 1;
    });
  }, []);

  const previousSlide = useCallback(() => {
    setSelectedImage(current => {
      if (!current) return allItems.length;
      return current === 1 ? allItems.length : current - 1;
    });
  }, []);

  const handleCloseModal = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setSelectedImage(null);
    setIsSlideshowActive(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    if (isFullscreen) {
      setAreControlsVisible(true);
      clearTimeout(controlsTimer);
      controlsTimer = setTimeout(() => {
        setAreControlsVisible(false);
      }, 5000);
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      // Initial timer
      controlsTimer = setTimeout(() => {
        setAreControlsVisible(false);
      }, 5000);

      // Add mouse move listener
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      setAreControlsVisible(true);
      clearTimeout(controlsTimer);
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      clearTimeout(controlsTimer);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFullscreen, handleMouseMove]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isSlideshowActive) {
      const timer = setInterval(nextSlide, 10000); // Changed from 3000 to 10000 ms (10 seconds)
      return () => clearInterval(timer);
    }
  }, [isSlideshowActive, nextSlide]);

  useEffect(() => {
    if (artwork && typeof artwork === 'string') {
      // Find the index of the artwork by matching the title
      const index = allItems.findIndex(item => item.title === decodeURIComponent(artwork));
      if (index !== -1) {
        setSelectedImage(index + 1);
      }
    }
  }, [artwork]);

  return (
    <Layout>
      <div className="container">
        <section className="collection">
          <div className="collection-header">
            <h1 className="collection-title">Complete Collection</h1>
            <button 
              className="collection-slideshow-button"
              onClick={toggleSlideshow}
              title="Start/Pause Slideshow"
            >
              <svg 
                className="collection-play-icon" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                style={{ 
                  background: 'black', 
                  borderRadius: '50%',
                  padding: '8px'
                }}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
              </svg>
            </button>
          </div>
          <div className="collection-grid">
            {allItems.map((item) => (
              <div 
                key={item.id} 
                className="collection-item"
                onClick={() => setSelectedImage(item.id)}
              >
                <div className="collection-image-container">
                  <Image
                    src={getImagePath(item.image)}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="collection-item-overlay">
                  <h3 className="collection-item-title">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {selectedImage && (
            <div 
              className={`modal-overlay ${isFullscreen ? 'fullscreen' : ''} ${
                !areControlsVisible && isFullscreen ? 'controls-hidden' : ''
              }`} 
              onClick={handleCloseModal}
              onMouseMove={handleMouseMove}
            >
              <div className={`modal-content ${isFullscreen ? 'fullscreen' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-controls">
                  <button 
                    className="modal-control-button"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    <svg 
                      className="fullscreen-icon" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      {isFullscreen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      )}
                    </svg>
                  </button>
                  <button 
                    className="modal-control-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSlideshow();
                    }}
                    title={isSlideshowActive ? "Pause Slideshow" : "Start Slideshow"}
                  >
                    <svg 
                      className="play-icon" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      {isSlideshowActive ? (
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      ) : (
                        <path d="M8 5v14l11-7z"/>
                      )}
                    </svg>
                  </button>
                  <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                </div>
                {allItems.map((item) => (
                  item.id === selectedImage && (
                    <div key={item.id} className="modal-image-container">
                      <Image
                        src={getImagePath(item.image)}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                      />
                      <div className="modal-title">{item.title}</div>
                    </div>
                  )
                ))}
                <button className="modal-nav-button prev" onClick={previousSlide}>&lt;</button>
                <button className="modal-nav-button next" onClick={nextSlide}>&gt;</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
