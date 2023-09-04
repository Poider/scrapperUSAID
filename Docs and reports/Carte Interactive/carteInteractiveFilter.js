const path = require('path')
const fs = require('fs')
const XlsxPopulate = require('xlsx-populate');
const XLSX = require('xlsx');


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

    
//   } catch (err) {
//     console.log(`Error: openSheet can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`);
//   }
}


// const mapParser = function (data) {


// data.forEach((item) => {
// 	if(item == undefined || item == null)
// 	return
// // console.log('hi')
// 	if(item.icon)
// 	delete item['icon']
// 	if(item.photo)
// 	delete item['photo']
// 	if(item["Geolocalisation"] !== undefined)
// 	{
// 	const split_ = item["Geolocalisation"].split(',')
// 	item["longitude"] = parseFloat(split_[0])
// 	item["latitude"] = parseFloat(split_[1])
// 	}
// })
// // console.log(data)
// return data
// }


const hasAllNullExceptFirst = (arr) => {
	const allNullExceptFirst = arr.slice(1).every((element) => element === null || element === undefined);
	return allNullExceptFirst && arr[0] !== null;
  };
//CIV Tanzania Ghana Kenya Nigeria Senegal
const isDefinedCountry = (countryLine, i) => {
	// if(countryLine === undefined || countryLine === null)
	// 	return false
	country = countryLine[0]
	if(country === 'CIV' || country === 'Tanzania' || country === 'Ghana' || country === 'Kenya' || country === 'Nigeria' || country === 'Senegal')
		return true
	return false
}

const parsePrograms = function (data) {

	data =  data.filter(item => item.some(i => i !== undefined && i !== null));

	const mappedData = []
	//parse first table

	// const subsidiaries = []
	// for( let i = 0; data[i] && !isDefinedCountry(data[i]); i++)
	// {
	// 	subsidiaries.push(data[i])
	// }
	// mappedData.push({'subsidiaries': subsidiaries})

	let currentCountry = null;
	currentTitles = null;
	for(let i = 0; i < data.length; i++)
	{
		while(i < data.length && !isDefinedCountry(data[i]))
			i++
		if(i >= data.length)
			break
		let item = data[i]
		if(isDefinedCountry(item,i))
		{
			currentCountry = item[0]
			i++;
			currentTitles = data[i]
			i++;
		}
			
		let obj = {}
		obj['country'] = currentCountry
		let programs = []
		item = data[i]
		while(!isDefinedCountry(item))
		{
			for(let j = 0; j < item.length; j++)
			{
				if(item[j] !== null && item[j] !== undefined)
				{
					obj[currentTitles[j]] = item[j]
				}
			}
			
			programs.push(obj)
			i++;
			item = data[i]
		}
		obj['programs'] = programs
		mappedData.push(obj)
	}
	return mappedData
}

async function main()
{
	const workingDir = path.dirname(__filename)
	// let mapData = await openSheet(workingDir, ['Carte interactive_Data _ LIFEMOZ _ OCPA.xlsx'])
	// mapData = mapParser(mapData)
	
	let data = await openPrograms(null,workingDir, ['BD Projects  - Numbers.xlsx'], 0)

	data = parsePrograms(data);
	console.log(JSON.stringify(data, null, 2))

} 


main()
