
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', {
      name: 'Streamhub Campaign Analytics'
    });

    this.totalCampaigns = page.getByTestId('total-campaigns');
    this.totalImpressions = page.getByTestId('total-impressions');
    this.averageClickRate = page.getByTestId('average-click-rate');
    this.chartBars = page.getByTestId('chart-bar');

    this.campaignName = page.getByRole('textbox', {
      name: 'Campaign name'
    });
    this.impressions = page.getByRole('spinbutton', {
      name: 'Impressions'
    });
    this.clicks = page.getByRole('spinbutton', {
      name: 'Clicks'
    });
    this.generateButton = page.getByRole('button', {
      name: 'Generate Report'
    });

    this.reportResult = page.locator('#report-result');
    this.resultName = page.locator('#result-name');
    this.resultRate = page.locator('#result-rate');
    this.validationError = page.getByRole('alert');
  }

  async open(url) {
    await this.page.goto(url);
    await expect(this.heading).toBeVisible();
  }

  async verifySummaryMetrics() {
    await expect(this.totalCampaigns).toHaveText('120');
    await expect(this.totalImpressions).toHaveText('240000');
    await expect(this.averageClickRate).toHaveText('2.5%');
  }

  async verifyChart() {
    await expect(this.chartBars).toHaveCount(4);

    for (let i = 0; i < await this.chartBars.count(); i++) {
      await expect(this.chartBars.nth(i)).toBeVisible();

      const height = await this.chartBars.nth(i).evaluate(
        element => element.getBoundingClientRect().height
      );

      expect(height).toBeGreaterThan(0);
    }
  }

  async generateReport(name, impressions, clicks) {
    await this.campaignName.fill(name);
    await this.impressions.fill(String(impressions));
    await this.clicks.fill(String(clicks));
    await this.generateButton.click();
  }
}

module.exports = DashboardPage;
