const { pathMaker } = require('../utils/path.js');
const path = require('path');
// const XLSX = require('xlsx');
const ExcelJS = require('exceljs');

const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');


async function openSheet(jsonizedPath, unzipPath, xls_unzipped_files, pageNum) {
	const filePath = path.join(unzipPath, xls_unzipped_files[0]);
  console.log(filePath);
  
//   try {
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
	return allData
    
//   } catch (err) {
//     console.log(`Error: openSheet can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`);
//   }
}

async function ProductionCapacitiesParser(fileName, jsonizedPath, filePath) {

	const pageNum = 0;
	// try{
	var ProductionCapacities = await openSheet(jsonizedPath, filePath, [fileName], pageNum);
	// }
	// catch(err){
	// 	console.log('error')
	// }
	console.log("hi")
	  console.log(JSON.stringify(ProductionCapacities,null,2));
//   await writingJson(jsonizedPath, allData);
	// return allData
}

ProductionCapacitiesParser('Blending plants Africa[1].xlsx', pathMaker('..', 'Strategic', 'json'), pathMaker('..', 'Strategic', 'xlsx'))


// module.exports = ProductionCapacitiesParser