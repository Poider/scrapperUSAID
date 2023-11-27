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

const countriesChanged = new Map([
	["CONGO, REPUBLIC OF",'Congo (Brazzaville)'],
	["CONGO, DEM. REP. OF THE", 'Congo (Kinshasa)'],
	["SÃO TOMÉ AND PRÍNCIPE", 'Sao Tome and Principe'],
	["SOUTH SUDAN, REPUBLIC OF", "South Sudan"],
	["EGYPT, ARAB REP. OF", "Egypt"],
	["CÔTE D'IVOIRE", "COTE D'IVOIRE"],
	["CONGO, DEM. REP.", 'Congo (Kinshasa)'],
	["CONGO, REP.",'Congo (Brazzaville)'],
	["GAMBIA, THE",'GAMBIA'],
	["EGYPT, ARAB REP.",'EGYPT']

])

function getCountryDataToInsert(country, countriesRef)
{
    country = country.toUpperCase();
    if(countriesRef.get(country))
    {
        const iso_code = countriesRef.get(country);
        return {country, iso_code};
    }
    else
    {
        if(countriesChanged.get(country))
        {
            const updatedCountry = countriesChanged.get(country).toUpperCase();
            const iso_code = countriesRef.get(updatedCountry);
            // console.log(country, iso_code)
            return {country : updatedCountry, iso_code};
        }
        else
								{
									console.log("country not found : ", country);
        return {country, iso_code : null};
								}
    }    
}

function getCountriesRef() {
	const jsonPath = path.join(__dirname, '..', 'Regions', 'African_regions.json');
	const countriesRef = fs.readFileSync(jsonPath, 'utf-8');
	const parsedCountriesRef = JSON.parse(countriesRef);

	const countriesRegions = parsedCountriesRef.map(countryData => {
					const { country, iso_code } = countryData;
					return [country.toUpperCase() , iso_code];
	});
	return new Map(countriesRegions);

}

function formatCountry(data, country)
{
	// format stuff on data object passed by ref
	const countriesRef = getCountriesRef()
	const countryToInsert = getCountryDataToInsert(country,countriesRef)
	data['country'] = countryToInsert['country'];
	data['country code'] = countryToInsert['iso_code'];
}

function documentData(allData, dataYear)
{
			//check country too
			//split abuja and the other?
	allData.forEach((data) => {
		 const country = data['Country'];
		 delete data['Country'];
		 formatCountry(data ,country);
			delete data ['Arable Land (Kha)'];
			delete data['Abuja Target : 50Kg/Ha |Delta KT P2O5'];
			delete data['Agronomy target : 114Kg/Ha |Delta KT P2O5'];
			data['indicator'] = 'Potential Phosphorus Consumption (P2O5)';
			data['year'] = dataYear;
			data['source'] = 'Internal';
			data['api_url'] = 'Internal';
			data["extracted_on"] =  new Date().toISOString().slice(0, 10)
	})
}

function divideData(allData)
{
	const newData = [] 
	allData.map((originalObject) => {
		const obj1 = {
			"country": originalObject["country"],
			"country code": originalObject["country code"],
			"target type" : "Abuja Target : 50Kg/Ha",
			"value": originalObject["Abuja Target : 50Kg/Ha |Potential P KT P2O5"],
			"unit": "KT",
			"Ranking": originalObject["Abuja Target : 50Kg/Ha |Ranking"],
			"indicator": originalObject["indicator"],
			"year": originalObject["year"],
			"source": originalObject["source"],
			"api_url": originalObject["api_url"],
			"extracted_on": originalObject["extracted_on"],

	}

	const obj2	= {
		"country": originalObject["country"],
		"country code": originalObject["country code"],
		"target type" : "Agronomy Target : 114Kg/Ha",
			"value": originalObject["Agronomy target : 114Kg/Ha |Potential P KT P2O5"],
			"unit": "KT",
			"Ranking": originalObject["Agronomy target : 114Kg/Ha |Ranking"],
			"indicator": originalObject["indicator"],
			"year": originalObject["year"],
			"source": originalObject["source"],
			"api_url": originalObject["api_url"],
			"extracted_on": originalObject["extracted_on"],
			
	}

	newData.push(obj1);
	newData.push(obj2);

	})
	return newData;
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
				key = abujaTarget + " |"+ titles[j]
			else if(j >= 16 && j <= 19)
				key = agronomyTarget  + " |"+ titles[j]
			else
				key = titles[j]

			obj[key] = PotentialConsumption[i][j]? PotentialConsumption[i][j] : null;
		}
		if(obj['Average P2O5 %'])
			obj['Average P2O5 %'] *= 100;
		// if(obj['Country'] == 'Djibouti')
		// 	obj['Country'] = 'Ethiopia';
		allData.push(obj);
	}
	//   console.log(JSON.stringify(allData,null,2));
//   await writingJson(jsonizedPath, allData);
documentData(allData, 2020)
const dividedData  = divideData(allData);
return dividedData
}

