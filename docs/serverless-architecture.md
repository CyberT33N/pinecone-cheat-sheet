# Pinecone Database architecture

This page describes the Pinecone Database architecture for [**serverless indexes**](/guides/index-data/indexing-overview).

## Overview

Pinecone serverless runs as a managed service on the AWS, GCP, and Azure cloud platforms. Client requests go through an [API gateway](#api-gateway) to either a global [control plane](#control-plane) or a regional [data plane](#data-plane). All vector data is written to highly efficient, distributed [object storage](#object-storage).

<img className="block max-w-full dark:hidden" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/serverless-overview.svg" />

<img className="hidden max-w-full dark:block" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/serverless-overview-dark.svg" />

### API gateway

Requests to Pinecone serverless contain an [API key](/guides/projects/manage-api-keys) assigned to a specific [project](/guides/projects/understanding-projects). Each incoming request is load-balanced through an edge proxy to an authentication service that verifies that the API key is valid for the targeted project. If so, the proxy routes the request to either the global control plane or a regional data plane, depending on the type of work to be performed.

### Control plane

The global control plane handles requests to manage organizational objects, such as projects and indexes. The control plane uses a dedicated database as the source of truth about these objects. Other services, such as the authentication service, also cache control plane data locally for performance optimization.

### Data plane

The data plane handles requests to write and read records in [indexes](/guides/index-data/indexing-overview) within a given [cloud region](/guides/index-data/create-an-index#cloud-regions). Indexes are partitioned into one or more logical [namespaces](/guides/index-data/indexing-overview#namespaces), and all write and read requests are scoped by namespace.

Writes and reads follow separate paths, with compute resources auto-scaling independently based on demand. The separation of compute resources ensures that queries never impact write throughput and writes never impact query latency. The auto-scaling of compute resources, combined with highly efficient blob storage, reduces [cost](/guides/manage-cost/understanding-cost), as you pay only for what you use.

### Object storage

For each namespace in a serverless index, Pinecone organizes records into immutable files called slabs. Slabs are [indexed for optimal query performance](#index-builder) and stored in distributed object storage that provides virtually limitless data scalability and guaranteed high-availability.

## Write path

<img className="block max-w-full dark:hidden" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/serverless-write-path.svg" />

<img className="hidden max-w-full dark:block" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/serverless-write-path-dark.svg" />

### Request log

When the [data plane](#data-plane) receives a request to add, update, or delete records in the namespace of an index, a log writer records the request details in a request log along with a monotonically increasing log sequence number (LSN). LSNs ensure that operations are applied in the correct order and provide a mechanism for tracking the state of the index.

Pinecone then returns a `200 OK` response to the client, guaranteeing the durability of the write, and sends the write to the index builder.

### Index builder

The index builder first stores the request data in an in-memory structure called a memtable, including the vector data, any associated metadata, and the LSN assigned to the request. If the write is an update or delete, the index builder also stores a mechanism for invalidating the older version of the record in queries. Periodically, the index builder then flushes data in the memtable to object storage.

In [object storage](#object-storage), the data for a given namespace is organized as immutable files called slabs. These slabs are indexed for optimal query performance, with smaller slabs using fast indexing techniques like scalar quantization or random projections and larger slabs using more computationally intensive cluster-based indexing techniques. When several smaller slabs aggregate in a namespace, the index builder triggers a compaction job to merge them into a larger slab. This adaptive process both optimizes query performance for each slab and amortizes the cost of more expensive indexing through the lifetime of the namespace.

<Note>
  All reads are routed through the memtable, which ensures that data that hasn't yet been flushed to object storage is available to be searched. For more details, see [Query executors](#query-executors).
</Note>

## Read path

<img className="block max-w-full dark:hidden" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/serverless-read-path.svg" />

<img className="hidden max-w-full dark:block" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/serverless-read-path-dark.svg" />

### Query routers

When the [data plane](#data-plane) receives a query to search a namespace in an index, a query router performs admission control to validate the query and ensure that it adheres to system constraints such as [rate and object limits](/reference/api/database-limits.mdx). Then it identifies which slabs are relevant for the query and routes the query to the executors responsible for those slabs. It also runs the query against the memtable, which contains fresh data that hasn't yet been incorporated into slabs. The memtable sends results back to the query router.

### Query executors

Each query executor scans the slabs it is responsible for and returns a list of `top_k` candidates to the query router. If the query includes a metadata filter, executors exclude records that do not match the specified criteria before identifying the `top_k` candidates. In most cases, the slabs are cached between an executor's memory and local SSD, enabling predictably high query performance. If a slab isn't cached, the executor fetches it from object storage and caches it for future queries. This typically happens when a slab is accessed for the first time or has not been queried in a while.

The query router then compiles results from all executors, merges and deduplicates them with results from the memtable, selects a final set of `top_k` candidates, and returns them to the client.
