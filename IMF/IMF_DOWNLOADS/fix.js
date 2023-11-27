const fs = require('fs');
const path = require('path');

/**[
  {
    "countryName": "Brazil",
    "indicatorName": "Official Reserve Assets, US Dollars",
    "year": "2000",
    "valueOfTheYear": 33011400000
  }] */


  function getCountriesRef() {
   const jsonPath = path.join(__dirname, '..', '..', 'Regions','African_regions.json'); 
   const countriesRef = fs.readFileSync(jsonPath, 'utf-8');
   const parsedCountriesRef = JSON.parse(countriesRef);

   const countriesRegions = parsedCountriesRef.map(countryData => {
       const { country, iso_code } = countryData;
       return [country.toUpperCase() , iso_code];
   });
   return new Map(countriesRegions);

}
  const imfCountriesChanged = new Map([
   ["CONGO, REPUBLIC OF",'Congo (Brazzaville)'],
   ["CONGO, DEM. REP. OF THE", 'Congo (Kinshasa)'],
   ["SÃO TOMÉ AND PRÍNCIPE", 'Sao Tome and Principe'],
   ["SOUTH SUDAN, REPUBLIC OF", "South Sudan"],
   ["EGYPT, ARAB REP. OF", "Egypt"],
   ["CÔTE D'IVOIRE", "COTE D'IVOIRE"]
])
function getCountryDataToInsert(country, countriesRef)
{
   country = country.toUpperCase();
   if(countriesRef.get(country))
   {
       const iso_code = countriesRef.get(country);
       return {country, iso_code};
   }
   else
   {
       if(imfCountriesChanged.get(country))
       {
           const updatedCountry = imfCountriesChanged.get(country).toUpperCase();
           const iso_code = countriesRef.get(updatedCountry);
           // console.log(country, iso_code)
           return {country : updatedCountry, iso_code};
       }
       else
       return {country, iso_code : null};
   }    
}
function FixJson()
{

 const regionData = getCountriesRef()
 const parsedRegionData = regionData

 const jsonPath = path.join(__dirname, 'Official Reserve Assets.json');
  const data = fs.readFileSync(jsonPath, 'utf-8');
  const parsedData = JSON.parse(data);
  const fixedData = parsedData.map(countryData => {
    const { countryName, indicatorName, year, valueOfTheYear } = countryData;
    const { country, iso_code } = getCountryDataToInsert(countryName, parsedRegionData);
    return { country, "country code":iso_code, indicator : indicatorName, year, value: valueOfTheYear, source :"IMF DATASETS DOWNLOAD", api_url : "https://data.imf.org/" , unit :"US DOLLARS", extracted_on: new Date().toISOString().slice(0, 10), indicator_code: "IRFCL_08-18-2023-10-47-09-91_timeSeries"};
  }
  );
  return fixedData;
}

let fixedData = FixJson();
fixedData = fixedData.filter(countryData => countryData.iso_code != null)
const jsonPath = path.join(__dirname, 'Official Reserve Assets.json');
fs.writeFileSync(jsonPath, JSON.stringify(fixedData, null, 2));
