
data integration and update process in the context of data pipelines
that afterwards will be data synchronization
ETL

extraction -> transform +? (filtering for the last needed infos) -> loading data

<Some files changes include :>
	-files parsed from weird formats OR transformed into a certain format (CRU BCG)
	-null check. > later will be handled by models (the vision)
	-fields changed for others on certain versions -> (eg. quantite facturee reajustee)
	-if negative FOB -> eliminate data row
	-add subregion for each country
	-added extra fields(project is operational or not,)
	-data aggregation
	-merge geolocations
	-added indicating data such as units for values
	-get bulk data show avg each year(doable in TAB)
	> tough :
	-files may have different versions structures + fields names
	-files need to update a dataset may differ for one dataset update
	-its been requested by many persons we may wanna have models and such later for prediction and such from the data, will this be possible through tableau

	-mr. jamali's vision: "« « outre le besoin de données et d’info Agri en Afrique et ce en temps réel – est aussi pour pouvoir centraliser une base de données regroupant notre Knowledge sur les fermiers Africains. Avouons qu’a date d’aujourd’hui, ce savoir-faire est éparpillé sur des laptops et des serveurs dans les 12 pays de présence + HQ. Je fais allusion à la data des OSL, Agribosster, Farmer Hub, Partenaires, et je passe) »
	> just check with him since he had a certain vision for this project

	first step was : 1.	Préparer une première liste des données à consolider et visualiser. Chaque collaborateur, selon son rôle, proposera un ensemble d’indicateurs pertinents, en phase avec la vision de Ssi Jamali


>>Questions
	-you asked taille of data, the one to be inserted at the start or the one that'll be updated 
		> what is your vision to pull the data
	-can we link between data that's not having exactly same name (example I try to put in data that comes from a certain api about fertlizers whereas they have different names on both, or for example countries names, (added accent, used abreviation...))
	-can we have a dataset and update on top of it if we link straight to tableau?
	-there's certain datasets that are uniform and do not really change as theyre from certain databases too that do update on a certain frequency
	-are we fetchin data from the api each time we try to visualize? cause for that it may be taking more time for data the arrive
	-currency exchange/navires(jamali's suggestion)? and irl api?
	-we connect a db?
	-we did extraction and transformation to the data now its time to load it
	-what she thought bout the ones I picked
	-data sciences if we dont have the data stored
	-can it accept json? or just excels
	-if I give africa fertlizers and the request either timeout or refuse to connect will there be handling for this sorta errors (like retrying the request)
	-when data fails to load either on the old structure what happens

--huge rate limit on imf datasets


	-- what sorta path could I take to get certfied in tableau? just in case I wanted to add it to my skillset


>internal files
Sources internes : 
	Fichiers sources provenant de BCG 
	Données provenant de Schoollab OCP Africa, Agribooster, des initiatives OSL, Farmer houses, etc. 



>update frequency
imf:
	IMF updated monthly or quarterly

VIFA:
	Market Prices: Updated weekly
	Fertilizer Demand and Supply: Updated monthly
	Fertilizer Policies and Regulations: Updated quarterly
	Fertilizer Research and Development: Updated annually

files:
	plants : annual
	capacities : quarterly
	CRU + premium : weekly