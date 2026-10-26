const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
test('V10 XXL finder is accessible, opens inline and closes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8765/v10/', { waitUntil: 'load' });
  const tabs = page.locator('#tabs button');
  await expect(tabs.first()).toBeVisible({ timeout: 15000 });
  const textTab = tabs.filter({ hasText: /text|wand|plakat/i }).first();
  await expect(textTab).toBeVisible();
  await textTab.click();
  const button = page.locator('#bds10-text-xxl-open');
  await expect(button).toBeVisible({ timeout: 10000 });
  const scene = page.getByText(/AKTUELLE SZENE\s*[·•:-]?\s*LIVE/i).first();
  await expect(scene).toBeVisible();
  await expect.poll(async () => button.evaluate(el => {
    const sceneHeading = [...document.querySelectorAll('#content h1,#content h2,#content h3,#content h4')].find(n => /AKTUELLE\s+SZENE.*LIVE/i.test(n.textContent));
    const card = sceneHeading?.closest('.panel,section,article');
    return Boolean(card && (el.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING));
  })).toBe(true);
  await button.click();
  await expect(page.locator('#bds10-inline-xxl')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#bds10-inline-xxl select').last()).toBeVisible();
  await expect(button).toContainText(/SCHLIESSEN/i);
  await button.click();
  await expect(page.locator('#bds10-inline-xxl')).toHaveCount(0);
  expect(errors, 'Uncaught JavaScript errors').toEqual([]);
});
test('V10 preserves camera quick access in Text view', async ({ page }) => {
  await page.goto('http://127.0.0.1:8765/v10/', { waitUntil: 'load' });
  const textTab = page.locator('#tabs button').filter({ hasText: /text|wand|plakat/i }).first();
  await textTab.click();
  await expect(page.getByText(/KAMERA\s*[·•:-]\s*SCHNELLZUGRIFF/i).first()).toBeVisible();
});
