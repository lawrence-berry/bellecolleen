import { test, expect } from '@playwright/test';

test.describe('Collection gallery slideshow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collection');
  });

  test('header button opens the modal and starts the slideshow', async ({ page }) => {
    await page.locator('.collection-slideshow-button').click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible();

    const toggleButton = page.locator('.modal-control-button').nth(1);
    await expect(toggleButton).toHaveAttribute('title', 'Pause Slideshow');
  });

  test('play/pause button toggles slideshow state and icon', async ({ page }) => {
    // Open the modal on a specific item without starting the slideshow.
    await page.locator('.collection-item', { hasText: 'Anima' }).click();
    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible();

    const toggleButton = page.locator('.modal-control-button').nth(1);
    await expect(toggleButton).toHaveAttribute('title', 'Start Slideshow');

    // Start
    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('title', 'Pause Slideshow');
    await expect(toggleButton.locator('path')).toHaveAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');

    // Pause
    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('title', 'Start Slideshow');
    await expect(toggleButton.locator('path')).toHaveAttribute('d', 'M8 5v14l11-7z');
  });

  test('slideshow auto-advances to the next slide while playing, and stops on pause', async ({ page }) => {
    await page.clock.install();

    await page.locator('.collection-item', { hasText: 'Anima' }).click();
    await expect(page.locator('.modal-title')).toHaveText('Anima');

    const toggleButton = page.locator('.modal-control-button').nth(1);
    await toggleButton.click(); // start slideshow

    await page.clock.fastForward('00:10'); // 10s interval
    await expect(page.locator('.modal-title')).toHaveText('Bollingen');

    await toggleButton.click(); // pause slideshow

    await page.clock.fastForward('00:30');
    await expect(page.locator('.modal-title')).toHaveText('Bollingen');
  });

  test('closing the modal resets the slideshow', async ({ page }) => {
    await page.locator('.collection-slideshow-button').click();
    const toggleButton = page.locator('.modal-control-button').nth(1);
    await expect(toggleButton).toHaveAttribute('title', 'Pause Slideshow');

    await page.locator('.modal-close').click();
    await expect(page.locator('.modal-overlay')).toBeHidden();

    // Reopening starts paused again.
    await page.locator('.collection-item', { hasText: 'Anima' }).click();
    await expect(page.locator('.modal-control-button').nth(1)).toHaveAttribute('title', 'Start Slideshow');
  });
});
