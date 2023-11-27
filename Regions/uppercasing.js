
const path = require('path');
const fs = require('fs');


function UppercasingJson()
{
    const jsonPath = path.join(__dirname, 'African_regions.json');
    const countriesRef = fs.readFileSync(jsonPath, 'utf-8');
    const parsedCountriesRef = JSON.parse(countriesRef);
    const countriesRegions = parsedCountriesRef.map(countryData => {
        const { country, iso_code, subregion } = countryData;
        return {country : country.toUpperCase(), iso_code,subregion: subregion.toUpperCase()};
    });
    return countriesRegions;
}

const countriesRegions = UppercasingJson();
const jsonPath = path.join(__dirname, 'African_regions.json');  
fs.writeFileSync(jsonPath, JSON.stringify(countriesRegions, null, 2));


