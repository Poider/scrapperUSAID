const axios = require('axios');


async function dataFetcher(indicator, ...args)
{
    if(!indicator)
        throw new Error('Indicator is required')
    let apiLink = 'http://dataservices.imf.org/REST/SDMX_JSON.svc'

    apiLink += `/${indicator}`

    for (let i = 0; i < args.length; i++)
        apiLink += `/${args[i]}`
    console.log(apiLink)
    const response = await axios.get(apiLink)
    return response.data
}

async function main()
{
    // http://dataservices.imf.org/REST/SDMX_JSON.svc/
    // http://dataservices.imf.org/REST/SDMX_XML.svc/CompactData/IRFCL/Q.RAFAFX_USD?startPeriod=2000&endPeriod=2001
    data = await dataFetcher('http://dataservices.imf.org/REST/SDMX_XML.svc/CompactData/DS-IRFCL/Q.RAFAFX_USD?startPeriod=2018&endPeriod=2020')
    stringified = JSON.stringify(data, null, 2)
    console.log(stringified)
}

main()