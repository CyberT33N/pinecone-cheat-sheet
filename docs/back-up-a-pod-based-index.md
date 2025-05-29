# Back up a pod-based index

This page describes how to create a static copy of a pod-based index, also known as a [collection](/guides/indexes/pods/understanding-collections).

## Create a collection

To create a backup of your pod-based index, use the [`create_collection`](/reference/api/2024-10/control-plane/create_collection) operation.

The following example creates a [collection](/guides/indexes/pods/understanding-collections) named `example-collection` from an index named `docs-example`:

<CodeGroup>
  ```python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="API_KEY")
  pc.create_collection("example-collection", "docs-example")
  ```

  ```javascript JavaScript
  // npm install @pinecone-database/pinecone
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({
    apiKey: 'YOUR_API_KEY'
  });

  await pc.createCollection({
    name: "example-collection",
    source: "docs-example",
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;

  public class CreateCollectionExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();

          pc.createCollection("example-collection", "docs-example");
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

      collection, err := pc.CreateCollection(ctx, &pinecone.CreateCollectionRequest{
          Name: "example-collection", 
          Source: "docs-example",
      })
      if err != nil {
          log.Fatalf("Failed to create collection: %v", err)
      } else {
          fmt.Printf("Successfully created collection: %v", collection.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var collectionModel = await pinecone.CreateCollectionAsync(new CreateCollectionRequest {
      Name = "example-collection",
      Source = "docs-example",
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s POST "https://api.pinecone.io/collections" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
          "name": "example-collection",
          "source": "docs-example"
    }'
  ```
</CodeGroup>

<Tip>
  You can create a collection using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/backups).
</Tip>

## Check the status of a collection

To retrieve the status of the process creating a collection and the size of the collection, use the [`describe_collection`](/reference/api/2024-10/control-plane/describe_collection) operation. Specify the name of the collection to check. You can only call `describe_collection` on a collection in the current project.

The `describe_collection` operation returns an object containing key-value pairs representing the name of the collection, the size in bytes, and the creation status of the collection.

The following example gets the creation status and size of a collection named `example-collection`.

<CodeGroup>
  ```python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='API_KEY')
  pc.describe_collection(name="example-collection")
  ```

  ```javascript JavaScript
  // npm install @pinecone-database/pinecone
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.describeCollection('example-collection');
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.client.model.CollectionModel;

  public class DescribeCollectionExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          CollectionModel collectionModel = pc.describeCollection("example-collection");
          System.out.println(collectionModel);
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

      collectionName := "example-collection"

      collection, err := pc.DescribeCollection(ctx, collectionName)
      if err != nil {
          log.Fatalf("Error describing collection %v: %v", collectionName, err)
      } else {
          fmt.Printf("Collection: %+v", collection)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var collectionModel = await pinecone.DescribeCollectionAsync("example-collection");

  Console.WriteLine(collectionModel);
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -i -X GET "https://api.pinecone.io/collections/example-collection" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

<Tip>
  You can check the status of a collection using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/backups).
</Tip>

## List your collections

To get a list of the collections in the current project, use the [`list_collections`](/reference/api/2024-10/control-plane/list_collections) operation.

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='API_KEY')
  pc.list_collections()
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  await pc.listCollections();
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.client.model.CollectionModel;

  public class ListCollectionsExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          List<CollectionModel> collectionList = pc.listCollections().getCollections();
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

      collections, err := pc.ListCollections(ctx)
      if err != nil {
  	    log.Fatalf("Failed to list collections: %v", err)
      } else {
          if len(collections) == 0 {
              fmt.Printf("No collections found in project")
          } else {
              for _, collection := range collections {
                  fmt.Printf("collection: %v\n", prettifyStruct(collection))
              }
          }
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var collectionList = await pinecone.ListCollectionsAsync();

  Console.WriteLine(collectionList);
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -i -X GET "https://api.pinecone.io/collections" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  ```

  <Tip>
    You can view a list of your collections using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/backups).
  </Tip>
</CodeGroup>

<Tip>
  You can view a list of your collections using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/backups).
</Tip>

## Delete a collection

To delete a collection, use the [`delete_collection`](/reference/api/2024-10/control-plane/delete_collection) operation. Specify the name of the collection to delete.

Deleting the collection takes several minutes. During this time, the [`describe_collection`](#check-the-status-of-a-collection) operation returns the status "deleting".

<CodeGroup>
  ```python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='API_KEY')
  pc.delete_collection("example-collection")
  ```

  ```javascript JavaScript
  // npm install @pinecone-database/pinecone
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  await pc.deleteCollection("example-collection");
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;

  public class DeleteCollectionExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.deleteCollection("example-collection");
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

      collectionName := "example-collection"

      err = pc.DeleteCollection(ctx, collectionName)
      if err != nil {
  	    log.Fatalf("Failed to delete collection: %v\n", err)
      } else {
          if len(collections) == 0 {
              fmt.Printf("No collections found in project")
          } else {
              fmt.Printf("Successfully deleted collection \"%v\"\n", collectionName)
          }
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  await pinecone.DeleteCollectionAsync("example-collection");
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -i -X DELETE "https://api.pinecone.io/collections/example-collection" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

<Tip>
  You can delete a collection using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/backups).
</Tip>
