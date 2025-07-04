# Choose a pod type and size

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

When planning your Pinecone deployment, it is important to understand the approximate storage requirements of your vectors to choose the appropriate pod type and number. This page will give guidance on sizing to help you plan accordingly.

As with all guidelines, these considerations are general and may not apply to your specific use case. We caution you to always test your deployment and ensure that the index configuration you are using is appropriate to your requirements.

[Collections](/guides/indexes/pods/understanding-collections) allow you to create new versions of your index with different pod types and sizes. This also allows you to test different configurations. This guide is merely an overview of sizing considerations; test your index configuration before moving to production.

<Tip>
  Users on the Standard, Enterprise, and Enterprise Dedicated plans can [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket) for further help with sizing and testing.
</Tip>

## Overview

There are five main considerations when deciding how to configure your Pinecone index:

* Number of vectors
* Dimensionality of your vectors
* Size of metadata on each vector
* Queries per second (QPS) throughput
* Cardinality of indexed metadata

Each of these considerations comes with requirements for index size, pod type, and replication strategy.

### Number of vectors

The most important consideration in sizing is the [number of vectors](/guides/index-data/upsert-data) you plan on working with. As a rule of thumb, a single p1 pod can store approximately 1M vectors, while a s1 pod can store 5M vectors. However, this can be affected by other factors, such as dimensionality and metadata, which are explained below.

### Dimensionality of vectors

The rules of thumb above for how many vectors can be stored in a given pod assumes a typical configuration of 768 [dimensions per vector](/guides/index-data/create-an-index). As your individual use case will dictate the dimensionality of your vectors, the amount of space required to store them may necessarily be larger or smaller.

Each dimension on a single vector consumes 4 bytes of memory and storage per dimension, so if you expect to have 1M vectors with 768 dimensions each, that’s about 3GB of storage without factoring in metadata or other overhead. Using that reference, we can estimate the typical pod size and number needed for a given index. Table 1 below gives some examples of this.

**Table 1: Estimated number of pods per 1M vectors by dimensionality**

| Pod type | Dimensions | Estimated max vectors per pod |
| -------- | ---------: | ----------------------------: |
| **p1**   |        512 |                     1,250,000 |
|          |        768 |                     1,000,000 |
|          |       1024 |                       675,000 |
|          |       1536 |                       500,000 |
| **p2**   |        512 |                     1,250,000 |
|          |        768 |                     1,100,000 |
|          |       1024 |                     1,000,000 |
|          |       1536 |                       550,000 |
| **s1**   |        512 |                     8,000,000 |
|          |        768 |                     5,000,000 |
|          |       1024 |                     4,000,000 |
|          |       1536 |                     2,500,000 |

Pinecone does not support fractional pod deployments, so always round up to the next nearest whole number when choosing your pods.

## Queries per second (QPS)

QPS speeds are governed by a combination of the [pod type](/guides/indexes/pods/understanding-pod-based-indexes#pod-types) of the index, the number of [replicas](/guides/indexes/pods/scale-pod-based-indexes#add-replicas), and the `top_k` value of queries. The pod type is the primary factor driving QPS, as the different pod types are optimized for different approaches.

The [p1 pods](/guides/index-data/indexing-overview/#p1-pods) are performance-optimized pods which provide very low query latencies, but hold fewer vectors per pod than [s1 pods](/guides/index-data/indexing-overview/#s1-pods). They are ideal for applications with low latency requirements (\<100ms). The s1 pods are optimized for storage and provide large storage capacity and lower overall costs with slightly higher query latencies than p1 pods. They are ideal for very large indexes with moderate or relaxed latency requirements.

The [p2 pod type](/guides/index-data/indexing-overview/#p2-pods) provides greater query throughput with lower latency. They support 200 QPS per replica and return queries in less than 10ms. This means that query throughput and latency are better than s1 and p1, especially for low dimension vectors (\<512D).

As a rule, a single p1 pod with 1M vectors of 768 dimensions each and no replicas can handle about 20 QPS. It’s possible to get greater or lesser speeds, depending on the size of your metadata, number of vectors, the dimensionality of your vectors, and the `top_K` value for your search. See Table 2 below for more examples.

**Table 2: QPS by pod type and `top_k` value**\*

| Pod type | top\_k 10 | top\_k 250 | top\_k 1000 |
| -------- | --------- | ---------- | ----------- |
| p1       | 30        | 25         | 20          |
| p2       | 150       | 50         | 20          |
| s1       | 10        | 10         | 10          |

\*The QPS values in Table 2 represent baseline QPS with 1M vectors and 768 dimensions.

[Adding replicas](/guides/indexes/pods/scale-pod-based-indexes#add-replicas) is the simplest way to increase your QPS. Each replica increases the throughput potential by roughly the same QPS, so aiming for 150 QPS using p1 pods means using the primary pod and 5 replicas. Using threading or multiprocessing in your application is also important, as issuing single queries sequentially still subjects you to delays from any underlying latency. The [Pinecone gRPC SDK](/guides/index-data/upsert-data#grpc-python-sdk) can also be used to increase throughput of upserts.

### Metadata cardinality and size

The last consideration when planning your indexes is the cardinality and size of your [metadata](/guides/index-data/upsert-data#inserting-vectors-with-metadata). While the increases are small when talking about a few million vectors, they can have a real impact as you grow to hundreds of millions or billions of vectors.

Indexes with very high cardinality, like those storing a unique user ID on each vector, can have significant memory requirements, resulting in fewer vectors fitting per pod. Also, if the size of the metadata per vector is larger, the index requires more storage. Limiting which metadata fields are indexed using [selective metadata indexing](/guides/indexes/pods/manage-pod-based-indexes#selective-metadata-indexing) can help lower memory usage.

### Pod sizes

You can also start with one of the larger [pod sizes](/guides/index-data/indexing-overview/#pod-size-and-performance), like p1.x2. Each step up in pod size doubles the space available for your vectors. We recommend starting with x1 pods and scaling as you grow. This way, you don’t start with too large a pod size and have nowhere else to go up, meaning you have to migrate to a new index before you’re ready.

### Example applications

The following examples will showcase how to use the sizing guidelines above to choose the appropriate type, size, and number of pods for your index.

#### Example 1: Semantic search of news articles

In our first example, we’ll use the demo app for semantic search from our documentation. In this case, we’re only working with 204,135 vectors. The vectors use 300 dimensions each, well under the general measure of 768 dimensions. Using the rule of thumb above of up to 1M vectors per p1 pod, we can run this app comfortably with a single p1.x1 pod.

#### Example 2: Facial recognition

For this example, suppose you’re building an application to identify customers using facial recognition for a secure banking app. Facial recognition can work with as few as 128 dimensions, but in this case, because the app will be used for access to finances, we want to make sure we’re certain that the person using it is the right one. We plan for 100M customers and use 2048 dimensions per vector.

We know from our rules of thumb above that 1M vectors with 768 dimensions fit nicely in a p1.x1 pod. We can just divide those numbers into the new targets to get the ratios we’ll need for our pod estimate:

```
100M / 1M = 100 base p1 pods
2048 / 768 = 2.667 vector ratio
2.667 * 100 = 267 rounding up
```

So we need 267 p1.x1 pods. We can reduce that by switching to s1 pods instead, sacrificing latency by increasing storage availability. They hold five times the storage of p1.x1, so the math is simple:

```
267 / 5 = 54 rounding up
```

So we estimate that we need 54 s1.x1 pods to store very high dimensional data for the face of each of the bank’s customers.
