const XLSX = require('xlsx');
const fs = require('fs');	
const path = require('path');
const {pathMaker} = require('../utils/path.js');


async function openSheet(jsonizedPath, unzipPath, xls_unzipped_files,pageNum) {
	const filePath = path.join(unzipPath, xls_unzipped_files[0]);
	console.log(filePath)
	try {
	
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




async function parseBcg(jsonData) {

    const translated = jsonData.map((item) => {

        let newObject = []
        for (key in item) {
			if(key === "Country")
				continue;
            let smallObject = {
                'Country': item["Country"],
                'Year': key,
                'Value':  item[key] ? item[key] : null
            };
            newObject.push(smallObject);
        }
        return newObject;
    });

    const flattened = translated.flat();

  	return flattened
}

async function bcgParser(fileName, jsonizedPath, filePath) {

	let marketShare = await openSheet(jsonizedPath, filePath, [fileName], 0);
	marketShare = await parseBcg(marketShare);
	return marketShare;
}

module.exports = bcgParser;