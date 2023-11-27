const fs = require('fs');
const path = require('path')

const pathFile = path.join(__dirname, 'imf_indicators.json');

function OpenAndProcess()
{
 const data = fs.readFileSync(pathFile, 'utf8');
 const json = JSON.parse(data);

 const toArr = Object.keys(json).map(key => json[key]);
 const indicators = toArr.map(x =>{return { label: x['label'], description : x['description']}});
 fs.writeFileSync(path.join(__dirname, 'imf_indicators_only.json'), JSON.stringify(indicators, null, 2));
}

OpenAndProcess();