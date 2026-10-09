const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { baseUrl } = require('../../config/env');

Given('I open the Streamhub dashboard', async function () {
  await this.page.goto(baseUrl);
  await expect(
    this.page.getByRole('heading', { name: 'Streamhub Campaign Analytics' })
  ).toBeVisible();
});

Then('I should see the campaign summary metrics', async function () {
  await expect(this.page.getByTestId('total-campaigns')).toHaveText('120');
  await expect(this.page.getByTestId('total-impressions')).toHaveText('240000');
  await expect(this.page.getByTestId('average-click-rate')).toHaveText('2.5%');
});

Then('I should see the campaign performance chart with visible bars', async function () {
  const bars = this.page.getByTestId('chart-bar');
  await expect(bars).toHaveCount(4);

  for (let i = 0; i < await bars.count(); i++) {
    await expect(bars.nth(i)).toBeVisible();
    const height = await bars.nth(i).evaluate(el => el.getBoundingClientRect().height);
    expect(height).toBeGreaterThan(0);
  }
});

When(
  'I generate a report for campaign {string} with {int} impressions and {int} clicks',
  async function (name, impressions, clicks) {
    await this.page.getByRole('textbox', { name: 'Campaign name' }).fill(name);
await this.page.getByRole('spinbutton', { name: 'Impressions' }).fill(String(impressions));
await this.page.getByRole('spinbutton', { name: 'Clicks' }).fill(String(clicks));
    await this.page.getByRole('button', { name: 'Generate Report' }).click();
  }
);

Then('the report should show campaign {string}', async function (name) {
  await expect(this.page.locator('#report-result')).toBeVisible();
  await expect(this.page.locator('#result-name')).toHaveText(name);
});

Then('the calculated click-through rate should be {string}', async function (rate) {
  await expect(this.page.locator('#result-rate')).toHaveText(rate);
});

Then('I should see a validation error', async function () {
  await expect(this.page.getByRole('alert')).toContainText('clicks between zero and impressions');
  await expect(this.page.locator('#report-result')).toBeHidden();
});