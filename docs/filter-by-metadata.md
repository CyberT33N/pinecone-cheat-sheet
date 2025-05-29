# Filter by metadata

export const word_0 = "vectors"

Every [record](/guides/get-started/glossary#record) in an index must contain an ID and a dense or sparse vector. In addition, you can include [metadata key-value pairs](/guides/index-data/indexing-overview#metadata) to store related information or context. When you search the index, you can then include a metadata filter to limit the search to records matching the filter expression.

## Search with a metadata filter

The following code searches for the 3 records that are most semantically similar to a query and that have a `category` metadata field with the value `digestive system`.

<Tabs>
  <Tab title="Search with text">
    <Note>
      Searching with text is supported only for [indexes with integrated embedding](/guides/index-data/indexing-overview#integrated-embedding).
    </Note>

    <CodeGroup>
      ```python Python
      from pinecone import Pinecone

      pc = Pinecone(api_key="YOUR_API_KEY")

      # To get the unique host for an index, 
      # see https://docs.pinecone.io/guides/manage-data/target-an-index
      index = pc.Index(host="INDEX_HOST")

      filtered_results = index.search(
          namespace="example-namespace", 
          query={
              "inputs": {"text": "Disease prevention"}, 
              "top_k": 3,
              "filter": {"category": "digestive system"},
          },
          fields=["category", "chunk_text"]
      )

      print(filtered_results)
      ```

      ```javascript JavaScript
      import { Pinecone } from '@pinecone-database/pinecone'

      const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      const namespace = pc.index("INDEX_NAME", "INDEX_HOST").namespace("example-namespace");

      const response = await namespace.searchRecords({
        query: {
          topK: 3,
          inputs: { text: "Disease prevention" },
          filter: { category: "digestive system" }
        },
        fields: ['chunk_text', 'category']
      });

      console.log(response);
      ```

      ```java Java
      import io.pinecone.clients.Index;
      import io.pinecone.configs.PineconeConfig;
      import io.pinecone.configs.PineconeConnection;
      import org.openapitools.db_data.client.ApiException;
      import org.openapitools.db_data.client.model.SearchRecordsResponse;

      import java.util.*;

      public class SearchText {
          public static void main(String[] args) throws ApiException {
              PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
              // To get the unique host for an index, 
              // see https://docs.pinecone.io/guides/manage-data/target-an-index
              config.setHost("INDEX_HOST");
              PineconeConnection connection = new PineconeConnection(config);

              Index index = new Index(config, connection, "integrated-dense-java");

              String query = "Disease prevention";
              List<String> fields = new ArrayList<>();
              fields.add("category");
              fields.add("chunk_text");

              Map<String, Object> filter = new HashMap<>();
              filter.put("category", "digestive system");

              // Search the dense index
              SearchRecordsResponse recordsResponse = index.searchRecordsByText(query,  "example-namespace", fields, 3, filter, null);

              // Print the results
              System.out.println(recordsResponse);
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

          metadataMap := map[string]interface{}{
              "category": map[string]interface{}{
                  "$eq": "digestive system",
              },
          }
          res, err := idxConnection.SearchRecords(ctx, &pinecone.SearchRecordsRequest{
              Query: pinecone.SearchRecordsQuery{
                  TopK: 3,
                  Inputs: &map[string]interface{}{
                      "text": "Disease prevention",
                  },
                  Filter: &metadataMap,
              },
              Fields: &[]string{"chunk_text", "category"},
          })
          if err != nil {
              log.Fatalf("Failed to search records: %v", err)
          }
          fmt.Printf(prettifyStruct(res))
      }
      ```

      ```csharp C#
      using Pinecone;

      var pinecone = new PineconeClient("YOUR_API_KEY");

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      var index = pinecone.Index(host: "INDEX_HOST");

      var response = await index.SearchRecordsAsync(
          "example-namespace",
          new SearchRecordsRequest
          {
              Query = new SearchRecordsRequestQuery
              {
                  TopK = 4,
                  Inputs = new Dictionary<string, object?> { { "text", "Disease prevention" } },
                  Filter = new Dictionary<string, object?>
                  {
                      ["category"] = new Dictionary<string, object?>
                      {
                          ["$eq"] = "digestive system"
                      }
                  }
              },
              Fields = ["category", "chunk_text"],
          }
      );

      Console.WriteLine(response);
      ```

      ```shell curl
      INDEX_HOST="INDEX_HOST"
      NAMESPACE="YOUR_NAMESPACE"
      PINECONE_API_KEY="YOUR_API_KEY"

      curl "https://$INDEX_HOST/records/namespaces/$NAMESPACE/search" \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -H "Api-Key: $PINECONE_API_KEY" \
        -H "X-Pinecone-API-Version: unstable" \
        -d '{
              "query": {
                  "inputs": {"text": "Disease prevention"},
                  "top_k": 3,
                  "filter": {"category": "digestive system"}
              },
              "fields": ["category", "chunk_text"]
           }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Search with a vector">
    <CodeGroup>
      ```Python Python
      from pinecone.grpc import PineconeGRPC as Pinecone

      pc = Pinecone(api_key="YOUR_API_KEY")

      # To get the unique host for an index, 
      # see https://docs.pinecone.io/guides/manage-data/target-an-index
      index = pc.Index(host="INDEX_HOST")

      index.query(
          namespace="example-namespace",
          vector=[0.0236663818359375,-0.032989501953125, ..., -0.01041412353515625,0.0086669921875], 
          top_k=3,
          filter={
              "category": {"$eq": "digestive system"}
          },
          include_metadata=True,
          include_values=False
      )
      ```

      ```JavaScript JavaScript
      import { Pinecone } from '@pinecone-database/pinecone'

      const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      const index = pc.index("INDEX_NAME", "INDEX_HOST")

      const queryResponse = await index.namespace('example-namespace').query({
          vector: [0.0236663818359375,-0.032989501953125,...,-0.01041412353515625,0.0086669921875],
          topK: 3,
          filter: {
              "category": { "$eq": "digestive system" }
          }
          includeValues: false,
          includeMetadata: true,
      });
      ```

      ```java Java
      import com.google.protobuf.Struct;
      import com.google.protobuf.Value;
      import io.pinecone.clients.Index;
      import io.pinecone.configs.PineconeConfig;
      import io.pinecone.configs.PineconeConnection;
      import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;

      import java.util.Arrays;
      import java.util.List;

      public class QueryExample {
          public static void main(String[] args) {
              PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
              // To get the unique host for an index, 
              // see https://docs.pinecone.io/guides/manage-data/target-an-index
              config.setHost("INDEX_HOST");
              PineconeConnection connection = new PineconeConnection(config);
              Index index = new Index(connection, "INDEX_NAME");
              List<Float> query = Arrays.asList(0.0236663818359375f, -0.032989501953125f, ..., -0.01041412353515625f, 0.0086669921875f);
              Struct filter = Struct.newBuilder()
                      .putFields("category", Value.newBuilder()
                              .setStructValue(Struct.newBuilder()
                                      .putFields("$eq", Value.newBuilder()
                                              .setStringValue("digestive system")
                                              .build()))
                              .build())
                      .build();

              QueryResponseWithUnsignedIndices queryResponse = index.query(1, query, null, null, null, "example-namespace", filter, false, true);
              System.out.println(queryResponse);
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

          queryVector := []float32{0.0236663818359375,-0.032989501953125,...,-0.01041412353515625,0.0086669921875}

          metadataMap := map[string]interface{}{
              "category": map[string]interface{}{
                  "$eq": "digestive system",
              }
          }

          metadataFilter, err := structpb.NewStruct(metadataMap)
          if err != nil {
              log.Fatalf("Failed to create metadata map: %v", err)
          }

          res, err := idxConnection.QueryByVectorValues(ctx, &pinecone.QueryByVectorValuesRequest{
              Vector:          queryVector,
              TopK:            3,
              MetadataFilter: metadataFilter,
              IncludeValues:   false,
              includeMetadata: true,
          })
          if err != nil {
              log.Fatalf("Error encountered when querying by vector: %v", err)
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

      var queryResponse = await index.QueryAsync(new QueryRequest {
          Vector = new[] { 0.0236663818359375f ,-0.032989501953125f, ..., -0.01041412353515625f, 0.0086669921875f },
          Namespace = "example-namespace",
          TopK = 3,
          Filter = new Metadata
          {
              ["category"] =
                  new Metadata
                  {
                      ["$eq"] = "digestive system",
                  }
          },
          IncludeMetadata = true,
      });

      Console.WriteLine(queryResponse);
      ```

      ```bash curl
      # To get the unique host for an index,
      # see https://docs.pinecone.io/guides/manage-data/target-an-index
      PINECONE_API_KEY="YOUR_API_KEY"
      INDEX_HOST="INDEX_HOST"

      curl "https://$INDEX_HOST/query" \
        -H "Api-Key: $PINECONE_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "X-Pinecone-API-Version: 2025-04" \
        -d '{
              "vector": [0.0236663818359375,-0.032989501953125,...,-0.01041412353515625,0.0086669921875],
              "namespace": "example-namespace",
              "topK": 3,
              "filter": {"category": {"$eq": "digestive system"}},
              "includeMetadata": true,
              "includeValues": false
          }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

## Metadata filter expressions

Pinecone's filtering query language is based on [MongoDB's query and projection operators](https://docs.mongodb.com/manual/reference/operator/query/). Pinecone currently supports a subset of those selectors:

| Filter    | Description                                                                                                                        | Supported types         |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `$eq`     | Matches {word_0} with metadata values that are equal to a specified value. Example: `{"genre": {"$eq": "documentary"}}`            | Number, string, boolean |
| `$ne`     | Matches {word_0} with metadata values that are not equal to a specified value. Example: `{"genre": {"$ne": "drama"}}`              | Number, string, boolean |
| `$gt`     | Matches {word_0} with metadata values that are greater than a specified value. Example: `{"year": {"$gt": 2019}}`                  | Number                  |
| `$gte`    | Matches {word_0} with metadata values that are greater than or equal to a specified value. Example:`{"year": {"$gte": 2020}}`      | Number                  |
| `$lt`     | Matches {word_0} with metadata values that are less than a specified value. Example: `{"year": {"$lt": 2020}}`                     | Number                  |
| `$lte`    | Matches {word_0} with metadata values that are less than or equal to a specified value. Example: `{"year": {"$lte": 2020}}`        | Number                  |
| `$in`     | Matches {word_0} with metadata values that are in a specified array. Example: `{"genre": {"$in": ["comedy", "documentary"]}}`      | String, number          |
| `$nin`    | Matches {word_0} with metadata values that are not in a specified array. Example: `{"genre": {"$nin": ["comedy", "documentary"]}}` | String, number          |
| `$exists` | Matches {word_0} with the specified metadata field. Example: `{"genre": {"$exists": true}}`                                        | Number, string, boolean |
| `$and`    | Joins query clauses with a logical `AND`. Example: `{"$and": [{"genre": {"$eq": "drama"}}, {"year": {"$gte": 2020}}]}`             | -                       |
| `$or`     | Joins query clauses with a logical `OR`. Example: `{"$or": [{"genre": {"$eq": "drama"}}, {"year": {"$gte": 2020}}]}`               | -                       |

For example, the following has a `"genre"` metadata field with a list of strings:

```JSON JSON
{ "genre": ["comedy", "documentary"] }
```

This means `"genre"` takes on both values, and requests with the following filters will match:

```JSON JSON
{"genre":"comedy"}

{"genre": {"$in":["documentary","action"]}}

{"$and": [{"genre": "comedy"}, {"genre":"documentary"}]}
```

However, requests with the following filter will **not** match:

```JSON JSON
{ "$and": [{ "genre": "comedy" }, { "genre": "drama" }] }
```

Additionally, requests with the following filters will **not** match because they are invalid. They will result in a compilation error:

```
# INVALID QUERY:
{"genre": ["comedy", "documentary"]}
```

```
# INVALID QUERY:
{"genre": {"$eq": ["comedy", "documentary"]}}
```
