// We will allow sync in these scripts.
/* eslint-disable no-sync */

const fs = require("fs-extra");
const glob = require("glob");
const nunjucks = require("nunjucks");

const bindData = (obj, data) => ({
    data,
    ...(typeof obj === "string" && obj !== null ? { obj } : obj),
  }),
  config = JSON.parse(fs.readFileSync("./config.json", "utf-8")),
  log = (obj) => {
    console.log(obj);
    return obj;
  },
  readFile = (path) => ({
    meta: {
      path,
    },
    content: fs.readFileSync(path, "utf-8"),
  }),
  renderNunjucks = (obj) => {
    const { data, content } = obj,
      output = nunjucks.renderString(content, data);
    nunjucks.configure({ autoescape: false });
    return { ...obj, content: output };
  },
  writeFile = (obj) => {
    const { meta, content } = obj;
    const outfile = meta.path.replace(
      config.render.srcDir,
      config.render.buildDir
    );
    fs.outputFile(outfile, content);
    console.log(`Rendered ${meta.path} -> ${outfile}`);
  };

// let archie = {};
// if (config.archie) {
//   archie = JSON.parse(fs.readFileSync(config.archie.output));
// }

// Ensure build directory exists
fs.mkdirpSync(config.render.buildDir);
fs.copySync(config.render.srcDir, config.render.buildDir);

glob
  .sync(`${config.render.srcDir}/**/*.html`)
  .map(readFile)
  .map((obj) =>
    bindData(obj, {
      config,
    })
  )
  .map(renderNunjucks)
  .map(writeFile);
