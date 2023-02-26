# cookie

> The bite-sized daily graphics starter.

This template repository is designed to help The Michigan Daily data team quickly start up and produce data visualizations to embed on [michigandaily.com](https://michigandaily.com).

It has several useful features:

- [x] MicroCMS with [ArchieML](http://archieml.org/)
- [x] Bundling with [Vite](https://vitejs.dev/)
- [x] [D3v7](https://d3js.org/) as a dependency by default
- [x] [bore](https://github.com/MichiganDaily/bore) as a dependency by default
- [x] Templating with [Nunjucks](https://mozilla.github.io/nunjucks/)
- [x] Easy deploy to GitHub Pages
- [x] Easy deploy to S3 bucket
- [x] Preview screen with embed URL
- [x] Data ingest from Google Sheets
- [x] Easy include of [ai2html](http://ai2html.org/) output
- [x] Ability to develop several common graphics in one repository

## Using this template

Click the green "Use this template" button to create a new instance of the `cookie` template. Then, clone the new instance and run `yarn install` to initialize the project.

You can use `yarn dev` to start a development server and `yarn build` to build production-ready files into `dist/`.

Edit the files in `src/`. To create graphics, you should only be editing files within the `src/graphic/` directory. You can write any markup in `src/graphic/index.html`, and JavaScript in `src/graphic/js/graphic.js`, and any styles in `src/graphic/css/graphic.scss`.

There are some [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) available to you:

- `--serif` for serif font (Lora)
- `--sans` for sans serif font (Open Sans)
- `--blue`, `--maize`, `--gray`, `--black`, `--white`, and `--blue-{1..5}` for colors

If you are embedding the graphic on the homepage, add the `homepage` class to the `body` tag. This will set the headline font to Lora, and will set the body font to Open Sans.

If you want to develop another graphic in the same instance, create a new HTML file in `src/graphic` that uses the `base.html` template. Refer to `src/graphic/index.html` for how to extend the template. You'll also need to create a new entry in `config.json`.

### Fetching from Google Drive

Refer to the [Google Drive fetch](https://github.com/MichiganDaily/sink/tree/main#google-drive-fetch) section in the `sink` README for instructions on how to set up `config.json` for fetching files from Google Drive.

You can import a JSON file in JS like this:

```js
import copy from "../data/data.json";
```

You can import a CSV file in JS like this:

```js
import csvfile from "../data/data.csv";
```

We use the [`@michigandaily/rollup-plugin-dsv`](https://github.com/MichiganDaily/rollup-plugin-dsv) plugin (which relies on [`d3-dsv`](https://github.com/d3/d3-dsv)) to parse CSV files (or other [DSV](https://en.wikipedia.org/wiki/Delimiter-separated_values) files) into usable arrays. You can prevent automatic typing by adding a `autoType=false` query parameter to the end of the import path. You can also specify which columns you want imported with a `columns` query parameter. Refer to the [transformer README](https://github.com/MichiganDaily/rollup-plugin-dsv#readme) for examples.

### Including `ai2html` output

1. Use our Adobe Illustrator [template](https://drive.google.com/file/d/1TN1c2nDiyhy91YwucmvwxFhdlnTAq0C4/view?usp=sharing) to create a graphic.
2. Save the instance to the root of this repository.
3. Set the red and bold `filename` value under the `ai2html-text` section to the name of the instance file name.
4. Generate the ai2html output. It should be in `src/graphic/ai2html-output`.
5. In `config.json`, set `illustrator_output_filename` to the HTML output file.

### Deploying to AWS S3

Refer to the [AWS S3 deployment with cache invalidation](https://github.com/MichiganDaily/sink/tree/main#aws-s3-deployment-with-cache-invalidation) section in the `sink` README for instructions on how to set up `config.json` for deploying to AWS S3.

1. Ensure sure that `base` in `vite.config.js` is routed correctly (it should probably be `config.key` prepended and appended by a `/`).
2. Run `yarn sink deploy aws`.

### Deploying to GitHub Pages

Refer to the [GitHub Pages deployment](https://github.com/MichiganDaily/sink/tree/main#github-pages-deployment) section in the `sink` README for instructions on how to set up `config.json` for deploying to GitHub Pages.

1. Ensure sure that `base` in `vite.config.js` is routed correctly (it should probably be `config.key` prepended and appended by a `/`).
2. Run `yarn sink deploy github`.
3. Go to [`Settings > Pages`](../../settings/pages) and check the **Enforce HTTPS** option. All of our sites should enforce HTTPS, so please make sure to double check this!
4. Your raw graphic will be accessible at `https://michigandaily.github.io/<repository-name>/graphic/index.html`.

### Playwright screenshots

Running `yarn build` will 1) build production files and 2) trigger a process where Playwright spawns a headless Chrome browser and downloads screenshots of the graphics. If the script is unable to find a cached version of Chrome or is unable to use your default Chrome installation, it will install Chrome in a cache folder.

If you don't want `yarn build` to trigger the Playwright process, set `COOKIE_SCREENSHOT=false` in a `.env` file.

You can also prevent the screenshot process by setting the environment variable inline prior to a command: `COOKIE_SCREENSHOT=false yarn build` or `COOKIE_SCREENSHOT=false yarn sink deploy github`.
