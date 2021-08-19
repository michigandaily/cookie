const { google } = require("googleapis");
const fs = require("fs");

const config = require("./../config.json");
const spreadsheetId = config.fetch.sheets.id;
const sheetId = config.fetch.sheets.sheetId;
const output = config.fetch.sheets.output;
const keyFile = config.fetch.sheets.auth;

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets"
  ],
});

const sheet = google.sheets({ version: "v4", auth: auth });

const parse = res => {
  let csv = String();

  res.data.sheets.forEach(sheet => {
    const data = sheet.data.pop();
    data.rowData.forEach(row => {
      row.values.forEach(v => {
        csv += `"${v.formattedValue || String()}",`
      });
      csv += "\n";
    });
  });

  return csv.replaceAll(",\n", "\n");
};

sheet.spreadsheets.getByDataFilter(
  {
    spreadsheetId: spreadsheetId,
    requestBody: {
      includeGridData: true,
      dataFilters: [{ gridRange: { sheetId: sheetId } }]
    }
  })
  .then(parse)
  .then(csv => fs.writeFileSync(output, csv))
  .catch(console.error);