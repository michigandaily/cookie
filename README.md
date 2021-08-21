# Cookie

> The bite-sized daily graphics starter.

This template repository is designed to help The Michigan Daily data team quickly start up and produce data visualizations to embed on [michigandaily.com](https://michigandaily.com).

It has several useful features:

- [X] MicroCMS with ArchieML
- [X] Bundling with Parcel
- [X] D3v7 as a dependency by default
- [X] Easy deploy to Github Pages
- [X] Preview screen with embed URL
- [X] Data ingest from Google Sheets
- [ ] Easy deploy to S3 bucket

## Using this template

Clone this repository, then run `make init` to initialize the project. If the project has already been initialized, just run `make install` to install the dependencies.

You can use `make dev` to start a development server, `make build` to build files into `dist/`, and `make build-prod` to build a production site (with analytics) into `dist/`

Edit the files in `src/`. To build graphics, you should only be editing files within the `src/graphic/` directory. You can write any markup in `src/graphic/index.html`, and Javascript in `src/graphic/js/graphic.js`, and any styles in `src/graphic/css/graphic.scss`.

There are some SCSS variables available to you:

- `$serif` for serif font (Lora)
- `$sans` for sans serif font (Open Sans)
- `$blue`, `$maize`, `$gray`, `$black`, `$white`, and `$blue-{1..5}` for colors

### Fetching from Google Drive

Download our service account credentials file (`auth.json`) and put it in the root of this repository.

#### Fetching HTML from a Google Doc

Consider the following generalized URL:

`https://docs.google.com/document/d/FILE_ID/edit`

1. In `config.json`, put `FILE_ID` in `fetch.archie.id`.
2. Put a path where the JSON-ified AML should go in `fetch.archie.output`. This path should probably be somewhere in `src/graphic`.
3. Run `make gdoc` to fetch the specified doc.

#### Fetching a CSV from a Google Sheet

Consider the following generalized URL:

`https://docs.google.com/spreadsheets/d/FILE_ID/edit#gid=SHEET_ID`

1. In `config.json`, put `FILE_ID` in `fetch.sheets.id`.
2. Put `SHEET_ID` in `fetch.sheets.sheetId`.
3. Put a path where the CSV should go in `fetch.sheets.output`. This path should probably be somewhere in `src/graphic`.
4. Run `make gsheet` to fetch the specified sheet.

## Deploying to GitHub Pages

1. Run `make gh-pages`
2. Go to [`Settings > Pages`](../../settings/pages) and check the **Enforce HTTPS** option. All of our sites should enforce https, so please make sure to double check this!
3. Your raw graphic will be accessible at `https://datagraphics.michigandaily.com/<repository-name>/graphic/index.html`
