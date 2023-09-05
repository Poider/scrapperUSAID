const readline = require('readline');
const fs = require('fs');
const path = require('path');


const { pathMaker } = require('../utils/path.js');
const CruParser = require('./CruParser.js');
const BlendingPlantsParser = require('./BlendingPlantsParser.js');
const SalesParser = require('./SalesParser.js');
const PotentialAbujaParser = require('./PotentialAbujaParser.js');
const FertlizerWeekPremiumParser = require('./PremiumWeekParser.js');
const productionCapacitiesParser = require('./ProductionCapacitiesParser.js');
const bcgParser = require('./bcgParser.js');

const read = readline.createInterface({ input: process.stdin, output: process.stdout });




const jsonNames = ['BlendingPlantsData.json',
	'Crudata.json',
	'FertlizerWeekPremiumData.json',
	'Potential-consumption-Data.json',
	'SalesData.json',
	'BCG_total_P205_demande_unlock_value.json',
	'OCP_Market_Shares_BCG_Demand_Unlocking_Total_Value.json',
	'phosphatePlantProd.json',
	'ureaPlantProd.json',
]

const fileNames = ['Blending plants Africa[1].xlsx',
	'CRU FERTILIZER WEEK-Historical Prices Averages-Weekly Report (20230707)-60431[1].xlsx',
	'Fertilizer Week Premium - report[1].xlsx',
	'Potential consumption (Abuja + Agronomy)[1].xlsx',
	'Sales 13-23[1].xlsx',
	'BCG_total_P205_demande_unlock_value (1).xlsx',
	'OCP_Market_Shares_BCG_Demand_Unlocking_Total_Value (1).xlsx',
	'Prod_capacities_Africa_23.xlsx',
];

const parsers = [BlendingPlantsParser, 
	CruParser, 
	FertlizerWeekPremiumParser, 
	PotentialAbujaParser,
	SalesParser,
	bcgParser,
	bcgParser,
	productionCapacitiesParser,
];





async function writingJson(jsonizedPath, xlsxData, jsonFileName) {
	const stringifiedXlsxData = JSON.stringify(xlsxData, null, 2);

	if (!fs.existsSync(jsonizedPath))
		fs.mkdirSync(jsonizedPath, { recursive: true });

	const jsonizedFilePath = path.join(jsonizedPath, jsonFileName);
	fs.writeFileSync(jsonizedFilePath, stringifiedXlsxData);
	console.log(`Data written to ${jsonizedFilePath}`);

}



async function bringInput(question) {

	return new Promise((resolve, reject) => {
		read.question(question, (answer) => {
			resolve(answer);
		})
	})
}

function deleteFile(filePath) {
	fs.unlink(filePath, (err) => {
	  if (err) {
		console.error('Error deleting file:', err);
		return;
	  }
	  console.log(`File ${filePath} has been deleted.`);
	});
  }

function getFilesInDirectory(directoryPath) {
	try {
	  const files = fs.readdirSync(directoryPath);
	  return files;
	} catch (error) {
	  console.error('Error reading directory:', error);
	  return [];
	}
  }

async function insert(filename) {

	// const input = await bringInput('Enter the name of the file: ');
	if (!fileNames.includes(filename)) {
		console.log('file name is not valid');
		console.error('file name is not valid');
		return
	}
	const jsonizedPath = pathMaker('..', 'Strategic', 'json');
	const filePath = pathMaker('..', 'Strategic', 'xlsx');
	const fileName = fileNames[fileNames.indexOf(filename)];
	const parser = parsers[fileNames.indexOf(filename)];
	try {
		const data = await parser(fileName, jsonizedPath, filePath);
		if (!data) {
			console.error('parser returned undefined');
			console.log('parser returned undefined');
			return;
		};
		if(fileName !== "Prod_capacities_Africa_23.xlsx")
		{
	
			const jsonFileName = jsonNames[fileNames.indexOf(filename)];
			await writingJson(jsonizedPath, data, jsonFileName);
		}
		else
		{
			
			for(let i = 0; i < data.length; i++)
			{
				const jsonFileName = jsonNames[fileNames.indexOf(filename) + i];
				await writingJson(jsonizedPath, data[i], jsonFileName);
			}
		}
	} catch (err) {
		console.error('failed')
	}
	
}



async function run() {

	const files = getFilesInDirectory(pathMaker('..', 'Strategic', 'xlsx'));
	if(files.length !== 0)
	{
		for (const file of files) {
			await insert(file);
			deleteFile(pathMaker('..', 'Strategic', 'xlsx', file))
		}
	}
	read.close();
	
}

run();