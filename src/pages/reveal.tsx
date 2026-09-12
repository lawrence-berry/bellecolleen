import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import collectionData from '../data/collection.json';
import { getImagePath } from '../utils/imagePath';

// Standalone, chrome-free "explode the painting into a grid, then
// reassemble it" loop, built for screen-recording social clips rather
// than as a site feature. Deliberately not linked from anywhere in the
// nav - reachable only via its URL (?art=<title>&grid=<N> to pick a
// specific painting/grid density), and noindex'd so it doesn't show up
// in search results either.

const GRID_SIZE_DEFAULT = 6;
const DEFAULT_ART = 'Anima';
const SPREAD = 2.4; // how far tiles travel, as a multiple of their own grid-distance from center

const HOLD_ASSEMBLED_MS = 1800;
const EXPLODE_MS = 1000;
const HOLD_EXPLODED_MS = 3200;
const REASSEMBLE_MS = 1000;

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// Deterministic pseudo-random in [0, 1) from an integer seed, so each
// tile's rotation is stable across re-renders instead of reshuffling.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return x - Math.floor(x);
}

type Phase = 'assembled' | 'exploding' | 'exploded' | 'reassembling';

export default function Reveal() {
  const router = useRouter();
  const { art, grid } = router.query;

  const item = useMemo(() => {
    const wanted = typeof art === 'string' ? decodeURIComponent(art).toLowerCase() : null;
    const found = wanted
      ? collectionData.items.find((i) => i.title.toLowerCase() === wanted)
      : null;
    return found ?? collectionData.items.find((i) => i.title === DEFAULT_ART) ?? collectionData.items[0];
  }, [art]);

  const gridSize = useMemo(() => {
    const parsed = typeof grid === 'string' ? parseInt(grid, 10) : NaN;
    return Number.isFinite(parsed) && parsed >= 2 && parsed <= 12 ? parsed : GRID_SIZE_DEFAULT;
  }, [grid]);

  const [phase, setPhase] = useState<Phase>('assembled');
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    setAutoplay(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    let cancelled = false;

    (async () => {
      while (!cancelled) {
        setPhase('assembled');
        await wait(HOLD_ASSEMBLED_MS);
        if (cancelled) return;
        setPhase('exploding');
        await wait(EXPLODE_MS);
        if (cancelled) return;
        setPhase('exploded');
        await wait(HOLD_EXPLODED_MS);
        if (cancelled) return;
        setPhase('reassembling');
        await wait(REASSEMBLE_MS);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [autoplay]);

  const isOut = phase === 'exploding' || phase === 'exploded';

  // Each tile's outward direction/distance is just its (col, row) offset
  // from the grid's center; delay ripples out from center on explode and
  // converges back in reverse order on reassemble.
  const tiles = useMemo(() => {
    const center = (gridSize - 1) / 2;
    const raw = [];
    let maxDist = 0;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const dx = col - center;
        const dy = row - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        maxDist = Math.max(maxDist, dist);
        raw.push({ row, col, dx, dy, dist, rotate: (seededRandom(row * gridSize + col + 1) - 0.5) * 70 });
      }
    }
    return raw.map((t) => ({
      ...t,
      delayOut: (t.dist / (maxDist || 1)) * 260,
      delayIn: ((maxDist - t.dist) / (maxDist || 1)) * 260,
    }));
  }, [gridSize]);

  return (
    <>
      <Head>
        <title>Reveal - BelleColleen</title>
        {/* Recording/demo tool, deliberately unlinked from the site - keep
            it out of search results even though the URL itself works. */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="reveal-stage">
        <div
          className="reveal-grid"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)` }}
        >
          {tiles.map((t) => {
            const delay = phase === 'exploding' ? t.delayOut : phase === 'reassembling' ? t.delayIn : 0;
            const denom = gridSize - 1 || 1;
            return (
              <div
                key={`${t.row}-${t.col}`}
                className="reveal-tile"
                style={{
                  backgroundImage: `url("${getImagePath(item.image)}")`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${(t.col * 100) / denom}% ${(t.row * 100) / denom}%`,
                  transform: isOut
                    ? `translate(${t.dx * SPREAD * 100}%, ${t.dy * SPREAD * 100}%) rotate(${t.rotate}deg)`
                    : 'translate(0, 0) rotate(0deg)',
                  transitionDelay: `${delay}ms`,
                }}
              />
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .reveal-stage {
          position: fixed;
          inset: 0;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .reveal-grid {
          display: grid;
          width: min(90vw, 90vh);
          height: min(90vw, 90vh);
        }
        .reveal-tile {
          background-repeat: no-repeat;
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-tile {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
