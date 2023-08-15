const axios = require('axios');


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

async function main()
{

    data = await dataFetcher('NGDP_RPCH', 'DZA')
    stringified = JSON.stringify(data, null, 2)
    console.log(stringified)
}

main()