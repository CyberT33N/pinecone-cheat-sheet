# Known limitations

This page describes known limitations and feature restrictions in Pinecone.

## General

* [Upserts](/guides/index-data/upsert-data)
  * Pinecone is eventually consistent, so there can be a slight delay before upserted records are available to query.

    After upserting records, use the [`describe_index_stats`](/reference/api/2024-10/data-plane/describeindexstats) operation to check if the current vector count matches the number of records you expect, although this method may not work for pod-based indexes with multiple replicas.
  * Only indexes using the [dotproduct distance metric](/guides/index-data/indexing-overview#dotproduct) support querying sparse-dense vectors.

    Upserting, updating, and fetching sparse-dense vectors in indexes with a different distance metric will succeed, but querying will return an error.
  * Indexes created before February 22, 2023 do not support sparse vectors.
* [Metadata](/guides/index-data/upsert-data#upsert-with-metadata-filters)
  * Null metadata values are not supported. Instead of setting a key to hold a null value, remove the key from the metadata payload.

## Serverless indexes

Serverless indexes do not support the following features:

* [Deleting records by metadata](/guides/manage-data/delete-data#delete-specific-records-by-metadata)

  * Instead, you can [delete records by ID prefix](/guides/manage-data/manage-document-chunks#delete-all-records-for-a-parent-document).
* [Selective metadata indexing](/guides/indexes/pods/manage-pod-based-indexes#selective-metadata-indexing)

  * Because high-cardinality metadata in serverless indexes does not cause high memory utilization, this operation is not relevant.
* [Filtering index statistics by metadata](/reference/api/2024-10/data-plane/describeindexstats)
* [Private endpoints](/guides/production/connect-to-aws-privatelink)

  * This feature is available on AWS only.

## Pod-based indexes

* [Pod storage capacity](/guides/indexes/pods/understanding-pod-based-indexes#pod-types)
  * Each **p1** pod has enough capacity for 1M vectors with 768 dimensions.
  * Each **s1** pod has enough capacity for 5M vectors with 768 dimensions.
* [Metadata](/guides/index-data/upsert-data#upsert-with-metadata-filters)
  * Metadata with high cardinality, such as a unique value for every vector in a large index, uses more memory than expected and can cause the pods to become full.
* [Collections](/guides/manage-data/back-up-an-index#pod-based-index-backups-using-collections)
  * You cannot query or write to a collection after its creation. For this reason, a collection only incurs storage costs.
  * You can only perform operations on collections in the current Pinecone project.
* [Sparse-dense vectors](/guides/search/hybrid-search#use-a-single-hybrid-index)
  * Only `s1` and `p1` [pod-based indexes](/guides/indexes/pods/understanding-pod-based-indexes#pod-types) using the dotproduct distance metric support sparse-dense vectors.
