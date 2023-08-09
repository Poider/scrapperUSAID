const puppeteer = require('puppeteer');
const unzipper = require('unzipper');
const {pathMaker} = require('./path');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const XLSX = require('xlsx');


function getFolderFiles(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    console.log('Files in the folder:', files);
    return files;
  } catch (err) {
    console.log("getFolderFiles : Folder doesn't exist yet");
    return [];
  }
}

 function directoryCleaner(directoryPath) {
  const directoryFiles =  getFolderFiles(directoryPath);
  console.log("cleaning directory", directoryPath, " of ", directoryFiles.length, " files");
  if(directoryFiles.length > 0) {
    directoryFiles.forEach(file => {
      const filePath = path.join(directoryPath, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`${filePath} was deleted`);
      } catch (err) {
        console.error(`Error deleting ${filePath}:`, err);
      }
      
    })
  }
}

async function runBrowser() {
  const browser = await puppeteer.launch({
    headless: `true`, 
  });
  return browser;
}

async function runPage(browser, link) {
  const page = await browser.newPage();
  await page.goto(link);
  return page;
}



async function zipDownloader(downloadPath) {
  let browser = await runBrowser();
  const page = await runPage(browser, 'https://results.usaid.gov/results');

  await page.waitForSelector('.button.button-icon-before');

  console.log("Found selector");

  const buttonElement = await page.$('.button.button-icon-before');

  directoryCleaner(downloadPath);
  
 
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  await buttonElement.click(); 
  await page.waitForTimeout(10000);

  await browser.close();
}


async function fileUnzipper(downloadPath) {
  const FilesArr  = getFolderFiles(downloadPath);

  const unzipPath = path.join(downloadPath, '..','unzipped_files');

  directoryCleaner(unzipPath);
  
  if(FilesArr.length === 0) {
    console.log('No files in the folder');
    throw new Error('No files in the folder');
  }
  else if(FilesArr.length > 1) {
    console.log('More than one file in the folder');
    throw new Error('More than one file in the folder');
  }
  
  
  const filePath = path.join(downloadPath, FilesArr[0]);
  //check if it ends with zip else throw
  const zip = new AdmZip(filePath);
  zip.extractAllTo(unzipPath, /*overwrite=*/true);
  return 
}

function AfricaJsonFiltering(xslxJsonData){
  africanJsonDataPath = pathMaker('input_data', 'africa_filtered.json');
  const AfricanCountriesdata = fs.readFileSync(africanJsonDataPath, 'utf8');
  const africanCoutnriesArr = JSON.parse(AfricanCountriesdata);
  const AfricanCountries = {};
  africanCoutnriesArr.forEach(element => {
    
  AfricanCountries[element] = true;
  });
  
  const xslxFilteredData = xslxJsonData.filter(item => AfricanCountries[item.country_name]);
  
//json data to a string

return xslxFilteredData;
}

function getAllDataCountries(xslxJsonData)
{
  let xslxFilteredData = xslxJsonData.map((item) =>{
    return item.country_name;
  });

  xslxFilteredData = [...new Set(xslxFilteredData)];
  return xslxFilteredData;
}

async function jsonize(jsonizedPath, unzipPath, xls_unzipped_files) {
  const filePath = path.join(unzipPath, xls_unzipped_files[0]);
  console.log(filePath)
  try{

  const workbook = XLSX.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  const sheetName = sheet_name_list[0]
  const worksheet = workbook.Sheets[sheetName];
  const xslxJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    
  //use to get All countries used in the data
  // const Countries = getAllDataCountries(xslxJsonData);

  const xslxFilteredData = AfricaJsonFiltering(xslxJsonData);

  const stringifiedXslxFiltered = JSON.stringify(xslxFilteredData, null, 2);
    
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
  const downloadPath = pathMaker('downloads','USAID_ZIP', 'zip');
  const unzipPath = pathMaker('downloads', 'USAID_ZIP','unzipped_files');
  const jsonizedPath = pathMaker('downloads', 'jsonized');


  await zipDownloader(downloadPath);
  await fileUnzipper(downloadPath);
  

  const unzipped_files =  getFolderFiles(unzipPath);
  const xls_unzipped_files  = unzipped_files.filter(file => file.endsWith('.xlsx'));
  await jsonize(jsonizedPath,unzipPath,xls_unzipped_files);
  
 

}

async function extraDataScrapper()
{

}


main();

 // scrapCountryInfos // promise all with first
//'unzipped_files' in .env