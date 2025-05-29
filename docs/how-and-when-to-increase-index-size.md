# How and when to increase index size

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

If your index is at around 90% fullness, we recommend increasing its size. This can be done in two ways: either by changing the pod size being used or by adding additional pods.

## Change Pod Size

You can easily increase the pod size from x1 up to x8 for your index's pods, both within the console and using the API. Each x-factor increases the base pod's capacity by that amount. So, an x4 pod is four times larger than an x1 pod. The price for the increased size is the same as adding that number of additional pods. So, a p1.x8 costs the same as eight p1.x1s.

### Change via console

1. Go to the [console and log in.](https://app.pinecone.io)
2. Switch to the Project that holds the index in question if it doesn't load by default.
3. Click the index you want to reconfigure.
4. Click the **...** button.
5. Select **Configure**.
6. In the dropdown, choose the pod size to use.
7. Click **Confirm**.

The size change will take up to 15 minutes to complete.

### Change via API

Please take a look at `configure_index()` in our [documentation](/reference/api/2024-10/control-plane/configure_index) for exact details on using the API to change your pod size.

## Add Additional Pods

Adding additional pods to a running index is not supported. However, you can create a collection from an index and then create a new index from that collection.

For steps on creating the collection first, please take a look at [backup indexes](/guides/manage-data/back-up-an-index#create-a-backup-using-a-collection) in our documentation.

For steps on creating an index from a collection, please take a look at [Create an index from a collection](/guides/indexes/pods/create-a-pod-based-index#create-a-pod-index-from-a-collection) in our documentation.
