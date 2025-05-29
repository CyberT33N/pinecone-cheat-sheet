# Select index type and size

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

When setting up your Pinecone index, consider five key factors:

1. **Number of Vectors**: Estimate the vector count. A p1 pod holds around 500k vectors, and an s1 pod holds around 2.5M vectors.
2. **Vector Dimensionality**: Typically, a vector has 1536 dimensions. Adjust pod size based on your vector dimensions.
3. **Metadata Size**: The size of metadata on each vector affects the index size.
4. **QPS Throughput**: Anticipate your queries per second throughput.
5. **Indexed Metadata Cardinality**: The distinct values in the indexed metadata also matter.

Adapt your index size, pod type, and replication strategy based on these considerations.

For more information, see [Choosing a pod type and size](/guides/indexes/pods/choose-a-pod-type-and-size).
