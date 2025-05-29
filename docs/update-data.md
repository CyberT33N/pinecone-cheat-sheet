# Update records

This page shows you how to use the [`update`](/reference/api/2024-10/data-plane/update) operation to update parts of existing records in dense or sparse indexes. To update entire records, use the [`upsert`](/guides/index-data/upsert-data) operation instead.

<Warning>
  The `update` operation does not validate the existence of IDs within an index. If a non-existent ID is specified, no records are affected and a `200 OK` status is returned.
</Warning>

## Update dense vector values

To update the dense vector value of a record in a [dense index](/guides/index-data/indexing-overview#dense-indexes), specify the `namespace`,  record `id`, and the new dense vector `values`. The new dense vector values must have the same length as the existing dense vector values.

In this example, assume you want to update the dense vector values of the following record in the `example-namespace` namespace:

```
(
	id="id-3", 
	values=[1.0, 2.0], 
    metadata={"type": "doc", "genre": "drama"}
)
```

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.update(id="id-3", values=[4.0, 2.0], namespace="example-namespace")
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  await index.namespace('example-namespace').update({
   	id: 'id-3',
   	values: [4.0, 2.0]
  });
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.UpdateResponse;

  import java.util.Arrays;
  import java.util.List;

  public class UpdateExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          List<Float> values = Arrays.asList(4.0f, 2.0f);
          UpdateResponse updateResponse = index.update("id-3", values, null, "example-namespace", null, null);
          System.out.println(updateResponse);
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

      id := "id-3"

      err = idxConnection.UpdateVector(ctx, &pinecone.UpdateVectorRequest{
          Id:     id,
          Values: []float32{4.0, 2.0},
      })
      if err != nil {
          log.Fatalf("Failed to update vector with ID %v: %v", id, err)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var updateResponse = await index.UpdateAsync(new UpdateRequest {
      Id = "id-3",
      Namespace = "example-namespace",
      Values = new[] { 4.0f, 2.0f }
  });
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl "https://$INDEX_HOST/vectors/update" \
  	-H "Api-Key: $PINECONE_API_KEY" \
  	-H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
  	-d '{
  			"id": "id-3",
  			"values": [
  				4.0,
  				2.0
  			],
  			"namespace": "example-namespace"
  		}'
  ```
</CodeGroup>

After the update, the dense vector values are changed, but the metadata is unchanged:

```
(
	id="id-3", 
	values=[4.0, 2.0],
    metadata={"type": "doc", "genre": "drama"} 
)
```

## Update sparse vector values

To update the sparse vector value of a record in a [sparse index](/guides/index-data/indexing-overview#sparse-indexes), specify the `namespace`,  record `id`, and the new `sparse_values`.

In this example, assume you are updating the sparse vector values of the following record in the `example-namespace` namespace:

```
(
	id="id-3", 
	sparse_values={"indices": [1, 5], "values": [0.5, 0.5]}
)
```

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.update(
  	id="id-3", 
  	sparse_values={"indices": [2, 6], "values": [0.5, 0.5]},
  	namespace="example-namespace"
  )
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  await index.namespace('example-namespace').update({
    id: 'id-3',
    sparseValues: {'indices': [2, 6], 'values': [0.5, 0.5]},
  });
  ```

  ```java Java
  import com.google.protobuf.Struct;
  import com.google.protobuf.Value;
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.UpdateResponse;

  import java.util.Arrays;
  import java.util.List;

  public class UpdateExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          List<Long> sparseIndices = Arrays.asList(2L, 6L);
          List<Float> sparseValues = Arrays.asList(0.5f, 0.5f);
          UpdateResponse updateResponse = index.update("id-3", null, null, "example-namespace", sparseIndices, sparseValues);
          System.out.println(updateResponse);
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

      id := "id-3"

      sparseValues := pinecone.SparseValues{
          Indices: []uint32{2, 6},
          Values:  []float32{0.5, 0.5},
      }

      err = idxConnection.UpdateVector(ctx, &pinecone.UpdateVectorRequest{
          Id:       id,
          SparseValues: &sparseValues,
      })
      if err != nil {
          log.Fatalf("Failed to update vector with ID %v: %v", id, err)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var updateResponse = await index.UpdateAsync(new UpdateRequest {
      Id = "id-3",
      Namespace = "example-namespace",
      SparseValues = new SparseValues
      {
          Indices = [2, 6],
          Values = new[] { 0.5f, 0.5f }
      }
  });
  ```

  ```bash curl
  # The `POST` request below uses the unique endpoint for an index.
  # See https://docs.pinecone.io/guides/manage-data/target-an-index for details.
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl "https://$INDEX_HOST/vectors/update" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
        "id": "id-3",
        "sparse_values": {"indices": [2, 6], "values": [0.5, 0.5]},
        "namespace": "example-namespace"
    }'
  ```
</CodeGroup>

After the update, the sparse value `indices` array is changed, but the rest of the record is unchanged:

```
(
	id="id-3", 
	sparse_values={"indices": [2, 6], "values": [0.5, 0.5]}
)
```

## Update metadata values

When updating metadata, only the specified metadata fields are modified, and if a specified metadata file does not exist, it is added.

In this example, assume you are updating the metadata values of following record in the `example-namespace` namespace:

```
(
    id="id-3", 
    values=[4.0, 2.0], 
    metadata={"type": "doc", "genre": "drama"}
)
```

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.update(
  	id="id-3", 
  	set_metadata={"type": "web", "new": True}, 
  	namespace="example-namespace"
  )
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  await index.namespace('example-namespace').update({
  	id: 'id-3',
  	metadata: {
  		type: "web",
  		new: true,
  	},
  });
  ```

  ```java Java
  import com.google.protobuf.Struct;
  import com.google.protobuf.Value;
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.UpdateResponse;

  import java.util.Arrays;
  import java.util.List;

  public class UpdateExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
  		Struct metaData = Struct.newBuilder()
  			.putFields("web",
  					Value.newBuilder().setBoolValue(true).build())
  			.build();
          UpdateResponse updateResponse = index.update("id-3", null, metaData, "example-namespace", null, null);
          System.out.println(updateResponse);
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

      id := "id-3"

      metadataMap := map[string]interface{}{
          "type": "web",
          "new": True,
      }

      metadataFilter, err := structpb.NewStruct(metadataMap)
      if err != nil {
          log.Fatalf("Failed to create metadata map: %v", err)
      }

      err = idxConnection.UpdateVector(ctx, &pinecone.UpdateVectorRequest{
          Id:       id,
          Metadata: metadataFilter,
      })
      if err != nil {
          log.Fatalf("Failed to update vector with ID %v: %v", id, err)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var updateResponse = await index.UpdateAsync(new UpdateRequest {
      Id = "id-3",
      Namespace = "example-namespace",
      Values = new[] { 4.0f, 2.0f },
      SetMetadata = new Metadata {
          ["type"] = new("web"),
          ["new"] = new(true)
      }
  });
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl "https://$INDEX_HOST/vectors/update" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
        "id": "id-3",
        "setMetadata": {
            "type": "web",
            "new": true
        },
        "namespace": "example-namespace"
      }'
  ```
</CodeGroup>

After the update, the `type` metadata field is `web`, the `new` property is added with the value `true`, and the `genre` property is unchanged:

```
(
    id="id-3", 
    values=[4.0, 2.0], 
    metadata={"type": "web", "new": true, "genre": "drama"}
)
```

## Update a combination of values

<Note>
  To update an entire record, use the [`upsert`](/guides/index-data/upsert-data) operation instead.
</Note>

In this example, assume you are updating the dense vector values and one metadata value of the following record in the `example-namespace` namespace:

```
(
    id="id-3", 
    values=[4.0, 2.0], 
    metadata={"type": "doc", "genre": "drama"}
)
```

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.update(
  	id="id-3", 
  	values=[5.0, 3.0], 
  	set_metadata={"genre": "comedy"},
  	namespace="example-namespace"
  )
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  await index.namespace('example-namespace').update({
    id: 'id-3',
    values: [5.0, 3.0],
    metadata: {
      type: "comedy",
    },
  });
  ```

  ```java Java
  import com.google.protobuf.Struct;
  import com.google.protobuf.Value;
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.UpdateResponse;

  import java.util.Arrays;
  import java.util.List;

  public class UpdateExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          List<Float> values = Arrays.asList(5.0f, 3.0f);
  		Struct metaData = Struct.newBuilder()
  			.putFields("type",
  					Value.newBuilder().setStringValue("comedy").build())
  			.build();
          UpdateResponse updateResponse = index.update("id-3", values, metaData, "example-namespace", null, null);
          System.out.println(updateResponse);
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

      id := "id-3"

      metadataMap := map[string]interface{}{
          "genre": "comedy",
      }

      metadataFilter, err := structpb.NewStruct(metadataMap)
      if err != nil {
          log.Fatalf("Failed to create metadata map: %v", err)
      }

      err = idxConnection.UpdateVector(ctx, &pinecone.UpdateVectorRequest{
          Id:       id,
          Values: []float32{5.0, 3.0},
          Metadata: metadataFilter,
      })
      if err != nil {
          log.Fatalf("Failed to update vector with ID %v: %v", id, err)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var updateResponse = await index.UpdateAsync(new UpdateRequest {
      Id = "id-3",
      Namespace = "example-namespace",
      Values = new[] { 5.0f, 3.0f },
      SetMetadata = new Metadata {
          ["genre"] = new("comedy")
      }
  });
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  # Update both values and metadata
  curl "https://$INDEX_HOST/vectors/update" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
          "id": "id-3",
          "values": [5.0, 3.0],
          "setMetadata": {"type": "comedy"},
          "namespace": "example-namespace"
        }'
  ```
</CodeGroup>

After the update, the dense vector values and the `genre` metadata value are changed, but the `type` metadata value is unchanged:

```
(
    id="id-3", 
    values=[5.0, 2.0], 
    metadata={"type": "doc", "genre": "comedy"}
)
```

## Data freshness

Pinecone is eventually consistent, so there can be a slight delay before new or changed records are visible to queries. You can view index stats to [check data freshness](/guides/index-data/check-data-freshness).
