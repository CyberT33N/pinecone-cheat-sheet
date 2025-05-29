# Understanding pod-based indexes

With pod-based indexes, you choose one or more pre-configured units of hardware (pods). Depending on the pod type, pod size, and number of pods used, you get different amounts of storage and higher or lower latency and throughput. Be sure to [choose an appropriate pod type and size](/guides/indexes/pods/choose-a-pod-type-and-size) for your dataset and workload.

## Pod types

Different pod types are priced differently. See [Understanding cost](/guides/manage-cost/understanding-cost) for more details.

<Note>
  Once a pod-based index is created, you cannot change its pod type. However, you can create a collection from an index and then [create a new index with a different pod type](/guides/indexes/pods/create-a-pod-based-index#create-a-pod-index-from-a-collection) from the collection.
</Note>

### s1 pods

These storage-optimized pods provide large storage capacity and lower overall costs with slightly higher query latencies than p1 pods. They are ideal for very large indexes with moderate or relaxed latency requirements.

Each s1 pod has enough capacity for around 5M vectors of 768 dimensions.

### p1 pods

These performance-optimized pods provide very low query latencies, but hold fewer vectors per pod than s1 pods. They are ideal for applications with low latency requirements (\<100ms).

Each p1 pod has enough capacity for around 1M vectors of 768 dimensions.

### p2 pods

The p2 pod type provides greater query throughput with lower latency. For vectors with fewer than 128 dimension and queries where `topK` is less than 50, p2 pods support up to 200 QPS per replica and return queries in less than 10ms. This means that query throughput and latency are better than s1 and p1.

Each p2 pod has enough capacity for around 1M vectors of 768 dimensions. However, capacity may vary with dimensionality.

The data ingestion rate for p2 pods is significantly slower than for p1 pods; this rate decreases as the number of dimensions increases. For example, a p2 pod containing vectors with 128 dimensions can upsert up to 300 updates per second; a p2 pod containing vectors with 768 dimensions or more supports upsert of 50 updates per second. Because query latency and throughput for p2 pods vary from p1 pods, test p2 pod performance with your dataset.

The p2 pod type does not support sparse vector values.

## Pod size and performance

Each pod type supports four pod sizes: `x1`, `x2`, `x4`, and `x8`. Your index storage and compute capacity doubles for each size step. The default pod size is `x1`. You can increase the size of a pod after index creation.

To learn about changing the pod size of an index, see [Configure an index](/guides/indexes/pods/scale-pod-based-indexes#increase-pod-size).

## Pod environments

When creating a pod-based index, you must choose the cloud environment where you want the index to be hosted. The project environment can affect your [pricing](https://pinecone.io/pricing). The following table lists the available cloud regions and the corresponding values of the `environment` parameter for the [`create_index`](/guides/index-data/create-an-index#create-a-pod-based-index) endpoint:

| Cloud | Region                       | Environment                   |
| ----- | ---------------------------- | ----------------------------- |
| GCP   | us-west-1 (N. California)    | `us-west1-gcp`                |
| GCP   | us-central-1 (Iowa)          | `us-central1-gcp`             |
| GCP   | us-west-4 (Las Vegas)        | `us-west4-gcp`                |
| GCP   | us-east-4 (Virginia)         | `us-east4-gcp`                |
| GCP   | northamerica-northeast-1     | `northamerica-northeast1-gcp` |
| GCP   | asia-northeast-1 (Japan)     | `asia-northeast1-gcp`         |
| GCP   | asia-southeast-1 (Singapore) | `asia-southeast1-gcp`         |
| GCP   | us-east-1 (South Carolina)   | `us-east1-gcp`                |
| GCP   | eu-west-1 (Belgium)          | `eu-west1-gcp`                |
| GCP   | eu-west-4 (Netherlands)      | `eu-west4-gcp`                |
| AWS   | us-east-1 (Virginia)         | `us-east-1-aws`               |
| Azure | eastus (Virginia)            | `eastus-azure`                |

[Contact us](http://www.pinecone.io/contact/) if you need a dedicated deployment in other regions.

The environment cannot be changed after the index is created.
