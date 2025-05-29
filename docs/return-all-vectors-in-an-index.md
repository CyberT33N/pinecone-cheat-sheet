# Return all vectors in an index

Pinecone is designed to find vectors that are similar to a given set of conditions, either by comparing a new vector to the ones in the index or by comparing a vector in the index to all of the others using the [query by ID feature](/reference/api/2024-10/data-plane/query). Because the Pinecone query function relies on performing this similarity search, there isn't a way to return all of the vectors currently stored in the index with a single query.

There isn't a guaranteed workaround for this type of query today but providing the ability to query all or export the entire index is on our roadmap for the future.
