const path = require('path')
const fs = require('fs')
const XlsxPopulate = require('xlsx-populate');
const XLSX = require('xlsx');


async function writingJson(jsonizedPath, xlsxData, jsonFileName) {
	const stringifiedXlsxData = JSON.stringify(xlsxData, null, 2);

	if (!fs.existsSync(jsonizedPath))
		fs.mkdirSync(jsonizedPath, { recursive: true });

	const jsonizedFilePath = path.join(jsonizedPath, jsonFileName);
	fs.writeFileSync(jsonizedFilePath, stringifiedXlsxData);
	console.log(`Data written to ${jsonizedFilePath}`);

}



async function openPrograms(jsonizedPath, unzipPath, xls_unzipped_files, pageNum) {
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


async function openSheet( unzipPath, xls_unzipped_files) {
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
		allData.push(...xslxJsonData);

	}
	return allData;
	// } catch (err) {
	//   console.log((`Error: jsonize can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`));
	// }

    

}



const hasAllNullExceptFirst = (arr) => {
	const allNullExceptFirst = arr.slice(1).every((element) => element === null || element === undefined);
	return allNullExceptFirst && arr[0] !== null;
  };
//CIV Tanzania Ghana Kenya Nigeria Senegal
const isDefinedCountry = (countryLine) => {
	// if(countryLine === undefined || countryLine === null)
	// 	return false
	country = countryLine[0]
	if(country === 'CIV' || country === 'Tanzania' || country === 'Ghana' || country === 'Kenya' || country === 'Nigeria' || country === 'Senegal')
		return true
	return false
}

const isMapDefinedCountry = (country) => {
	if(country === `Côte d'Ivoire` || country === 'Tanzania' || country === 'Ghana' || country === 'Kenya' || country === 'Nigeria' || country === 'Sénégal')
		return true
	return false
}

function getMapCountry()
{
	const mapCountry = {
		'CIV': `Côte d'Ivoire`,
		'Tanzania': 'Tanzania',
		'Ghana': 'Ghana',
		'Kenya': 'Kenya',
		'Nigeria': 'Nigeria',
		'Senegal': 'Sénégal'
	}
	return mapCountry[country]
}

const mapParser = function (data, programData) {


	data.forEach((item) => {
		if (item == undefined || item == null)
			return
		// console.log('hi')
		if (item.icon)
			delete item['icon']
		if (item.photo)
			delete item['photo']
		if (item["Geolocalisation"] !== undefined) {
			const split_ = item["Geolocalisation"].split(',')
			item["longitude"] = parseFloat(split_[0])
			item["latitude"] = parseFloat(split_[1])
		}
		item['country'] = item['tag 1( country )']
		delete item['tag 1( country )']

		if (item['main _ entry'] === 'OCP OFFICE' && isMapDefinedCountry(item['country'])) {
			item['programs data'] = programData.filter((program) => program.country === item['country'])[0]['programs']
		}
	})

	return data
}
	
	



//! this is program parser until 2022 only, use env variable to change it
const parsePrograms = function (data) {

	data =  data.filter(item => item.some(i => i !== undefined && i !== null));

	const mappedData = []

	let currentCountry = null;
	currentTitles = null;
	for(let i = 0; i < data.length; i++)
	{
	
		while(i < data.length && !isDefinedCountry(data[i]))
		{
			// console.log(data[i])
			i++
		}
		if(i >= data.length)
			break
		let item = data[i]
		//takes the country line and titles line after it
		if(isDefinedCountry(item))
		{
			currentCountry = item[0]
			i++;
			currentTitles = data[i]
			i++;
		}
			
		let obj = {}
		obj['country'] = getMapCountry(currentCountry)
		let programs = []

		while(i < data.length && !isDefinedCountry(data[i]))
		{
			item = data[i]
			let secondObj = {}
			for(let j = 0; j < item.length; j++)
			{
				if(item[j] !== null && item[j] !== undefined)
				{
					if(j === 0)
					{
						secondObj["project"] = item[j]
						secondObj['project type'] = currentTitles[j]
						continue;
					}
					secondObj[currentTitles[j]] = item[j]
				}
			}
			for(let j = 2016 ; j <= 2022; j++)
			{
				if(secondObj[j.toString()] === 0)
					delete secondObj[j.toString()]
			}
			if(secondObj["Total"] === undefined)
				secondObj["Total"] = null
			if(secondObj["project"] === undefined)
				secondObj["project"] = null
			if(secondObj["project"] !== "TOTAL" && secondObj["project"] !== null)
				programs.push(secondObj)
		
			if( i + 1 < data.length && isDefinedCountry(data[i + 1]))
				break
			i++;
		}

		obj['programs'] = programs
		mappedData.push(obj)
	}
	return mappedData
}

async function main()
{
	const workingDir = path.dirname(__filename)

	let programData = await openPrograms(null,workingDir, ['BD Projects  - Numbers.xlsx'], 0)
	programData = parsePrograms(programData);

	let mapData = await openSheet(workingDir, ['Carte interactive_Data _ LIFEMOZ _ OCPA.xlsx'])
	mapData = mapParser(mapData, programData)
	
	const jsonizedPath = workingDir
	const jsonFileName = 'mapData.json';
	await writingJson(jsonizedPath, mapData, jsonFileName);

} 


main()
