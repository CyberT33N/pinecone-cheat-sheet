# List record IDs

This page shows you how to use the [`list`](/reference/api/2024-10/data-plane/list) endpoint to list the IDs of records in an index [namespace](/guides/index-data/indexing-overview#namespaces). You can list the IDs of all records in a namespace or just the records with a common ID prefix.

Using `list` to get record IDs and not the associated data is a cheap and fast way to check [upserts](/guides/index-data/upsert-data).

<Note>
  The `list` endpoint is supported only for [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes).
</Note>

## List the IDs of all records in a namespace

To list the IDs of all records in the namespace of a serverless index, pass only the `namespace` parameter:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='YOUR_API_KEY')

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  for ids in index.list(namespace='example-namespace'):
      print(ids)

  # Response:
  # ['doc1#chunk1', 'doc1#chunk2', 'doc1#chunk3']
  ```

  ```js JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';
  const pc = new Pinecone();

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST").namespace("example-namespace");

  const results = await index.listPaginated();
  console.log(results);
  // {
  //   vectors: [
  //     { id: 'doc1#01' }, { id: 'doc1#02' }, { id: 'doc1#03' },
  //     { id: 'doc1#04' }, { id: 'doc1#05' },  { id: 'doc1#06' },
  //     { id: 'doc1#07' }, { id: 'doc1#08' }, { id: 'doc1#09' },
  //     ...
  //   ],
  //   pagination: {
  //     next: 'eyJza2lwX3Bhc3QiOiJwcmVUZXN0LS04MCIsInByZWZpeCI6InByZVRlc3QifQ=='
  //   },
  //   namespace: 'example-namespace',
  //   usage: { readUnits: 1 }
  // }

  // Fetch the next page of results
  await index.listPaginated({ prefix: 'doc1#', paginationToken: results.pagination.next});
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.ListResponse;

  public class ListExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          // get the pagination token
          String paginationToken = index.list("example-namespace", 3).getPagination().getNext();
          // get vectors with limit 3 with the paginationToken obtained from the previous step
          ListResponse listResponse = index.list("example-namespace", 3, paginationToken);
      }
  }

  // Response:
  // vectors {
  //   id: "doc1#chunk1"
  // }
  // vectors {
  //   id: "doc1#chunk2"
  // }
  // vectors {
  //   id: "doc2#chunk1"
  // }
  // vectors {
  //   id: "doc3#chunk1"
  // }
  // pagination {
  //   next: "eyJza2lwX3Bhc3QiOiJhbHN0cm9lbWVyaWEtcGVydXZpYW4iLCJwcmVmaXgiOm51bGx9"
  // }
  // namespace: "example-namespace"
  // usage {
  //   read_units: 1
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      limit := uint32(3)

      res, err := idxConnection.ListVectors(ctx, &pinecone.ListVectorsRequest{
          Limit:  &limit,
      })
      if len(res.VectorIds) == 0 {
          fmt.Println("No vectors found")
  	} else {
  		fmt.Printf(prettifyStruct(res))
  	}
  }

  // Response:
  // {
  //   "vector_ids": [
  //     "doc1#chunk1",
  //     "doc1#chunk2",
  //     "doc1#chunk3"
  //   ],
  //   "usage": {
  //     "read_units": 1
  //   },
  //   "next_pagination_token": "eyJza2lwX3Bhc3QiOiIwMDBkMTc4OC0zMDAxLTQwZmMtYjZjNC0wOWI2N2I5N2JjNDUiLCJwcmVmaXgiOm51bGx9"
  // }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var listResponse = await index.ListAsync(new ListRequest {
      Namespace = "example-namespace",
  });

  Console.WriteLine(listResponse);

  // Response:
  // {
  //   "vectors": [
  //     {
  //       "id": "doc1#chunk1"
  //     },
  //     {
  //       "id": "doc1#chunk2"
  //     },
  //     {
  //       "id": "doc1#chunk3"
  //     }
  //   ],
  //   "pagination": "eyJza2lwX3Bhc3QiOiIwMDBkMTc4OC0zMDAxLTQwZmMtYjZjNC0wOWI2N2I5N2JjNDUiLCJwcmVmaXgiOm51bGx9",
  //   "namespace": "example-namespace",
  //   "usage": {
  //     "readUnits": 1
  //   }
  // }
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/list?namespace=example-namespace" \
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
  ```
</CodeGroup>

## List the IDs of records with a common prefix

ID prefixes enable you to query segments of content. Use the `list` endpoint to list all of the records with the common prefix. For more details, see [Use ID prefixes](/guides/manage-data/manage-document-chunks#use-id-prefixes).

## Paginate through results

The `list` endpoint returns up to 100 IDs per page at a time by default. If the `limit` parameter is passed, `list` returns up to that number of IDs per page instead. For example, if `limit=3`, up to 3 IDs be returned per page. Whenever there are additional IDs to return, the response also includes a `pagination_token` for fetching the next page of IDs.

### Implicit pagination

When using the Python SDK, `list` paginates automatically.

```python Python
from pinecone.grpc import PineconeGRPC as Pinecone

pc = Pinecone(api_key='YOUR_API_KEY')

# To get the unique host for an index, 
# see https://docs.pinecone.io/guides/manage-data/target-an-index
index = pc.Index(host="INDEX_HOST")

for ids in index.list(namespace='example-namespace'):
    print(ids)

# Response:
# ['doc1#chunk1', 'doc1#chunk2', 'doc1#chunk3']
# ['doc1#chunk4', 'doc1#chunk5', 'doc1#chunk6']
# ...
```

### Manual pagination

When using the Node.js SDK, Java SDK, Go SDK, .NET SDK, or REST API, you must manually fetch each page of results. You can also manually paginate with the Python SDK using `list_paginated()`.

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='YOUR_API_KEY')

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  namespace = 'example-namespace'

  # For manual control over pagination
  results = index.list_paginated(
      prefix='pref',
      limit=3,
      namespace='example-namespace'
  )
  print(results.namespace)
  print([v.id for v in results.vectors])
  print(results.pagination.next)
  print(results.usage)

  # Results:
  # ['10103-0', '10103-1', '10103-10']
  # eyJza2lwX3Bhc3QiOiIxMDEwMy0=
  # {'read_units': 1}
  ```

  ```js JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';
  const pc = new Pinecone();

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST").namespace("example-namespace");

  const results = await index.listPaginated({ prefix: 'doc1#', limit: 3 });
  console.log(results);

  // Response:
  // {
  //   vectors: [
  //     { id: 'doc1#01' }, { id: 'doc1#02' }, { id: 'doc1#03' }
  //   ],
  //   pagination: {
  //     next: 'eyJza2lwX3Bhc3QiOiJwcmVUZXN0LSCIsInByZWZpeCI6InByZVRlc3QifQ=='
  //   },
  //   namespace: 'example-namespace',
  //   usage: { readUnits: 1 }
  // }
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.ListResponse;

  public class ListExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          ListResponse listResponse = index.list("example-namespace", "doc1#" 2); /* Note: Currently, you must include an ID prefix to list vector IDs. */
          System.out.println(listResponse.getVectorsList());
          System.out.println(listResponse.getPagination());
      }
  }

  // Response:
  // vectors {
  //   id: "doc1#chunk1"
  // }
  // vectors {
  //   id: "doc1#chunk2"
  // }
  // pagination {
  //   next: "eyJza2lwX3Bhc3QiOiJhbHN0cm9lbWVyaWEtcGVydXZpYW4iLCJwcmVmaXgiOm51bGx9"
  // }
  // namespace: "example-namespace"
  // usage {
  //   read_units: 1
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      limit := uint32(3)

      res, err := idxConnection.ListVectors(ctx, &pinecone.ListVectorsRequest{
          Limit:  &limit,
      })
      if len(res.VectorIds) == 0 {
          fmt.Println("No vectors found")
      } else {
          fmt.Printf(prettifyStruct(res))
      }
  }

  // Response:
  // {
  //   "vector_ids": [
  //     "doc1#chunk1",
  //     "doc1#chunk2",
  //     "doc1#chunk3"
  //   ],
  //   "usage": {
  //     "read_units": 1
  //   },
  //   "next_pagination_token": "eyJza2lwX3Bhc3QiOiIwMDBkMTc4OC0zMDAxLTQwZmMtYjZjNC0wOWI2N2I5N2JjNDUiLCJwcmVmaXgiOm51bGx9"
  // }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var listResponse = await index.ListAsync(new ListRequest {
      Namespace = "example-namespace",
      Prefix = "document1#",
  });

  Console.WriteLine(listResponse);

  // Response:
  // {
  //   "vectors": [
  //     {
  //       "id": "doc1#chunk1"
  //     },
  //     {
  //       "id": "doc1#chunk2"
  //     },
  //     {
  //       "id": "doc1#chunk3"
  //     }
  //   ],
  //   "pagination": "eyJza2lwX3Bhc3QiOiIwMDBkMTc4OC0zMDAxLTQwZmMtYjZjNC0wOWI2N2I5N2JjNDUiLCJwcmVmaXgiOm51bGx9",
  //   "namespace": "example-namespace",
  //   "usage": {
  //     "readUnits": 1
  //   }
  // }
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/list?namespace=example-namespace" \
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
  ```
</CodeGroup>

Then, to get the next batch of IDs, use the returned `pagination_token`:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='YOUR_API_KEY')

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  namespace = 'example-namespace'

  results = index.list_paginated(
      prefix='pref',
      limit=3,
      namespace='example-namespace',
      pagination_token='eyJza2lwX3Bhc3QiOiIxMDEwMy0='
  )
  print(results.namespace)
  print([v.id for v in results.vectors])
  print(results.pagination.next)
  print(results.usage)

  # Response:
  # ['10103-0', '10103-1', '10103-10']
  # xndlsInByZWZpeCI6IjEwMTAzIn0==
  # {'read_units': 1}
  ```

  ```js JavaScript
  await index.listPaginated({ prefix: 'doc1#', limit: 3, paginationToken: results.pagination.next});

  // Response:
  // {
  //   vectors: [
  //     { id: 'doc1#10' }, { id: 'doc1#11' }, { id: 'doc1#12' }
  //   ],
  //   pagination: {
  //     next: 'dfajlkjfdsoijeowjoDJFKLJldLIFf34KFNLDSndaklqoLQJORN45afdlkJ=='
  //   },
  //   namespace: 'example-namespace',
  //   usage: { readUnits: 1 }
  // }
  ```

  ```java Java
  listResponse = index.list("example-namespace", "doc1#", "eyJza2lwX3Bhc3QiOiJ2MTg4IiwicHJlZml4IjpudWxsfQ==");
  System.out.println(listResponse.getVectorsList());

  // Response:
  // vectors {
  //   id: "doc1#chunk3"
  // }
  // vectors {
  //   id: "doc1#chunk4"
  // }
  // vectors {
  //   id: "doc1#chunk5"
  // }
  // vectors {
  //   id: "doc1#chunk6"
  // }
  // vectors {
  //   id: "doc1#chunk7"
  // }
  // vectors {
  //   id: "doc1#chunk8"
  // }
  // pagination {
  //   next: "eyJza2lwX3Bhc3QiOiJhbHN0cm9lbWVyaWEtcGVydXZpYW4iLCJwcmVmaXgiOm51bGx9"
  // }
  // namespace: "example-namespace"
  // usage {
  //   read_units: 1
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      limit := uint32(3)
      paginationToken := "dfajlkjfdsoijeowjoDJFKLJldLIFf34KFNLDSndaklqoLQJORN45afdlkJ=="

      res, err := idxConnection.ListVectors(ctx, &pinecone.ListVectorsRequest{
          Limit:  &limit,
          PaginationToken: &paginationToken,
      })
      if len(res.VectorIds) == 0 {
          fmt.Println("No vectors found")
  	} else {
  	    fmt.Printf(prettifyStruct(res))
  	}
  }

  // Response:
  // {
  //   "vector_ids": [
  //     "doc1#chunk4",
  //     "doc1#chunk5",
  //     "doc1#chunk6"
  //   ],
  //   "usage": {
  //     "read_units": 1
  //   },
  //   "next_pagination_token": "eyJza2lwX3Bhc3QiOiIwMDBkMTc4OC0zMDAxLTQwZmMtYjZjNC0wOWI2N2I5N2JjNDUiLCJwcmVmaXgiOm51bGx9"
  // }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var listResponse = await index.ListAsync(new ListRequest {
      Namespace = "example-namespace",
      Prefix = "document1#",
      PaginationToken= "eyJza2lwX3Bhc3QiOiIwMDBkMTc4OC0zMDAxLTQwZmMtYjZjNC0wOWI2N2I5N2JjNDUiLCJwcmVmaXgiOm51bGx9",
  });

  Console.WriteLine(listResponse);

  // Response:
  // {
  //   "vectors": [
  //     {
  //       "id": "doc1#chunk4"
  //     },
  //     {
  //       "id": "doc1#chunk5"
  //     },
  //     {
  //       "id": "doc1#chunk6"
  //     }
  //   ],
  //   "pagination": "dfajlkjfdsoijeowjoDJFKLJldLIFf34KFNLDSndaklqoLQJORN45afdlkJ==",
  //   "namespace": "example-namespace",
  //   "usage": {
  //     "readUnits": 1
  //   }
  // }
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/list?namespace=example-namespace&paginationToken=c2Vjb25kY2FsbA%3D%3D" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"

  # Response:
  # {
  #   "vectors": [
  #     { "id": "doc2#chunk1" },
  #     { "id": "doc2#chunk1" },
  #     { "id": "doc2#chunk1" },
  #     { "id": "doc2#chunk1" },
  #    ...
  #   ],
  #   "pagination": {
  #     "next": "mn23b4jB3Y9jpsS1"
  #   },
  #   "namespace": "example-namespace",
  #   "usage": {
  #     "readUnits": 1
  #   }
  # }
  ```
</CodeGroup>

When there are no more IDs to return, the response does not includes a `pagination_token`:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key='YOUR_API_KEY')

  index = pc.Index(host="INDEX_HOST")

  namespace = 'example-namespace'

  results = index.list_paginated(
      prefix='10103',
      limit=3,
      pagination_token='xndlsInByZWZpeCI6IjEwMTAzIn0=='
  )

  print(results.namespace)
  print([v.id for v in results.vectors])
  print(results.pagination.next)
  print(results.usage)

  # Response:
  # ['10103-4', '10103-5', '10103-6']
  # {'read_units': 1}
  ```

  ```js JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';
  const pc = new Pinecone();

  const index = pc.index("INDEX_NAME", "INDEX_HOST").namespace("example-namespace");

  const results = await index.listPaginated({ prefix: 'doc1#' });
  console.log(results);

  // Response:
  // {
  //   vectors: [
  //     { id: 'doc1#19' }, { id: 'doc1#20' }, { id: 'doc1#21' }
  //   ],
  //   namespace: 'example-namespace',
  //   usage: { readUnits: 1 }
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

      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST", Namespace: "example-namespace"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      limit := uint32(3)
      paginationToken := "eyJza2lwX3Bhc3QiOiIwMDBkMTc4OC0zMDAxLTQwZmMtYjZjNC0wOWI2N2I5N2JjNDUiLCJwcmVmaXgiOm51bGx9"

      res, err := idxConnection.ListVectors(ctx, &pinecone.ListVectorsRequest{
          Limit:  &limit,
          paginationToken: &paginationToken,
      })
      if len(res.VectorIds) == 0 {
          fmt.Println("No vectors found")
    	} else {
  	    fmt.Printf(prettifyStruct(res))
  	}
  }

  // Response:
  // {
  //   "vector_ids": [
  //     "doc1#chunk7",
  //     "doc1#chunk8",
  //     "doc1#chunk9"
  //   ],
  //   "usage": {
  //     "read_units": 1
  //   }
  // }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var index = pinecone.Index(host: "INDEX_HOST");

  var listResponse = await index.ListAsync(new ListRequest {
      Namespace = "example-namespace",
      Prefix = "document1#",
      PaginationToken= "dfajlkjfdsoijeowjoDJFKLJldLIFf34KFNLDSndaklqoLQJORN45afdlkJ==",
  });

  Console.WriteLine(listResponse);

  // Response:
  // {
  //   "vectors": [
  //     {
  //       "id": "doc1#chunk7"
  //     },
  //     {
  //       "id": "doc1#chunk8"
  //     },
  //     {
  //       "id": "doc1#chunk9"
  //     }
  //   ],
  //   "pagination": null,
  //   "namespace": "example-namespace",
  //   "usage": {
  //     "readUnits": 1
  //   }
  // }
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/vectors/list?namespace=example-namespace&paginationToken=mn23b4jB3Y9jpsS1" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  # Response:
  # {
  #   "vectors": [
  #     { "id": "doc3#chunk1" },
  #     { "id": "doc5#chunk2" },
  #     { "id": "doc5#chunk3" },
  #     { "id": "doc5#chunk4" },
  #    ...
  #   ],
  #   "namespace": "example-namespace",
  #   "usage": {
  #     "readUnits": 1
  #   }
  # }
  ```
</CodeGroup>
