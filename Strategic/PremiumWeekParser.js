const { pathMaker } = require('../USAID/path.js');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

function hasOnlyOneField(obj) {
	if(!obj) return true;
	const keys = Object.keys(obj);
	return keys.length <= 1;
  }

async function openSheet(jsonizedPath, unzipPath, xls_unzipped_files, pageNum) {
	const filePath = path.join(unzipPath, xls_unzipped_files[0]);
	console.log(filePath)
	try{
	
	const workbook = XLSX.readFile(filePath);
	const sheet_name_list = workbook.SheetNames;
	const sheetName = sheet_name_list[pageNum]
	const worksheet = workbook.Sheets[sheetName];
	const xslxJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
	return xslxJsonData;
  
	} catch (err) {
	  console.log((`Error: jsonize can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`));
	}
}

async function writingJson(jsonizedPath, xlsxData) {
    const stringifiedXlsxData = JSON.stringify(xlsxData, null, 2);

    if (!fs.existsSync(jsonizedPath)) 
      fs.mkdirSync(jsonizedPath, { recursive: true });

    const jsonizedFilePath = path.join(jsonizedPath, 'WeekPremiumData.json');
    fs.writeFileSync(jsonizedFilePath, stringifiedXlsxData);
    console.log(`Data written to ${jsonizedFilePath}`);

}



async function main() {	
  const fileName = 'Fertilizer Week Premium - report[1].xlsx';
  const jsonizedPath = pathMaker('..', 'Strategic', 'json');
  const filePath = pathMaker('..', 'Strategic', 'xlsx');
  const pageNum = 0;
  let premiumData = await openSheet(jsonizedPath, filePath, [fileName], pageNum);
  premiumData= premiumData.filter((obj) => !hasOnlyOneField(obj));
  
  const mappedArray = premiumData.flatMap((originalObj) => {
	const dateValuePairs = [];
	let year;
	let month;
	let quarter;
	for (const key in originalObj) {
	  if (key !== "Product Group" && key !== "Price Name" && key !== "Unit" && key !== "52 WK HIGH" && key !== "52 WK LOW" && key !== "W-on-W") {
		const price_date = new Date(key).toLocaleDateString("en-GB",{
			month: "numeric",
			day: "numeric",
			year: "numeric"
		  });
		const price_date_arr = price_date.split("/");
		year = price_date_arr[2];
		month = price_date_arr[1];
      	let avg = originalObj[key]; 
		avg = (parseFloat(avg.split("-")[0]) + parseFloat(avg.split("-")[1]))/2;
		quarter = Math.ceil(month/3);
		dateValuePairs.push({ price_date, avg });
		// console.log(date)
	  }
	}
	return dateValuePairs.map((pair) => ({
	  "product": originalObj["Product Group"],
	  "spot": originalObj["Price Name"],
	  "year": year ? year : null,
	  "month" : month ? month : null,
	  "quarter": quarter ? quarter : null,
	  "bulkPricing": originalObj["Unit"],
	  ...pair, // Spread the date-value pair
	}));
  });
//   console.log(JSON.stringify(mappedArray,null,2));
  await writingJson(jsonizedPath, mappedArray);
}

main();