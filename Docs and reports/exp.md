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
fix percentage abuja
add excel date extract from the number
create parsers for each file
check integrity of the data (check if I converted any percentages)
filtering jsons of excels
make a handler on top of all the parsers
check if filtering is all ok

added the prod parser


>>>>DONE


>> questionable
	worldbank from js? faostat too? -> exists
	if data is big in files swap to streaming data instead of reading it in heap at once

>>on going
lifemoz mergin with the programs data -> each has its kpis
getting geolocation for prod

add env for insert
make version for updating (IN PRODUCTION PHASE)


>>yassine
and tableau dude tomorrow



>>> TODO
design after she send agri -> she sent design pattern to follow
report about trademaps
sales products rename?
add bcg stuff
contract
ERROR HANDLIN IN PARSERS IN CASE ITS OUT OF ORDINARY (in the db insertion code)
name and structure convention docs
	2017 NAN

https://datadryad.org/stash/dataset/doi:10.5061/dryad.2rbnzs7qh
check how to integrate that data map interactive into tableau



>>
	design dial strategy, do we just make yes, this is the dashboard profile of stragtegy things


>>sales Product name changes
	DAP MAP 1
	npk just percetages
	ACP
	BG4  -> rock phosphate
	TSP
	MCP
	jfc5? (f ocp col)
	FOB is paid price to get all the way to my port its on em how much to pay the ship waits in port price