# Vertically downscaling

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

After creating an index, you cannot vertically downscale the index/pod size. Index sizes can be scaled up after creation, but you cannot scale them back down. For example, you can scale up a pod from *x2* to *x4* but not scale an *x4* pod back down to *x2*. For more information, please see our documentation on [vertical scaling](/guides/indexes/pods/scale-pod-based-indexes#vertical-scaling).

In order to scale down your pod size, [create a collection](/guides/indexes/pods/back-up-a-pod-based-index).

If you wish to create a collection in the Pinecone console:

1. Navigate to the Pinecone console.
2. Select your project from the project selector in the left navigation bar.
3. Click the **...** icon to the right of the index name.
4. Choose **Collection**.
5. Name your collection.
6. Click **Create Collection**.

   You can then [create a new index from your collection](/guides/indexes/pods/restore-a-pod-based-index) and specify your desired pod size.
