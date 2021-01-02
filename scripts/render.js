const fs = require("fs-extra");
const glob = require("glob");
const nunjucks = require("nunjucks");

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
// Ensure build directory exists
fs.mkdirpSync(config.render.buildDir);
fs.copySync(config.render.srcDir, config.render.buildDir);

let archie;
if (config.archie) {
  archie = JSON.parse(fs.readFileSync(config.archie.output));
}

const data = {
  archie,
  config,
  env: process.env.NODE_ENV,
};

const readFile = (path) => ({
  content: fs.readFileSync(path, "utf-8"),
  meta: {
    path,
  },
});
const bindData = (obj) => {
  obj = typeof obj === "string" && obj !== null ? { obj } : obj;
  return { data, ...obj };
};
const renderNunjucks = (obj) => {
  const { data, content } = obj;
  nunjucks.configure({ autoescape: false });
  const output = nunjucks.renderString(content, data);
  return { ...obj, content: output };
};
const writeFile = (obj) => {
  const { meta, content } = obj;
  const outfile = meta.path.replace(
    config.render.srcDir,
    config.render.buildDir
  );
  fs.outputFile(outfile, content);
  console.log(`Rendered ${meta.path} -> ${outfile}`);
};

glob
  .sync(`${config.render.srcDir}/**/*.html`)
  .map(readFile)
  .map(bindData)
  .map(renderNunjucks)
  .map(writeFile);
