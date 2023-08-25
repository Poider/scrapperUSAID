const path = require('path')
const fs = require('fs')
const s = function () {
const data =  fs.readFileSync(path.join(__dirname,'Carte interactive_Data _ LIFEMOZ _ OCPA.json'))

let jsonData = JSON.parse(data)
jsonData.forEach((item) => {
	if(item == undefined || item == null)
	return
	if(item.icon)
	delete item['icon']
	if(item.photo)
	delete item['photo']
	if(item["Geolocalisation"] !== undefined)
	{
	const split_ = item["Geolocalisation"].split(',')
	item.longitude = parseFloat(split_[0])
	item.latitude = parseFloat(split_[1])
	}
})


fs.writeFileSync(path.join(__dirname, 'Carte interactive_Data _ LIFEMOZ _ OCPA_FILTERED.json'), JSON.stringify(jsonData,null,2))
}
// 'Carte interactive_Data _ LIFEMOZ _ OCPA.json'
s()