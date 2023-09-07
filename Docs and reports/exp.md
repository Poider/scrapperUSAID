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
fix the rest of the files,
lifemoz handle nigeria null stuff line
lifemoz mergin with the programs data -> each has its kpis
finish mayssoun's work
getting geolocation for prod
add bcg stuff
get africa fertilizer links
report about trademaps
design after she send agri -> she sent design pattern to follow

>> questionable
	worldbank from js? faostat too? -> exists
	if data is big in files swap to streaming data instead of reading it in heap at once

>>on going


contract

add env for insert

make version for updating (IN PRODUCTION PHASE)




>>> TODO
note data cleaning
updates frequency

sales products rename?


ERROR HANDLIN IN PARSERS IN CASE ITS OUT OF ORDINARY (in the db insertion code)
name and structure convention docs


https://datadryad.org/stash/dataset/doi:10.5061/dryad.2rbnzs7qh
check how to integrate that data map interactive into tableau



>>Questions
	extraction -> transform +? (filtering for the last needed infos) -> loading data

	-can we have a dataset and update on top of it if we link straight to tableau?
	-there's certain datasets that are uniform and do not really change as theyre from certain databases too that do update on a certain frequency
	-are we fetchin data from the api each time we try to visualize? cause for that it may be taking more time for data the arrive
	-currency exchange/navires? and irl api?
	-we connect a db?
	-we did extraction and transformation to the data now its time to load it
	-what she thought bout the ones I picked
	-data sciences if we dont have the data stored


--huge rate limit on imf datasets







	-programs data I linked em to lifemoz, but which is it we wanna show, right now theyre all there
	-design dial strategy, do we just make one dashboard, this is the dashboard profile of stragtegy things


>>sales Product name changes
	DAP MAP 1
	npk just percetages
	ACP
	BG4  -> rock phosphate
	TSP
	MCP
	jfc5? (f ocp col)
	FOB is paid price to get all the way to my port its on em how much to pay the ship waits in port price