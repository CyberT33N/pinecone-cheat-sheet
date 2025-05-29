# Decrease latency

This page describes helpful techniques for decreasing latency for upserts, searches, and other data operations.

## Use namespaces

When you divide records into [namespaces](/guides/index-data/indexing-overview#namespaces) in a logical way, you speed up queries by ensuring only relevant records are scanned. The same applies to [fetching records](/guides/manage-data/fetch-data), [listing record IDs](/guides/manage-data/list-record-ids), and other data operations.

## Filter by metadata

In addition to increasing search accuracy and relevance, [searching with metadata filters](/guides/search/filter-by-metadata) can also help decrease latency by retrieving only records that match the filter.

## Target indexes by host

When you target an index by name for data operations such as `upsert` and `query`, the SDK gets the unique DNS host for the index using the `describe_index` operation. This is convenient for testing but should be avoided in production because `describe_index` uses a different API than data operations and therefore adds an additional network call and point of failure. Instead, you should get an index host once and cache it for reuse or specify the host directly.

You can get index hosts in the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes) or using the [`describe_index`](/guides/manage-data/manage-indexes#describe-an-index) operation.

The following example shows how to target an index by host directly:

<Note>
  When using Private Endpoints for private connectivity between your application and Pinecone, you must target the index using the [Private Endpoint URL](/guides/production/connect-to-aws-privatelink#run-data-plane-commands) for the host.
</Note>

<CodeGroup>
  ```Python Python {5}
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  index = pc.Index(host="INDEX_HOST")
  ```

  ```javascript JavaScript {6}
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  // For the Node.js SDK, you must specify both the index host and name.
  const index = pc.index("INDEX_NAME", "INDEX_HOST");
  ```

  ```java Java {11}
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;

  public class TargetIndexByHostExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          // For the Java SDK, you must specify both the index host and name.
          Index index = new Index(connection, "INDEX_NAME");
      }
  }
  ```

  ```go Go {21}
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

      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host %v: %v", idx.Host, err)
      }
  }
  ```

  ```csharp C# {5}
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var index = pinecone.Index(host: "INDEX_HOST");
  ```
</CodeGroup>

## Reuse connections

When you target an index for upserting or querying, the client establishes a TCP connection, which is a three-step process. To avoid going through this process on every request, and reduce average request latency, [cache and reuse the index connection object](/reference/api/authentication#initialize-a-client) whenever possible.

## Use a cloud environment

If you experience slow uploads or high query latencies, it might be because you are accessing Pinecone from your home network. To decrease latency, access Pinecone/deploy your application from a cloud environment instead, ideally from the same [cloud and region](/guides/index-data/create-an-index#cloud-regions) as your index.

## Avoid database limits

Pinecone has [rate limits](/reference/api/database-limits#rate-limits) that restrict the frequency of requests within a specified period of time. Rate limits vary based on pricing plan and apply to serverless indexes only.
