import Head from 'next/head';
import Layout from '../components/Layout';
import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import collectionData from '../data/collection.json';
import { useRouter } from 'next/router';
import { getImagePath } from '../utils/imagePath';

// Replace the hardcoded allItems with the imported data
const allItems = collectionData.items;

// True while a view transition's animation is playing.
let transitionInFlight = false;

// Runs a state update inside the View Transitions API when the browser
// supports it, so the outgoing/incoming artwork crossfade instead of
// cutting instantly. flushSync forces React to commit synchronously so
// the DOM mutation happens inside the transition's callback, which the
// API requires to capture a before/after snapshot pair.
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function withSlideTransition(update: () => void) {
  if (typeof document === 'undefined' || !document.startViewTransition || prefersReducedMotion()) {
    update();
    return;
  }
  if (transitionInFlight) {
    // Mutating state while a transition is capturing/animating - even
    // via a plain setState outside the transition's own callback -
    // corrupts it and makes the browser report an uncaught
    // "InvalidStateError: Transition was aborted", even though we never
    // call startViewTransition a second time. So rapid clicks during an
    // animation are dropped rather than falling back to a plain update.
    return;
  }

  transitionInFlight = true;
  const transition = document.startViewTransition(() => flushSync(update));
  transition.finished.catch(() => {}).finally(() => {
    transitionInFlight = false;
  });
}

export default function Collection() {
  const router = useRouter();
  const { artwork } = router.query;

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  let controlsTimer: NodeJS.Timeout;

  const toggleSlideshow = useCallback(() => {
    if (!selectedImage) {
      setSelectedImage(1); // Start with first image if none selected
    }
    setIsSlideshowActive(prev => !prev);
  }, [selectedImage]);

  const nextSlide = useCallback(() => {
    withSlideTransition(() => {
      setSelectedImage(current => {
        if (!current) return 1;
        return current === allItems.length ? 1 : current + 1;
      });
    });
  }, []);

  const previousSlide = useCallback(() => {
    withSlideTransition(() => {
      setSelectedImage(current => {
        if (!current) return allItems.length;
        return current === 1 ? allItems.length : current - 1;
      });
    });
  }, []);

  const handleCloseModal = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setSelectedImage(null);
    setIsSlideshowActive(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      // requestFullscreen() can reject (denied permissions policy, no
      // user activation, etc.) - only flip the UI state once it actually
      // succeeds, otherwise we're left showing a fullscreen UI that isn't.
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
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

  // Modal focus management: move focus in on open, trap Tab within the
  // dialog, close on Escape, and restore focus to whatever opened it.
  // Keyed on open/closed rather than selectedImage itself, so navigating
  // between slides doesn't re-trigger this (focus should stay put then).
  const isModalOpen = selectedImage !== null;
  useEffect(() => {
    if (!isModalOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    modalContentRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseModal();
        return;
      }
      if (e.key !== 'Tab' || !modalContentRef.current) return;

      const focusable = modalContentRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // The dialog container itself (tabIndex=-1, holds focus right after
      // opening) isn't in `focusable` and isn't part of the browser's
      // normal tab order, so Shift+Tab from it falls back to DOM order and
      // escapes straight past the modal into the page behind it. Treat
      // focus being on the container the same as focus being on `first`.
      const atStart = document.activeElement === first || document.activeElement === modalContentRef.current;

      if (e.shiftKey && atStart) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  return (
    <Layout>
      <Head>
        <title>Collection | BelleColleen</title>
      </Head>
      <div className="container">
        <section className="collection">
          <div className="collection-header">
            <h1 className="collection-title">Complete Collection</h1>
            <button
              className="icon-btn collection-slideshow-button"
              onClick={toggleSlideshow}
              title={isSlideshowActive ? 'Pause Slideshow' : 'Start Slideshow'}
              aria-label={isSlideshowActive ? 'Pause Slideshow' : 'Start Slideshow'}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {isSlideshowActive ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>
          </div>
          <div className="collection-grid">
            {allItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className="collection-item"
                onClick={() => setSelectedImage(item.id)}
                aria-label={`View ${item.title}`}
              >
                <div className="collection-image-container">
                  <Image
                    src={getImagePath(item.image)}
                    alt=""
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="collection-item-overlay">
                  <span className="collection-item-title">{item.title}</span>
                </div>
              </button>
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
              <div
                ref={modalContentRef}
                className={`modal-content ${isFullscreen ? 'fullscreen' : ''}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="collection-modal-title"
                tabIndex={-1}
              >
                <div className="modal-controls">
                  <button
                    className="icon-btn modal-control-button"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
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
                        // Same "arrows pointing out" glyph as the exit-fullscreen
                        // path above, but its strokes hug the outer edge of the
                        // viewBox instead of clustering centrally, so it reads
                        // visibly heavier at the same box size. Scaled down
                        // in place to match the other icons' visual weight.
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          transform="translate(12 12) scale(0.75) translate(-12 -12)"
                          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                        />
                      )}
                    </svg>
                  </button>
                  <button
                    className="icon-btn modal-control-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSlideshow();
                    }}
                    title={isSlideshowActive ? "Pause Slideshow" : "Start Slideshow"}
                    aria-label={isSlideshowActive ? "Pause Slideshow" : "Start Slideshow"}
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
                  <button className="icon-btn modal-close" onClick={handleCloseModal} title="Close" aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {allItems.map((item) => (
                  item.id === selectedImage && (
                    <div key={item.id} className="modal-image-container">
                      <Image
                        src={getImagePath(item.image)}
                        alt=""
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                      />
                      <div className="modal-title" id="collection-modal-title">{item.title}</div>
                    </div>
                  )
                ))}
                <button className="icon-btn modal-nav-button prev" onClick={previousSlide} title="Previous" aria-label="Previous">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button className="icon-btn modal-nav-button next" onClick={nextSlide} title="Next" aria-label="Next">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
