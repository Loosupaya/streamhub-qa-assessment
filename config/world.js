const { Before, After, setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(20000);
const { chromium } = require('@playwright/test');

class CustomWorld {
  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  await this.init();
});

After(async function () {
  await this.close();
});