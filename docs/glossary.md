# Glossary

This page defines concepts in Pinecone and how they relate to each other.

<img className="block max-w-full dark:hidden" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/objects.png" />

<img className="hidden max-w-full dark:block" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/objects-dark.png" />

## Organization

A organization is a group of one or more [projects](#project) that use the same billing. Organizations allow one or more [users](#user) to control billing and permissions for all of the projects belonging to the organization.

For more information, see [Understanding organizations](/guides/organizations/understanding-organizations).

## Project

A project belongs to an [organization](#organization) and contains one or more [indexes](#index). Each project belongs to exactly one organization, but only [users](#user) who belong to the project can access the indexes in that project. [API keys](#api-key) and [Assistants](#assistant) are project-specific.

For more information, see [Understanding projects](/guides/projects/understanding-projects).

## Index

There are two types of [serverless indexes](/guides/index-data/indexing-overview), dense and sparse.

<Note>
  For details on pod-based indexes, see [Using pods](/guides/indexes/pods/understanding-pod-based-indexes).
</Note>

### Dense index

A dense index stores [dense vectors](#dense-vector), which are a series of numbers that represent the meaning and relationships of text, images, or other types of data. Each number in a dense vector corresponds to a point in a multidimensional space. Vectors that are closer together in that space are semantically similar.

When you query a dense index, Pinecone retrieves the dense vectors that are the most semantically similar to the query. This is often called **semantic search**, nearest neighbor search, similarity search, or just vector search.

### Sparse index

<PP />

A sparse index stores [sparse vectors](#sparse-vector), which are a series of numbers that represent the words or phrases in a document. Sparse vectors have a very large number of dimensions, where only a small proportion of values are non-zero. The dimensions represent words from a dictionary, and the values represent the importance of these words in the document.

When you search a sparse index, Pinecone retrieves the sparse vectors that most exactly match the words or phrases in the query. Query terms are scored independently and then summed, with the most similar records scored highest. This is often called **lexical search** or **keyword search**.

## Namespace

A namespace is a partition within a [dense](#dense-index) or [sparse index](#sparse-index). It divides [records](#record) in an index into separate groups.

All [upserts](/guides/index-data/upsert-data), [queries](/guides/search/search-overview), and other [data operations](/reference/api/2024-10/data-plane) always target one namespace:

<img className="block max-w-full dark:hidden" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/quickstart-upsert.png" />

<img className="hidden max-w-full dark:block" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/quickstart-upsert-dark.png" />

For more information, see [Use namespaces](/guides/index-data/indexing-overview#namespaces).

## Record

A record is a basic unit of data and consists of a [record ID](#record-id), a [dense vector](#dense-vector) or a [sparse vector](#sparse-vector) (depending on the type of index), and optional [metadata](#metadata).

For more information, see [Upsert data](/guides/index-data/upsert-data).

### Record ID

A record ID is a record's unique ID. [Use ID prefixes](/guides/manage-data/manage-document-chunks#use-id-prefixes) to segment your data beyond namespaces.

### Dense vector

A dense vector, also referred to as a vector embedding or simply a vector, is a series of numbers that represent the meaning and relationships of data. Each number in a dense vector corresponds to a point in a multidimensional space. Vectors that are closer together in that space are semantically similar.

Dense vectors are stored in [dense indexes](#dense-index).

You use a dense embedding model to convert data to dense vectors. The embedding model can be external to Pinecone or [hosted on Pinecone infrastructure](/guides/index-data/create-an-index#embedding-models) and integrated with an index.

For more information about dense vectors, see [What are vector embeddings?](https://www.pinecone.io/learn/vector-embeddings/).

### Sparse vector

A sparse vector, also referred to as a sparse vector embedding, has a large number of dimensions, but only a small proportion of those values are non-zero. Sparse vectors are often used to represent documents or queries in a way that captures keyword information. Each dimension in a sparse vector typically represents a word from a dictionary, and the non-zero values represent the importance of these words in the document.

Sparse vectors are store in [sparse indexes](#sparse-index).

You use a sparse embedding model to convert data to sparse vectors. The embedding model can be external to Pinecone or [hosted on Pinecone infrastructure](/guides/index-data/create-an-index#embedding-models) and integrated with an index.

For more information about sparse vectors, see [Sparse retrieval](https://www.pinecone.io/learn/sparse-retrieval/).

### Metadata

Metadata is additional information that can be attached to vector embeddings to provide more context and enable additional [filtering capabilities](/guides/index-data/indexing-overview#metadata). For example, the original text of the embeddings can be stored in the metadata.

## Other concepts

Although not represented in the diagram above, Pinecone also contains the following concepts:

* [API key](#api-key)
* [User](#user)
* [Backup or collection](#backup-or-collection)
* [Pinecone Inference](#pinecone-inference)

### API key

An API key is a unique token that [authenticates](/reference/api/authentication) and authorizes access to the [Pinecone APIs](/reference/api/introduction). API keys are project-specific.

### User

A user is a member of organizations and projects. Users are assigned specific roles at the organization and project levels that determine the user's permissions in the [Pinecone console](https://app.pinecone.io).

For more information, see [Manage organization members](/guides/organizations/manage-organization-members) and [Manage project members](/guides/projects/manage-project-members).

### Backup or collection

A backup is a static copy of a serverless index.

Backups only consume storage. They are non-queryable representations of a set of records. You can create a backup from an index, and you can create a new index from that backup. The new index configuration can differ from the original source index: for example, it can have a different name. However, it must have the same number of dimensions and similarity metric as the source index.

For more information, see [Understanding backups](/guides/manage-data/backups-overview).

### Pinecone Inference

Pinecone Inference is an API service that provides access to [embedding models](/guides/index-data/create-an-index#embedding-models) and [reranking models](/guides/search/rerank-results#reranking-models) hosted on Pinecone's infrastructure.

## Learn more

* [Vector database](https://www.pinecone.io/learn/vector-database/)
* [Pinecone APIs](/reference/api/introduction)
* [Approximate nearest neighbor (ANN) algorithms](https://www.pinecone.io/learn/a-developers-guide-to-ann-algorithms/)
* [Retrieval augmented generation (RAG)](https://www.pinecone.io/learn/retrieval-augmented-generation/)
* [Image search](https://www.pinecone.io/learn/series/image-search/)
* [Tokenization](https://www.pinecone.io/learn/tokenization/)
