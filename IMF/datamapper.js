const axios = require('axios');

const fs = require('fs');
const path = require('path')
async function dataFetcher(indicator, ...args) {
    if (!indicator)
        throw new Error('Indicator is required')
    let apiLink = 'https://www.imf.org/external/datamapper/api/v1'

    apiLink += `/${indicator}`

    for (let i = 0; i < args.length; i++)
        apiLink += `/${args[i]}`
    console.log(apiLink)
    const response = await axios.get(apiLink)
    return response.data
}

function getAfricanCountries() {
    const jsonPath = path.join(__dirname, 'input', 'african_countries.json')
    const countriesData = fs.readFileSync(jsonPath, 'utf-8')
    return JSON.parse(countriesData)
}

function getObjectKeys(object) {
    const keys = []
    for (const key in object) {
        keys.push(key)
    }
    return keys
}

function isAfrican(code, countriesData) {
    for (const countryData of countriesData) {
        if (countryData["code"] === code)
            return countryData["country"]
    }
    return null
}

function getCountriesRef() {
    const jsonPath = path.join(__dirname, '..', 'Regions', 'African_regions.json');
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

function formatData(data, unit, label) {
    const africanCountries = getAfricanCountries()

    const formattedData = []
    const values = data["values"]
    const countriesRef = getCountriesRef()
    const indicator = getObjectKeys(values)[0]
    getObjectKeys(values[indicator]).forEach((countryCode) => {
        const country = isAfrican(countryCode, africanCountries)
        if (country) {
            const countryToInsert = getCountryDataToInsert(country,countriesRef)
            
                for (const year in values[indicator][countryCode]) {
                    if (year < 2000)
                        continue
                    const value = values[indicator][countryCode][year]
                    formattedData.push({
                        "indicator": label,
                        "country": countryToInsert.country ? countryToInsert.country : null,
                        "country code": countryToInsert.iso_code ? countryToInsert.iso_code : null,
                        "year": year,
                        "value": value,
                        "unit": unit ? unit : null,
                        "source": "IMF",
                        "api_url" : "https://www.imf.org/external/datamapper/api/v1",
                        "extracted_on": new Date().toISOString().slice(0, 10)

                        // "indicator": indicator
                    })
                }
            
        }
    })
    return formattedData
}


async function dataMapper(indicator, fileName, unit, label) {
    const fetchedData = await dataFetcher(indicator)
    const formattedData = formatData(fetchedData, unit, label)
    stringified = JSON.stringify(formattedData, null, 2)

    fs.writeFileSync(path.join(__dirname, 'output', fileName), stringified)
}


async function getFilesReady(indicator, fileName) {
    const indicatorInfos = await dataFetcher('indicators')

    const unit = []
    const labels = []
    for (let i = 0; i < indicator.length; i++) {
        unit.push(indicatorInfos["indicators"][indicator[i]]["unit"])
        labels.push(indicatorInfos["indicators"][indicator[i]]["label"])
    }

    for (let i = 0; i < indicator.length; i++) {
        await dataMapper(indicator[i], fileName[i], unit[i], labels[i])
    }
}

async function main() {
    const indicators = [
     'd',
     'BRASS_MI',
     'DG_GDP', 
     'EREER',
     "GGXCNL_GDP", 
     "GGXCNLXG_GDP", 
     "GGRXG_GDP", 
     "GGX_GDP", 
     "GGXWDG_GDP", 
     "ENEER"
    ]
    const fileNames = [
        "Gross public debt, percent of GDP.json", 
        "Reserves (Months of Imports).json",
        "External Debt, Official Debt, Debtor Based (% of GDP).json",
        "Real Effective Exchange Rates (2010=100).json",
        "Overall Fiscal Balance, Including Grants (% of GDP).json",
        "Overall Fiscal Balance, Excluding Grants (% of GDP).json",
        "Government Revenue, Excluding Grants (% of GDP).json", 
        "Government Expenditure (% of GDP.json", 
        "Government Debt (% of GDP).json", 
        "Nominal Effective Exchange Rates (2010=100).json"
    ]
    await getFilesReady(indicators, fileNames)

}

main()