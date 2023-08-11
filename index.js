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
  // console.log('creating new page')
  const page = await browser.newPage();
  // console.log("opening page");
  await page.goto(link);
  // console.log("gone to the link");
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

function getAllResultNames(xslxJsonData)
{
  let xslxFilteredData = xslxJsonData.map((item) =>{
    return item.result_name;
  });

  xslxFilteredData = [...new Set(xslxFilteredData)];
  return xslxFilteredData;
}

function getAllSectorNames(xslxJsonData)
{
  let xslxFilteredData = xslxJsonData.map((item) =>{
    return item.result_name;
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
  // const countries = getAllDataCountries(xslxJsonData);
  // const result_names = getAllResultNames(xslxJsonData);
  // const sector_names = getAllSectorNames(xslxJsonData);
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

async function AutoDataScrapper()
{
  let browser = await runBrowser();
  const page = await runPage(browser, 'https://results.usaid.gov/results');

  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();

  const effectiveYear = thisMonth > 9 ? thisYear : thisYear - 1;
  // for(let year = 2014; year <= effectiveYear; i++){
    //circle on the countries, and check their years
    let year = 2014;
    const dropDownSelector = '#app-entry-point > div > div.row.navigation-bar > div.nb-selected-additional > div > label > select'
    await page.waitForSelector(dropDownSelector);
    //just wait for selector after goto
    console.log("Found selector");
    await page.select(dropDownSelector, toString(year));
    
    const atGlanceSelector = "#selected_bar_height > div.row.sb-details-wrapper > div.column.small-12.medium-5.xlarge-6 > div > div > div.quicklook-container > div > div:nth-child(2)"
 
    
    const response1 = await page.waitForResponse(response => {console.log(response.url())});
    const response2 = await page.waitForResponse(response => {console.log(response.url())});

    console.log("found glance selector")
    await page.screenshot({path : pathMaker('downloads', `${year}.png`)});
  // }

  page.close();
  browser.close();
  return 
}




async function getCountryDropDown(browser, year)
{
  const page = await browser.newPage();

  await page.goto(`https://results.usaid.gov/results/country?fiscalYear=${year}`); // Replace with the URL of the page

  // Click the element to trigger the dropdown
  await page.waitForSelector('#app-entry-point > div > div.row.navigation-bar > div.column.small-12.nb-selected.data-select > div > div > span')
  await page.click('#app-entry-point > div > div.row.navigation-bar > div.column.small-12.nb-selected.data-select > div > div > span');

  console.log('clicked')

  const dropdownValues = await page.$$eval('.data-selector-option-name', (optionElements) => {
    const values = [];
  
    for (const option of optionElements) {
      const trimmedText = option.textContent.trim();
      if (trimmedText !== 'Worldwide') {
        values.push(trimmedText);
      }
    }
  
    return values;
  });

  // Output the captured content (you can process it as needed)
  // const s = dropdownValues.has('Albania')
  const mySet = new Set(dropdownValues);
  

  // Perform an action to make the dropdown disappear (e.g., clicking somewhere else)
  await page.click('body'); // You can replace 'body' with the appropriate selector

  await page.close();
  return(mySet)
}



async function ManualDataScrapper() {

  let browser = await runBrowser();

  const AllData = [];
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();

  // const effectiveYear = thisMonth > 9 ? thisYear : thisYear - 1;
  const effectiveYear = 2021;
  const countries = fs.readFileSync(pathMaker('input_data', 'africa_filtered.json'), 'utf8');
  const countriesArr = JSON.parse(countries);
  let i = 0
  for (let year = 2014; year <= effectiveYear; i++) {


    const availableCountries = await getCountryDropDown(browser, year);

    for (country of countriesArr) {
      if (availableCountries.has(country)) {

        console.log(country, year)
        //circle on the countries, and check their years
        const cleanCountry = country.toLowerCase().replace(' ','-').replace('.','-').replace('(','').replace(')','').replace('/','-');
        let dataLink = `https://results.usaid.gov/results/country/${cleanCountry}?fiscalYear=${year}`
        console.log(dataLink)
        const page = await runPage(browser, dataLink);
        const Selector = '#selected_bar_height > div.row.sb-details-wrapper > div.column.small-12.medium-5.xlarge-6 > div > div > div.quicklook-container > div > div:nth-child(4) > div'
        console.log('taking a screenshot')
        await page.screenshot({ path: pathMaker('downloads', `${year}.png`) });
        console.log('awaiting selector');
        await page.waitForSelector(Selector);
        console.log('found selector');
        await page.screenshot({ path: pathMaker('downloads', `${year}${country}.png`) });
        const info = await page.evaluate(() => {
          const selector = '#selected_bar_height > div.row.sb-details-wrapper > div.column.small-12.medium-5.xlarge-6 > div > div > div.quicklook-container > div > div:nth-child(4) > div';
          const element = document.querySelector(selector);
          const textContent = element.innerHTML; // Use innerHTML to get the raw HTML content

          // Replace the <br> tag with a space
          let cleanedText = textContent.replace('<span class="ql-text">', '');
          cleanedText = cleanedText.replace('</span>', '');

          cleanedText = cleanedText.replace('<br>', ' ');

          return cleanedText.trim();
        });

        let infoArr = info.split(' ');
        AllData.push({
          country: country,
          year: year,
          Human_Development_Index: {
            score: +infoArr[1],
            level: infoArr[3]
          }
        });
        page.close();
      }

    }
  }
  console.log('done', AllData);

  fs.writeFileSync(pathMaker('downloads', 'human-development-index.json'), JSON.stringify(AllData, null, 2));
  //write all data to json
  
  browser.close();


}

ManualDataScrapper();




// getCountryDropDown();
// AutoDataScrapper();

// main();

//'unzipped_files' in .env