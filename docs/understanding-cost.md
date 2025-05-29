# Understanding cost

This page describes how costs are incurred in Pinecone. For the latest pricing details, see [Pricing](https://www.pinecone.io/pricing/).

<Tip>
  Starting on July 1, 2025, new Pinecone pricing will make it easier to understand and predict future costs. For details, see [Read units](#read-units) and [Write units](#write-units).
</Tip>

## Platform fee

{/* <Tabs>

  <Tab title="Current"> */}

The Standard and Enterprise [pricing plans](https://www.pinecone.io/pricing/) include a monthly platform fee and usage credits:

| Plan       | Platform fee | Usage credits |
| ---------- | ------------ | ------------- |
| Standard   | \$25/month   | \$15/month    |
| Enterprise | \$500/month  | \$150/month   |

Usage credits do not roll over from month to month. Platform fees do not apply to organizations on the Starter plan or with annual commits.

**Examples**

<AccordionGroup>
  <Accordion title="Usage covered by monthly credits">
    * You are on the Standard plan.
    * Your usage for the month of August amounts to \$10.
    * Minus your \$15 monthly usage credit, the actual cost of usage is \$0.
    * Including the \$25 monthly platform fee, your total for the month of August is \$25.
  </Accordion>

  <Accordion title="Usage exceeds monthly credits">
    * You are on the Standard plan.
    * Your usage for the month of August amounts to \$100.
    * Minus your \$15 monthly usage credit, the actual cost of usage is \$75.
    * Including the \$25 monthly platform fee, your total for the month of August is \$100.
  </Accordion>
</AccordionGroup>

{/* </Tab>

  <Tab title="July 1, 2025">

  Customers who sign up for the Standard or Enterprise plan on or after July 1, 2025 will have a monthly minimum usage commitment instead of a monthly platform fee:

  | Plan       | Minimum usage |
  | ---------  | ------------ |
  | Standard   | $50/month    |
  | Enterprise | $500/month   |

  Beyond the monthly minimum, customers will be charged for what they use each month. 

  <Note>
  Customers who signed up for the Standard or Enteprise plan before July 1, 2025 will continue to pay a monthly platform fee until September 1, 2025. After that date, the minimum usage commitment explained above will replace the platform fee.
  </Note> 

  **Examples**

  <AccordionGroup>

  <Accordion title="Usage below monthly minimum">

  - You are on the Standard plan.
  - Your usage for the month of August amounts to &#36;20.
  - Your usage is below the &#36;50 monthly minimum, so your total for the month is &#36;50.

  </Accordion>

  <Accordion title="Usage exceeds monthly minimum">

  - You are on the Standard plan.
  - Your usage for the month of August amounts to &#36;100.
  - Your usage exceeds the &#36;50 monthly minimum, so your total for the month is &#36;100.

  </Accordion>

  </AccordionGroup>

  </Tab>

  </Tabs> */}

## Serverless indexes

With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you pay for the amount of data stored and operations performed, based on three usage metrics: [read units](#read-units), [write units](#write-units), and [storage](#storage).

For up-to-date serverless pricing details, see [Pricing](https://www.pinecone.io/pricing/).

### Read units

Read units (RUs) measure the compute, I/O, and network resources consumed by [query](/guides/search/semantic-search), [fetch](/guides/manage-data/fetch-data), and [list](/guides/manage-data/list-record-ids) requests.

<Tip>
  Read requests return the number of RUs used. You can use this information to [monitor read costs](/guides/manage-cost/monitor-your-usage#read-units).
</Tip>

<Tabs>
  <Tab title="Current">
    #### Query

    The number of RUs used by a query is proportional to the following factors:

    * Record count: The number of vectors contained in the target index. Only vectors stored in the relevant namespace are used.
    * Record size: Higher dimensionality or larger metadata increases the size of each scanned vector.

    Because serverless indexes organize vectors in similarity-based clusters, only a fraction of each index will be read for each query. The number of RUs a query uses therefore increases much more slowly than the index size.

    The following table contains the RU cost of a query at different namespace sizes and record dimensionality, assuming an average metadata size around 500 bytes:

    | Records per namespace | Dimension=384 | Dimension=768 | Dimension=1536 |
    | --------------------- | ------------- | ------------- | -------------- |
    | 100,000               | 5 RUs         | 5 RUs         | 6 RUs          |
    | 1,000,000             | 6 RUs         | 10 RUs        | 18 RUs         |
    | 10,000,000            | 18 RUs        | 32 RUs        | 59 RUs         |

    Scanning a namespace has a minimal cost of 5 RUs.

    When either `include_metadata` or `include_values` are specified, an internal fetch call retrieves the full record values for the IDs returned in the initial scan. This stage consumes RUs equal to a matching fetch call - 1 RU per 10 records in the result set.

    | TopK value | Additional RUs used |
    | ---------- | ------------------- |
    | TopK=5     | 1                   |
    | TopK=10    | 1                   |
    | TopK=50    | 5                   |

    Hybrid retrieval searches over more data and incurs additional RUs. This additional cost is a factor of the size of the namespace you search and the number of non-zero sparse dimensions. Similar costs are incurred for sparse-only searches. For example, for sparse vectors with 100 non-zero sparse dimensions, approximate RUs consumed for sparse vectors are as follows:

    | Records per namespace | RUs for sparse vector retrieval |
    | --------------------- | ------------------------------- |
    | 10,000,000            | 17 RUs                          |
    | 100,000,000           | 54 RUs                          |

    #### Fetch

    A fetch request uses 1 RU for every 10 records fetched, for example:

    | # of fetched records | RU usage |
    | -------------------- | -------- |
    | 10                   | 1        |
    | 50                   | 5        |
    | 107                  | 11       |

    Specifying a non-existent ID or adding the same ID more than once does not increase the number of RUs used. However, a fetch request will always use at least 1 RU.

    #### List

    List has a fixed cost of 1 RU for every call, with up to 100 records returned per call.
  </Tab>

  <Tab title="July 1, 2025">
    #### Query

    As of July 1, 2025, the cost of a query scales linearly with the size of the targeted namespace. Specifically, a query uses 1 RU for every 1 GB of namespace size, with a minimum of 0.25 RUs per query.

    For example, the following table contains the RU cost of searching a dense index at different namespace sizes:

    | Records   | Dense dimension | Avg. metadata size | Avg. record size | Namespace size | RUs  |
    | :-------- | :-------------- | :----------------- | :--------------- | :------------- | :--- |
    | 500,000   | 768             | 500 bytes          | 3.57 KB          | 1.78 GB        | 2    |
    | 1,000,000 | 1536            | 1000 bytes         | 7.14 KB          | 7.14 GB        | 7.25 |
    | 5,000,000 | 1024            | 15,000 bytes       | 19.10 KB         | 95.5 GB        | 95.5 |

    {/* The following table contains the RU cost of searching a hybrid dense/sparse index at different namespace sizes: 

      | Records | Dense dimension | Sparse non-zero dimensions | Avg. metadata size | Avg. record size | Namespace size | RUs |
      | :------ | :-------------- | :------------------------- | :----------------- | :--------------- | :------------- | :-- |
      | 500,000 | 768 | ? | 500 bytes | 3.57 KB  | 1.78 GB | 2 |
      | 1,000,000 | 1536 | ? | 1000 bytes | 7.14 KB | 7.14 GB | 7.25 |
      | 5,000,000 | 1024 | ? | 15,000 bytes | 19.10 KB | 95.5 GB | 95.5 | */}

    Parameters that affect the size of the query response, such as `top_k`, `include_metadata`, and `include_values`, are not relevant for query cost; only the size of the namespace determines the number of RUs used.

    #### Fetch

    A fetch request uses 1 RU for every 10 records fetched, for example:

    | Fetched records | RUs |
    | --------------- | --- |
    | 10              | 1   |
    | 50              | 5   |
    | 107             | 11  |

    Specifying a non-existent ID or adding the same ID more than once does not increase the number of RUs used. However, a fetch request will always use at least 1 RU.

    #### List

    List has a fixed cost of 1 RU per call, with up to 100 records per call.
  </Tab>
</Tabs>

### Write units

Write units (WUs) measure the storage and compute resources used by [upsert](/guides/index-data/upsert-data), [update](/guides/manage-data/update-data), and [delete](/guides/manage-data/delete-data) requests.

<Tabs>
  <Tab title="Current">
    #### Upsert

    An upsert request uses 1 WU for each 1 KB of the request, with a minimum of 1 WU per request. When an upsert modifies an existing record, the request uses 1 WU for each 1 KB of the existing record as well.

    For example, the following table shows the WUs used by upsert requests at different batch sizes and record sizes, assuming all records are new:

    | Records per batch | Record size | Dimension | Metadata size | WUs  |
    | :---------------- | :---------- | :-------- | :------------ | :--- |
    | 1                 | 6.24 KB     | 1536      | 100 bytes     | 6.24 |
    | 10                | 19.10 KB    | 1024      | 15,000 bytes  | 191  |
    | 100               | 3.57 KB     | 768       | 500 bytes     | 357  |
    | 1000              | 7.14 KB     | 1536      | 1000 bytes    | 7140 |

    #### Update

    An update requests uses 1 WU for each 1 KB of the new and existing record, with a minimum of 1 WU per request.

    For example, the following table shows the WUs used by an update at different record sizes:

    | New record size | Previous record size | WUs   |
    | :-------------- | :------------------- | :---- |
    | 6.24 KB         | 6.50 KB              | 12.74 |
    | 19.10 KB        | 15 KB                | 24.1  |
    | 3.57 KB         | 5 KB                 | 8.57  |
    | 7.14 KB         | 10 KB                | 17.14 |

    #### Delete

    A delete requests uses 1 WU for each 1 KB of the records deleted, with a minimum of 1 WU per request.

    For example, the following table shows the WUs used by delete requests at different batch sizes and record sizes:

    | Records per batch | Record size | Dimension | Metadata size | WUs  |
    | :---------------- | :---------- | :-------- | :------------ | :--- |
    | 1                 | 6.24 KB     | 1536      | 100 bytes     | 6.24 |
    | 10                | 19.10 KB    | 1024      | 15,000 bytes  | 191  |
    | 100               | 3.57 KB     | 768       | 500 bytes     | 357  |
    | 1000              | 7.14 KB     | 1536      | 1000 bytes    | 7140 |

    Specifying a non-existent ID or adding the same ID more than once does not increase WU use.

    [Deleting all records in a namespace](/guides/manage-data/delete-data#delete-records-in-a-namespace) uses 1 WU.
  </Tab>

  <Tab title="July 1, 2025">
    <Note>
      The only change to write units as of July 1, 2025 is the minimum of 5 WUs per write request.
    </Note>

    #### Upsert

    An upsert request uses 1 WU for each 1 KB of the request, with a minimum of 5 WUs per request. When an upsert modifies an existing record, the request uses 1 WU for each 1 KB of the existing record as well.

    For example, the following table shows the WUs used by upsert requests at different batch sizes and record sizes, assuming all records are new:

    | Records per batch | Record size | Dimension | Metadata size | WUs  |
    | :---------------- | :---------- | :-------- | :------------ | :--- |
    | 1                 | 6.24 KB     | 1536      | 100 bytes     | 6.24 |
    | 10                | 19.10 KB    | 1024      | 15,000 bytes  | 191  |
    | 100               | 3.57 KB     | 768       | 500 bytes     | 357  |
    | 1000              | 7.14 KB     | 1536      | 1000 bytes    | 7140 |

    #### Update

    An update requests uses 1 WU for each 1 KB of the new and existing record, with a minimum of 5 WUs per request.

    For example, the following table shows the WUs used by an update at different record sizes:

    | New record size | Previous record size | WUs   |
    | :-------------- | :------------------- | :---- |
    | 6.24 KB         | 6.50 KB              | 12.74 |
    | 19.10 KB        | 15 KB                | 24.1  |
    | 3.57 KB         | 5 KB                 | 8.57  |
    | 7.14 KB         | 10 KB                | 17.14 |
    | 3.17 KB         | 3.17 KB              | 6.34  |

    #### Delete

    A delete requests uses 1 WU for each 1 KB of the records deleted, with a minimum of 5 WUs per request.

    For example, the following table shows the WUs used by delete requests at different batch sizes and record sizes:

    | Records per batch | Record size | Dimension | Metadata size | WUs  |
    | :---------------- | :---------- | :-------- | :------------ | :--- |
    | 1                 | 6.24 KB     | 1536      | 100 bytes     | 6.24 |
    | 10                | 19.10 KB    | 1024      | 15,000 bytes  | 191  |
    | 100               | 3.57 KB     | 768       | 500 bytes     | 357  |
    | 1000              | 7.14 KB     | 1536      | 1000 bytes    | 7140 |

    Specifying a non-existent ID or adding the same ID more than once does not increase WU use.

    [Deleting all records in a namespace](/guides/manage-data/delete-data#delete-records-in-a-namespace) uses 5 WUs.
  </Tab>
</Tabs>

### Storage

Storage costs are based on the size of an index on a per-Gigabyte (GB) hourly rate.

The size of an index is defined as the total size of its records across all namespaces. The size of a single record is defined as the sum of three components:

* ID size
* Embedding size (equal to 4 times the vector's dimensions)
* Total metadata size (equal to the total size of all metadata fields)

The following table demonstrates a typical index size at different record counts and dimensionality:

| Records per namespace | Dimension=384 | Dimension=768 | Dimension=1536 |
| --------------------- | ------------- | ------------- | -------------- |
| 100,000               | 0.20 GB       | 0.35 GB       | 0.66 GB        |
| 1,000,000             | 2.00 GB       | 3.50 GB       | 6.60 GB        |
| 10,000,000            | 20.00 GB      | 35.00 GB      | 66.00 GB       |

<Note>
  The cost of an import is based on the size of the records read, whether the records were imported successfully or not. If the import operation fails (e.g., after encountering a vector of the wrong dimension in an import with `on_error="abort"`), you will still be charged for the records read.

  However, if the import fails because of an internal system error, you will not incur charges. In this case, the import will return the error message `"We were unable to process your request. If the problem persists, please contact us at https://support.pinecone.io"`.
</Note>

## Pod-based indexes

For each [pod-based index](/guides/indexes/pods/understanding-pod-based-indexes), billing is determined by the per-minute price per pod and the number of pods the index uses, regardless of index activity. The per-minute price varies by pod type, pod size, account plan, and cloud region. For up-to-date pod-based index pricing rates, see [Pricing](https://www.pinecone.io/pricing/pods).

Total cost depends on a combination of factors:

* **Pod type.** Each [pod type](/guides/indexes/pods/understanding-pod-based-indexes#pod-types) has different per-minute pricing.
* **Number of pods.** This includes replicas, which duplicate pods.
* **Pod size.**  Larger pod sizes have proportionally higher costs per minute.
* **Total pod-minutes.** This includes the total time each pod is running, starting at pod creation and rounded up to 15-minute increments.
* **Cloud provider.** The cost per pod-type and pod-minute varies depending on the cloud provider you choose for your project.
* **Collection storage.** Collections incur costs per GB of data per minute in storage, rounded up to 15-minute increments.
* **Plan.** The free plan incurs no costs; the Standard or Enterprise plans incur different costs per pod-type, pod-minute, cloud provider, and collection storage.

The following equation calculates the total costs accrued over time:

```
(Number of pods) * (pod size) * (number of replicas) * (minutes pod exists) * (pod price per minute) 
+ (collection storage in GB) * (collection storage time in minutes) * (collection storage price per GB per minute)
```

To see a calculation of your current usage and costs, go to [**Settings > Usage**](https://app.pinecone.io/organizations/-/settings/usage) in the Pinecone console.

<Accordion title="Example">
  While our pricing page lists rates on an hourly basis for ease of comparison, this example lists prices per minute, as this is how Pinecone calculates billing.

  An example application has the following requirements:

  * 1,000,000 vectors with 1536 dimensions
  * 150 queries per second with `top_k` = 10
  * Deployment in an EU region
  * Ability to store 1GB of inactive vectors

  [Based on these requirements](/guides/indexes/pods/choose-a-pod-type-and-size), the organization chooses to configure the project to use the Standard billing plan to host one `p1.x2` pod with three replicas and a collection containing 1 GB of data. This project runs continuously for the month of January on the Standard plan. The components of the total cost for this example are given in Table 1 below:

  **Table 1: Example billing components**

  | Billing component             | Value        |
  | ----------------------------- | ------------ |
  | Number of pods                | 1            |
  | Number of replicas            | 3            |
  | Pod size                      | x2           |
  | Total pod count               | 6            |
  | Minutes in January            | 44,640       |
  | Pod-minutes (pods \* minutes) | 267,840      |
  | Pod price per minute          | \$0.0012     |
  | Collection storage            | 1 GB         |
  | Collection storage minutes    | 44,640       |
  | Price per storage minute      | \$0.00000056 |

  The invoice for this example is given in Table 2 below:

  **Table 2: Example invoice**

  | Product       | Quantity | Price per unit | Charge   |
  | ------------- | -------- | -------------- | -------- |
  | Collections   | 44,640   | \$0.00000056   | \$0.025  |
  | P2 Pods (AWS) | 0        |                | \$0.00   |
  | P2 Pods (GCP) | 0        |                | \$0.00   |
  | S1 Pods       | 0        |                | \$0.00   |
  | P1 Pods       | 267,840  | \$0.0012       | \$514.29 |

  Amount due \$514.54
</Accordion>

## Embedding

Pinecone hosts several [embedding models](/guides/index-data/create-an-index#embedding-models) so it's easy to manage your vector storage and search process on a single platform. You can use a hosted model to embed your data as an integrated part of upserting and querying, or you can use a hosted model to embed your data as a standalone operation.

Embedding costs are determined by how many [tokens](https://www.pinecone.io/learn/tokenization/) are in a request. In general, the more words contained in your passage or query, the more tokens you generate.

For example, if you generate embeddings for the query, "What is the maximum diameter of a red pine?", Pinecone Inference generates 10 tokens, then converts them into an embedding. If the price per token for your billing plan is \$.08 per million tokens, then this API call costs \$.00001.

To learn more about tokenization, see [Choosing an embedding model](https://www.pinecone.io/learn/series/rag/embedding-models-rundown/). For up-to-date embed pricing, see [Pricing](https://www.pinecone.io/pricing/).

<Tip>
  Embedding requests returns the total tokens generated. You can use this information to [monitor and manage embedding costs](/guides/manage-cost/monitor-your-usage#embedding-tokens).
</Tip>

## Reranking

Pinecone hosts several [reranking models](/guides/search/rerank-results#reranking-models) so it's easy to manage two-stage vector retrieval on a single platform. You can use a hosted model to rerank results as an integrated part of a query, or you can use a hosted model to rerank results as a standalone operation.

Reranking costs are determined by the number of requests to the reranking model. For up-to-date rerank pricing, see [Pricing](https://www.pinecone.io/pricing/).

## Assistant

For details on how costs are incurred in Pinecone Assistant, see [Assistant pricing](/guides/assistant/pricing-and-limits).

## See also

* [Monitor your usage](/guides/manage-cost/monitor-your-usage)
* [Manage cost](/guides/manage-cost/manage-cost)
* [Pricing](https://www.pinecone.io/pricing/)
