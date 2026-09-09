import { test, expect, Page } from '@playwright/test';

const NAV_PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Collection', path: '/collection' },
  { name: 'Exhibitions', path: '/exhibitions' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

for (const { name, path } of NAV_PAGES) {
  test(`${name} page loads with no console errors`, async ({ page }) => {
    const errors = collectPageErrors(page);

    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();

    await expect(page.locator('nav.nav')).toBeVisible();
    await expect(page.locator('footer.footer')).toBeVisible();

    expect(errors).toEqual([]);
  });
}

test('nav links navigate to every page with no console errors', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/');

  for (const { name, path } of NAV_PAGES) {
    await page.locator('.nav-links a', { hasText: name }).click();
    await expect(page).toHaveURL(new RegExp(`${path === '/' ? '/$' : path}$`));
  }

  expect(errors).toEqual([]);
});
