# Data ingestion overview

To ingest data into an index, you can [import from object storage](#import-from-object-storage) or use the [upsert](#upsert) operation.

<Tip>
  To control costs when ingesting large datasets (10,000,000+ records), use [import](/guides/index-data/import-data) instead of upsert.
</Tip>

## Import from object storage

[Importing from object storage](/guides/index-data/import-data) is most efficient and cost-effective method to load large numbers of records into an index. You store your data as Parquet files in object storage, integrate your object storage with Pinecone, and then start an asynchronous, long-running operation that imports and indexes your records.

<Note>
  This feature is in [public preview](/release-notes/feature-availability) and available only on [Standard and Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

### Import limitations

* Import does not support [integrated embedding](/guides/index-data/indexing-overview#vector-embedding).
* Import only supports AWS S3 as a data source.
* You cannot import data from S3 Express One Zone storage.
* You cannot import data into existing namespaces.
* Each import request can import up 1TB of data into a maximum of 100 namespaces. Note that you cannot import more than 10GB per file and no more than 100,000 files per import.
* Each import will take at least 10 minutes to complete.

### Import cost

* To understand how cost is calculated for imports, see [Understanding cost](/guides/manage-cost/understanding-cost#imports-and-storage).
* For up-to-date pricing information, see [Pricing](https://www.pinecone.io/pricing/).

## Upsert

For ongoing ingestion into an index, either one record at a time or in batches, use the [upsert](/guides/index-data/upsert-data) operation. [Batch uperting](/guides/index-data/upsert-data#upsert-in-batches) can improve throughput performance and is a good option for larger numbers of records (up to 1000 per batch) if you cannot work around import's current [limitations](#limitations).

### Upsert limits

| Metric                                 | Limit               |
| :------------------------------------- | :------------------ |
| Max upsert size                        | 2MB or 1000 records |
| Max metadata size per record           | 40 KB               |
| Max length for a record ID             | 512 characters      |
| Max dimensionality for dense vectors   | 20,000              |
| Max non-zero values for sparse vectors | 2048                |
| Max dimensionality for sparse vectors  | 4.2 billion         |

### Upsert cost

* To understand how cost is calculated for upserts, see [Understanding cost](/guides/manage-cost/understanding-cost#upsert).
* For up-to-date pricing information, see [Pricing](https://www.pinecone.io/pricing/).

## Data freshness

Pinecone is eventually consistent, so there can be a slight delay before new or changed records are visible to queries. You can view index stats to [check data freshness](/guides/index-data/check-data-freshness).
