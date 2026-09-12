import { test, expect } from '@playwright/test';

test.describe('/reveal (unlinked recording tool)', () => {
  test('is not linked from the site nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href*="reveal"]')).toHaveCount(0);
  });

  test('is noindex, nofollow', async ({ page }) => {
    await page.goto('/reveal');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('defaults to a 6x6 grid of the default painting, no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/reveal');
    await expect(page.locator('.reveal-tile')).toHaveCount(36);
    const bg = await page.locator('.reveal-tile').first().evaluate((el) => (el as HTMLElement).style.backgroundImage);
    expect(bg).toContain('Anima.jpg');
    expect(errors).toEqual([]);
  });

  test('?art and ?grid pick a specific painting and grid density', async ({ page }) => {
    await page.goto('/reveal?art=Sophia&grid=8');
    await expect(page.locator('.reveal-tile')).toHaveCount(64);
    const bg = await page.locator('.reveal-tile').first().evaluate((el) => (el as HTMLElement).style.backgroundImage);
    expect(bg).toContain('Sophia.jpg');
  });

  test('an unknown ?art value falls back to the default painting', async ({ page }) => {
    await page.goto('/reveal?art=NotARealPainting');
    const bg = await page.locator('.reveal-tile').first().evaluate((el) => (el as HTMLElement).style.backgroundImage);
    expect(bg).toContain('Anima.jpg');
  });

  test('an out-of-range ?grid value falls back to the default grid size', async ({ page }) => {
    await page.goto('/reveal?grid=999');
    await expect(page.locator('.reveal-tile')).toHaveCount(36);
  });

  test('tiles animate out from the assembled state over the loop', async ({ page }) => {
    await page.goto('/reveal');
    const tile = page.locator('.reveal-tile').first();
    await expect(tile).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)'); // assembled = identity
    await expect(tile).not.toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)', { timeout: 8000 }); // exploded
  });
});
