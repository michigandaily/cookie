import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";

import { build, preview } from "vite";
import { config as parseEnvironmentVariables } from "dotenv";
import { chromium } from "playwright-core";
import { installBrowsersForNpmInstall } from "playwright-core/lib/server";

const readJson = (path) => JSON.parse(readFileSync(path).toString());

const getBrowser = async () => {
  let browser;
  if (existsSync(chromium.executablePath())) {
    browser = await chromium.launch();
  } else {
    try {
      browser = await chromium.launch({
        channel: "chrome",
      });
    } catch {
      console.log(
        "Could not open Chrome. Installing to Playwright cache",
        chromium.executablePath()
      );
      await installBrowsersForNpmInstall(["chromium"]);
      browser = await chromium.launch();
    }
  }

  return browser;
};

const main = async () => {
  const config = readJson("./config.json");
  const entries = Object.keys(config.entries);

  if (existsSync(".env")) {
    parseEnvironmentVariables();
  }

  const sc = process.env.COOKIE_SCREENSHOT;
  const shouldScreenshot = sc === undefined ? true : sc === "true";

  await build();
  const previewServer = await preview();
  const baseUrl = previewServer.resolvedUrls.local.pop();

  let browser;
  if (shouldScreenshot) {
    try {
      browser = await getBrowser();
    } catch (e) {
      console.log("Could not start browser. Skipping screenshot process");
      console.error(e);
    }
  }

  if (!browser) {
    previewServer.httpServer.close();
    return;
  }
  const page = await browser.newPage();
  const screenSizes = [780, 338, 288];

  const downloadAndSave = async (entry, size, format) => {
    await page.locator("#graphic > iframe").waitFor("attached");
    await page.mainFrame().childFrames().pop().waitForLoadState("networkidle");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      await page.locator(`button#download-${format}`).click(),
    ]);

    const entryName = basename(entry, ".html");
    const path = `./img/cookie-graphic-${entryName}-${size}-${new Date().toISOString()}.${format}`;
    console.log("Saving screenshot to", path);
    await download.saveAs(path);
  };

  const shots = entries
    .map((entry) => screenSizes.map((size) => ({ entry, size })))
    .flat();

  for await (const { entry, size } of shots) {
    await page.goto(`${baseUrl}?width=${size}&entry=${entry}`, {
      waitUntil: "networkidle",
    });
    await downloadAndSave(entry, size, "png");
    await downloadAndSave(entry, size, "svg");
  }
  await browser.close();
  previewServer.httpServer.close();
};

main();
