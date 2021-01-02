// https://github.com/newsdev/archieml-js
// TODO:
// - Remove styles from item keys
// - Make keys case insensitive (lowercase all)

// const config = fs.readFileSync(env.CONFIG_PATH)

const { google } = require("googleapis");
const archieml = require("archieml");
const fs = require("fs");
const url = require("url");
const htmlparser = require("htmlparser2");
const Entities = require("html-entities").AllHtmlEntities;

const config = JSON.parse(fs.readFileSync("./config.json"));
const fileId = config.archie.gdoc;
const archieOutput = config.archie.output;
const keyFile = config.archie.apiConfig;

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

const parse = (data) => {
  return new Promise((res, rej) => {
    const handler = new htmlparser.DomHandler(function (error, dom) {
      if (error) {
        rej(error);
        return;
      }
      const tagHandlers = {
        _base: function (tag) {
          let str = "";
          tag.children.forEach(function (child) {
            if ((func = tagHandlers[child.name || child.type]))
              str += func(child);
          });
          return str;
        },
        text: function (textTag) {
          return textTag.data;
        },
        span: function (spanTag) {
          const style = spanTag.attribs.style;
          let str = tagHandlers._base(spanTag);
          if (style && style.includes("font-weight:700")) {
            str = `<b>${str}</b>`;
          }
          if (style && style.includes("font-style:italic")) {
            str = `<em>${str}</em>`;
          }
          return str;
        },
        p: function (pTag) {
          return tagHandlers._base(pTag) + "\n";
        },
        a: function (aTag) {
          let href = aTag.attribs.href;
          if (href === undefined) return "";

          // extract real URLs from Google's tracking
          // from: http://www.google.com/url?q=http%3A%2F%2Fwww.nytimes.com...
          // to: http://www.nytimes.com...
          if (
            aTag.attribs.href &&
            url.parse(aTag.attribs.href, true).query &&
            url.parse(aTag.attribs.href, true).query.q
          ) {
            href = url.parse(aTag.attribs.href, true).query.q;
          }

          let str = '<a href="' + href + '">';
          str += tagHandlers._base(aTag);
          str += "</a>";
          return str;
        },
        li: function (tag) {
          return "* " + tagHandlers._base(tag) + "\n";
        },
      };

      ["ul", "ol"].forEach(function (tag) {
        tagHandlers[tag] = tagHandlers.span;
      });
      ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(function (tag) {
        tagHandlers[tag] = tagHandlers.p;
      });

      const body = dom[0].children[1];
      let parsedText = tagHandlers._base(body);

      // Convert html entities into the characters as they exist in the google doc
      const entities = new Entities();
      parsedText = entities.decode(parsedText);

      // Remove smart quotes from inside tags
      parsedText = parsedText.replace(/<[^<>]*>/g, function (match) {
        return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
      });

      const parsed = archieml.load(parsedText);
      res(parsed);
    });
    const parser = new htmlparser.Parser(handler);
    parser.write(data);
    parser.end();
  });
};
drive.files
  .export({ fileId: fileId, mimeType: "text/html" })
  .then((res) => {
    return parse(res.data);
  })
  .then((res) => fs.writeFileSync(archieOutput, JSON.stringify(res)))
  .catch(console.error);
