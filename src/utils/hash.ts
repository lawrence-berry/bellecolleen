// Simple deterministic string hash (djb2-ish), used to pick a stable
// "random" item from a list based on some key (a route, a day) without
// needing a real RNG or any server-side state.
export function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Deterministic PRNG (mulberry32) from an integer seed - same seed always
// produces the same sequence, so e.g. "today" always shuffles the same way.
function mulberry32(seed: number) {
  let state = seed | 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministically shuffles `items` based on `seed` (e.g. a day index),
// so picking several distinct "random for today" entries - a hero image
// plus a few featured picks that never repeat it - is just taking a
// prefix of the result instead of juggling separate hashes and retries.
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = items.slice();
  const random = mulberry32(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
