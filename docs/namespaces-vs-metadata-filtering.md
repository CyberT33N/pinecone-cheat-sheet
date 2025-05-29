# Namespaces vs. metadata filtering

This article will discuss the advantages and disadvantages of using namespaces
and metadata filtering in your application. Performance is the same whether
you use namespaces or metadata filtering. The most significant difference is
how you query your index.

## Namespaces

[Namespaces](/guides/index-data/indexing-overview#namespaces) are a way to segment data into distinct areas within your index.
The intent is to have the ability for an index to serve multiple purposes. For
example, you could have a single index containing customers, catalog items,
and articles. These can be queried and treated effectively as separate
entities in your index. However, there is one strong consideration. You can
only query one namespace (or none) at a time. This means you cannot choose to
query the entire corpus of data in the future. If you see the need to query
across namespaces, then use metadata filtering instead. If you never need to
cross namespaces with queries, then using namespaces is fine.

## Metadata Filtering

Metadata fields or you could call them key:value pairs, are a way to add
information to individual vectors to give them more meaning. By adding
metadata to your vectors, you can filter by those fields at query time. This
is similar to namespaces, except you are not limited to a single filter. You
can use a variety of filter patterns and conditions to search subsets of your
data without requiring namespaces or multiple queries. This is a popular
alternative to namespaces, and many customers use this method instead. This
gives the same performance and more flexibility in the future if you want to
search across the entire index.

For more information, see [metadata filtering](/guides/index-data/indexing-overview#metadata).

## Switching from namespaces to metadata filtering

1. Clear your index or [create a new index](https://www.pinecone.io/docs/api/operation/create_index/)
2. [Re-ingest](https://www.pinecone.io/docs/api/operation/upsert/)
   your data and use a metadata field instead. Leave out the namespace
   parameter.
3. Run queries using the methods outlined on [Filtering with metadata](/guides/index-data/indexing-overview#metadata).
