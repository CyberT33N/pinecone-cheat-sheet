# Fetch records

This page shows you how to [fetch records](/reference/api/2024-10/data-plane/fetch) by ID from a dense or sparse index [namespace](/guides/index-data/indexing-overview#namespaces). The returned records are complete, including all relevant vector values and metadata.

<Tip>
  You can fetch data using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes/-/browser).
</Tip>

## Fetch records

To fetch records, specify the record IDs and the namespace. To use the default namespace, specify the record IDs and `"__default__"` as the namespace.

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.fetch(ids=["id-1", "id-2"], namespace="example-namespace")
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  const fetchResult = await index.namespace('example-namespace').fetch(['id-1', 'id-2']);
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.FetchResponse;

  import java.util.Arrays;
  import java.util.List;

  public class FetchExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");

          List<String> ids = Arrays.asList("id-1", "id-2");
          FetchResponse fetchResponse = index.fetch(ids, "example-namespace");
          System.out.println(fetchResponse);
      }
  }
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      res, err := idxConnection.FetchVectors(ctx, []string{"id-1", "id-2"})
      if err != nil {
          log.Fatalf("Failed to fetch vectors: %v", err)
      } else {
          fmt.Printf(prettifyStruct(res))
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var fetchResponse = await index.FetchAsync(new FetchRequest {
      Ids = new List<string> { "id-1", "id-2" },
      Namespace = "example-namespace"
  });
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/fetch?ids=id-1&ids=id-2&namespace=example-namespace" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

The response looks like this:

<CodeGroup>
  ```Python Python
  {'namespace': 'example-namespace',
   'usage': {'readUnits': 1},
   'vectors': {'id-1': {'id': 'id-1',
                        'values': [0.568879, 0.632687092, 0.856837332, ...]},
               'id-2': {'id': 'id-2',
                        'values': [0.00891787093, 0.581895, 0.315718859, ...]}}}
  ```

  ```JavaScript JavaScript
  {'namespace': 'example-namespace',
   'usage': {'readUnits': 1},
   'records': {'id-1': {'id': 'id-1',
                        'values': [0.568879, 0.632687092, 0.856837332, ...]},
               'id-2': {'id': 'id-2',
                        'values': [0.00891787093, 0.581895, 0.315718859, ...]}}}
  ```

  ```java Java
  namespace: "example-namespace"
  vectors {
    key: "id-1"
    value {
      id: "id-1"
      values: 0.568879
      values: 0.632687092
      values: 0.856837332
      ...
    }
  }
  vectors {
    key: "id-2"
    value {
      id: "id-2"
      values: 0.00891787093
      values: 0.581895
      values: 0.315718859
      ...
    }
  }
  usage {
    read_units: 1
  }
  ```

  ```go Go
  {
    "vectors": {
      "id-1": {
        "id": "id-1",
        "values": [
          -0.0089730695,
          -0.020010853,
          -0.0042787646,
          ...
        ]
      },
      "id-2": {
        "id": "id-2",
        "values": [
          -0.005380766,
          0.00215196,
          -0.014833462,
          ...
        ]
      }
    },
    "usage": {
      "read_units": 1
    }
  }
  ```

  ```csharp C#
  {
    "vectors": {
      "id-1": {
        "id": "id-1",
        "values": [
          -0.0089730695,
          -0.020010853,
          -0.0042787646,
          ...
        ],
        "sparseValues": null,
        "metadata": null
      },
      "vec1": {
        "id": "id-2",
        "values": [
          -0.005380766,
          0.00215196,
          -0.014833462,
          ...
        ],
        "sparseValues": null,
        "metadata": null
      }
    },
    "namespace": "example-namespace",
    "usage": {
      "readUnits": 1
    }
  ```

  ```json curl
  {
    "vectors": {
      "id-1": {
        "id": "id-1",
        "values": [0.568879, 0.632687092, 0.856837332, ...]
      },
      "id-2": {
        "id": "id-2",
        "values": [0.00891787093, 0.581895, 0.315718859, ...]
      }
    },
    "namespace": "example-namespace",
    "usage": {"readUnits": 1},
  }
  ```
</CodeGroup>

## Data freshness

Pinecone is eventually consistent, so there can be a slight delay before new or changed records are visible to queries. You can view index stats to [check data freshness](/guides/index-data/check-data-freshness).
