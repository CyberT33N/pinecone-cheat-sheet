# Pods are full

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

There is a limit to how much vector data a single pod can hold. Create an index with more pods to hold more data. [Estimate the right index configuration](/guides/indexes/pods/choose-a-pod-type-and-size) and [scale your index](/guides/indexes/pods/scale-pod-based-indexes) to increase capacity.

If your metadata has high cardinality (e.g., you have unique values for every vector in a large index) the index will take up more memory. This could result in the pods becoming full sooner than expected. Consider [only indexing metadata to be used for filtering](/guides/indexes/pods/manage-pod-based-indexes#selective-metadata-indexing), and storing the rest in a separate key-value store.

See the [Configure pod-based indexes](/guides/indexes/pods/manage-pod-based-indexes) for information on how to specify the number of pods for your index.
