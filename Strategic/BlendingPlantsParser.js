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

    const jsonizedFilePath = path.join(jsonizedPath, 'BlendingPlantsData.json');
    fs.writeFileSync(jsonizedFilePath, stringifiedXlsxData);
    console.log(`Data written to ${jsonizedFilePath}`);

}


function field_wanted(field)
{
	if (field == 'Plant' || field == 'Year established' || field == 'Position' || field == 'Status' || field == 'Prod Capacity' || field == 'Nameplate Capacity Value' || field == 'Nameplate Capacity Units' || field == 'Products Produced' || field == 'Country' || field == 'Latitude' || field == 'Longitude')
		return true;
}

module.exports = async function BlendingPlantsParser(fileName, jsonizedPath, filePath) {

	const pageNum = 0;
	let blendingPlants = await openSheet(jsonizedPath, filePath, [fileName], pageNum);
	const titles = blendingPlants[6];
	const allData = [];
	for( let i = 7; i < blendingPlants.length; i++) {
		let obj = {};
		if(!blendingPlants[i][3])
			continue;
		for(let j = 0; j < titles.length  ; j++) {
			if(field_wanted(titles[j]))
				obj[titles[j]] = blendingPlants[i][j]? blendingPlants[i][j] : null;
		}
		let products =  obj['Products Produced'].split('\r\n');
		for(let j = 0; j < products.length; j++)
		{
			if (products[j].startsWith(', ')) {
				products[j] = products[j].substring(2);
			  }
		}

		products= products.filter((item) => item);
		obj['Products Produced'] = products;
		allData.push(obj);
	}

	//   console.log(JSON.stringify(allData,null,2));
//   await writingJson(jsonizedPath, allData);
	return allData
}
