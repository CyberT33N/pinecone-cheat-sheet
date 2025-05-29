# Use namespaces instead of several indexes

In any use case where you consider adding an index on a *per-user* or *per-instance* basis, you likely should explore using [namespaces](/guides/index-data/indexing-overview#namespaces). Namespaces allow you to partition the records of an index. Pinecone then confines all queries and other operations to a single namespace, thus separating the records as if they existed in separate indexes.

In any situation where you may be seeking to programmatically create indexes, you also likely should consider using [namespaces](/guides/index-data/indexing-overview#namespaces) instead. Separate indexes are highly resource and cost-intensive. Most use cases that may initially seem like they require distinct indexes can actually be tackled through the incorporation of namespaces.
