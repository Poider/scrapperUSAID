const { pathMaker } = require('../utils/path.js');
const path = require('path');
// const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');


async function openSheet(jsonizedPath, unzipPath, xls_unzipped_files, givenPageNum) {
	const filePath = path.join(unzipPath, xls_unzipped_files[0]);
	console.log(filePath)
	// try{
	
		const workbook = XLSX.readFile(filePath);
		const sheet_name_list = workbook.SheetNames;
		const allData = [];
		for(let pageNum = 0; pageNum < sheet_name_list.length ;pageNum++) {
		const sheetName = sheet_name_list[pageNum]
		const worksheet = workbook.Sheets[sheetName];
		const xslxJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
		allData.push(xslxJsonData);

	}
	return allData;
	// } catch (err) {
	//   console.log((`Error: jsonize can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`));
	// }

    
//   } catch (err) {
//     console.log(`Error: openSheet can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`);
//   }
}




async function ureaParse(jsonData) {

	const translated = jsonData.map((item) => {

		let newObject = []
		for (let i = 2010; i <= 2035; i++) {
			let smallObject = {
				'Country': item["Geography"],
				'Location' : item["Location"],
				'Company Name': item["Company"],
				'Year': i.toString(),
				'Value': item[i],
				'unit' : "000 metric tons/year",
				'Status': "Operational*",
			};
			newObject.push(smallObject);
		}
		return newObject;
	});

	const flattened = translated.flat();

	return flattened;
}





async function PhosphateParse(jsonData) {

	const translated = jsonData.map((item) => {
		newItem = [];

		for (const key in item) {
			if (item[key] === "No")
				continue;
			else if (item[key] === "Yes")
				newItem.push(key);
		}
		let newObject = []
		for (let i = 2010; i <= 2035; i++) {
			let smallObject = {
				'Country': item["Geography"],
				'Company Name': item["Company"],
				'Location' : item["Location"],
				'Status': item["Status"] ==="Operational" ? "Operational" : "Operational*",
				'Year': i.toString(),
				'Value': item[i],
				'unit' : "000 metric tons/year",
				'Products': newItem.join(', '),
				

			};
			newObject.push(smallObject);
		}
		return newObject;
	});

	const flattened = translated.flat();

	return flattened;
}


async function ProductionCapacitiesParser(fileName, jsonizedPath, filePath) {

  const pageNum = 0;
  try{
  var ProductionCapacities = await openSheet(jsonizedPath, filePath, [fileName], pageNum);
  }
  catch(err){
  	console.log('production parser error')
  }
  // console.log("hi")
  const urea = await ureaParse(ProductionCapacities[0])
  const phosphate = await PhosphateParse(ProductionCapacities[1])

  return [urea, phosphate]
}

// ProductionCapacitiesParser('Prod_capacities_Africa_23.xlsx', pathMaker('..', 'Strategic', 'json'), pathMaker('..', 'Strategic', 'xlsx'))


module.exports = ProductionCapacitiesParser