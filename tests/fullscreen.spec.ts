import { test, expect } from '@playwright/test';

test.describe('Collection modal fullscreen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collection');
    await page.locator('.collection-item', { hasText: 'Anima' }).click();
    await expect(page.locator('.modal-overlay')).toBeVisible();
  });

  test('toggles the browser Fullscreen API and updates the icon/title', async ({ page }) => {
    const modal = page.locator('.modal-overlay');
    const fullscreenButton = page.locator('.modal-control-button').first();

    await expect(fullscreenButton).toHaveAttribute('title', 'Enter Fullscreen');
    expect(await page.evaluate(() => !!document.fullscreenElement)).toBe(false);

    await fullscreenButton.click();
    await expect(modal).toHaveClass(/fullscreen/);
    await expect(fullscreenButton).toHaveAttribute('title', 'Exit Fullscreen');
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);

    await fullscreenButton.click();
    await expect(modal).not.toHaveClass(/fullscreen/);
    await expect(fullscreenButton).toHaveAttribute('title', 'Enter Fullscreen');
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  });

  test('hides controls after idling in fullscreen, and reveals them on mouse move', async ({ page }) => {
    await page.clock.install();

    const modal = page.locator('.modal-overlay');
    await page.locator('.modal-control-button').first().click();
    await expect(modal).toHaveClass(/fullscreen/);
    await expect(modal).not.toHaveClass(/controls-hidden/);

    await page.clock.fastForward('00:06'); // idle timeout is 5s
    await expect(modal).toHaveClass(/controls-hidden/);

    await page.mouse.move(200, 200);
    await expect(modal).not.toHaveClass(/controls-hidden/);
  });

  test('closing the modal exits fullscreen', async ({ page }) => {
    const modal = page.locator('.modal-overlay');
    await page.locator('.modal-control-button').first().click();
    await expect(modal).toHaveClass(/fullscreen/);
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);

    await page.locator('.modal-close').click();
    await expect(modal).toBeHidden();
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  });

  test('a denied fullscreen request does not throw or get stuck', async ({ page }) => {
    // Simulate a browser that refuses the request (permissions policy, no
    // user activation, etc.) and make sure the app degrades gracefully
    // instead of leaving the UI in a stuck "fullscreen" state or throwing.
    await page.evaluate(() => {
      Element.prototype.requestFullscreen = () =>
        Promise.reject(new TypeError('not granted'));
    });

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    const modal = page.locator('.modal-overlay');
    const fullscreenButton = page.locator('.modal-control-button').first();

    await fullscreenButton.click();
    await page.waitForTimeout(200); // let the rejected promise settle

    await expect(modal).not.toHaveClass(/fullscreen/);
    await expect(fullscreenButton).toHaveAttribute('title', 'Enter Fullscreen');
    expect(errors).toEqual([]);
  });
});
