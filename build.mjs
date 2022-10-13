import { readFileSync } from "node:fs";
import { normalize } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import { Parcel } from "@parcel/core";

const main = async () => {
  const pkg = JSON.parse(readFileSync("./package.json").toString());

  const publicUrl = pkg.targets.default.publicUrl;
  const port = 1234;

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

  const subscriber = await bundler.watch();

  const browser = await chromium.launch({
    channel: "chrome",
  });

  const page = await browser.newPage();
  const screenSizes = [780, 338, 288];

  const downloadAndSave = async (width, format) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator(`button#download-${format}`).click(),
    ]);

    const path = `./img/cookie-graphic-${new Date().toISOString()}-${width}.${format}`;
    console.log("Saving screenshot to", path);
    await download.saveAs(path);
  };

  for await (const size of screenSizes) {
    await page.goto(
      `http://localhost:${port}${normalize(`/${publicUrl}/`)}?width=${size}`
    );
    await downloadAndSave(size, "png");
    await downloadAndSave(size, "svg");
  }

  await browser.close();
  await subscriber.unsubscribe();
};

main();
