const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function dataFetcher(link)
{

    console.log("request link: " ,link)
    const response = await axios.get(link)
    // console.log("response status: ", response.status);
    return response.data
}

function dataStructureParser(data)
{
    let indicatorArr = data["Structure"]["CodeLists"]["CodeList"][3]["Code"]
    indicatorArr = indicatorArr.map(indicator => {
        return {
            id: indicator["@value"],
            name: indicator["Description"]["#text"]
        }
    })
    return indicatorArr
}

async function getDataSetIndicators(dataSetID)
{
    const data = await dataFetcher(`http://dataservices.imf.org/REST/SDMX_JSON.svc/DataStructure/${dataSetID}`)
    const stringified = JSON.stringify(data, null, 2)
    const writePath = path.join(__dirname, 'datasets infos output', `${dataSetID}_fullInfos.json`)
    fs.writeFileSync(writePath, stringified)
    const writePath2 = path.join(__dirname, 'datasets infos output', `${dataSetID}_indicators.json`)
    const indicators  = dataStructureParser(data)
    fs.writeFileSync(writePath2, JSON.stringify(indicators, null, 2))
}

async function getGeneric(jsonData)
{
    const fields = {};

// Extract Frequency (FREQ) information
const freq = jsonData.GenericMetadata.MetadataSet.AttributeValueSet.find(
    (item) => item.TargetRef === 'DATA_STRUCTURE_DEFINITION' &&
      item.ReportedAttribute &&
      item.ReportedAttribute.some(
        (attr) => attr['@conceptID'] === 'FREQ_NAME'
      )
  );
  
  if (freq) {
    fields['Frequency'] = {
      Name: freq.ReportedAttribute.find(attr => attr['@conceptID'] === 'FREQ_NAME').Value['#text'],
      ID: freq.ReportedAttribute.find(attr => attr['@conceptID'] === 'FREQ_ID').Value['#text'],
      Mnemo: freq.ReportedAttribute.find(attr => attr['@conceptID'] === 'FREQ_MNEMO').Value['#text'],
    };
  } else {
    console.error("Frequency data not found.");
  }
  

// Extract Reference Area (REF_AREA) information
const refArea = jsonData.GenericMetadata.MetadataSet.AttributeValueSet.find(
  (item) => item.TargetRef === 'DATA_STRUCTURE_DEFINITION' &&
    item.ReportedAttribute.some(
      (attr) => attr['@conceptID'] === 'REF_AREA_NAME'
    )
);
if(refArea)
{
fields['Reference Area'] = {
  Name: refArea.ReportedAttribute.find(attr => attr['@conceptID'] === 'REF_AREA_NAME').Value['#text'],
  Code: refArea.ReportedAttribute.find(attr => attr['@conceptID'] === 'REF_AREA_CODE').Value['#text'],
  // Add other reference area properties here if needed
};
}
else
{
    console.error("Reference Area data not found.");
}
// Extract Indicator (INDICATOR) information
const indicator = jsonData.GenericMetadata.MetadataSet.AttributeValueSet.find(
  (item) => item.TargetRef === 'DATA_STRUCTURE_DEFINITION' &&
    item.ReportedAttribute.some(
      (attr) => attr['@conceptID'] === 'INDICATOR_NAME'
    )
);
if(indicator){
fields['Indicator'] = {
  Name: indicator.ReportedAttribute.find(attr => attr['@conceptID'] === 'INDICATOR_NAME').Value['#text'],
  Code: indicator.ReportedAttribute.find(attr => attr['@conceptID'] === 'INDICATOR_CODE').Value['#text'],
  // Add other indicator properties here if needed
};
}
else
{
    console.error("Indicator data not found.");
}

return fields;
}

async function dataPortalApi(datasetID, indicatorID,frequency, startPeriod, endPeriod, location, type = 'CompactData')
{
  //type = 'CompactData' or 'GenericMetadata'
  const data = await dataFetcher(`http://dataservices.imf.org/REST/SDMX_JSON.svc/${type}/${datasetID}/${frequency}.${location}.${indicatorID}?startPeriod=${startPeriod}&endPeriod=${endPeriod}`)
  return data
}
async function main()
{
    // http://dataservices.imf.org/REST/SDMX_JSON.svc/
    // http://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IRFCL/Q.RAFAFX_USD?startPeriod=2000&endPeriod=2001
   
    // await getDataSetIndicators("AFRREO")

    // const GenericMetadata = await dataFetcher('http://dataservices.imf.org/REST/SDMX_JSON.svc/GenericMetadata/BOP/A..IAOCD_BP6_XDC.?startPeriod=2002&endPeriod=2022')
    const GenericMetadata = await dataPortalApi('BOP', 'IAOCD_BP6_XDC', 'A', '2002', '2022', '', '')
  const frequency = GenericMetadata?.GenericMetadata?.MetadataSet?.AttributeValueSet[0]?.ReportedAttribute[1]?.ReportedAttribute[2]?.Value["#text"];
  if(frequency)
  console.log('Frequency:', frequency);
  else
  console.error("Frequency data not found.");    
    const stringified = JSON.stringify(GenericMetadata, null, 2)
    console.log(stringified)
    
    // const fetchedData = await dataFetcher('http://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/BOP/A..IAOCD_BP6_XDC.?startPeriod=2002&endPeriod=2022')
    // console.log(JSON.stringify(fetchedData, null, 2))
}

main()