const fs = require('fs');
const {pathMaker} = require('../utils/path.js');


const data = fs.readFileSync(pathMaker('..','USAID','downloads','jsonized','data.json'), 'utf-8');
const dataObj = JSON.parse(data);

for(let year = 2014; year <=2021 ;year++){
let filtered = dataObj.filter((item) => {
    return +(item.fiscal_year) === 2020;
});
filtered = filtered.map((item) => {
    return item.country_name;
});
filtered = [...new Set(filtered)];
const jsonized = JSON.stringify(filtered);
fs.writeFileSync(pathMaker('..','USAID','test',`${year}`), jsonized, 'utf-8'); 
}