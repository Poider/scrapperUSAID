const {pathMaker} = require('../utils/path.js');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

async function jsonize(jsonizedPath, unzipPath, xls_unzipped_files) {
  const filePath = path.join(unzipPath, xls_unzipped_files[0]);
  console.log(filePath)
//   try{

  const workbook = XLSX.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  const sheetName = sheet_name_list[0]
  const worksheet = workbook.Sheets[sheetName];
  const xslxJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    
  //use to get All countries used in the data
  // const countries = getAllDataCountries(xslxJsonData);
  // const result_names = getAllResultNames(xslxJsonData);
  // const sector_names = getAllSectorNames(xslxJsonData);
//   const xslxFilteredData = AfricaJsonFiltering(xslxJsonData);




const transformedData = [];

xslxJsonData.forEach(entry => {
	const countryName = entry["Country Name"];
	const indicatorName = entry["Indicator Name"];
	
	for (const year in entry) {
	  if (year.match(/^\d{4}$/)) {
		transformedData.push({
		  countryName,
		  indicatorName,
		  year,
		  valueOfTheYear: entry[year]
		});
	  }
	}
  });


// getting all the unique country names
//   const s = transformedData.map(entry => entry.countryName);
//   const uniqueIndicatorNames = [...new Set(s)];

  const chosenIndicatorName = "Official Reserve Assets, US Dollars";    
  
  const filteredData = transformedData.filter(entry => entry.indicatorName === chosenIndicatorName);
  


  const stringifiedXslxFiltered = JSON.stringify(filteredData, null, 2);
    
  if (!fs.existsSync(jsonizedPath)) 
    fs.mkdirSync(jsonizedPath, { recursive: true });
  jsonizedPath = path.join(jsonizedPath, 'data.json');
  fs.writeFileSync(jsonizedPath, stringifiedXslxFiltered);
  console.log(`Data written to ${jsonizedPath}`);

//   } catch (err) {
//     console.log((`Error: jsonize can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`));
//   }
}



async function main() {
  const fileName = 'IRFCL_08-18-2023-10-47-09-91_timeSeries.xlsx'
  const jsonizedPath = pathMaker('..','IMF','IMF_DOWNLOADS');
  const filePath = pathMaker('..','IMF','IMF_DOWNLOADS');
  
  await jsonize(jsonizedPath,filePath,[fileName]);
  
 

}

main();