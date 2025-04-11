import Layout from '../components/Layout';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import collectionData from '../data/collection.json';
import { useRouter } from 'next/router';

// Replace the hardcoded allItems with the imported data
const allItems = collectionData.items;

export default function Collection() {
  const router = useRouter();
  const { artwork } = router.query;

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

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
    setSelectedImage(null);
    setIsSlideshowActive(false);
  };

  useEffect(() => {
    if (isSlideshowActive) {
      const timer = setInterval(nextSlide, 10000); // Changed from 3000 to 10000 ms (10 seconds)
      return () => clearInterval(timer);
    }
  }, [isSlideshowActive, nextSlide]);

  useEffect(() => {
    if (artwork && typeof artwork === 'string') {
      // Find the index of the artwork by matching the filename
      const index = allItems.findIndex(item => item.image === artwork);
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
                    src={item.image}
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
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-controls">
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
                        src={item.image}
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
