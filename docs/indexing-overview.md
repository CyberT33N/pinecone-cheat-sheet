# Indexing overview

export const word_0 = "vectors"

This page describes key concepts related to indexing data in Pinecone.

## Indexes

In Pinecone, you store vector data in indexes. There are two types of indexes: dense and sparse.

### Dense indexes

Dense indexes store dense vectors, which are a series of numbers that represent the meaning and relationships of text, images, or other types of data. Each number in a dense vector corresponds to a point in a multidimensional space. Vectors that are closer together in that space are semantically similar.

When you query a dense index, Pinecone retrieves the dense vectors that are the most semantically similar to the query. This is often called **semantic search**, nearest neighbor search, similarity search, or just vector search.

Learn more:

* [Create a dense index](/guides/index-data/create-an-index#create-a-dense-index)
* [Upsert dense vectors](/guides/index-data/upsert-data#upsert-dense-vectors)
* [Query a dense index](/guides/search/semantic-search)

### Sparse indexes

<Note>
  This feature is in [public preview](/release-notes/feature-availability).
</Note>

Sparse indexes store sparse vectors, which are a series of numbers that represent the words or phrases in a document. Sparse vectors have a very large number of dimensions, where only a small proportion of values are non-zero. The dimensions represent words from a dictionary, and the values represent the importance of these words in the document.

When you search a sparse index, Pinecone retrieves the sparse vectors that most exactly match the words or phrases in the query. Query terms are scored independently and then summed, with the most similar records scored highest. This is often called **lexical search** or **keyword search**.

Learn more:

* [Create a sparse index](/guides/index-data/create-an-index#create-a-sparse-index)
* [Upsert sparse vectors](/guides/index-data/upsert-data#upsert-sparse-vectors)
* [Query a sparse index](/guides/search/lexical-search)

#### Limitations

<Note>
  These limitations are subject to change during the public preview period.
</Note>

Sparse indexes have the following limitations:

* Max sparse records per namespace: 100,000,000
* Max non-zero values per sparse vector: 1000
* Max upserts per second per sparse index: 10
* Max queries per second per sparse index: 100
* Max `top_k` value per query: 1000

  <Note>
    You may get fewer than `top_k` results if `top_k` is larger than the number of sparse vectors in your index that match your query. That is, any vectors where the dotproduct score is `0` will be discarded.
  </Note>
* Max query results size: 4MB
* Limited performance with high cardinality metadata. Better metadata indexing is coming soon.

## Namespaces

Within an index, records are partitioned into namespaces, and all [upserts](/guides/index-data/upsert-data), [queries](/guides/search/search-overview), and other [data operations](/guides/index-data/upsert-data) always target one namespace. This has two main benefits:

* **Multitenancy:** When you need to isolate data between customers, you can use one namespace per customer and target each customer's writes and queries to their dedicated namespace. See [Implement multitenancy](/guides/index-data/implement-multitenancy) for end-to-end guidance.

* **Faster queries:** When you divide records into namespaces in a logical way, you speed up queries by ensuring only relevant records are scanned. The same applies to fetching records, listing record IDs, and other data operations.

Namespaces are created automatically during [upsert](/guides/index-data/upsert-data). If a namespace doesn't exist, it is created implicitly.

<img className="block max-w-full dark:hidden" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/quickstart-upsert.png" />

<img className="hidden max-w-full dark:block" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/quickstart-upsert-dark.png" />

## Vector embedding

[Dense vectors](/guides/get-started/glossary#dense-vector) and [sparse vectors](/guides/get-started/glossary#sparse-vector) are the basic units of data in Pinecone and what Pinecone was specially designed to store and work with. Dense vectors represents the semantics of data such as text, images, and audio recordings, while sparse vectors represent documents or queries in a way that captures keyword information.

To transform data into vector format, you use an embedding model. You can either use Pinecone's integrated embedding models to convert your source data to vectors automatically, or you can use an external embedding model and bring your own vectors to Pinecone.

### Integrated embedding

1. [Create an index](/guides/index-data/create-an-index) that is integrated with one of Pinecone's [hosted embedding models](/guides/index-data/create-an-index#embedding-models).
2. [Upsert](/guides/index-data/upsert-data) your source text. Pinecone uses the integrated model to convert the text to vectors automatically.
3. [Search](/guides/search/search-overview) with a query text. Again, Pinecone uses the integrated model to convert the text to a vector automatically.

<Note>
  Indexes with integrated embedding do not support [updating](/guides/manage-data/update-data) or [importing](/guides/index-data/import-data) with text.
</Note>

### Bring your own vectors

1. Use an embedding model to convert your text to vectors. The model can be [hosted by Pinecone](/reference/api/2025-04/inference/generate-embeddings) or an external provider.
2. [Create an index](/guides/index-data/create-an-index) that matches the characteristics of the model.
3. [Upsert](/guides/index-data/upsert-data) your vectors directly.
4. Use the same external embedding model to convert a query to a vector.
5. [Search](/guides/search/search-overview) with your query vector directly.

## Data ingestion

<Tip>
  To control costs when ingesting large datasets (10,000,000+ records), use [import](/guides/index-data/import-data) instead of upsert.
</Tip>

There are two ways to ingest data into an index:

* [Importing from object storage](/guides/index-data/import-data) is the most efficient and cost-effective way to load large numbers of records into an index. You store your data as Parquet files in object storage, integrate your object storage with Pinecone, and then start an asynchronous, long-running operation that imports and indexes your records.

* [Upserting](/guides/index-data/upsert-data) is intended for ongoing writes to an index. [Batch upserting](/guides/index-data/upsert-data#upsert-in-batches) can improve throughput performance and is a good option for larger numbers of records (up to 1000 per batch) if you cannot work around import's current limitations.

## Metadata

Every [record](/guides/get-started/glossary#record) in an index must contain an ID and a vector. In addition, you can include metadata key-value pairs to store additional information or context. When you query the index, you can then include a [metadata filter](/guides/search/filter-by-metadata) to limit the search to records matching a filter expression. Searches without metadata filters do not consider metadata and search the entire namespace.

### Metadata types

Metadata payloads must be key-value pairs in a JSON object. Keys must be strings, and values can be one of the following data types:

* String
* Number (integer or floating point, gets converted to a 64 bit floating point)
* Booleans (true, false)
* List of strings

<Warning>
  Null metadata values are not supported. Instead of setting a key to hold a\
  null value, we recommend you remove that key from the metadata payload.
</Warning>

For example, the following would be valid metadata payloads:

```JSON JSON
{
    "genre": "action",
    "year": 2020,
    "length_hrs": 1.5
}

{
    "color": "blue",
    "fit": "straight",
    "price": 29.99,
    "is_jeans": true
}
```

### Metadata size

Pinecone supports 40KB of metadata per vector.

### Metadata filter expressions

Pinecone's filtering query language is based on [MongoDB's query and projection operators](https://docs.mongodb.com/manual/reference/operator/query/). Pinecone currently supports a subset of those selectors:

| Filter    | Description                                                                                                                        | Supported types         |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `$eq`     | Matches {word_0} with metadata values that are equal to a specified value. Example: `{"genre": {"$eq": "documentary"}}`            | Number, string, boolean |
| `$ne`     | Matches {word_0} with metadata values that are not equal to a specified value. Example: `{"genre": {"$ne": "drama"}}`              | Number, string, boolean |
| `$gt`     | Matches {word_0} with metadata values that are greater than a specified value. Example: `{"year": {"$gt": 2019}}`                  | Number                  |
| `$gte`    | Matches {word_0} with metadata values that are greater than or equal to a specified value. Example:`{"year": {"$gte": 2020}}`      | Number                  |
| `$lt`     | Matches {word_0} with metadata values that are less than a specified value. Example: `{"year": {"$lt": 2020}}`                     | Number                  |
| `$lte`    | Matches {word_0} with metadata values that are less than or equal to a specified value. Example: `{"year": {"$lte": 2020}}`        | Number                  |
| `$in`     | Matches {word_0} with metadata values that are in a specified array. Example: `{"genre": {"$in": ["comedy", "documentary"]}}`      | String, number          |
| `$nin`    | Matches {word_0} with metadata values that are not in a specified array. Example: `{"genre": {"$nin": ["comedy", "documentary"]}}` | String, number          |
| `$exists` | Matches {word_0} with the specified metadata field. Example: `{"genre": {"$exists": true}}`                                        | Number, string, boolean |
| `$and`    | Joins query clauses with a logical `AND`. Example: `{"$and": [{"genre": {"$eq": "drama"}}, {"year": {"$gte": 2020}}]}`             | -                       |
| `$or`     | Joins query clauses with a logical `OR`. Example: `{"$or": [{"genre": {"$eq": "drama"}}, {"year": {"$gte": 2020}}]}`               | -                       |

For example, the following has a `"genre"` metadata field with a list of strings:

```JSON JSON
{ "genre": ["comedy", "documentary"] }
```

This means `"genre"` takes on both values, and requests with the following filters will match:

```JSON JSON
{"genre":"comedy"}

{"genre": {"$in":["documentary","action"]}}

{"$and": [{"genre": "comedy"}, {"genre":"documentary"}]}
```

However, requests with the following filter will **not** match:

```JSON JSON
{ "$and": [{ "genre": "comedy" }, { "genre": "drama" }] }
```

Additionally, requests with the following filters will **not** match because they are invalid. They will result in a compilation error:

```
# INVALID QUERY:
{"genre": ["comedy", "documentary"]}
```

```
# INVALID QUERY:
{"genre": {"$eq": ["comedy", "documentary"]}}
```
