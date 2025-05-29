# Create a pod-based index

This page shows you how to create a pod-based index. For guidance on serverless indexes, see [Create a serverless index](/guides/index-data/create-an-index).

<Tip>
  You can create an index using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/create-index/serverless).
</Tip>

## Create a pod index

To create a pod index, use the [`create_index`](/reference/api/2024-10/control-plane/create_index) operation as follows:

* Provide a `name` for the index.
* Specify the `dimension` and `metric` of the vectors you'll store in the index. This should match the dimension and metric supported by your embedding model.
* Set `spec.environment` to the [environment](/guides/index-data/create-an-index#cloud-regions) where the index should be deployed. For Python, you also need to import the `ServerlessSpec` class.
* Set `spec.pod_type` to the [pod type](/guides/indexes/pods/understanding-pod-based-indexes#pod-types) and [size](/guides/index-data/indexing-overview#pod-size-and-performance) that you want.

Other parameters are optional. See the [API reference](/reference/api/2024-10/control-plane/create_index) for details.

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
      pods=1
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
        pods: 1
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
          pc.createPodsIndex("docs-example", 1536, "us-west1-gcp",
                  "p1.x1", "cosine", DeletionProtection.DISABLED);
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
      DeletionProtection = DeletionProtection.Disabled
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
           "deletion_protection": "disabled"
        }'
  ```
</CodeGroup>

## Create a pod index from a collection

You can create a pod-based index from a collection. For more details, see [Restore an index](/guides/indexes/pods/restore-a-pod-based-index).
