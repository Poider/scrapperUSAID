>>>HISTORY
worked on USAID + IMF + african fertilizer + currency exchange

messaged bloomberg/reuters

carte to json (clean the json)
africa fertilizer -> report website data (per countries per year)
AFOSTAT(this data is cool) -> json
messaged trademap
FOUND INDICATORS
download / check some of the excel formats
make a fetching function
reverse engineer the country codes + town codes + product codes + available country data->	changes each page 
thinkin of best way to store this through a db, for performance
Talked to official trademap
documentation : if there's a new country added (can be automated later)
excel files give them formulas
translating some excel to data
is it avg we take in week premium > it is
tell her she needs to know that there's diffference f african-fert graphs



>>>>DONE
fix percentage abuja
add excel date extract from the number
create parsers for each file
check integrity of the data (check if I converted any percentages)
filtering jsons of excels


>> questionable
	worldbank from js? faostat too? -> exists

>>on going



>>> TODO
check if filtering is all ok
contract
make a handler on top of all the parsers
ERROR HANDLIN IN PARSERS IN CASE ITS OUT OF ORDINARY
name and structure convention docs


make version for updating
https://datadryad.org/stash/dataset/doi:10.5061/dryad.2rbnzs7qh
check how to integrate that data map interactive into tableau
whats ifdc
chEcK ppt

>>Questions
	-Sales :
	Null Check :  Product Category , Quantité facturée réajustée, Sub region 
	I save dates dd/mm/yyyy or mm/dd/yyyy (whats in some files but it looks weird)
	sub region? am I to google which is east countries and west ones?
	2017 NAN
	FOB can be negative? AMEROPA AG 2017
	Montant FOB vs prix FOB / montant? also which is that in 2023 file 

	-blending : status??

----PHASE DATABASE FILLING after having the grouping and the schema so I can define the database tables schema


>>sales Product name changes
	DAP MAP 1
	npk just percetages
	ACP
	BG4  -> rock phosphate
	TSP
	MCP
	jfc5? (f ocp khana)