import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Credit Card Validator', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:8080';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: true,
      // slowMo: 20,
      devtools: false,
    });

    page = await browser.newPage();

    await page.goto(baseUrl);
    await page.waitForSelector('.credit-card-widget');
  });

  afterAll(async () => {
    if (page && !page.isClosed()) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
    if (server) {
      server.kill();
    }
  });

  test('should find rendered widget on page', async () => {
    await page.waitForSelector('.credit-card-widget');
  });

  function hasClass(elem, className) {
    return elem.evaluate((elem, className) => {
      return elem.classList.contains(className);
    }, className);
  }

  async function isVisible(elem) {
    const inv = await hasClass(elem, 'inv');
    return !inv;
  }

  test.each([
    ['7715964180', true],
    ['4275 8318 0246 1377', true],
    ['01042-0172', true],
    ['0 1 0 4 2 0 1 7 2', true],
    ['4275 8318 0246 1372', false],
    ['4276 8440 2783 3693', false],
  ])('should insert and check invalid card numbers', async (cardNum, isValid) => {
    const widget = await page.$('.credit-card-widget');
    const input = await widget.$('input');
    const validateBtn = await widget.$('#validate');
    const check = await widget.$('.check-ico');
    const cross = await widget.$('.cross-ico');

    await input.type(cardNum);
    await validateBtn.click();

    const crossVisible = await isVisible(cross);
    const checkVisible = await isVisible(check);

    if (isValid) {
      expect(crossVisible).toBe(false);
      expect(checkVisible).toBe(true);
    } else {
      expect(crossVisible).toBe(true);
      expect(checkVisible).toBe(false);
    }

    await input.evaluate(el => el.value = '');
  });
});