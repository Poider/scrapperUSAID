const data = [
 {
 "indicator": {
 "id": "SP.POP.TOTL",
 "value": "Population, total"
 },
 "country": {
 "id": "AO",
 "value": "Angola"
 },
 "countryiso3code": "AGO",
 "date": "2020",
 "value": 33428486,
 "unit": "",
 "obs_status": "",
 "decimal": 0
 },
 {
 "indicator": {
 "id": "SP.POP.TOTL",
 "value": "Population, total"
 },
 "country": {
 "id": "BI",
 "value": "Burundi"
 },
 "countryiso3code": "BDI",
 "date": "2020",
 "value": 12220227,
 "unit": "",
 "obs_status": "",
 "decimal": 0
 }
]

function format(data_array){
 data_array.forEach(element => {
  if(element["indicator"] != undefined && element["indicator"] != undefined  && element["country"] != undefined && element["indicator"]["value"] != undefined && element["country"]["value"] != undefined && element["countryiso3code"] != undefined && element["date"] != undefined)
  {
  element["indicator"] = element["indicator"]["value"]
  element["country"] = element["country"]["value"]
  element["country code"] = element["countryiso3code"]
  delete element["countryiso3code"]
  element["year"] = element["date"]
  delete element["date"]
  }
  else
  {
   console.log("Error: data format is not correct")
   throw new Error("Error: data format is not correct")
  }

 });
 return data_array
}


function main()
{
 const formatted_data = format(data)
 console.log(JSON.stringify(formatted_data,null,2))
}
main ()