les choices made:

generally speaking about what it took to get this final result we have gone through an ETL process where you extract, clean, transform, load, and analyze, so far we have done the first 3 and currently on the process of loading the data for visualization, the vision later stays to also fill gaps through analyzing and using ai models.

we tried to not fall in the "garbage in, garbage out", so it took effort finding the right ressources that are reliable through a list of known datasets and world leading organizations something such as worldbank, we then had to see if we're able to

we had around 16 ressources that range between apis and website to scrap private apis from and website to automate scrapping from, for internal file we put  a script that shall consume each file and outputs either the data as jsons to be visualized with tableau or fed straight into a database

Point forts of those decisions:


architecture taken:

    Management rules


best practice we did like making catalogue:


Problems:


Solutions:
