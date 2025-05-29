# Delete records

This page shows you how to use the [`delete`](/reference/api/2024-10/data-plane/delete) endpoint to remove records from an index [namespace](/guides/index-data/indexing-overview#namespaces).

## Delete records by ID

Since Pinecone records can always be efficiently accessed using their ID, deleting by ID is the most efficient way to remove specific records.

<Note>
  To remove records from the default namespace, specify `"__default__"` as the namespace in your request.
</Note>

<CodeGroup>
  ```Python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.delete(ids=["id-1", "id-2"], namespace='example-namespace')
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  const ns = index.namespace('example-namespace')
  // Delete one record by ID.
  await ns.deleteOne('id-1');
  // Delete more than one record by ID.
  await ns.deleteMany(['id-2', 'id-3']);
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;

  import java.util.Arrays;
  import java.util.List;

  public class DeleteExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          List<String> ids = Arrays.asList("id-1", "id-2");
          index.deleteByIds(ids, "example-namespace");
      }
  }
  ```

  ```go Go
  package main

  import (
      "context"
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      id1 := "id-1"
      id2 := "id-2"

      err = idxConnection.DeleteVectorsById(ctx, []string{id1, id2})
      if err != nil {
          log.Fatalf("Failed to delete vector with ID %v: %v", id, err)
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
      Ids = new List<string> { "id-1", "id-2" },
      Namespace = "example-namespace",
  });
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl "https://$INDEX_HOST/vectors/delete" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "ids": [
        "id-1", 
        "id-2"
      ],
      "namespace": "example-namespace"
    }
  '
  ```
</CodeGroup>

## Delete records by metadata

<Note>
  Serverless indexes do not support deleting by metadata. You can [delete records by ID prefix](/guides/manage-data/manage-document-chunks#delete-all-records-for-a-parent-document) instead.
</Note>

## Delete records in a namespace

In serverless indexes, it's safe to delete an entire namespace or a large number of records at once because reads and writes do not share compute resources. There are two ways to delete records from a namespace:

* [Delete all records in a namespace](#delete-all-records-in-a-namespace)
* [Delete an entire namespace](#delete-an-entire-namespace)

### Delete all records in a namespace

To delete all of the records in a namespace but not the namespace itself, provide a `namespace` parameter and specify the appropriate `deleteAll` parameter for your SDK. To target the default namespace, set `namespace` to `"__default__"`.

<CodeGroup>
  ```Python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.delete(delete_all=True, namespace='example-namespace')
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  await index.namespace('example-namespace').deleteAll();
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;

  import java.util.Arrays;
  import java.util.List;

  public class DeleteExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          index.deleteAll("example-namespace");
      }
  }
  ```

  ```go Go
  package main

  import (
      "context"
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      err = idxConnection.DeleteAllVectorsInNamespace(ctx)
      if err != nil {
          log.Fatalf("Failed to delete all vectors in namespace %v: %v", namespace, err)
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
      DeleteAll = true,
      Namespace = "example-namespace",
  });
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl "https://$INDEX_HOST/vectors/delete" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "deleteAll": true,
      "namespace": "example-namespace"
    }
  '
  ```
</CodeGroup>

### Delete an entire namespace

To delete an entire namespace and all of its records, see [Delete a namespace](/guides/manage-data/manage-namespaces#delete-a-namespace).

## Delete an entire index

To remove all records from an index, [delete the index](/guides/manage-data/manage-indexes#delete-an-index) and [recreate it](/guides/index-data/create-an-index).

## Data freshness

Pinecone is eventually consistent, so there can be a slight delay before new or changed records are visible to queries. You can view index stats to [check data freshness](/guides/index-data/check-data-freshness).
