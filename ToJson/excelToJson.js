const {pathMaker} = require('../utils/path.js');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

async function jsonize(jsonizedPath, unzipPath, xls_unzipped_files) {
  const filePath = path.join(unzipPath, xls_unzipped_files[0]);
  console.log(filePath)
  try{
  
  const workbook = XLSX.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  const sheetName = sheet_name_list[0]
  const worksheet = workbook.Sheets[sheetName];
  const xslxJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    
  const stringifiedXslxFiltered = JSON.stringify(xslxJsonData, null, 2);
    
  if (!fs.existsSync(jsonizedPath)) 
    fs.mkdirSync(jsonizedPath, { recursive: true });
  jsonizedPath = path.join(jsonizedPath, 'data.json');
  fs.writeFileSync(jsonizedPath, stringifiedXslxFiltered);
  console.log(`Data written to ${jsonizedPath}`);

  } catch (err) {
    console.log((`Error: jsonize can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`));
  }
}



async function main() {
	//TO BE SET
  const fileName = 'Fertilizer Week Premium - report[1].xlsx'
  const jsonizedPath = pathMaker('..','toJson','json');
  const filePath = pathMaker('..','toJson','xlsx');
  
  await jsonize(jsonizedPath,filePath,[fileName]);
  
 

}

main();