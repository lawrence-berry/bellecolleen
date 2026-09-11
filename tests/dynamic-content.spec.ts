import { test, expect } from '@playwright/test';
import { seededShuffle } from '../src/utils/hash';
import collectionData from '../src/data/collection.json';

function todaysShuffle() {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return seededShuffle(collectionData.items, dayIndex);
}

test.describe('Home page daily rotation', () => {
  test('hero image matches today\'s deterministic pick, with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    const expected = todaysShuffle()[0];
    const src = await page.locator('.hero-image').getAttribute('src');
    expect(decodeURIComponent(src ?? '')).toContain(expected.image);
    expect(errors).toEqual([]);
  });

  test('featured works are 3 items from today\'s shuffle, distinct from the hero', async ({ page }) => {
    await page.goto('/');
    const shuffled = todaysShuffle();
    const expectedHero = shuffled[0];
    const expectedFeatured = shuffled.slice(1, 4);

    const titles = await page.locator('.card-title').allTextContents();
    expect(titles).toEqual(expectedFeatured.map((item) => item.title));
    expect(titles).not.toContain(expectedHero.title);
  });

  test('hero image is stable across reloads within the same day', async ({ page }) => {
    await page.goto('/');
    const first = await page.locator('.hero-image').getAttribute('src');

    await page.reload();
    const second = await page.locator('.hero-image').getAttribute('src');

    expect(second).toBe(first);
  });
});

test.describe('Footer copyright year', () => {
  test('shows the current year, not a hardcoded one', async ({ page }) => {
    await page.goto('/');
    const currentYear = String(new Date().getFullYear());
    await expect(page.locator('.footer p')).toContainText(currentYear);
  });

  test('is present on every page, with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    for (const path of ['/', '/collection', '/exhibitions', '/about', '/contact']) {
      await page.goto(path);
      const currentYear = String(new Date().getFullYear());
      await expect(page.locator('.footer p')).toContainText(currentYear);
    }
    expect(errors).toEqual([]);
  });
});
