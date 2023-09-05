imports:
1	- Total Import Volumes by Country Over Time (17 countries)
2	- Annual Import Volumes by product (13 products 17 countries)

exports:
3	- Total Export Volumes by Country Over Time (12 country)
4	- Annual Export Volumes by Product (up until 2022 / 12 countries 5 products )

volumes:
5	-Total Fertilizer production volumes by country over time (9 countries)
	
prices:
6	- Historical International Price Trends (for 16 products)





1)

const link = 'https://admin.vifaakenya.org/api/imports/regional/totalImportVolumesByCountry'
const body = {
  "years": [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
  "countriesSelected": [800519, 978660, 2, 805187, 683945, 3, 804180, 670465, 804873, 710067, 708364, 1, 777170, 804482, 690942, 778657, 805560],
  "lang": "en"
}

2)

const year = 2023;
  const link = 'https://admin.vifaakenya.org/api/imports/regional/byCountry'
  const body = {
    yearSelected: year,
    countriesSelected: [800519, 978660, 2, 805187, 683945, 3, 804180, 670465, 804873, 710067, 708364, 1, 777170, 804482, 690942, 778657, 805560],
    productsSelected: [17, 287, 13, 285, 11, 281, 7, 278, 21, 52, 276, 274, 0],
    lang: "en"
  }

3)
const link = "https://admin.vifaakenya.org/api/exports/regional/totalExportVolumesByCountry"
const body  = {
  "years": [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
  "countriesSelected": [2, 805187, 683945, 3, 804180, 670465, 804873, 708364, 777170, 804482, 690942, 805560],
  "lang": "en"
}

4) 
	const year = 2022;
  const link = 'https://admin.vifaakenya.org/api/imports/regional/byCountry'
  const body = {
  "yearSelected": year,
  "countriesSelected": [2, 805187, 683945, 3, 804180, 670465, 804873, 708364, 777170, 804482, 690942, 805560],
  "productsSelected": [13, 281, 21, 52, 0],
  "lang": "en"
}

5)

const link = "https://admin.vifaakenya.org/api/production/regional/totalProductionVolumesByCountry"

const body = {
  "years": [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010],
  "countriesSelected": [2, 3, 670465, 683945, 777170, 804180, 804482, 805187, 805560],
  "productsSelected": [13, 17, 281, 287, 52, 0],
  "lang": "en"
}

6) 
const link = "https://admin.vifaakenya.org/api/fob/historicalSeriesByProducts"
const body = {
  "productOriginsSelected": [2041604, 22030, 22033, 22035, 82621, 22047, 22049, 22051, 22031, 22055, 22039, 22038, 22041, 22037, 22043, 22045],
  "dates": [],
  "unit": "USD_MT",
  "currencyCode": "USD",
  "lang": "en"
}