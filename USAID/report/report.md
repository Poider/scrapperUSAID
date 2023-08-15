DEC.USAID api you encode 64Base ur Qsearch > you encode again to URLBASE and send the api, results < 2000 denied -> request to send by email: https://dec.usaid.gov/api/

eg: https://dec.usaid.gov/api/qsearch.ashx?q=U2VhcmNoIHN0cmluZw%3D%3D


result :
{
  searchTerm: 'purchasing power zambia 2020',
  searchDate: '2023-08-11T03:56:51.1418568-04:00',
  RecordsFound: 2152,
  Error: {
    Identifier: 'ResultTooLargeForQsearch',
    Message: 'The query that you have provided returns too many results for qsearch to handle. Please include a more narrow search string or use https://dec.usaid.gov/api/request.aspx have the results send to you via email.'
  }
}






request: 
    https://dec.usaid.gov/api/qsearch.ashx?q=afghanistan%20male%20population%202014

returns documents and whole studies :
eg:
    https://dec.usaid.gov/dec/content/Detail.aspx?ctID=ODVhZjk4NWQtM2YyMi00YjRmLTkxNjktZTcxMjM2NDBmY2Uy&rID=NTk1NTMx


    DEC one of 4 APIS that are linked to usaid and the other 3 are dead

    eg: http://explore.data.gov/resource/668u-5wrc.json
        http://api.dhsprogram.com/#/api-data.cfm


now for : https://data.usaid.gov/browse?category=Economic+Growth
    which socrata gets the infos from



Each study has dataSets -> each have their link of API thats like tables with fields of that dataset
-> so we should gather the dataSets needed on years needed, and request data needed from a different link for each data for each year

eg: https://data.usaid.gov/Modern-Energy-Services/Power-Africa-Enabling-Environment-Data-Tracker/rhv4-cmvv


each dataSet we may find what we want or not, Collecting Taxes Database: only 2015 2017

eg : https://data.usaid.gov/resource/sf8i-fzzw.json
    has gdp from 1980 to 2016


thats what that global result is sorta random, cus their data are gathered from multiple different datasets



To browse dataSets :
        https://data.usaid.gov/browse






                                                    SCRAPPED::::

for scavanging stuff, I since we're tryna visualize, a user can't rely on smth that would show you data for a certain year for a country and next year that info is missing, saying the user is tracking X country to see if theres inflation through years and would find infos on graph bout 2014 nnone on 2015 then again 2016



after research, i found usaid gathers infos from worldbank for term of 'INCOME GROUP, GROSS NATIONAL INCOME' and 'POPULATION, 'Human Development Index' from (UN Development Program (UNDP), Human Development Report + UN Population Division, World Population Prospects)

^ the only data thats consistent for each year and each country
Other data : Spending by sector -> then multiple specifics on that sector spending
    eg. Agriculture: X$
        how many annual sales of farms 
        how many investments to support food security

Imma take from it for now the Human Dev index



check if stuff in here can be needed?
https://roadmaps.usaid.gov/country/algeria
https://idea.usaid.gov/cd/albania/education
https://www.foreignassistance.gov/cd/albania

USAID Sources:
WorldBank

idea: put in averages just for user to have an idea to scale that data using the average perspective (get the average from all countries with that data of that year);
