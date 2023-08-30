const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const {pathMaker} = require('../utils/path.js');

async function jsonize(jsonizedPath, filePath) {
  // try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const allData = [];

    workbook.eachSheet((worksheet, sheetId) => {
      const xlsxJsonData = [];

      worksheet.eachRow((row, rowNumber) => {
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          rowData[`column_${colNumber}`] = cell.value;
        });
        xlsxJsonData.push(rowData);
      });

      allData.push({ sheetName: worksheet.name, data: xlsxJsonData });
    });

    const stringifiedXlsxFiltered = JSON.stringify(allData, null, 2);

    if (!fs.existsSync(jsonizedPath)) {
      fs.mkdirSync(jsonizedPath, { recursive: true });
    }

    const outputFileName = 'data.json';
    const outputPath = path.join(jsonizedPath, outputFileName);
    fs.writeFileSync(outputPath, stringifiedXlsxFiltered);
    console.log(`Data written to ${outputPath}`);
  // } catch (err) {
  //   console.log(`Error: Unable to process the file ${filePath}`);
  // }
}


const fileName = 'CRU FERTILIZER WEEK-Historical Prices Averages-Weekly Report (20230707)-60431[1].xlsx'
const jsonizedPath = pathMaker('..','toJson','json');
const filePath = pathMaker('..', 'toJson', 'xlsx',fileName);

jsonize(jsonizedPath, filePath);
