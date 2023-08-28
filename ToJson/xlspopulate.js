const { pathMaker } = require('../USAID/path.js');
const path = require('path');
const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');

async function jsonize(jsonizedPath, unzipPath, xls_unzipped_files, pageNum) {
  const filePath = path.join(unzipPath, xls_unzipped_files[0]);
  console.log(filePath);
  
  try {
    const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const sheet = workbook.sheet(pageNum);

    const xlsxJsonData = sheet.usedRange().value();
    const stringifiedXlsxData = JSON.stringify(xlsxJsonData, null, 2);

    if (!fs.existsSync(jsonizedPath)) 
      fs.mkdirSync(jsonizedPath, { recursive: true });

    const jsonizedFilePath = path.join(jsonizedPath, 'data.json');
    fs.writeFileSync(jsonizedFilePath, stringifiedXlsxData);
    console.log(`Data written to ${jsonizedFilePath}`);
  } catch (err) {
    console.log(`Error: jsonize can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`);
  }
}

async function main() {
  // TO BE SET
  const fileName = 'CRU FERTILIZER WEEK-Historical Prices Averages-Weekly Report (20230707)-60431[1].xlsx';
  const jsonizedPath = pathMaker('..', 'toJson', 'json');
  const filePath = pathMaker('..', 'toJson', 'xlsx');
  const pageNum = 1;
  await jsonize(jsonizedPath, filePath, [fileName], pageNum);
}

main();
