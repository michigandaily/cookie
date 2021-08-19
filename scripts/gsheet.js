import { google } from "googleapis";
import { readFileSync, writeFileSync } from "fs";
import { csvFormat } from "d3-dsv";

const config = JSON.parse(readFileSync("./config.json"));
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
  const csv = Array();

  const sheet = res.data.sheets.pop();
  const data = sheet.data.pop();
  const headers = data.rowData.shift().values.map(h => h.formattedValue);

  const headerToValue = (d, i) => [headers[i], d.formattedValue || String()];

  data.rowData.forEach(row => {
    csv.push(Object.fromEntries(row.values.map(headerToValue)));
  });

  return csvFormat(csv, headers);
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
  .then(csv => writeFileSync(output, csv))
  .catch(console.error);
