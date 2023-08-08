const puppeteer = require('puppeteer');
const unzipper = require('unzipper');
const {pathMaker} = require('./path');
const fs = require('fs');
const path = require('path');
const { get } = require('http');
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

async function directoryCleaner(directoryPath) {
  const directoryFiles =  getFolderFiles(directoryPath);
  console.log("cleaning directory", directoryPath, " of ", directoryFiles.length, " files");
  if(directoryFiles.length > 0) {
    directoryFiles.forEach(file => {
      const filePath = path.join(directoryPath, file);
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(`${file} was deleted`);
      });
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
  fs.createReadStream(filePath)
      .pipe(unzipper.Extract({ path: unzipPath }));
}

async function jsonize(jsonizedPath, unzipPath, xls_unzipped_files) {
  
}

async function main() {
  const downloadPath = pathMaker('downloads', 'zip');
  const unzipPath = pathMaker('downloads', 'unzipped_files');
  const jsonizedPath = pathMaker('downloads', 'jsonized');


  // await zipDownloader(downloadPath);
  // await fileUnzipper(downloadPath);
  
  const unzipped_files = getFolderFiles(unzipPath);
  const xls_unzipped_files  = unzipped_files.filter(file => file.endsWith('.xlsx'));
  jsonize(jsonizedPath,unzipPath,xls_unzipped_files);
  //Jsonize with africa filtering
  // scrapCountryInfos // promise all with first
}

main();