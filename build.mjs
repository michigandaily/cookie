import { readFileSync, existsSync } from "node:fs";
import { normalize, basename } from "node:path";
import { fileURLToPath } from "node:url";

import { Parcel } from "@parcel/core";
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
  const pkg = readJson("./package.json");
  const config = readJson("./config.json");
  const entries = Object.keys(config.entries);

  const publicUrl = pkg.targets.default.publicUrl;
  const port = 1234;
  const baseUrl = `http://localhost:${port}${normalize(`/${publicUrl}/`)}`;

  const bundler = new Parcel({
    entries: ["src/index.html", "src/graphic/*.html"],
    config: "./.parcelrc",
    mode: "production",
    defaultTargetOptions: {
      shouldScopeHoist: false,
      publicUrl,
    },
    serveOptions: {
      port,
      publicUrl,
    },
    additionalReporters: [
      {
        packageName: "@parcel/reporter-cli",
        resolveFrom: fileURLToPath(import.meta.url),
      },
    ],
  });

  if (existsSync(".env")) {
    parseEnvironmentVariables();
  }

  const sc = process.env.COOKIE_SCREENSHOT;
  const shouldScreenshot = sc === undefined ? true : sc === "true";

  let browser;
  if (shouldScreenshot) {
    try {
      browser = await getBrowser();
    } catch (e) {
      console.log("Could not start browser. Skipping screenshot process");
      console.error(e);
    }
  }

  const subscriber = await bundler.watch(async (err, event) => {
    if (err) {
      throw err;
    }

    if (event.type === "buildSuccess") {
      if (!browser) {
        await subscriber.unsubscribe();
        return;
      }
      const page = await browser.newPage();
      const screenSizes = [780, 338, 288];

      const downloadAndSave = async (entry, size, format) => {
        await page.locator("#graphic > iframe").waitFor("attached");
        await page
          .mainFrame()
          .childFrames()
          .pop()
          .waitForLoadState("networkidle");

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
      await subscriber.unsubscribe();
    }
  });
};

main();
