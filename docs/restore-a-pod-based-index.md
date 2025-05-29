# Restore a pod-based index

You can restore a pod-based index by creating a new index from a [collection](/guides/indexes/pods/understanding-collections).

## Create a pod-based index from a collection

To create a pod-based index from a [collection](/guides/manage-data/back-up-an-index#pod-based-index-backups-using-collections), use the [`create_index`](/reference/api/2024-10/control-plane/create_index) endpoint and provide a [`source_collection`](/reference/api/2024-10/control-plane/create_index#!path=source%5Fcollection\&t=request) parameter containing the name of the collection from which you wish to create an index. The new index can differ from the original source index: the new index can have a different name, number of pods, or pod type. The new index is queryable and writable.

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone, PodSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.create_index(
    name="docs-example",
    dimension=128,
    metric="cosine",
    spec=PodSpec(
      environment="us-west-1-gcp",
      pod_type="p1.x1",
      pods=1,
      source_collection="example-collection"
    )
  )
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({
    apiKey: 'YOUR_API_KEY'
  });

  await pc.createIndex({
    name: 'docs-example',
    dimension: 128,
    metric: 'cosine',
    spec: {
      pod: {
        environment: 'us-west-1-gcp',
        podType: 'p1.x1',
        pods: 1,
        sourceCollection: 'example-collection'
      }
    }
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.IndexModel;
  import org.openapitools.db_control.client.model.DeletionProtection;

  public class CreateIndexFromCollectionExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.createPodsIndex("docs-example", 1536, "us-west1-gcp",
                  "p1.x1", "cosine", "example-collection", DeletionProtection.DISABLED);
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
          SourceCollection:   "example-collection",
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
      Dimension = 1538,
      Metric = MetricType.Cosine,
      Spec = new PodIndexSpec
      {
          Pod = new PodSpec
          {
              Environment = "us-east1-gcp",
              PodType = "p1.x1",
              Pods = 1,
              Replicas = 1,
              Shards = 1,
              SourceCollection = "example-collection",
          }
      },
      DeletionProtection = DeletionProtection.Enabled,
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
           "dimension": 128,
           "metric": "cosine",
           "spec": {
              "pod": {
                 "environment": "us-west-1-gcp",
                 "pod_type": "p1.x1",
                 "pods": 1,
                 "source_collection": "example-collection"
              }
           }
        }'
  ```
</CodeGroup>
