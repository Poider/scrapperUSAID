const { pathMaker } = require('../utils/path.js');
const path = require('path');
// const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');


async function openSheet(jsonizedPath, unzipPath, xls_unzipped_files, pageNum) {
	const filePath = path.join(unzipPath, xls_unzipped_files[0]);
  console.log(filePath);
  
//   try {
    const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const sheet = workbook.sheet(pageNum);
    const xlsxJsonData = sheet.usedRange().value();
	return xlsxJsonData
    
//   } catch (err) {
//     console.log(`Error: openSheet can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`);
//   }
}

async function writingJson(jsonizedPath, xlsxData) {
    const stringifiedXlsxData = JSON.stringify(xlsxData, null, 2);

    if (!fs.existsSync(jsonizedPath)) 
      fs.mkdirSync(jsonizedPath, { recursive: true });

    const jsonizedFilePath = path.join(jsonizedPath, 'Potential-consumption-Data.json');
    fs.writeFileSync(jsonizedFilePath, stringifiedXlsxData);
    console.log(`Data written to ${jsonizedFilePath}`);

}



module.exports = async function AbujaParser(fileName, jsonizedPath, filePath) {

	const pageNum = 0;
	let PotentialConsumption = await openSheet(jsonizedPath, filePath, [fileName], pageNum);
	// console.log(JSON.stringify(PotentialConsumption,null,2));
	const majorTitle = PotentialConsumption[0][4];
	const abujaTarget = PotentialConsumption[0][12];
	const agronomyTarget = PotentialConsumption[0][16];
	// console.log(majorTitle)
	const titles = PotentialConsumption[1];
	const allData = [];
	for( let i = 2; i < PotentialConsumption.length; i++) {
		let obj = {};
		for(let j = 0; j < titles.length  ; j++) {
			if(j != 14 && j != 13 && j != 18 && j != 17 && j != 0 && j != 7 && j != 15 && j != 19)
				continue;
			if(j >= 4 && j <= 6)
				key = majorTitle + titles[j]
			else if(j >= 12 && j <= 15)
				key = abujaTarget + " :"+ titles[j]
			else if(j >= 16 && j <= 19)
				key = agronomyTarget  + " :"+ titles[j]
			else
				key = titles[j]

			obj[key] = PotentialConsumption[i][j]? PotentialConsumption[i][j] : null;
		}
		if(obj['Average P2O5 %'])
			obj['Average P2O5 %'] *= 100;
		allData.push(obj);
	}
	//   console.log(JSON.stringify(allData,null,2));
//   await writingJson(jsonizedPath, allData);
return allData
}

