# Check data freshness

Pinecone is eventually consistent, so there can be a slight delay before new or changed records are visible to queries. This page describes two ways of checking the data freshness of a Pinecone index:

* To check if a serverless index queries reflect recent writes to the index, [check the log sequence number](#check-the-log-sequence-number).

* To check whether an index contains recently inserted or deleted vectors, [verify the number of vectors in the index](#verify-vector-counts).

## Check the log sequence number

<Note>
  This method is only available for serverless indexes through the [Database API](https://docs.pinecone.io/reference/api/2024-10/data-plane/upsert).
</Note>

### Log sequence numbers

When you make a write request to a serverless index namespace, Pinecone assigns a monotonically increasing log sequence number (LSN) to the write operation. The LSN reflects upserts as well as updates and deletes to that namespace. Writes to one namespace do not increase the LSN for other namespaces.

You can use LSNs to verify that specific write operations are reflected in your query responses. If the LSN contained in the query response header is greater than or equal to the LSN of the relevant write operation, then that operation is reflected in the query response. If the LSN contained in the query response header is *greater than* the LSN of the relevant write operation, then subsequent operations are also reflected in the query response.

Follow the steps below to compare the LSNs for a write and a subsequent query.

### 1. Get the LSN for a write operation

Every time you modify records in your namespace, the HTTP response contains the LSN for the upsert. This is contained in a header called `x-pinecone-request-lsn`.

The following example demonstrates how to get the LSN for an `upsert` request using the `curl` option `-i`. This option tells curl to include headers in the displayed response. Use the same method to get the LSN for an `update` or `delete` request.

```shell curl
PINECONE_API_KEY="YOUR_API_KEY"
INDEX_HOST="INDEX_HOST"

curl -i "https://$INDEX_HOST/vectors/upsert" \
  -H "Api-Key: $PINECONE_API_KEY" \
  -H "content-type: application/json" \
  -H "X-Pinecone-API-Version: 2025-04" \
  -d '{
        "vectors": [
          {
            "id": "vec1",
            "values": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
          }
        ],
        "namespace": "example-namespace"
      }'
```

The preceding request receives a response like the following example:

```shell curl
HTTP/2 200 
date: Wed, 21 Aug 2024 15:23:04 GMT
content-type: application/json
content-length: 66
x-pinecone-max-indexed-lsn: 4
x-pinecone-request-latency-ms: 1149
x-pinecone-request-id: 3687967458925971419
x-envoy-upstream-service-time: 1150
grpc-status: 0
server: envoy

{"upsertedCount":1}
```

In the preceding example response, the value of `x-pinecone-max-indexed-lsn` is 4. This means that the index has performed 4 write operations since its creation.

### 2. Get the LSN for a query

Every time you query your index, the HTTP response contains the LSN for the query. This is contained in a header called `x-pinecone-max-indexed-lsn`.

By checking the LSN in your query results, you can confirm that the LSN is greater than or equal to the LSN of the relevant write operation, indicating that the results of that operation are present in the query results.

The following example makes a `query` request to the index:

```shell
PINECONE_API_KEY="YOUR_API_KEY"
INDEX_HOST="INDEX_HOST"

curl -i "https://$INDEX_HOST/query" \
  -H "Api-Key: $PINECONE_API_KEY" \
  -H 'Content-Type: application/json' \
  -H "X-Pinecone-API-Version: 2025-04" \
  -d '{
    "vector": [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    "namespace": "example-namespace",
    "topK": 3,
    "includeValues": true
  }'
```

The preceding request receives a response like the following example:

```shell
HTTP/2 200 
date: Wed, 21 Aug 2024 15:33:36 GMT
content-type: application/json
content-length: 66
x-pinecone-max-indexed-lsn: 5
x-pinecone-request-latency-ms: 40
x-pinecone-request-id: 6683088825552978933
x-envoy-upstream-service-time: 41
grpc-status: 0
server: envoy

{
  "results":[],
  "matches":[
    {
      "id":"vec1",
      "score":0.891132772,
      "values":[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8],
    }
  ],
  "namespace":"example-namespace",
  "usage":{"readUnits":6}
}
```

In the preceding example response, the value of `x-pinecone-max-indexed-lsn` is 5.

### 3. Compare LSNs for writes and queries

If the LSN of a query is greater than or equal to the LSN for a write operation, then the results of the query reflect the results of the write operation.

In [step 1](#1-get-the-lsn-for-a-write-operation), the LSN contained in the response headers is 4.

In [step 2](#2-get-the-lsn-for-a-query), the LSN contained in the response headers is 5.

5 is greater than or equal to 4; therefore, the results of the query reflect the results of the upsert. However, this does not guarantee that the records upserted are still present or unmodified: the write operation with LSN of 5 may have updated or deleted these records, or upserted additional records.

## Verify record counts

If you insert new records or delete records, the number of records in the index may change. This means that the record count for an index can indicate whether Pinecone has indexed your latest inserts and deletes: if the record count for the index matches the count you expect after inserting or deleting records, the index is probably up-to-date. However, this is not always true. For example, if you delete the same number of records that you insert, the expected record count may remain the same. Also, some write operations, such as updates to an index configuration or vector data values, do not change the number of records in the index.

To verify that your index contains the number of records you expect, [view index stats](/reference/api/2024-10/data-plane/describeindexstats):

<CodeGroup>
  ```python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.describe_index_stats()
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  const stats = await index.describeIndexStats();
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.DescribeIndexStatsResponse;

  public class DescribeIndexStatsExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          DescribeIndexStatsResponse indexStatsResponse = index.describeIndexStats();
          System.out.println(indexStatsResponse);
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
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      stats, err := idxConnection.DescribeIndexStats(ctx)
      if err != nil {
          log.Fatalf("Failed to describe index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("%+v", *stats)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var indexStatsResponse = await index.DescribeIndexStatsAsync(new DescribeIndexStatsRequest());

  Console.WriteLine(indexStatsResponse);
  ```

  ```shell curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X POST "https://$INDEX_HOST/describe_index_stats" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

The response will look like this:

<CodeGroup>
  ```Python Python
  {'dimension': 1024,
   'index_fullness': 8e-05,
   'namespaces': {'example-namespace1': {'vector_count': 4}, 'example-namespace2': {'vector_count': 4}},
   'total_vector_count': 8}
  ```

  ```JavaScript JavaScript
  Returns:
  {
    namespaces: { example-namespace1: { recordCount: 4 }, example-namespace2: { recordCount: 4 } },
    dimension: 1024,
    indexFullness: 0.00008,
    totalRecordCount: 8
  }

  // Note: the value of totalRecordCount is the same as total_vector_count.
  ```

  ```java Java
  namespaces {
    key: "example-namespace1"
    value {
      vector_count: 4
    }
  }
  namespaces {
    key: "example-namespace2"
    value {
      vector_count: 4
    }
  }
  dimension: 1024
  total_vector_count: 8
  ```

  ```go Go
  {
    "dimension": 1024,
    "index_fullness": 0,
    "total_vector_count": 8,
    "namespaces": {
      "example-namespace1": {
        "vector_count": 4
      },
      "example-namespace2": {
        "vector_count": 4
      }
    }
  }
  ```

  ```csharp C#
  {
    "namespaces": {
      "example-namespace1": {
        "vectorCount": 4
      },
      "example-namespace2": {
        "vectorCount": 4
      }
    },
    "dimension": 1024,
    "indexFullness": 0,
    "totalVectorCount": 8
  }
  ```

  ```shell curl
  {
    "namespaces": {
      "example-namespace1": {
        "vectorCount": 4
      },
      "example-namespace2": {
        "vectorCount": 4
      }
    },
    "dimension": 1024,
    "indexFullness": 0.00008,
    "totalVectorCount": 8
  }
  ```
</CodeGroup>
