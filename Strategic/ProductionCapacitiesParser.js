const { pathMaker } = require('../utils/path.js');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');
const { get } = require('http');


async function openSheet(jsonizedPath, unzipPath, xls_unzipped_files, givenPageNum) {
	const filePath = path.join(unzipPath, xls_unzipped_files[0]);
	console.log(filePath)
	try{
	
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
	} catch (err) {
	  console.log((`Error: jsonize can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`));
	}

    

}

function getLocation(company_name ,company_location ,companies_geolocation, fertilizer_type){

	for (const key in companies_geolocation) {
		let company,location;
		company = key.trim()
		if (key.indexOf("/") > 0)
		{
			company = key.split("/")[0].trim()
			location = key.split("/")[1].trim()
		}

		if(location === company_location && company === company_name)
		{
			if(companies_geolocation[key]['Product_on_sheet'] === fertilizer_type)
				return companies_geolocation[key]
			continue;
		}
		if(company === company_name && location === undefined)
		{
			if(companies_geolocation[key]['Product_on_sheet'] === fertilizer_type)
				return companies_geolocation[key]
			continue;
		}
	}
	return undefined
}


async function ureaParse(jsonData, companies_geolocation) {

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
			const geolocation = getLocation(item["Company"],item["Location"],companies_geolocation,"Urea")
			if(geolocation !== undefined)
			{
				smallObject['Latitude'] = geolocation['latitude']
				smallObject['Longitude'] = geolocation['longitude']
			}
			else
			{
				console.log(item["Company"] , item["Location"])
				smallObject['Latitude'] = undefined
				smallObject['Longitude'] = undefined
			}

			newObject.push(smallObject);
		}
		return newObject;
	});

	const flattened = translated.flat();

	return flattened;
}





async function PhosphateParse(jsonData, companies_geolocation) {

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
			const geolocation = getLocation(item["Company"],item["Location"],companies_geolocation,"Phosphate")
			if(geolocation !== undefined)
			{
				smallObject['Latitude'] = geolocation['latitude']
				smallObject['Longitude'] = geolocation['longitude']
			}
			else
			{	console.error(item["Company"] , item["Location"])
				smallObject['Latitude'] = null
				smallObject['Longitude'] = null
			}
		

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
  let companies_geolocation =  fs.readFileSync(path.join(__dirname,'Constants','company_location.json'), 'utf8')
  companies_geolocation = JSON.parse(companies_geolocation)

  // console.log("hi")
  const urea = await ureaParse(ProductionCapacities[0],companies_geolocation)
  const phosphate = await PhosphateParse(ProductionCapacities[1],companies_geolocation)

  
  return [urea, phosphate]
}

// ProductionCapacitiesParser('Prod_capacities_Africa_23.xlsx', pathMaker('..', 'Strategic', 'json'), pathMaker('..', 'Strategic', 'xlsx'))

module.exports = ProductionCapacitiesParser