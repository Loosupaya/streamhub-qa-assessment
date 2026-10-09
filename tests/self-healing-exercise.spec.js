
const { test, expect } = require('@playwright/test');

// INTENTIONAL SELF-HEALING EXERCISE.
// These locators are deliberately brittle or incorrect.
// Keep this file separate from the passing Cucumber suite.

test('Exercise 1 - brittle CSS class locator', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.locator('.blue-button-v1').click();
});

test('Exercise 2 - incorrect heading text', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await expect(page.getByRole('heading', {
    name: 'Sales Overview Dashboard'
  })).toBeVisible();
});

test('Exercise 3 - outdated test ID', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await expect(page.getByTestId('total-sales')).toBeVisible();
});

test('Exercise 4 - brittle positional locator', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.locator('button').nth(8).click();
});
