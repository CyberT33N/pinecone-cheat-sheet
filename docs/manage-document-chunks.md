# Manage document chunks

In [Retrieval Augmented Generation (RAG)](https://www.pinecone.io/learn/retrieval-augmented-generation/) use cases, it is best practice to [chunk large documents](https://www.pinecone.io/learn/chunking-strategies/) into smaller segments, embed each chunk separately, and then store each embedded chunk as a distinct record in Pinecone. This page shows you how to model, store, and manage such records in serverless indexes.

## Use ID prefixes

ID prefixes enable you to query segments of content, which is especially useful for lists and [mass deletion](/guides/manage-data/delete-data). Prefixes are commonly used to represent the following:

* **Hierarchical relationships**: When you have multiple records representing chunks of a single document, use a [common ID prefix](#use-id-prefixes-to-reference-parent-documents) to reference the document. This is the main use of ID prefixes for RAG.
* **Versioning**: Assign a [multi-level ID prefix](#work-with-multi-level-id-prefixes) to denote the version of the content.
* **Content typing**: For [multi-modal search](https://www.pinecone.io/solutions/multi-modal/), assign an ID prefix to identify different kind of objects (e.g., text, images, videos) in the database.
* **Source identification**: Assign an ID prefix to denote the source of the content. For example, if you want to disconnect a given user's account that was a data source, you can easily find and delete all of the records associated with the user.

### Use ID prefixes to reference parent documents

When you have multiple records representing chunks of a single document, use a common ID prefix to reference the document.

You can use any prefix pattern you like, but make sure you use a consistent prefix pattern for all child records of a document. For example, the following are all valid prefixes for the first chunk of `doc1`:

* `doc1#chunk1`
* `doc1_chunk1`
* `doc1___chunk1`
* `doc1:chunk1`
* `doc1chunk1`

Prefixes can also be [multi-level](#work-with-multi-level-id-prefixes). For example, `doc1#v1#chunk1` and `doc1#v2#chunk1` can represent different versions of the first chunk of `doc1`.

<Note>
  ID prefixes are not validated on upsert or update. It is useful to pick a unique and consistent delimiter that will not be used in the ID elsewhere.
</Note>

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone
  from pinecone import ServerlessSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.create_index(
    name="docs-example",
    dimension=8,
    metric="cosine",
    spec=ServerlessSpec(
      cloud="aws",
      region="us-east-1"
    )
  )

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.upsert(
    vectors=[
      {"id": "doc1#chunk1", "values": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]},
      {"id": "doc1#chunk2", "values": [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]},
      {"id": "doc1#chunk3", "values": [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]},
      {"id": "doc1#chunk4", "values": [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]}
    ],
    namespace="example-namespace"
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
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      }
    }
  });

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  await index.namespace("example-namespace").upsert([
    {
      "id": "doc1#chunk1", 
      "values": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
    },
    {
      "id": "doc1#chunk2", 
      "values": [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
    },
    {
      "id": "doc1#chunk3", 
      "values": [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
    },
    {
      "id": "doc1#chunk4", 
      "values": [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
    }
  ]);
  ```

  ```java Java
  // Upsert vectors

  import com.google.protobuf.Struct;
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.unsigned_indices_model.VectorWithUnsignedIndices;
  import java.util.ArrayList;
  import java.util.Arrays;
  import java.util.List;
  import static io.pinecone.commons.IndexInterface.buildUpsertVectorWithUnsignedIndices;

  import java.util.Arrays;
  import java.util.List;

  public class UpsertExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");

          // Vector ids to be upserted
          List<String> upsertIds = Arrays.asList("doc1#chunk1", "doc1#chunk2", "doc1#chunk3");

          // List of values to be upserted
          List<List<Float>> values = new ArrayList<>();
          values.add(Arrays.asList(1.0f, 2.0f, 3.0f));
          values.add(Arrays.asList(4.0f, 5.0f, 6.0f));
          values.add(Arrays.asList(7.0f, 8.0f, 9.0f));
          ...
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

      // Serverless index
      indexName := "docs-example"
      vectorType := "dense"
      dimension := int32(1536)
      metric := pinecone.Cosine
      deletionProtection := pinecone.DeletionProtectionDisabled

      idx, err := pc.CreateServerlessIndex(ctx, &pinecone.CreateServerlessIndexRequest{
          Name:               indexName,
          VectorType:         &vectorType,
          Dimension:          &dimension,
          Metric:             &metric,
          Cloud:              pinecone.Aws,
          Region:             "us-east-1",
          DeletionProtection: &deletionProtection,
      })
      if err != nil {
          log.Fatalf("Failed to create serverless index: %v", idx.Name)
      } else {
          fmt.Printf("Successfully created serverless index: %v", idx.Name)
      }

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
      }

      vectors := []*pinecone.Vector{
          {
              Id:     "doc1#chunk1",
              Values: []float32{0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1},
          },
          {
              Id:     "doc1#chunk2",
              Values: []float32{0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2},
          },
          {
              Id:     "doc1#chunk3",
              Values: []float32{0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3},
          },   
          {
              Id:     "doc1#chunk4",
              Values: []float32{0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4},
          },   
      }

      count, err := idxConnection.UpsertVectors(ctx, vectors)
      if err != nil {
          log.Fatalf("Failed to upsert vectors: %v", err)
      } else {
          fmt.Printf("Successfully upserted %d vector(s)", count)
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
      Spec = new ServerlessIndexSpec
      {
          Serverless = new ServerlessSpec
          {
              Cloud = ServerlessSpecCloud.Aws,
              Region = "us-east-1",
          }
      },
      DeletionProtection = DeletionProtection.Disabled
  });

  var upsertResponse = await index.UpsertAsync(new UpsertRequest {
      Vectors = new[]
      {
          new Vector
          {
              Id = "doc1#chunk1",
              Values = new[] { 0.1f, 0.1f, 0.1f, 0.1f, 0.1f, 0.1f, 0.1f, 0.1f },
          },
          new Vector
          {
              Id = "doc1#chunk2",
              Values = new[] { 0.2f, 0.2f, 0.2f, 0.2f, 0.2f, 0.2f, 0.2f, 0.2f },
          },
          new Vector
          {
              Id = "doc1#chunk3",
              Values = new[] { 0.3f, 0.3f, 0.3f, 0.3f, 0.3f, 0.3f, 0.3f, 0.3f },
          },
          new Vector
          {
              Id = "doc1#chunk4",
              Values = new[] { 0.4f, 0.4f, 0.4f, 0.4f, 0.4f, 0.4f, 0.4f, 0.4f },
          },
      },
      Namespace = "example-namespace",
  });
  ```

  ```shell curl
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
              "serverless": {
                 "cloud": "aws",
                 "region": "us-east-1"
              }
           }
        }'

  # The `GET` request below uses the unique endpoint for an index.
  # See https://docs.pinecone.io/guides/manage-data/target-an-index for details.
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/upsert" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "vectors": [
        {
          "id": "doc1#chunk1", 
          "values": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
        },
        {
          "id": "doc1#chunk2", 
          "values": [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
        },
        {
          "id": "doc1#chunk3", 
          "values": [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
        },
        {
          "id": "doc1#chunk4", 
          "values": [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
        }
      ],
      "namespace": "example-namespace"
    }'
  ```
</CodeGroup>

## List all record IDs for a parent document

When all records related to a document use a common ID prefix, you can use the `list` operation with the `namespace` and `prefix` parameters to fetch the IDs of the records.

<Note>
  The `list` operation is supported only for [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes).
</Note>

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='YOUR_API_KEY')

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  # To iterate over all result pages using a generator function
  for ids in index.list(prefix='doc1#', namespace='example-namespace'):
      print(ids)
  ```

  ```js JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';
  const pc = new Pinecone();

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST").namespace("example-namespace");

  const results = await index.listPaginated({ prefix: 'doc1#' });
  console.log(results);
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.ListResponse;

  PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  config.setHost("INDEX_HOST");
  PineconeConnection connection = new PineconeConnection(config);
  Index index = new Index(connection, "INDEX_NAME");
  ListResponse listResponse = index.list("example-namespace", "doc1#"); /* Note: Currently, you must include an ID prefix to list vector IDs. */
  System.out.println("Response: " + listResponse.getVectorsList());
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

      limit := uint32(3)
      prefix := "doc1#"

      res, err := idxConnection.ListVectors(ctx, &pinecone.ListVectorsRequest{
          Limit:  &limit,
          Prefix: &prefix,
      })
      if len(res.VectorIds) == 0 {
          fmt.Println("No vectors found")
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

  var listResponse = await index.ListAsync(new ListRequest {
      Namespace = "example-namespace",
      Prefix = "doc1#",
  });

  Console.WriteLine(listResponse);
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/list?namespace=example-namespace&prefix=doc1#" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

The response looks like this:

<CodeGroup>
  ```python Python
  ['doc1#chunk1', 'doc1#chunk2', 'doc1#chunk3']
  ```

  ```js JavaScript
  {
    vectors: [
      { id: 'doc1#01' }, { id: 'doc1#02' }, { id: 'doc1#03' },
      { id: 'doc1#04' }, { id: 'doc1#05' },  { id: 'doc1#06' },
      { id: 'doc1#07' }, { id: 'doc1#08' }, { id: 'doc1#09' },
      ...
    ],
    pagination: {
      next: 'eyJza2lwX3Bhc3QiOiJwcmVUZXN0LS04MCIsInByZWZpeCI6InByZVRlc3QifQ=='
    },
    namespace: 'example-namespace',
    usage: { readUnits: 1 }
  }
  ```

  ```java Java
  vectors {
    id: "doc1#chunk1"
  }
  vectors {
    id: "doc1#chunk2"
  }
  vectors {
    id: "doc1#chunk3"
  }
  ...
  pagination {
    next: "eyJza2lwX3Bhc3QiOiJhbHN0cm9lbWVyaWEtcGVydXZpYW4iLCJwcmVmaXgiOm51bGx9"
  }
  namespace: "example-namespace"
  usage {
    read_units: 1
  }
  ```

  ```go Go
  {
    "vector_ids": [
      "doc1#chunk1",
      "doc1#chunk2",
      "doc1#chunk3"
    ],
    "usage": {
      "read_units": 1
    }
  }
  ```

  ```csharp C#
  {
    "vectors": [
      {
        "id": "doc1#chunk1"
      },
      {
        "id": "doc1#chunk2"
      },
      {
        "id": "doc1#chunk3"
      }
    ],
    "pagination": "eyJza2lwX3Bhc3QiOiIwMDBkMTc4OC0zMDAxLTQwZmMtYjZjNC0wOWI2N2I5N2JjNDUiLCJwcmVmaXgiOm51bGx9",
    "namespace": "example-namespace",
    "usage": {
      "readUnits": 1
    }
  }
  ```

  ```json curl
  {
    "vectors": [
      { "id": "doc1#chunk1" },
      { "id": "doc1#chunk2" },
      { "id": "doc1#chunk3" },
      { "id": "doc1#chunk4" },
     ...
    ],
    "pagination": {
      "next": "c2Vjb25kY2FsbA=="
    },
    "namespace": "example-namespace",
    "usage": {
      "readUnits": 1
    }
  }
  ```
</CodeGroup>

When there are additional IDs to return, the response includes a `pagination_token` that you can use to get the next batch of IDs. For more details, see [Paginate through list results](/guides/manage-data/list-record-ids#paginate-through-results)

With the record IDs, you can then use the `fetch` endpoint to [fetch the content of the records](/guides/manage-data/fetch-data).

## Delete all records for a parent document

To delete all records representing chunks of a single document, first list the record IDs based on their common ID prefix, and then [delete the records by ID](/guides/manage-data/delete-data#delete-specific-records-by-id):

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='YOUR_API_KEY')

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  for ids in index.list(prefix='doc1#', namespace='example-namespace'):
    print(ids) # ['doc1#chunk1', 'doc1#chunk2', 'doc1#chunk3']
    index.delete(ids=ids, namespace=namespace)
  ```

  ```js JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';
  const pc = new Pinecone();

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST").namespace("example-namespace");

  const pageOneList = await index.listPaginated({ prefix: 'doc1#' });
  const pageOneVectorIds = pageOneList.vectors.map((vector) => vector.id);

  // Then, delete the first page of records by ID:
  await index.deleteMany(pageOneVectorIds);

  // For a second page of returned records:
  const pageTwoList = await index.listPaginated({ prefix: 'doc1#', paginationToken: pageOneList.pagination.next });
  const pageTwoVectorIds = pageTwoList.vectors.map((vector) => vector.id);

  await index.deleteMany(pageTwoVectorIds);
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import java.util.Arrays;
  import java.util.List;
  ...

  PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  config.setHost("INDEX_HOST");
  PineconeConnection connection = new PineconeConnection(config);
  Index index = new Index(connection, "INDEX_NAME");
  List<String> ids = Arrays.asList("doc1#");
  DeleteResponse deleteResponse = index.deleteByIds(ids, "example-namespace");
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

  	client, err := pinecone.NewClient(pinecone.NewClientParams{
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

  	recordPrefix := "doc1#"
  	var limit uint32 = 100

  	listResp, err := indexConn.ListVectors(context.Background(), &pinecone.ListVectorsRequest{
  		Prefix: &recordPrefix,
  		Limit:  &limit,
  	})
  	if err != nil {
  		panic(err)
  	}
  	fmt.Printf("List response: %+v\n", listResp)

  	for listResp.NextPaginationToken != nil {
  		vectorIdsToDelete := make([]string, len(listResp.VectorIds))
  		for i, vectorId := range listResp.VectorIds {
  			if vectorId != nil {
  				vectorIdsToDelete[i] = *vectorId
  			}
  		}
  		err = indexConn.DeleteVectorsById(context.Background(), vectorIdsToDelete)
  		if err != nil {
  			panic(err)
  		}
  		fmt.Printf("Deleted %d vectors\n", len(vectorIdsToDelete))

  		listResp, err = indexConn.ListVectors(context.Background(), &pinecone.ListVectorsRequest{
  			Prefix:          &recordPrefix,
  			Limit:           &limit,
  			PaginationToken: listResp.NextPaginationToken,
  		})
  		if err != nil {
  			panic(err)
  		}
  	}
  }
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/list?namespace=example-namespace&prefix=doc1#" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  # Response:
  # {
  #   "vectors": [
  #     { "id": "doc1#chunk1" },
  #     { "id": "doc1#chunk2" },
  #     { "id": "doc1#chunk3" },
  #     { "id": "doc1#chunk4" },
  #    ...
  #   ],
  #   "pagination": {
  #     "next": "c2Vjb25kY2FsbA=="
  #   },
  #   "namespace": "example-namespace",
  #   "usage": {
  #     "readUnits": 1
  #   }
  # }

  # Then, delete the records by ID:

  curl "https://$INDEX_HOST/vectors/delete" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "ids": [
        "doc1#chunk1", 
        "doc1#chunk2", 
        "doc1#chunk3", 
        "doc1#chunk4"
      ],
      "namespace": "example-namespace"
    }
  '
  ```
</CodeGroup>

## Work with multi-level ID prefixes

The examples above are based on a simple ID prefix (`doc1#`), but it's also possible to work with more complex, multi-level prefixes.

For example, let's say you use the prefix pattern `doc#v#chunk` to differentiate between different versions of a document. If you wanted to delete all records for one version of a document, first list the record IDs based on the relevant `doc#v#` prefix and then [delete the records by ID](/guides/manage-data/delete-data#delete-specific-records-by-id):

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='YOUR_API_KEY')

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  for ids in index.list(prefix='doc1#v1', namespace='example-namespace'):
      print(ids) # ['doc1#v1#chunk1', 'doc1#v1#chunk2', 'doc1#v1#chunk3']
      index.delete(ids=ids, namespace=namespace)
  ```

  ```js JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';
  const pc = new Pinecone();

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST").namespace("example-namespace");

  const results = await index.listPaginated({ prefix: 'doc1#v1' });
  console.log(results);

  // {
  //   vectors: [
  //     { id: 'doc1#v1#01' }, { id: 'doc1#v1#02' }, { id: 'doc1#v1#03' }
  //   ],
  //   pagination: {
  //     next: 'eyJza2lwX3Bhc3QiOiJwcmVUZXN0LS04MCIsInByZWZpeCI6InByZVRlc3QifQ=='
  //   },
  //   namespace: 'example-namespace',
  //   usage: { readUnits: 1 }
  // }

  // Then, delete the records by ID:
  const vectorIds = results.vectors.map((vector) => vector.id);
  await index.deleteMany(vectorIds);
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import java.util.Arrays;
  import java.util.List;
  ...

  PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  config.setHost("INDEX_HOST");
  PineconeConnection connection = new PineconeConnection(config);
  Index index = new Index(connection, "INDEX_NAME");
  List<String> ids = Arrays.asList("doc1#v1"); /* [id: "doc1#v1#chunk1", id: "doc1#v1#chunk2", id: "doc1#v1#chunk3" ... */

  /* Then, delete the records by ID: */
  DeleteResponse deleteResponse = index.deleteByIds(ids, "example-namespace");
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

  	client, err := pinecone.NewClient(pinecone.NewClientParams{
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

  	recordPrefix := "doc1#v1"
  	var limit uint32 = 100

  	listResp, err := indexConn.ListVectors(context.Background(), &pinecone.ListVectorsRequest{
  		Prefix: &recordPrefix,
  		Limit:  &limit,
  	})
  	if err != nil {
  		panic(err)
  	}
  	fmt.Printf("List response: %+v\n", listResp)

  	for listResp.NextPaginationToken != nil {
  		vectorIdsToDelete := make([]string, len(listResp.VectorIds))
  		for i, vectorId := range listResp.VectorIds {
  			if vectorId != nil {
  				vectorIdsToDelete[i] = *vectorId
  			}
  		}
  		err = indexConn.DeleteVectorsById(context.Background(), vectorIdsToDelete)
  		if err != nil {
  			panic(err)
  		}
  		fmt.Printf("Deleted %d vectors\n", len(vectorIdsToDelete))

  		listResp, err = indexConn.ListVectors(context.Background(), &pinecone.ListVectorsRequest{
  			Prefix:          &recordPrefix,
  			Limit:           &limit,
  			PaginationToken: listResp.NextPaginationToken,
  		})
  		if err != nil {
  			panic(err)
  		}
  	}
  }
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/list?namespace=example-namespace&prefix=doc1%23v1%23" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"

  # Response:
  # {
  #   "vectors": [
  #     { "id": "doc1#v1#chunk1" },
  #     { "id": "doc1#v1#chunk2" },
  #     { "id": "doc1#v1#chunk3" },
  #     { "id": "doc1#v1#chunk4" },
  #    ...
  #   ],
  #   "pagination": {
  #     "next": "c2Vjb25kY2FsbA=="
  #   },
  #   "namespace": "example-namespace",
  #   "usage": {
  #     "readUnits": 1
  #   }
  # }

  # Then, delete the records by ID:

  curl "https://$INDEX_HOST/vectors/delete" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "ids": [
        "doc1#v1#chunk1", 
        "doc1#v1#chunk2", 
        "doc1#v1#chunk3", 
        "doc1#v1#chunk4"
      ],
      "namespace": "example-namespace"
    }
  '
  ```
</CodeGroup>

However, if you wanted to delete all records across all versions of a document, you would list the record IDs based on the `doc1#` part of the prefix that is common to all versions and then [delete the records by ID](/guides/manage-data/delete-data#delete-specific-records-by-id):

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='YOUR_API_KEY')

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  for ids in index.list(prefix='doc1#', namespace='example-namespace'):
      print(ids) # ['doc1#v1#chunk1', 'doc1#v1#chunk2', 'doc1#v1#chunk3', 'doc1#v2#chunk1', 'doc1#v2#chunk2', 'doc1#v2#chunk3']
      index.delete(ids=ids, namespace=namespace)
  ```

  ```js JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';
  const pc = new Pinecone();

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST").namespace("example-namespace");

  const results = await index.listPaginated({ prefix: 'doc1#' });
  console.log(results);

  // {
  //   vectors: [
  //     { id: 'doc1#v1#01' }, { id: 'doc1#v1#02' }, { id: 'doc1#v1#03' },
  //     { id: 'doc1#v2#01' }, { id: 'doc1#v2#02' }, { id: 'doc1#v2#03' }
  //   ],
  //   pagination: {
  //     next: 'eyJza2lwX3Bhc3QiOiJwcmVUZXN0LS04MCIsInByZWZpeCI6InByZVRlc3QifQ=='
  //   },
  //   namespace: 'example-namespace',
  //   usage: { readUnits: 1 }
  // }

  // Then, delete the records by ID:
  const vectorIds = results.vectors.map((vector) => vector.id);
  await index.deleteMany(vectorIds);
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import java.util.Arrays;
  import java.util.List;
  ...

  PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  config.setHost("INDEX_HOST");
  PineconeConnection connection = new PineconeConnection(config);
  Index index = new Index(connection, "INDEX_NAME");
  List<String> ids = Arrays.asList("doc1"); /* [id: "doc1#v1#chunk1", id: "doc1#v1#chunk2", id: "doc1#v2#chunk1" ... */

  /* Then, delete the records by ID:*/
  DeleteResponse deleteResponse = index.deleteByIds(ids, "example-namespace");
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

  	client, err := pinecone.NewClient(pinecone.NewClientParams{
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

  	recordPrefix := "doc1#"
  	var limit uint32 = 100

  	listResp, err := indexConn.ListVectors(context.Background(), &pinecone.ListVectorsRequest{
  		Prefix: &recordPrefix,
  		Limit:  &limit,
  	})
  	if err != nil {
  		panic(err)
  	}
  	fmt.Printf("List response: %+v\n", listResp)

  	for listResp.NextPaginationToken != nil {
  		vectorIdsToDelete := make([]string, len(listResp.VectorIds))
  		for i, vectorId := range listResp.VectorIds {
  			if vectorId != nil {
  				vectorIdsToDelete[i] = *vectorId
  			}
  		}
  		err = indexConn.DeleteVectorsById(context.Background(), vectorIdsToDelete)
  		if err != nil {
  			panic(err)
  		}
  		fmt.Printf("Deleted %d vectors\n", len(vectorIdsToDelete))

  		listResp, err = indexConn.ListVectors(context.Background(), &pinecone.ListVectorsRequest{
  			Prefix:          &recordPrefix,
  			Limit:           &limit,
  			PaginationToken: listResp.NextPaginationToken,
  		})
  		if err != nil {
  			panic(err)
  		}
  	}
  }
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/list?namespace=example-namespace&prefix=doc1%23" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"

  # Response:
  # {
  #   "vectors": [
  #     { "id": "doc1#v1#chunk1" },
  #     { "id": "doc1#v1#chunk2" },
  #     { "id": "doc1#v1#chunk3" },
  #     { "id": "doc1#v1#chunk4" },
  #   ...
  #     { "id": "doc1#v2#chunk1" },
  #     { "id": "doc1#v2#chunk2" },
  #     { "id": "doc1#v2#chunk3" },
  #     { "id": "doc1#v2#chunk4" },
  #   ...
  #   ],
  #   "pagination": {
  #     "next": "c2Vjb25kY2FsbA=="
  #   },
  #   "namespace": "example-namespace",
  #   "usage": {
  #     "readUnits": 1
  #   }
  # }

  # Then, delete the records by ID:

  curl "https://$INDEX_HOST/vectors/delete" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H 'Content-Type: application/json' \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "ids": [
        "doc1#v1#chunk1", 
        "doc1#v1#chunk2", 
        "doc1#v1#chunk3", 
        "doc1#v1#chunk4",
        ...
        "doc1#v2#chunk1", 
        "doc1#v2#chunk2", 
        "doc1#v2#chunk3", 
        "doc1#v2#chunk4",
      ],
      "namespace": "example-namespace"
    }
  '
  ```
</CodeGroup>

{/* ## RAG using pod-based indexes

  The `list` endpoint does not support pod-based indexes. Instead of using ID prefixes to reference parent documents, [use a metadata key-value pair](/guides/index-data/upsert-data#upsert-with-metadata-filters). If you later need to delete the records, you can [pass a metadata filter expression to the `delete` endpoint](/guides/manage-data/delete-data#delete-specific-records-by-metadata). */}
