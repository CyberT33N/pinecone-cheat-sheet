# Manage pod-based indexes

This page shows you how to manage pod-based indexes.

For guidance on serverless indexes, see [Manage serverless indexes](/guides/manage-data/manage-indexes).

## Describe a pod-based index

Use the [`describe_index`](/reference/api/2024-10/control-plane/describe_index/) endpoint to get a complete description of a specific index:

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.describe_index(name="docs-example")

  # Response:
  # {'dimension': 1536,
  #  'host': 'docs-example-4mkljsz.svc.aped-4627-b74a.pinecone.io',
  #  'metric': 'cosine',
  #  'name': 'docs-example',
  #  'spec': {'pod': {'environment': 'us-east-1-aws',
  #                   'pod_type': 's1.x1',
  #                   'pods': 1,
  #                   'replicas': 1,
  #                   'shards': 1}},
  #  'status': {'ready': True, 'state': 'Ready'}}
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.describeIndex('docs-example');

  // Response:
  // {
  //    "name": "docs-example",
  //    "dimension": 1536,
  //    "metric": "cosine",
  //    "host": "docs-example-4mkljsz.svc.aped-4627-b74a.pinecone.io",
  //    "deletionProtection": "disabled",
  //    "spec": {
  //       "serverless": {
  //          "environment": "us-east-1-aws",
  //          "pod_type": "s1.x1",
  //          "pods": 1,
  //          "replicas": 1,
  //          "shards": 1
  //       }
  //    },
  //    "status": {
  //       "ready": true,
  //       "state": "Ready"
  //    }
  // }
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;

  public class DescribeIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOURE_API_KEY").build();
          IndexModel indexModel = pc.describeIndex("docs-example");
          System.out.println(indexModel);
      }
  }

  // Response:
  // class IndexModel {
  //     name: docs-example
  //     dimension: 1536
  //     metric: cosine
  //     host: docs-example-4mkljsz.svc.aped-4627-b74a.pinecone.io
  //     deletionProtection: disabled
  //     spec: class IndexModelSpec {
  //         serverless: null
  //         pod: class PodSpec {
  //             cloud: aws
  //             region: us-east-1
  //             environment: us-east-1-aws,
  //             podType: s1.x1,
  //             pods: 1,
  //             replicas: 1,
  //             shards: 1
  //         }
  //     }
  //     status: class IndexModelStatus {
  //         ready: true
  //         state: Ready
  //     }
  // }
  ```

  ```go Go
  package main

  import (
      "context"
      "encoding/json"
      "fmt"
      "log"

      "github.com/pinecone-io/go-pinecone/v3/pinecone"
  )

  func prettifyStruct(obj interface{}) string {
      bytes, _ := json.MarshalIndent(obj, "", "  ")
      return string(bytes)
  }

  func main() {
      ctx := context.Background()

      pc, err := pinecone.NewClient(pinecone.NewClientParams{
          ApiKey: "YOUR_API_KEY",
      })
      if err != nil {
          log.Fatalf("Failed to create Client: %v", err)
      }

      idx, err := pc.DescribeIndex(ctx, "docs-example")
      if err != nil {
          log.Fatalf("Failed to describe index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("index: %v\n", prettifyStruct(idx))
      }
  }

  // Response:
  // index: {
  // 	"name": "docs-example",
  // 	"dimension": 1536,
  // 	"host": "docs-example-4mkljsz.svc.aped-4627-b74a.pinecone.io",
  // 	"metric": "cosine",
  //  "deletion_protection": "disabled",
  // 	"spec": {
  // 	  "pod": {
  //       "environment": "us-east-1-aws",
  //       "pod_type": "s1.x1",
  //       "pods": 1,
  //       "replicas": 1,
  //       "shards": 1
  // 	  }
  // 	},
  // 	"status": {
  // 	  "ready": true,
  // 	  "state": "Ready"
  // 	}
  // }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var indexModel = await pinecone.DescribeIndexAsync("docs-example");

  Console.WriteLine(indexModel);

  // Response:
  // {
  //   "name": "docs-example",
  //   "dimension": 1536,
  //   "metric": "cosine",
  //   "host": "docs-example-4mkljsz.svc.aped-4627-b74a.pinecone.io",
  //   "deletion_protection": "disabled",
  //   "spec": {
  //     "serverless": null,
  //     "pod": {
  //        "environment": "us-east-1-aws",
  //        "pod_type": "s1.x1",
  //        "pods": 1,
  //        "replicas": 1,
  //        "shards": 1
  //     }
  //   },
  //   "status": {
  //     "ready": true,
  //     "state": "Ready"
  //   }
  // }
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -i -X GET "https://api.pinecone.io/indexes/docs-example" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04"
  # Response:
  # {
  #    "name": "docs-example",
  #    "metric": "cosine",
  #    "dimension": 1536,
  #    "status": {
  #       "ready": true,
  #       "state": "Ready"
  #    },
  #    "host": "docs-example-4mkljsz.svc.aped-4627-b74a.pinecone.io",
  #    "spec": {
  #       "pod": {
  #          "environment": "us-east-1-aws",
  #          "pod_type": "s1.x1",
  #          "pods": 1,
  #          "replicas": 1,
  #          "shards": 1
  #       }
  #    }
  # }
  ```
</CodeGroup>

<DescribeIndexWarning />

## Delete a pod-based index

Use the [`delete_index`](reference/api/2024-10/control-plane/delete_index) operation to delete a pod-based index and all of its associated resources.

<Note>
  You are billed for a pod-based index even when it is not in use.
</Note>

<CodeGroup>
  ```python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone, PodSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.delete_index(name="docs-example")
  ```

  ```javascript JavaScript
  // npm install @pinecone-database/pinecone
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({
    apiKey: 'YOUR_API_KEY'
  });

  await pc.deleteIndex('docs-example');
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;

  public class DeleteIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.deleteIndex("docs-example");
      }
  }
  ```

  ```go Go
  package main

  import (
      "context"
      "fmt"
      "log"

      "github.com/pinecone-io/go-pinecone/v3/pinecone"
  )

  func main() {
      ctx := context.Background()

      pc, err := pinecone.NewClient(pinecone.NewClientParams{
          ApiKey: "YOUR_API_KEY",
      })
      if err != nil {
          log.Fatalf("Failed to create Client: %v", err)
      }

      indexName := "docs-example"

      err = pc.DeleteIndex(ctx, indexName)
      if err != nil {
          log.Fatalf("Failed to delete index: %v", err)
      } else {
          fmt.Println("Index \"%v\" deleted successfully", indexName)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  await pinecone.DeleteIndexAsync("docs-example");
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -i -X DELETE "https://api.pinecone.io/indexes/docs-example" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

If deletion protection is enabled on an index, requests to delete it will fail and return a `403 - FORBIDDEN` status with the following error:

```
Deletion protection is enabled for this index. Disable deletion protection before retrying.
```

Before you can delete such an index, you must first [disable deletion protection](/guides/manage-data/manage-indexes#configure-deletion-protection).

<Tip>
  You can delete an index using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes). For the index you want to delete, click the three dots to the right of the index name, then click **Delete**.
</Tip>

## Selective metadata indexing

For pod-based indexes, Pinecone indexes all metadata fields by default. When metadata fields contains many unique values, pod-based indexes will consume significantly more memory, which can lead to performance issues, pod fullness, and a reduction in the number of possible vectors that fit per pod.

To avoid indexing high-cardinality metadata that is not needed for [filtering your queries](/guides/index-data/indexing-overview#metadata) and keep memory utilization low, specify which metadata fields to index using the `metadata_config` parameter.

<Note>
  Since high-cardinality metadata does not cause high memory utilization in serverless indexes, selective metadata indexing is not supported.
</Note>

The value for the `metadata_config` parameter is a JSON object containing the names of the metadata fields to index.

```JSON JSON
{
    "indexed": [
        "metadata-field-1",
        "metadata-field-2",
        "metadata-field-n"
    ]
}
```

**Example**

The following example creates a pod-based index that only indexes the `genre` metadata field. Queries against this index that filter for the `genre` metadata field may return results; queries that filter for other metadata fields behave as though those fields do not exist.

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone, PodSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.create_index(
    name="docs-example",
    dimension=1536,
    metric="cosine",
    spec=PodSpec(
      environment="us-west1-gcp",
      pod_type="p1.x1",
      pods=1,
      metadata_config = {
        "indexed": ["genre"]
      }
    ),
    deletion_protection="disabled"

  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({
    apiKey: 'YOUR_API_KEY'
  });

  await pc.createIndex({
    name: 'docs-example',
    dimension: 1536,
    metric: 'cosine',
    spec: {
      pod: {
        environment: 'us-west1-gcp',
        podType: 'p1.x1',
        pods: 1,
        metadata_config: {
          indexed: ["genre"]
        }
      }
    },
    deletionProtection: 'disabled',
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.IndexModel;
  import org.openapitools.db_control.client.model.DeletionProtection;

  public class CreateIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          CreateIndexRequestSpecPodMetadataConfig podSpecMetadataConfig = new CreateIndexRequestSpecPodMetadataConfig();
          List<String> indexedItems = Arrays.asList("genre", "year");
          podSpecMetadataConfig.setIndexed(indexedItems);
          pc.createPodsIndex("docs-example", 1536, "us-west1-gcp",
                  "p1.x1", "cosine", podSpecMetadataConfig, DeletionProtection.DISABLED);
      }
  }
  ```

  ```go Go
  package main

  import (
      "context"
      "fmt"
      "log"

      "github.com/pinecone-io/go-pinecone/v3/pinecone"
  )

  func main() {
      ctx := context.Background()

      pc, err := pinecone.NewClient(pinecone.NewClientParams{
          ApiKey: "YOUR_API_KEY",
      })
      if err != nil {
          log.Fatalf("Failed to create Client: %v", err)
      }

      podIndexMetadata := &pinecone.PodSpecMetadataConfig{
          Indexed: &[]string{"genre"},
      }

      indexName := "docs-example"
    	metric := pinecone.Dotproduct
  	deletionProtection := pinecone.DeletionProtectionDisabled

  	idx, err := pc.CreatePodIndex(ctx, &pinecone.CreatePodIndexRequest{
          Name:               indexName,
          Metric:             &metric,
          Dimension:          1536,
          Environment:        "us-east1-gcp",
          PodType:            "p1.x1",
          DeletionProtection: &deletionProtection,
    	})
    	if err != nil {
          log.Fatalf("Failed to create pod-based index: %v", idx.Name)
      } else {
          fmt.Printf("Successfully created pod-based index: %v", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var createIndexRequest = await pinecone.CreateIndexAsync(new CreateIndexRequest
  {
      Name = "docs-example",
      Dimension = 1536,
      Metric = MetricType.Cosine,
      Spec = new PodIndexSpec
      {
          Pod = new PodSpec
          {
              Environment = "us-east1-gcp",
              PodType = "p1.x1",
              Pods = 1,
              MetadataConfig = new PodSpecMetadataConfig
              {
                  Indexed = new List<string> { "genre" },
              },
          }
      },
      DeletionProtection = DeletionProtection.Disabled
  });
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s https://api.pinecone.io/indexes \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
           "name": "docs-example",
           "dimension": 1536,
           "metric": "cosine",
           "spec": {
              "pod": {
                 "environment": "us-west1-gcp",
                 "pod_type": "p1.x1",
                 "pods": 1,
                 "metadata_config": {
                    "indexed": ["genre"]
                 }
              }
           },
           "deletion_protection": "disabled"
        }'
  ```
</CodeGroup>

## Prevent index deletion

<Note>
  This feature requires [Pinecone API version](/reference/api/versioning) `2024-07`, [Python SDK](/reference/python-sdk) v5.0.0, [Node.js SDK](/reference/node-sdk) v3.0.0, [Java SDK](/reference/java-sdk) v2.0.0, or [Go SDK](/reference/go-sdk) v1.0.0 or later.
</Note>

You can prevent an index and its data from accidental deleting when [creating a new index](/guides/index-data/create-an-index) or when [configuring an existing index](/guides/indexes/pods/manage-pod-based-indexes). In both cases, you set the `deletion_protection` parameter to `enabled`.

To enable deletion protection when creating a new index:

<CodeGroup>
  ```python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone, PodSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.create_index(
    name="docs-example",
    dimension=1536,
    metric="cosine",
    spec=PodSpec(
      environment="us-west1-gcp",
      pod_type="p1.x1",
      pods=1
    ),
      deletion_protection="enabled"
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({
    apiKey: 'YOUR_API_KEY'
  });

  await pc.createIndex({
    name: 'docs-example',
    dimension: 1536,
    metric: 'cosine',
    spec: {
      pod: {
        environment: 'us-west1-gcp',
        podType: 'p1.x1',
        pods: 1
      }
    },
    deletionProtection: 'enabled',
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.IndexModel;
  import org.openapitools.db_control.client.model.DeletionProtection;

  public class CreateIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.createPodsIndex("docs-example", 1536, "us-west1-gcp",
                  "p1.x1", "cosine", DeletionProtection.ENABLED);
      }
  }
  ```

  ```go Go
  package main

  import (
      "context"
      "fmt"
      "log"

      "github.com/pinecone-io/go-pinecone/v3/pinecone"
  )

  func main() {
      ctx := context.Background()

      pc, err := pinecone.NewClient(pinecone.NewClientParams{
          ApiKey: "YOUR_API_KEY",
      })
      if err != nil {
          log.Fatalf("Failed to create Client: %v", err)
      }

      indexName := "docs-example"
    	metric := pinecone.Dotproduct
  	deletionProtection := pinecone.DeletionProtectionDisabled

  	idx, err := pc.CreatePodIndex(ctx, &pinecone.CreatePodIndexRequest{
          Name:               indexName,
          Metric:             &metric,
          Dimension:          1536,
          Environment:        "us-east1-gcp",
          PodType:            "p1.x1",
          DeletionProtection: &deletionProtection,
    	})
    	if err != nil {
          log.Fatalf("Failed to create pod-based index: %v", idx.Name)
      } else {
          fmt.Printf("Successfully created pod-based index: %v", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var createIndexRequest = await pinecone.CreateIndexAsync(new CreateIndexRequest
  {
      Name = "docs-example",
      Dimension = 1536,
      Metric = MetricType.Cosine,
      Spec = new PodIndexSpec
      {
          Pod = new PodSpec
          {
              Environment = "us-east1-gcp",
              PodType = "p1.x1",
              Pods = 1,
          }
      },
      DeletionProtection = DeletionProtection.Enabled
  });
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s "https://api.pinecone.io/indexes" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
           "name": "docs-example",
           "dimension": 1536,
           "metric": "cosine",
           "spec": {
              "pod": {
                 "environment": "us-west1-gcp",
                 "pod_type": "p1.x1",
                 "pods": 1
              }
           },
           "deletion_protection": "enabled
  ```
</CodeGroup>

To enable deletion protection when configuring an existing index:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.configure_index(
     name="docs-example", 
     deletion_protection="enabled"
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const client = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await client.configureIndex('docs-example', { deletionProtection: 'enabled' });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;

  public class ConfigureIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.configurePodsIndex("docs-example", DeletionProtection.ENABLED);
      }
  }
  ```

  ```go Go
  package main

  import (
      "context"
      "fmt"
      "log"

      "github.com/pinecone-io/go-pinecone/v3/pinecone"
  )

  func main() {
      ctx := context.Background()

      pc, err := pinecone.NewClient(pinecone.NewClientParams{
          ApiKey: "YOUR_API_KEY",
      })
      if err != nil {
          log.Fatalf("Failed to create Client: %v", err)
      }

      idx, err := pc.ConfigureIndex(ctx, "docs-example", pinecone.ConfigureIndexParams{DeletionProtection: "enabled"})
    	if err != nil {
          log.Fatalf("Failed to configure index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("Successfully configured index \"%v\"", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var indexMetadata = await pinecone.ConfigureIndexAsync("docs-example", new ConfigureIndexRequest
  {
      DeletionProtection = DeletionProtection.Enabled,
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s -X PATCH "https://api.pinecone.io/indexes/docs-example" \
      -H "Content-Type: application/json" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
          "deletion_protection": "enabled"
          }'
  ```
</CodeGroup>

When deletion protection is enabled on an index, requests to delete the index fail and return a `403 - FORBIDDEN` status with the following error:

```
Deletion protection is enabled for this index. Disable deletion protection before retrying.
```

## Disable deletion protection

Before you can [delete an index](#delete-a-pod-based-index) with deletion protection enabled, you must first disable deletion protection as follows:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.configure_index(
     name="docs-example", 
     deletion_protection="disabled"
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const client = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await client.configureIndex('docs-example', { deletionProtection: 'disabled' });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;

  public class ConfigureIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.configurePodsIndex("docs-example", DeletionProtection.DISABLED);
      }
  }
  ```

  ```go Go
  package main

  import (
      "context"
      "fmt"
      "log"

      "github.com/pinecone-io/go-pinecone/v3/pinecone"
  )

  func main() {
      ctx := context.Background()

      pc, err := pinecone.NewClient(pinecone.NewClientParams{
          ApiKey: "YOUR_API_KEY",
      })
      if err != nil {
          log.Fatalf("Failed to create Client: %v", err)
      }

      idx, err := pc.ConfigureIndex(ctx, "docs-example", pinecone.ConfigureIndexParams{DeletionProtection: "disabled"})
    	if err != nil {
          log.Fatalf("Failed to configure index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("Successfully configured index \"%v\"", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var configureIndexRequest = await pinecone.ConfigureIndexAsync("docs-example", new ConfigureIndexRequest
  {
      DeletionProtection = DeletionProtection.Disabled,
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s -X PATCH "https://api.pinecone.io/indexes/docs-example" \
      -H "Content-Type: application/json" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
          "deletion_protection": "disabled"
          }'
  ```
</CodeGroup>

## Delete an entire namespace

In pod-based indexes, reads and writes share compute resources, so deleting an entire namespace with many records can increase the latency of read operations. In such cases, consider [deleting records in batches](#delete-records-in-batches).

## Delete records in batches

In pod-based indexes, reads and writes share compute resources, so deleting an entire namespace or a large number of records can increase the latency of read operations. To avoid this, delete records in batches of up to 1000, with a brief sleep between requests. Consider using smaller batches if the index has active read traffic.

<CodeGroup>
  ```python Batch delete a namespace
  from pinecone import Pinecone
  import numpy as np
  import time

  pc = Pinecone(api_key='API_KEY')

  INDEX_NAME = 'INDEX_NAME'
  NAMESPACE = 'NAMESPACE_NAME'
  # Consider using smaller batches if you have a high RPS for read operations
  BATCH = 1000

  index = pc.Index(name=INDEX_NAME)
  dimensions = index.describe_index_stats()['dimension']

  # Create the query vector
  query_vector = np.random.uniform(-1, 1, size=dimensions).tolist()
  results = index.query(vector=query_vector, namespace=NAMESPACE, top_k=BATCH)

  # Delete in batches until the query returns no results
  while len(results['matches']) > 0:
      ids = [i['id'] for i in results['matches']]
      index.delete(ids=ids, namespace=NAMESPACE)
      time.sleep(0.01)
      results = index.query(vector=query_vector, namespace=NAMESPACE, top_k=BATCH)
  ```

  ```python Batch delete by metadata
  from pinecone import Pinecone
  import numpy as np
  import time

  pc = Pinecone(api_key='API_KEY')

  INDEX_NAME = 'INDEX_NAME'
  NAMESPACE = 'NAMESPACE_NAME'
  # Consider using smaller batches if you have a high RPS for read operations
  BATCH = 1000

  index = pc.Index(name=INDEX_NAME)
  dimensions = index.describe_index_stats()['dimension']

  METADATA_FILTER = {}

  # Create the query vector with a filter
  query_vector = np.random.uniform(-1, 1, size=dimensions).tolist()
  results = index.query(vector=query_vector, namespace=NAMESPACE, filter=METADATA_FILTER, top_k=BATCH)

  # Delete in batches until the query returns no results
  while len(results['matches']) > 0:
      ids = [i['id'] for i in results['matches']]
      index.delete(ids=ids, namespace=NAMESPACE)
      time.sleep(0.01)
      results = index.query(vector=query_vector, namespace=NAMESPACE, filter=METADATA_FILTER, top_k=BATCH)
  ```
</CodeGroup>

## Delete records by metadata

<Note>
  In pod-based indexes, if you are targeting a large number of records for deletion and the index has active read traffic, consider [deleting records in batches](#delete-records-in-batches).
</Note>

To delete records based on their metadata, pass a metadata filter expression to the `delete` operation. This deletes all vectors matching the metadata filter expression.

For example, to delete all vectors with genre "documentary" and year 2019 from an index, use the following code:

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.delete(
      filter={
          "genre": {"$eq": "documentary"}
      }
  )
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  await index.deleteMany({
    genre: { $eq: "documentary" },
  });
  ```

  ```java Java
  import com.google.protobuf.Struct;
  import com.google.protobuf.Value;
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;

  import java.util.Arrays;
  import java.util.List;

  public class DeleteByMetadataExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          Struct filter = Struct.newBuilder()
                  .putFields("genre", Value.newBuilder()
                          .setStructValue(Struct.newBuilder()
                                  .putFields("$eq", Value.newBuilder()
                                          .setStringValue("documentary")
                                          .build()))
                          .build())
                  .build();
          index.deleteByFilter(filter, "example-namespace");
      }
  }
  ```

  ```go Go
  package main

  import (
      "context"
      "log"

      "github.com/pinecone-io/go-pinecone/v3/pinecone"
      "google.golang.org/protobuf/types/known/structpb"
  )

  func main() {
      ctx := context.Background()

      pc, err := pinecone.NewClient(pinecone.NewClientParams{
          ApiKey: "YOUR_API_KEY",
      })
      if err != nil {
          log.Fatalf("Failed to create Client: %v", err)
      }

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      metadataFilter := map[string]interface{}{
          "genre": "$eq": "documentary"
      }

      filter, err := structpb.NewStruct(metadataFilter)
      if err != nil {
          log.Fatalf("Failed to create metadata filter: %v", err)
      }

      err = idxConnection.DeleteVectorsByFilter(ctx, filter)
      if err != nil {
          log.Fatalf("Failed to delete vector(s) with filter %+v: %v", filter, err)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var deleteResponse = await index.DeleteAsync(new DeleteRequest {
      Namespace = "example-namespace",
      Filter = new Metadata
      {
          ["genre"] =
              new Metadata
              {
                  ["$eq"] = "documentary"
              }
      }
  });
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -i "https://$INDEX_HOST/vectors/delete" \
    -H 'Api-Key: $PINECONE_API_KEY' \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "filter": {"genre": {"$eq": {"documentary"}}
    }'
  ```
</CodeGroup>

## Tag an index

When configuring an index, you can tag the index to help with index organization and management. For more details, see [Tag an index](/guides/manage-data/manage-indexes#configure-index-tags).

## Troubleshoot index fullness errors

Serverless indexes automatically scale as needed.

However, pod-based indexes can run out of capacity. When that happens, upserting new records will fail with the following error:

```console console
Index is full, cannot accept data.
```

While a full pod-based index can still serve queries, you need to [scale your index](/guides/indexes/pods/scale-pod-based-indexes) to accommodate more records.
