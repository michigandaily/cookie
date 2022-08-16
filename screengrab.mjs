import { spawn, exec } from "node:child_process";
import {
  writeFileSync,
  existsSync,
  readFileSync,
  mkdirSync,
  watch,
} from "node:fs";

import { launch } from "puppeteer-core";
import { findChrome } from "find-chrome-bin";

const CHROME_FILE = "chrome.json";
const IMAGE_PATH = "./img";

const watchForImage = (format) =>
  new Promise((res) => {
    // eslint-disable-next-line prefer-const
    let watcher;

    const timeout = setTimeout(() => {
      console.log("Did not download image");
      watcher.close();
      res();
    }, 60000);

    watcher = watch(IMAGE_PATH, (e, name) => {
      if (e === "rename" && name.endsWith(format)) {
        watcher.close();
        clearTimeout(timeout);
        res();
      }
    });
  });

const main = async () => {
  const { executablePath } = existsSync(CHROME_FILE)
    ? JSON.parse(readFileSync(CHROME_FILE))
    : await findChrome();

  if (!existsSync(CHROME_FILE)) {
    writeFileSync(
      CHROME_FILE,
      JSON.stringify({ executablePath: executablePath })
    );
  }

  if (!existsSync(IMAGE_PATH)) {
    mkdirSync(IMAGE_PATH);
  }

  exec("lsof -i :8000 -t | xargs kill");
  const server = spawn("python3", ["-m", "http.server", "--directory", "dist"]);
  const browser = await launch({ executablePath, headless: false });

  const page = await browser.newPage();

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: IMAGE_PATH,
  });

  const screenSizes = [780, 338, 288];

  for await (const size of screenSizes) {
    await page.goto(`http://localhost:8000?width=${size}`);

    const pngButton = await page.waitForSelector("#download-png");
    pngButton.click();
    await watchForImage("png");

    const svgButton = await page.waitForSelector("#download-svg");
    svgButton.click();
    await watchForImage("svg");
  }

  await page.close();
  await browser.close();
  server.kill("SIGKILL");
};

main();
