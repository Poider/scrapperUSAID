const puppeteer = require('puppeteer');

async function runBrowser() {
  const browser = await puppeteer.launch({
    headless: `true`, // Set headless mode to true for production
  });
  return browser;
}

async function runPage(browser, link) {
  const page = await browser.newPage();

  // Intercept network requests to prevent navigation
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    // Allow requests for resources, ignore navigations
      request.continue();
    
  });

  await page.goto(link);
  return page;
}

async function main() {
  let browser = await runBrowser();
  const page = await runPage(browser, 'https://results.usaid.gov/results');

  await page.waitForSelector('.button.button-icon-before');

  console.log("Found selector");

  const buttonElement = await page.$('.button.button-icon-before');
  const href = await buttonElement.evaluate(el => el.getAttribute('href'));

  const downloadPath = '/mnt/c/Users/User/Desktop/Work/pupeteering/downloads/';

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  console.log("Navigated to download link:", 'https://results.usaid.gov/' + href);

  // Directly initiate the download
  await page.evaluate(href => {
    window.open('https://results.usaid.gov/' + href, '_self');
  }, href);

  await page.waitForTimeout(10000);

  await browser.close();
}

main();
