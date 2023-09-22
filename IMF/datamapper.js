const axios = require('axios');
const fs = require('fs');
const path = require('path')
async function dataFetcher(indicator, ...args)
{
    if(!indicator)
        throw new Error('Indicator is required')
    let apiLink = 'https://www.imf.org/external/datamapper/api/v1'

    apiLink += `/${indicator}`

    for (let i = 0; i < args.length; i++)
        apiLink += `/${args[i]}`
    console.log(apiLink)
    const response = await axios.get(apiLink)
    return response.data
}

function getAfricanCountries()
{
    const jsonPath = path.join(__dirname, 'input', 'african_countries.json')
    const countriesData = fs.readFileSync(jsonPath, 'utf-8')
    return JSON.parse(countriesData)
}

function getObjectKeys(object)
{
    const keys = []
    for (const key in object)
    {
        keys.push(key)
    }
    return keys
}

function isAfrican(code, countriesData)
{
    for (const countryData of countriesData)
    {
        if (countryData["code"] === code)
            return countryData["country"]
    }
    return null
}

function formatData(data, unit, label)
{
    const africanCountries = getAfricanCountries()

    const formattedData = []
    const values = data["values"]
    const indicator = getObjectKeys(values)[0]
    getObjectKeys(values[indicator]).forEach((countryCode) => {
        const country = isAfrican(countryCode, africanCountries)
        if (country)
        {
            for(const year in values[indicator][countryCode])
            {
                if (year < 2000)
                    continue
                const value = values[indicator][countryCode][year]
                formattedData.push({
                    "indicator": label,
                    "country": country,
                    "country code": countryCode,
                    "year": year,
                    "value": value,
                    "unit": unit? unit : null
                    // "indicator": indicator
                })
            }
        }
    })
    return formattedData
}


async function dataMapper(indicator, fileName, unit, label)
{
    const fetchedData = await dataFetcher(indicator)
    const formattedData = formatData(fetchedData, unit, label)
    stringified = JSON.stringify(formattedData, null, 2)
    
    fs.writeFileSync(path.join(__dirname, 'output', fileName), stringified)
}


async function getFilesReady(indicator, fileName)
{
    const indicatorInfos = await dataFetcher('indicators')
    
    const unit = []
    const labels = []
    for(let i = 0; i < indicator.length; i++)
    {
        unit.push(indicatorInfos["indicators"][indicator[i]]["unit"])
        labels.push(indicatorInfos["indicators"][indicator[i]]["label"])
    }

    for (let i = 0; i < indicator.length; i++)
    {
        await dataMapper(indicator[i], fileName[i], unit[i], labels[i])
    }
}

async function main()
{
    const indicators = ['d','BRASS_MI']
    const fileNames = ["Gross public debt, percent of GDP.json", "Reserves (Months of Imports).json"]
    await getFilesReady(indicators, fileNames)
    
}

main()