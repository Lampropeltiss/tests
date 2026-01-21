import puppeteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000); // default puppeteer timeout

describe("Credit Card Validator", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:8080";

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // slowMo: 20,
      devtools: false,
    });

    page = await browser.newPage();

    await page.goto(baseUrl);
    await page.waitForSelector(".credit-card-widget");
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

  test("should find rendered widget on page", async () => {
    const widget = await page.waitForSelector(".credit-card-widget");
    expect(widget).toBeTruthy();
  });

  test.each([
    "7715964180",
    "4275 8318 0246 1377",
    "01042-0172",
    "0 1 0 4 2 0 1 7 2",
  ])("should insert and check valid card numbers", async (cardNum) => {
    const widget = await page.$(".credit-card-widget");
    const input = await widget.$("input");
    const validateBtn = await widget.$("#validate");

    await input.type(cardNum);
    await validateBtn.click();

    const check = await widget.$(".check-ico");
    const cross = await widget.$(".cross-ico");

    const isCheckVisible = await check.isIntersectingViewport();
    const isCrossVisible = await cross.isIntersectingViewport();

    expect(isCheckVisible).toBe(true); // check-ico виден
    expect(isCrossVisible).toBe(false); // cross-ico не виден

    await input.evaluate((el) => (el.value = ""));
  });

  test.each(["4275 8318 0246 1372", "4276 8440 2783 3693"])(
    "should insert and check invalid card numbers",
    async (cardNum) => {
      const widget = await page.$(".credit-card-widget");
      const input = await widget.$("input");
      const validateBtn = await widget.$("#validate");

      await input.type(cardNum);
      await validateBtn.click();

      const check = await widget.$(".check-ico");
      const cross = await widget.$(".cross-ico");

      const isCheckVisible = await check.isIntersectingViewport();
      const isCrossVisible = await cross.isIntersectingViewport();

      expect(isCheckVisible).toBe(false); // check-ico не виден
      expect(isCrossVisible).toBe(true); // cross-ico виден

      await input.evaluate((el) => (el.value = ""));
    },
  );
});
