# Cookie

> The bite-sized daily graphics starter.

This template repository is designed to help the Michigan Daily data team
quickly start up and produce data visualizations to embed on
[michigandaily.com](https://michigandaily.com).

It has several useful features:

- [X] MicroCMS with ArchieML
- [X] Bundling with Parcel
- [X] D3v6 as a dependency by default
- [X] Easy deploy to Github pages
- [ ] Preview screen with embed code (WIP)
- [ ] Data ingest from Google sheets (WIP)
- [ ] Easy deploy to S3 bucket (planned)

## Using this template

Clone this repository, then run `make init` to initialize the project. If the
project has already been initialized, just run `yarn` to install the
dependencies.

You can use `make dev` to start a development server, `make build` to build
files into `dist/`, and `make build-prod` to build a production site (with
analytics) into `dist/`

Edit the files in `src/`. To build graphics, you should only be editing files
within the `src/graphic/` directory. You can write any markup in
`src/graphic/index.html`, and Javascript in `src/graphic/js/graphic.js`, and any
styles in `src/graphic/css/graphic.scss`.

There are some SCSS variables available to you:

- `$serif` for serif font (Lora)
- `$sans` for sans serif font (Open Sans)
- `$blue`, `$maize`, `$gray`, `$black`, `$white`, and `$blue-{1..5}` for colors

Finally, to deploy to _magnify_, copy the `dist/graphic/` repository to the
your magnify folder and push.
