import Layout from '../components/Layout';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import collectionData from '../data/collection.json';

// Replace the hardcoded allItems with the imported data
const allItems = collectionData.items;

export default function Collection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  const startSlideshow = useCallback(() => {
    setSelectedImage(1); // Start with first image
    setIsSlideshowActive(true);
  }, []);

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

  return (
    <Layout>
      <div className="container">
        <section className="collection">
          <div className="collection-header">
            <h1 className="collection-title">Complete Collection</h1>
            <button 
              className="slideshow-button"
              onClick={startSlideshow}
              title="Start Slideshow"
            >
              <svg 
                className="play-icon" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z"/>
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
                <button className="modal-close" onClick={handleCloseModal}>&times;</button>
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
