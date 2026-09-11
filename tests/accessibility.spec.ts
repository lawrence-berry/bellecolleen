import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/collection', '/exhibitions', '/about', '/contact'];

// axe's full-page DOM scan is meaningfully heavier than a UI interaction
// assertion - give it more headroom than the suite's default timeout.
const AXE_TIMEOUT = 60_000;

test.describe('Automated accessibility scan (axe)', () => {
  for (const path of pages) {
    test(`${path} has no axe violations`, async ({ page }) => {
      test.setTimeout(AXE_TIMEOUT);
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }

  test('/collection with modal open has no axe violations', async ({ page }) => {
    test.setTimeout(AXE_TIMEOUT);
    await page.goto('/collection');
    await page.locator('.collection-item', { hasText: 'Anima' }).click();
    await expect(page.locator('.modal-overlay')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});

test.describe('Collection modal keyboard/focus behavior', () => {
  test('grid tiles are keyboard-operable and open the modal on Enter', async ({ page }) => {
    await page.goto('/collection');
    const trigger = page.locator('.collection-item', { hasText: 'Anima' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.modal-overlay')).toBeVisible();
  });

  test('opening the modal moves focus into it, with correct dialog semantics', async ({ page }) => {
    await page.goto('/collection');
    await page.locator('.collection-item', { hasText: 'Anima' }).click();

    const modal = page.locator('.modal-content');
    await expect(modal).toBeFocused();
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('#collection-modal-title')).toHaveText('Anima');
  });

  test('Shift+Tab immediately after opening wraps to the last control, not out of the dialog', async ({ page }) => {
    // Regression test: the dialog container holds focus on open but isn't
    // itself in the browser's tab order (tabIndex=-1), so a naive trap
    // that only checks the first/last *child* lets Shift+Tab escape
    // straight past the modal into the page behind it.
    await page.goto('/collection');
    await page.locator('.collection-item', { hasText: 'Anima' }).click();
    await expect(page.locator('.modal-content')).toBeFocused();

    await page.keyboard.press('Shift+Tab');

    const stillInside = await page.evaluate(() => {
      const modalEl = document.querySelector('.modal-content');
      return !!document.activeElement && !!modalEl && modalEl.contains(document.activeElement);
    });
    expect(stillInside).toBe(true);
  });

  test('Tab wraps forward from the last control back to the first', async ({ page }) => {
    await page.goto('/collection');
    await page.locator('.collection-item', { hasText: 'Anima' }).click();
    await expect(page.locator('.modal-content')).toBeFocused();

    await page.keyboard.press('Shift+Tab'); // land on the last control
    await page.keyboard.press('Tab'); // wrap forward to the first

    const stillInside = await page.evaluate(() => {
      const modalEl = document.querySelector('.modal-content');
      return !!document.activeElement && !!modalEl && modalEl.contains(document.activeElement);
    });
    expect(stillInside).toBe(true);
  });

  test('Escape closes the modal and restores focus to the trigger', async ({ page }) => {
    await page.goto('/collection');
    const trigger = page.locator('.collection-item', { hasText: 'Anima' });
    await trigger.click();
    await expect(page.locator('.modal-content')).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(page.locator('.modal-overlay')).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe('Page identity', () => {
  const titles: Record<string, RegExp> = {
    '/': /BelleColleen/,
    '/collection': /Collection \| BelleColleen/,
    '/exhibitions': /Exhibitions \| BelleColleen/,
    '/about': /About \| BelleColleen/,
    '/contact': /Contact \| BelleColleen/,
  };

  for (const [path, expected] of Object.entries(titles)) {
    test(`${path} has a distinct, descriptive title`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(expected);
    });
  }
});

test('skip link moves focus to main content', async ({ page }) => {
  await page.goto('/collection');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});
