const {pathMaker} = require('../utils/path.js');
const path = require('path');
const fs = require('fs');
const csvtojson = require('csvtojson');

(
	async function main() {
		const fileName = 'test.csv'
		const csvFilePath = pathMaker('..','toJson','csv',fileName);
		const jsonizedPath = pathMaker('..','toJson','json');
		const jsonArray = await csvtojson().fromFile(csvFilePath);
		const stringifiedJsonArray = JSON.stringify(jsonArray, null, 2);
		if (!fs.existsSync(jsonizedPath)) 
			fs.mkdirSync(jsonizedPath, { recursive: true });
		const jsonizedFilePath = path.join(jsonizedPath, 'csvdata.json');
		fs.writeFileSync(jsonizedFilePath, stringifiedJsonArray);
		console.log(`Data written to ${jsonizedFilePath}`);
	}
)()