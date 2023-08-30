const { pathMaker } = require('../utils/path.js');
const path = require('path');
const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');

async function openSheet(jsonizedPath, unzipPath, xls_unzipped_files, pageNum) {
	jsonizedPath = jsonizedPath; // hehe
	const filePath = path.join(unzipPath, xls_unzipped_files[0]);
  console.log(filePath);
  
  try {
    const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const sheet = workbook.sheet(pageNum);

    const xlsxJsonData = sheet.usedRange().value();
	return xlsxJsonData
    
  } catch (err) {
    console.log(`Error: openSheet can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`);
  }
}

async function writingJson(jsonizedPath, xlsxData) {
    const stringifiedXlsxData = JSON.stringify(xlsxData, null, 2);

    if (!fs.existsSync(jsonizedPath)) 
      fs.mkdirSync(jsonizedPath, { recursive: true });

    const jsonizedFilePath = path.join(jsonizedPath, 'Crudata.json');
    fs.writeFileSync(jsonizedFilePath, stringifiedXlsxData);
    console.log(`Data written to ${jsonizedFilePath}`);

}

const excelSerialNumberToJsDate = (serialNumber) => {
	// Convert Excel serial number to JavaScript Date, accounting for Excel's incorrect leap year in 1900
	const jsDate = new Date(Date.UTC(1900, 0, serialNumber - 1));
	return jsDate;
  };

  const formatDate = (date) => {
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const day = String(date.getDate()).padStart(2, '0');
	const year = date.getFullYear();
  
	return `${day}/${month}/${year}`;
  };
async function main() {
  // TO BE SET
  const fileName = 'CRU FERTILIZER WEEK-Historical Prices Averages-Weekly Report (20230707)-60431[1].xlsx';
  const jsonizedPath = pathMaker('..', 'Strategic', 'json');
  const filePath = pathMaker('..', 'Strategic', 'xlsx');
  const pageNum = 1;
  const CruData = await openSheet(jsonizedPath, filePath, [fileName], pageNum);
  let Product = [...CruData[0]]
  let Spot = [...CruData[1]]
  let bulkPricing = [...CruData[2]]
  Product = Product.filter((item) => item != null && item != undefined && item != 'Back to Contents')
  Spot = Spot.filter((item) => item != null && item != undefined)
  bulkPricing = bulkPricing.filter((item) => item != null && item != undefined)
//   console.log(JSON.stringify(Product, null, 2))
//   console.log(JSON.stringify(Spot, null, 2))
//   console.log(JSON.stringify(bulkPricing, null, 2))	
let allData = []
	for(let i = 4; i < CruData.length; i++){
		if(CruData[i].length < 5)
			throw new Error('Data is not like usual')
		
		const year = CruData[i][0];
		const quarter = CruData[i][1];
		const month = CruData[i][2];
		const price_date = formatDate(excelSerialNumberToJsDate(CruData[i][3]));

		let j = 0;
		// const cols_length = 1893;
		for(let n = 4; n < CruData[i].length; n += 3){
			let object = {};
			object['year'] = year;
			object['quarter'] = quarter;
			object['month'] = month;
			object['price_date'] = price_date;
			object['product'] = Product[j];
			object['spot'] = Spot[j];
			object['bulkPricing'] = bulkPricing[j];
			object['Max'] = CruData[i][n]? CruData[i][n] : null;
			object['Min'] = CruData[i][n+1] ? CruData[i][n+1] : null;
			object['Avg'] = CruData[i][n+2] ? CruData[i][n+2] : null;
			allData.push(object);
			j++;
		}
	}
	// console.log(JSON.stringify(allData, null, 2))
	//their count is 317 elements each
  //! Check if data is like usual, if not throw error

  
  writingJson(jsonizedPath, allData);
}

main();
