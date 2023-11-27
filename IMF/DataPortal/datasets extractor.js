const fs = require('fs');
const path = require('path')

const pathFile = path.join(__dirname, 'data_portal_datasets.json');
const data = fs.readFileSync(pathFile, 'utf8');


const json = JSON.parse(data);
const datasets = json.map(x => {return {code: x.KeyFamilyRef.KeyFamilyID, description: x.Name['#text']}});
fs.writeFileSync(path.join(__dirname, 'data_portal_datasets_only.json'), JSON.stringify(datasets, null, 2));