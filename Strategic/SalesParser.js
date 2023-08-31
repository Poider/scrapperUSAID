const { pathMaker } = require('../utils/path.js');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

function hasOnlyOneField(obj) {
	if(!obj) return true;
	const keys = Object.keys(obj);
	return keys.length <= 1;
  }

async function openSheet(jsonizedPath, unzipPath, xls_unzipped_files) {
	const filePath = path.join(unzipPath, xls_unzipped_files[0]);
	console.log(filePath)
	try{
	
		const workbook = XLSX.readFile(filePath);
		const sheet_name_list = workbook.SheetNames;
		const allData = [];
		for(let pageNum = 0; pageNum < sheet_name_list.length; pageNum++) {
		const sheetName = sheet_name_list[pageNum]
		const worksheet = workbook.Sheets[sheetName];
		const xslxJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
		allData.push(...xslxJsonData);
		pageNum++;

	}
	return allData;
	} catch (err) {
	  console.log((`Error: jsonize can't find the folder ${unzipPath} or the file ${xls_unzipped_files[0]}`));
	}
}


async function writingJson(jsonizedPath, xlsxData) {
    const stringifiedXlsxData = JSON.stringify(xlsxData, null, 2);

    if (!fs.existsSync(jsonizedPath)) 
      fs.mkdirSync(jsonizedPath, { recursive: true });

    const jsonizedFilePath = path.join(jsonizedPath, 'SalesData.json');
    fs.writeFileSync(jsonizedFilePath, stringifiedXlsxData);
    console.log(`Data written to ${jsonizedFilePath}`);

}


function getValueIgnoreCase(obj, key) {
	key = key.toLowerCase()
	for (const k in obj) {
	  if (k.toLowerCase().trim() === key) {
		return obj[k];
	  }
	}


	return undefined;
  }
  
const excelSerialNumberToJsDate = (serialNumber) => {
	// Convert Excel serial number to JavaScript Date, accounting for Excel's incorrect leap year in 1900
	const jsDate = new Date(Date.UTC(1900, 0, serialNumber - 1));
	return jsDate;
  };

  const formatDate = (date) => {
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const day = String(date.getDate()).padStart(2, '0');
	const year = date.getFullYear();
  
	return `${day}/${month}/${year}`;
};

function mapper(saleObj)
{
	const client = getValueIgnoreCase(saleObj, "Client");
	const dateBL = formatDate (excelSerialNumberToJsDate( getValueIgnoreCase(saleObj, "Date BL")));
	const product = getValueIgnoreCase(saleObj, "Produit");
	const productCategory = getValueIgnoreCase(saleObj, "Famille du produit");
	const quantity = getValueIgnoreCase(saleObj, "Quantité facturée réajustée");
	let montantFOB = getValueIgnoreCase(saleObj, "Montant FOB");
	if(!montantFOB)
		montantFOB = getValueIgnoreCase(saleObj, "Prix FOB");
	let countryOfTheClient = getValueIgnoreCase(saleObj, "Pays du client");
	const subRegion = getValueIgnoreCase(saleObj, "Secteur de Vente");
	const portDeDechargement = getValueIgnoreCase(saleObj, "Port de déchargement");
	const navire = getValueIgnoreCase(saleObj, "navire");
	if(!countryOfTheClient && portDeDechargement)
	{
		const portDataSplit = portDeDechargement.split('/')
		const country = portDataSplit.length > 1 ? portDataSplit[1] : null;
		countryOfTheClient = country
	}
	return{
		"client" : client ? client : null,
		"date BL" : dateBL ? dateBL : null,
		"Product" : product ? product : null,
		"Product Category" : productCategory ? productCategory : null,
		"Quantité facturée réajustée" : quantity ? quantity : null,
		"Montant FOB" : montantFOB ? montantFOB : null,
		"Country of the client" : countryOfTheClient ? countryOfTheClient : null,
		"Sub region" : subRegion ? subRegion : null,
		"Port de déchargement" : portDeDechargement ? portDeDechargement : null,
		"Navire" : navire ? navire : null,
	}
}

async function salesParser(fileName, jsonizedPath, filePath) {
  const pageNum = 1;
  let sales = await openSheet(jsonizedPath, filePath, [fileName], pageNum);
  sales = sales.map(mapper);
//   console.log(JSON.stringify(sales,null,2));
//   await writingJson(jsonizedPath, sales);
   return sales
}

module.exports = salesParser