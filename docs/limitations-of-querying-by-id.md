# Limitations of querying by ID

When [querying by record ID](/guides/search/semantic-search#search-with-a-record-id), even with a high `topK`, the response is not guaranteed to include the record with the specified ID.

## Approximate nearest neighbor (ANN)

Approximate nearest neighbor algorithms are designed to quickly find the closest matches to a given data point within large datasets with reasonable accuracy rather than perfect precision. Depending on the data, ANN may have a slightly lower accuracy than Known Nearest Neighbor (KNN) algorithms, but will have significantly lower read costs and latency than KNN. This is one of the key features of ANN.

ANN algorithms assess broad data clusters to find matches. Some of these clusters might be ignored even if they contain relevant records simply because their overall similarity to the query is lower, because the algorithm aims to optimize the search by focusing on areas with a higher density of potential matches.

See our learning center for more information on [ANN algorithms](https://www.pinecone.io/learn/a-developers-guide-to-ann-algorithms/).

## Recommendations

### Perform a fetch instead of a query

Results from [Fetch](/guides/manage-data/fetch-data) are guaranteed to include the record with the specified ID.

### Use metadata filtering

A [metadata filter](/guides/index-data/indexing-overview#metadata) in an ANN search effectively narrows the dataset to a more relevant subset, fine-tuning the search process. By explicitly excluding less relevant clusters from the outset, the search is performed among a group of records more closely related to the query, thereby increasing the efficiency and accuracy of the search.
