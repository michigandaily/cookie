# cookie

> The bite-sized daily graphics starter.

This template repository is designed to help The Michigan Daily data team quickly start up and produce data visualizations to embed on [michigandaily.com](https://michigandaily.com).

It has several useful features:

- [x] MicroCMS with [ArchieML](http://archieml.org/)
- [x] Bundling with [Parcel](https://parceljs.org/)
- [x] [D3v7](https://d3js.org/) as a dependency by default
- [x] Templating with [Nunjucks](https://mozilla.github.io/nunjucks/)
- [x] Easy deploy to GitHub Pages
- [ ] Easy deploy to S3 bucket
- [x] Preview screen with embed URL
- [x] Data ingest from Google Sheets
- [x] Easy include of [ai2html](http://ai2html.org/) output
- [x] Ability to develop several common graphics in one repository.

## Using this template

Click the green "Use this template" button to create a new instance of the `cookie` template. Then, clone the new instance and run `make init` to initialize the project.

You can use `yarn dev` to start a development server and `yarn build` to build production-ready files into `dist/`.

Edit the files in `src/`. To build graphics, you should only be editing files within the `src/graphic/` directory. You can write any markup in `src/graphic/index.html`, and JavaScript in `src/graphic/js/graphic.js`, and any styles in `src/graphic/css/graphic.scss`.

There are some SCSS variables available to you:

- `$serif` for serif font (Lora)
- `$sans` for sans serif font (Open Sans)
- `$blue`, `$maize`, `$gray`, `$black`, `$white`, and `$blue-{1..5}` for colors

If you want to develop another graphic in the same instance, create a new HTML file in `src/graphic` that uses the `base.html` template. Refer to `src/graphic/index.html` for how to extend the template. You'll also need to create a new entry in `config.json`.

### Fetching from Google Drive

If you haven't already, download our service account credentials file (`.daily-google-services.json`) and put it in the home directory of your computer.

The credentials file will have a `client_email` property. Share your Google Doc or Google Sheet with the value of this property in order to allow permission to fetch.

Our `config.json` file contains a `fetch` property which has an array of objects as the value. Each object represents a file that will be fetched.

An object must have `id`, `output`, and `auth` properties in order to query for a Google Doc. An object must also have a `sheetId` property to query for a Google Sheet.

The `auth` property of each object is the name of the credentials file. Since `auth` is a property of each object instead of the entire configuration file, we are able to fetch files that come from locations that may require different permissions.

You may fetch as few or as many files as you want.

#### Fetching JSON from a Google Doc

Consider the following generalized URL:

`https://docs.google.com/document/d/FILE_ID/edit`

1. In `config.json`, put `FILE_ID` in `id`.
2. Put a path where the JSON-ified AML should go in `output`. This path should probably be somewhere in `src/graphic`.
3. Run `yarn run sink gdoc` to fetch the specified document.

#### Fetching a CSV from a Google Sheet

Consider the following generalized URL:

`https://docs.google.com/spreadsheets/d/FILE_ID/edit#gid=SHEET_ID`

1. In `config.json`, put `FILE_ID` in `id`.
2. Put `SHEET_ID` in `sheetId`.
3. Put a path where the CSV should go in `output`. This path should probably be somewhere in `src/graphic`.
4. Run `yarn run sink gsheet` to fetch the specified sheet.

### Including `ai2html` output

1. Use our Adobe Illustrator [template](https://drive.google.com/file/d/1TN1c2nDiyhy91YwucmvwxFhdlnTAq0C4/view?usp=sharing) to create a graphic.
2. Save the instance to the root of this repository.
3. Set the red and bold `filename` value under the `ai2html-text` section to the name of the instance file name.
4. Generate the ai2html output. It should be in `src/graphic/ai2html-output`.
5. In `config.json`, set `illustrator_output_filename` to the HTML output file.

## Deploying to GitHub Pages

1. Run `make gh-pages`
2. Go to [`Settings > Pages`](../../settings/pages) and check the **Enforce HTTPS** option. All of our sites should enforce https, so please make sure to double check this!
3. Your raw graphic will be accessible at `https://michigandaily.github.io/<repository-name>/graphic/index.html`
