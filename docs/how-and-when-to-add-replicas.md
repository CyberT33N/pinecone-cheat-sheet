# How and when to add replicas

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

[Pinecone replicas](/guides/indexes/pods/scale-pod-based-indexes#add-replicas) are an easy to add resilience and increased throughput to your index. This article will discuss the scenarios where adding additional replicas make the most sense.

## Increase QPS

The primary reason to add replicas is to increase your index's queries per second \[QPS]. Each new replica adds another pod for reading from your index and, generally speaking, will increase your QPS by an equal amount as a single pod. So, if you consistently get 25 QPS for a single pod, each replica will result in 25 more QPS.

If you don't see an increase in QPS, add multiprocessing to your application to ensure you are running parallel operations. You can use the [Pinecone gRPC SDK](/guides/index-data/upsert-data#grpc-python-sdk), or your multiprocessing library of choice.

## Provide data redundancy

When you add a replica to your index, the Pinecone controller will choose a zone in the same region that does not currently have a replica, up to a maximum of three zones (your fourth and subsequent replicas will be hosted in zones with existing replicas). If your application requires multizone redundancy, this is our recommended approach to achieve that.
