import { test, expect } from '@playwright/test';

const SITE_URL = 'https://lawrence-berry.github.io/bellecolleen';

const pages: { path: string; title: string }[] = [
  { path: '/', title: 'BelleColleen - Art Collection' },
  { path: '/collection', title: 'Collection | BelleColleen' },
  { path: '/exhibitions', title: 'Exhibitions | BelleColleen' },
  { path: '/about', title: 'About | BelleColleen' },
  { path: '/contact', title: 'Contact | BelleColleen' },
];

test.describe('Open Graph / Twitter Card tags', () => {
  for (const { path, title } of pages) {
    test(`${path} has correct, non-duplicated og:title/og:url/twitter:title`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(title);
      // getAbsoluteUrl always resolves to the production origin, even in
      // dev - crawlers only ever fetch these tags from the deployed site.
      const expectedUrl = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

      const ogTitle = page.locator('meta[property="og:title"]');
      const ogUrl = page.locator('meta[property="og:url"]');
      const twitterTitle = page.locator('meta[name="twitter:title"]');

      await expect(ogTitle).toHaveCount(1);
      await expect(ogUrl).toHaveCount(1);
      await expect(twitterTitle).toHaveCount(1);

      await expect(ogTitle).toHaveAttribute('content', title);
      await expect(ogUrl).toHaveAttribute('content', expectedUrl);
      await expect(twitterTitle).toHaveAttribute('content', title);
    });
  }

  test('site-wide defaults (image, card type, description) are present exactly once', async ({ page }) => {
    await page.goto('/');

    const expectedImage = `${SITE_URL}/images/artworks/Secret%20of%20the%20Golden%20Flower.jpg`;

    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', expectedImage);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '645');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '457');

    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'BelleColleen');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', expectedImage);

    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveCount(1);
  });

  test('og:image URL is reachable (not a 404)', async ({ page, request }) => {
    await page.goto('/');
    const content = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(content).toBeTruthy();
    // The image itself lives on the dev server too (same path, no
    // basePath in dev) - fetch it from there rather than production to
    // keep this test independent of whether the site has been deployed.
    const devUrl = content!.replace(`${SITE_URL}`, 'http://localhost:3000');
    const response = await request.get(devUrl);
    expect(response.status()).toBe(200);
  });
});
