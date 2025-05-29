# Best Practices

Pinecone offers a number of best practice tips for making the most of your use of
the system. We've collected some of them here for your convenience.

## How do I choose the right vector embeddings for my use case?

The choice of vector embeddings depends on your specific application. For text-based applications, embeddings like BERT or GPT can be effective. For images, CNN-based embeddings might be better. It's crucial to experiment with different embeddings to find the one that offers the best performance for your needs.

## What are some best practices for indexing in Pinecone?

* **Batching**: [Batch your data](/guides/index-data/upsert-data#upsert-in-batches) during the indexing process to optimize speed and efficiency.
* **Dimensionality**: Consider the dimensionality of your vectors. Higher dimensions can offer more accuracy but require more resources.
* **Metadata**: Store relevant metadata alongside vectors for more context during retrieval. For pod-based indexes, make sure to use [selective metadata indexing](/guides/indexes/pods/manage-pod-based-indexes#selective-metadata-indexing) to minimize performance impacts from having very high cardinality on your metadata. For example, if you store individual email addresses of customers on each vector, we recommend against using those in metadata filtering as the resulting cardinality can impact write performance, and concurrent reads while those writes are being applied.
* **Namespaces**: When indexing, try to [use namespaces to keep your data among tenants separate](/guides/index-data/implement-multitenancy), and do not use multiple indexes for this purpose. Namespaces are more efficient and more affordable in the long run.

## How do I maintain high query performance in Pinecone?

* **Optimize Query Size**: Keep your query vector size consistent with your index vector size.
* **Parallel Queries**: Utilize [parallel querying](/troubleshooting/parallel-queries) to enhance throughput.
* **Cache Strategies**: Implement caching for frequently accessed data to reduce latency.

## What are the security best practices in Pinecone?

* **Access Controls**: Never share your Pinecone API key with any unauthorized users. API keys grant full access to a Pinecone project and can be used to read, write, edit, and delete data and vectors. If your API key is exposed, [delete the key](/guides/projects/manage-api-keys#delete-an-api-key) and generate a new one in the [console](https://app.pinecone.io) at your earliest opportunity. You can do so in the *API Keys* section of any Project page.
* **Monitoring**: Regularly monitor your Pinecone instances for any unusual activity. Monitoring is available via metrics in the [Pinecone console](https://app.pinecone.io/organizations/) as well via Prometheus endpoints. Please see [more in our documentation on monitoring](/guides/production/monitoring#available-metrics).

## How do I scale my Pinecone deployment effectively?

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

* **Monitor Usage**: Regularly monitor your resource usage to know when your index is becoming full and needs to be resized or replaced with a new one using more pods.
* **Data Sharding**: Implement data sharding to distribute workload across multiple indexes. Note that this approach is only appropriate for indexes in the hundreds of millions of vectors. If your index will comfortably fit within fewer than 100 pods, we recommend using a single index to simplify operations.

## How do I ensure data consistency in Pinecone?

* **Regular Backups**: Implement regular backups of your data using [collections](/guides/manage-data/back-up-an-index).
* **Consistent Indexing**: Ensure consistent vector representations during the indexing process.
* **Concurrency Control**: Use Pinecone's built-in concurrency controls to manage simultaneous data updates.
