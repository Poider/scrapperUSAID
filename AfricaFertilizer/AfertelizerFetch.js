const axios = require('axios');
const fs = require('fs');

const fetchDataWithRetry = async (link, body) => {
  const maxRetries = 100; 
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.post(link, body, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Content-Type': 'application/json',
          'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          Referer: 'https://viz.africafertilizer.org/',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        timeout: 60000,
      });
      console.log('retries:', retries)
      // console.log(response.data);
      return response.data;
      break;
    } catch (error) {

      if (error.code === 'ETIMEDOUT') {
        console.log('Timeout occurred. Retrying...');
        retries++;
      } else {

        console.log('OTHER ERROR')
        break;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  if (retries === maxRetries) {
    console.error('Max retries reached. Request could not be completed.');
    throw new Error('Max retries reached. Request could not be completed.');
  }
};


(async function main() {
  const link = "https://admin.vifaakenya.org/api/fob/historicalSeriesByProducts"
  const body = {
    "productOriginsSelected": [2041604, 22030, 22033, 22035, 82621, 22047, 22049, 22051, 22031, 22055, 22039, 22038, 22041, 22037, 22043, 22045],
    "dates": [],
    "unit": "USD_MT",
    "currencyCode": "USD",
    "lang": "en"
  }

    const data = await fetchDataWithRetry(link , body);
    console.log(JSON.stringify(data, null, 2))
    // fs.writeFileSync("MonthlyInternationalPrice.json", JSON.stringify(data, null, 2));
})();