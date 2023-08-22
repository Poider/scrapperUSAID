"https://datahelp.imf.org/knowledgebase/articles/667681-using-json-restful-web-service"
datasets: "https://data.imf.org/?sk=388dfa60-1d26-4ade-b505-a05a558d9a42&sid=1479329132316"

Example:
https://datahelp.imf.org/knowledgebase/articles/1968408-how-to-use-the-api-python-and-r

Dataflow Method:
    Arguments: None
    Returns: A list of available dataset names.

DataStructure Method:
    Argument: database ID (the ID of a specific dataset)
    Returns: The structure of the specified dataset.


CompactData Method:
    Arguments:
    database ID: ID of the dataset.
    items from dimensions: Specific items from dimensions (variables) that you want data for.
    start date and end date: Time period for the data.
    Returns: Compact data for the specified dimensions and time period.

MetadataStructure Method:
    Argument: database ID
    Returns: The metadata structure of the specified dataset.

GenericMetadata Method:
    Arguments:
    database ID: ID of the dataset.
    frequency: Time frequency of the data.
    items from dimensions: Specific items from dimensions (variables) that you want metadata for.
    start date and end date: Time period for the metadata.
    Returns: Generic metadata for the specified dimensions and time period.

CodeList Method:
    Argument: Either a codelist code or a database ID
    Returns: Description of the requested codelist or dataset's codelists.

MaxSeriesInResult Method:
    Arguments: None
    Returns: Maximum number of time series that can be returned by CompactData.