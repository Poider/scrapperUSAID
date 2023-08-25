const axios = require('axios');
const fs = require('fs');

const fetchDataWithRetry = async () => {
  const maxRetries = 100; 
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.post('https://admin.vifaakenya.org/api/prices/byProducts', {
        unit: 'MZN_50_KG',
        dates: ['2023-06-01', '2023-06-30'],
        zoneSelected: false,
        treePlantation: false,
        zoomLevel: 6,
        years: [2023],
        yearSelected: 2023,
        townsSelected: [
          738669, 737070, 712598, 729323, 728796, 740167, 749492, 712596, 751110, 721228,
          713003, 713909, 712582, 717415, 712594, 737763, 733647, 725086, 724967, 712589,
          717413, 716317, 740936, 734717, 734385, 751128, 751017, 728501, 739985, 760656,
          760575, 760609, 740240, 760571, 727705, 760573, 760661, 716801, 760751, 727387,
          760812
        ],
        currencyCode: 'MZN',
        compoundProductSelected: '281',
        countryIso: 'MZ',
        lang: 'en'
      }, {
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
  
    const data = await fetchDataWithRetry();
  
    fs.writeFileSync("MonthlyInternationalPrice.json", JSON.stringify(data, null, 2));
})();