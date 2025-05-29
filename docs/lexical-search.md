# Lexical search

This page shows you how to search a [sparse index](/guides/index-data/indexing-overview#sparse-indexes) for records that most exactly match the words or phrases in a query. This is often called lexical search or keyword search.

Lexical search uses [sparse vectors](https://www.pinecone.io/learn/sparse-retrieval/), which have a very large number of dimensions, where only a small proportion of values are non-zero. The dimensions represent words from a dictionary, and the values represent the importance of these words in the document. Words are scored independently and then summed, with the most similar records scored highest.

<Note>
  This feature is in [public preview](/release-notes/feature-availability).
</Note>

## Search with text

<Note>
  Searching with text is supported only for [indexes with integrated embedding](/guides/index-data/indexing-overview#integrated-embedding).
</Note>

To search a sparse index with a query text, use the [`search_records`](/reference/api/2025-01/data-plane/search_records) operation with the following parameters:

* The `namespace` to query. To use the default namespace, set the namespace to `"__default__"`.
* The `query.inputs.text` parameter with the query text. Pinecone uses the embedding model integrated with the index to convert the text to a sparse vector automatically.
* The `query.top_k` parameter with the number of similar records to return.
* Optionally, you can specify the `fields` to return in the response. If not specified, the response will include all fields.

For example, the following code converts the query “What is AAPL's outlook, considering both product launches and market conditions?” to a sparse vector and then searches for the 3 most similar vectors in the `example-namespaces` namespace:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  results = index.search(
      namespace="example-namespace", 
      query={
          "inputs": {"text": "What is AAPL's outlook, considering both product launches and market conditions?"}, 
          "top_k": 3
      },
      fields=["chunk_text", "quarter"]
  )

  print(results)
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
      inputs: { text: "What is AAPL's outlook, considering both product launches and market conditions?" },
    },
    fields: ['chunk_text', 'quarter']
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

          Index index = new Index(config, connection, "integrated-sparse-java");

          String query = "What is AAPL's outlook, considering both product launches and market conditions?";
          List<String> fields = new ArrayList<>();
          fields.add("category");
          fields.add("chunk_text");

          // Search the sparse index
          SearchRecordsResponse recordsResponse = index.searchRecordsByText(query,  "example-namespace", fields, 3, null, null);

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

      res, err := idxConnection.SearchRecords(ctx, &pinecone.SearchRecordsRequest{
          Query: pinecone.SearchRecordsQuery{
              TopK: 3,
              Inputs: &map[string]interface{}{
                  "text": "What is AAPL's outlook, considering both product launches and market conditions?",
              },
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
              TopK = 3,
              Inputs = new Dictionary<string, object?> { { "text", "What is AAPL's outlook, considering both product launches and market conditions?" } },
          },
          Fields = ["category", "chunk_text"],
      }
  );

  Console.WriteLine(response);
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl "https://$INDEX_HOST/records/namespaces/example-namespace/search" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
          "query": {
            "inputs": { "text": "What is AAPL'\''s outlook, considering both product launches and market conditions?" },
            "top_k": 3
          },
          "fields": ["chunk_text", "quarter"]
      }'
  ```
</CodeGroup>

The results will look as follows. The most similar records are scored highest.

<CodeGroup>
  ```python Python
  {'result': {'hits': [{'_id': 'vec2',
                        '_score': 10.77734375,
                        'fields': {'chunk_text': "Analysts suggest that AAPL'''s "
                                                 'upcoming Q4 product launch '
                                                 'event might solidify its '
                                                 'position in the premium '
                                                 'smartphone market.',
                                   'quarter': 'Q4'}},
                       {'_id': 'vec3',
                        '_score': 6.49066162109375,
                        'fields': {'chunk_text': "AAPL'''s strategic Q3 "
                                                 'partnerships with '
                                                 'semiconductor suppliers could '
                                                 'mitigate component risks and '
                                                 'stabilize iPhone production.',
                                   'quarter': 'Q3'}},
                       {'_id': 'vec1',
                        '_score': 5.3671875,
                        'fields': {'chunk_text': 'AAPL reported a year-over-year '
                                                 'revenue increase, expecting '
                                                 'stronger Q3 demand for its '
                                                 'flagship phones.',
                                   'quarter': 'Q3'}}]},
   'usage': {'embed_total_tokens': 18, 'read_units': 1}}
  ```

  ```javascript JavaScript
  {
    result: { 
      hits: [ 
        {
          _id: "vec2",
          _score: 10.82421875,
          fields: {
            chunk_text: "Analysts suggest that AAPL'''s upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
            quarter: "Q4"
          }
        },
        {
          _id: "vec3",
          _score: 6.49066162109375,
          fields: {
            chunk_text: "AAPL'''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production.",
            quarter: "Q3"
          }
        },
        {
          _id: "vec1",
          _score: 5.3671875,
          fields: {
            chunk_text: "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.",
            quarter: "Q3"
          }
        }
      ]
    },
    usage: { 
      readUnits: 1, 
      embedTotalTokens: 18 
    }
  }
  ```

  ```java Java
  class SearchRecordsResponse {
      result: class SearchRecordsResponseResult {
          hits: [class Hit {
              id: vec2
              score: 10.82421875
              fields: {chunk_text=Analysts suggest that AAPL's upcoming Q4 product launch event might solidify its position in the premium smartphone market., quarter=Q4}
              additionalProperties: null
          }, class Hit {
              id: vec3
              score: 6.49066162109375
              fields: {chunk_text=AAAPL'''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production., quarter=Q3}
              additionalProperties: null
          }, class Hit {
              id: vec1
              score: 5.3671875
              fields: {chunk_text=AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones., quarter=Q3}
              additionalProperties: null
          }]
          additionalProperties: null
      }
      usage: class SearchUsage {
          readUnits: 1
          embedTotalTokens: 18
      }
      additionalProperties: null
  }
  ```

  ```go Go
  {
    "result": {
      "hits": [
        {
          "_id": "vec2",
          "_score": 10.833984,
          "fields": {
            "chunk_text": "Analysts suggest that AAPL's upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
            "quarter": "Q4"
          }
        },
        {
          "_id": "vec3",
          "_score": 6.473572,
          "fields": {
            "chunk_text": "AAPL's strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production.",
            "quarter": "Q3"
          }
        },
        {
          "_id": "vec1",
          "_score": 5.3710938,
          "fields": {
            "chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.",
            "quarter": "Q3"
          }
        }
      ]
    },
    "usage": {
      "read_units": 6,
      "embed_total_tokens": 18
    }
  }
  ```

  ```csharp C#
  {
      "result": {
          "hits": [
              {
                  "_id": "vec2",
                  "_score": 10.833984,
                  "fields": {
                      "chunk_text": "Analysts suggest that AAPL's upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
                      "quarter": "Q4"
                  }
              },
              {
                  "_id": "vec3",
                  "_score": 6.473572,
                  "fields": {
                      "chunk_text": "AAPL's strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production.",
                      "quarter": "Q3"
                  }
              },
              {
                  "_id": "vec1",
                  "_score": 5.3710938,
                  "fields": {
                      "chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.",
                      "quarter": "Q3"
                  }
              }
          ]
      },
      "usage": {
          "read_units": 6,
          "embed_total_tokens": 18
      }
  }
  ```

  ```json curl
  {
    "result": {
      "hits": [
        {
          "_id": "vec2",
          "_score": 10.82421875,
          "fields": {
            "chunk_text": "Analysts suggest that AAPL'''s upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
            "quarter": "Q4"
          }
        },
        {
          "_id": "vec3",
          "_score": 6.49066162109375,
          "fields": {
            "chunk_text": "AAPL'''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production.",
            "quarter": "Q3"
          }
        },
        {
          "_id": "vec1",
          "_score": 5.3671875,
          "fields": {
            "chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.",
            "quarter": "Q3"
          }
        }
      ]
    },
    "usage": {
      "embed_total_tokens": 18,
      "read_units": 1
    }
  }
  ```
</CodeGroup>

## Search with a sparse vector

To search a sparse index with a sparse vector representation of a query, use the [`query`](/reference/api/2025-01/data-plane/query) operation with the following parameters:

* The `namespace` to query. To use the default namespace, set the namespace to `"__default__"`.
* The `sparse_vector` parameter with the sparse vector values and indices.
* The `top_k` parameter with the number of results to return.
* Optionally, you can set `include_values` and/or `include_metadata` to `true` to include the vector values and/or metadata of the matching records in the response. However, when querying with `top_k` over 1000, avoid returning vector data or metadata for optimal performance.

For example, the following code uses a sparse vector representation of the query "What is AAPL's outlook, considering both product launches and market conditions?" to search for the 3 most similar vectors in the `example-namespaces` namespace:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  results = index.query(
      namespace="example-namespace",
      sparse_vector={
        "values": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        "indices": [767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697]
      }, 
      top_k=3,
      include_metadata=True,
      include_values=False
  )

  print(results)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  const queryResponse = await index.namespace('example-namespace').query({
      sparseVector: {
          indices: [767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697],
          values: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
      },
      topK: 3,
      includeValues: false,
      includeMetadata: true
  });

  console.log(queryResponse);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;
  import io.pinecone.clients.Index;

  import java.util.*;

  public class SearchSparseIndex {
      public static void main(String[] args) throws InterruptedException {
          // Instantiate Pinecone class
          Pinecone pinecone = new Pinecone.Builder("YOUR_API_KEY").build();

          String indexName = "docs-example";

          Index index = pinecone.getIndexConnection(indexName);

          List<Long> sparseIndices = Arrays.asList(
                  767227209L, 1640781426L, 1690623792L, 2021799277L, 2152645940L,
                  2295025838L, 2443437770L, 2779594451L, 2956155693L, 3476647774L,
                  3818127854L, 428309169L);
          List<Float> sparseValues = Arrays.asList(
                  1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f,
                  1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f);

          QueryResponseWithUnsignedIndices queryResponse = index.query(3, null, sparseIndices, sparseValues, null, "example-namespace", null, false, true);
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

  	sparseValues := pinecone.SparseValues{
  		Indices: []uint32{767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697},
  		Values:  []float32{1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0},
  	}

  	res, err := idxConnection.QueryByVectorValues(ctx, &pinecone.QueryByVectorValuesRequest{
  		SparseValues:    &sparseValues,
  		TopK:            3,
  		IncludeValues:   false,
  		IncludeMetadata: true,
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

  var index = pinecone.Index("docs-example");

  var queryResponse = await index.QueryAsync(new QueryRequest {
      Namespace = "example-namespace",
      TopK = 4,
      SparseVector = new SparseValues
      {
          Indices = [767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697],
          Values = new[] { 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f },
      },
      IncludeValues = false,
      IncludeMetadata = true
  });

  Console.WriteLine(queryResponse);
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl "https://$INDEX_HOST/query" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
          "sparseVector": {
              "values": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
              "indices": [767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697]
          },
          "namespace": "example-namespace",
          "topK": 4,
          "includeMetadata": true,
          "includeValues": false
      }'
  ```
</CodeGroup>

The results will look as follows. The most similar records are scored highest.

<CodeGroup>
  ```python Python
  {'matches': [{'id': 'vec2',
                'metadata': {'category': 'technology',
                             'quarter': 'Q4',
                             'chunk_text': "Analysts suggest that AAPL'''s "
                                            'upcoming Q4 product launch event '
                                            'might solidify its position in the '
                                            'premium smartphone market.'},
                'score': 10.9042969,
                'values': []},
               {'id': 'vec3',
                'metadata': {'category': 'technology',
                             'quarter': 'Q3',
                             'chunk_text': "AAPL'''s strategic Q3 partnerships "
                                            'with semiconductor suppliers could '
                                            'mitigate component risks and '
                                            'stabilize iPhone production'},
                'score': 6.48010254,
                'values': []},
               {'id': 'vec1',
                'metadata': {'category': 'technology',
                             'quarter': 'Q3',
                             'chunk_text': 'AAPL reported a year-over-year '
                                            'revenue increase, expecting '
                                            'stronger Q3 demand for its flagship '
                                            'phones.'},
                'score': 5.3671875,
                'values': []}],
   'namespace': 'example-namespace',
   'usage': {'read_units': 1}}
  ```

  ```javascript JavaScript
  { 
    matches: [
              { 
                id: 'vec2',
                score: 10.9042969,
                values: [],
                metadata: {
                  chunk_text: "Analysts suggest that AAPL'''s upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
                  category: 'technology',
                  quarter: 'Q4'
                }
              },
              {
                id: 'vec3',
                score: 6.48010254,
                values: [],
                metadata: {
                  chunk_text: "AAPL'''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production.",
                  category: 'technology',
                  quarter: 'Q3'
                }
              },
              {
                id: 'vec1',
                score: 5.3671875,
                values: [],
                metadata: {
                    chunk_text: 'AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.',
                    category: 'technology',
                    quarter: 'Q3'
                }
              }
            ],
    namespace: 'example-namespace',
    usage: {readUnits: 1}
  }
  ```

  ```java Java
  class QueryResponseWithUnsignedIndices {
      matches: [ScoredVectorWithUnsignedIndices {
          score: 10.34375
          id: vec2
          values: []
          metadata: fields {
            key: "category"
            value {
              string_value: "technology"
            }
          }
          fields {
            key: "chunk_text"
            value {
              string_value: "Analysts suggest that AAPL\'\\\'\'s upcoming Q4 product launch event might solidify its position in the premium smartphone market."
            }
          }
          fields {
            key: "quarter"
            value {
              string_value: "Q4"
            }
          }
          
          sparseValuesWithUnsignedIndices: SparseValuesWithUnsignedIndices {
              indicesWithUnsigned32Int: []
              values: []
          }
      }, ScoredVectorWithUnsignedIndices {
          score: 5.8638916
          id: vec3
          values: []
          metadata: fields {
            key: "category"
            value {
              string_value: "technology"
            }
          }
          fields {
            key: "chunk_text"
            value {
              string_value: "AAPL\'\\\'\'s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production"
            }
          }
          fields {
            key: "quarter"
            value {
              string_value: "Q3"
            }
          }
          
          sparseValuesWithUnsignedIndices: SparseValuesWithUnsignedIndices {
              indicesWithUnsigned32Int: []
              values: []
          }
      }, ScoredVectorWithUnsignedIndices {
          score: 5.3671875
          id: vec1
          values: []
          metadata: fields {
            key: "category"
            value {
              string_value: "technology"
            }
          }
          fields {
            key: "chunk_text"
            value {
              string_value: "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones."
            }
          }
          fields {
            key: "quarter"
            value {
              string_value: "Q3"
            }
          }
          
          sparseValuesWithUnsignedIndices: SparseValuesWithUnsignedIndices {
              indicesWithUnsigned32Int: []
              values: []
          }
      }]
      namespace: example-namespace
      usage: read_units: 1

  }
  ```

  ```go Go
  {
    "matches": [
      {
        "vector": {
          "id": "vec2",
          "metadata": {
            "category": "technology",
            "quarter": "Q4",
            "chunk_text": "Analysts suggest that AAPL's upcoming Q4 product launch event might solidify its position in the premium smartphone market."
          }
        },
        "score": 10.904296
      },
      {
        "vector": {
          "id": "vec3",
          "metadata": {
            "category": "technology",
            "quarter": "Q3",
            "chunk_text": "AAPL's strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production"
          }
        },
        "score": 6.4801025
      },
      {
        "vector": {
          "id": "vec1",
          "metadata": {
            "category": "technology",
            "quarter": "Q3",
            "chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones"
          }
        },
        "score": 5.3671875
      }
    ],
    "usage": {
      "read_units": 1
    },
    "namespace": "example-namespace"
  }
  ```

  ```csharp C#
  {
    "results": [],
    "matches": [
      {
        "id": "vec2",
        "score": 10.904297,
        "values": [],
        "metadata": {
          "category": "technology",
          "chunk_text": "Analysts suggest that AAPL\u0027\u0027\u0027s upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
          "quarter": "Q4"
        }
      },
      {
        "id": "vec3",
        "score": 6.4801025,
        "values": [],
        "metadata": {
          "category": "technology",
          "chunk_text": "AAPL\u0027\u0027\u0027s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production",
          "quarter": "Q3"
        }
      },
      {
        "id": "vec1",
        "score": 5.3671875,
        "values": [],
        "metadata": {
          "category": "technology",
          "chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.",
          "quarter": "Q3"
        }
      }
    ],
    "namespace": "example-namespace",
    "usage": {
      "readUnits": 1
    }
  }
  ```

  ```json curl
  {
    "results": [],
    "matches": [
      {
        "id": "vec2",
        "score": 10.9042969,
        "values": [],
        "metadata": {
          "chunk_text": "Analysts suggest that AAPL'''s upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
          "category": "technology",
          "quarter": "Q4"
        }
      },
      {
        "id": "vec3",
        "score": 6.48010254,
        "values": [],
        "metadata": {
          "chunk_text": "AAPL'''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production.",
          "category": "technology",
          "quarter": "Q3"
        }
      },
      {
        "id": "vec1",
        "score": 5.3671875,
        "values": [],
        "metadata": {
            "chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.",
            "category": "technology",
            "quarter": "Q3"
        }
      }
    ],
    "namespace": "example-namespace",
    "usage": {
      "readUnits": 1
    }
  }
  ```
</CodeGroup>

## Search with a record ID

When you search with a record ID, Pinecone uses the sparse vector associated with the record as the query. To search a sparse index with a record ID, use the [`query`](/reference/api/2025-01/data-plane/query) operation with the following parameters:

* The `namespace` to query. To use the default namespace, set the namespace to `"__default__"`.
* The `id` parameter with the unique record ID containing the sparse vector to use as the query.
* The `top_k` parameter with the number of results to return.
* Optionally, you can set `include_values` and/or `include_metadata` to `true` to include the vector values and/or metadata of the matching records in the response. However, when querying with `top_k` over 1000, avoid returning vector data or metadata for optimal performance.

For example, the following code uses an ID to search for the 3 records in the `example-namespace` namespace that best match the sparse vector in the record:

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.query(
      namespace="example-namespace",
      id="rec2", 
      top_k=3,
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
      id: 'rec2',
      topK: 3,
      includeValues: false,
      includeMetadata: true,
  });
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;

  public class QueryExample {
      public static void main(String[] args) {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);
          Index index = new Index(connection, "INDEX_NAME");
          QueryResponseWithUnsignedIndices queryRespone = index.queryByVectorId(3, "rec2", "example-namespace", null, false, true);
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

      vectorId := "rec2"
      res, err := idxConnection.QueryByVectorId(ctx, &pinecone.QueryByVectorIdRequest{
          VectorId:      vectorId,
          TopK:          3,
          IncludeValues: false,
          IncludeMetadata: true,
      })
      if err != nil {
          log.Fatalf("Error encountered when querying by vector ID `%v`: %v", vectorId, err)
      } else {
          fmt.Printf(prettifyStruct(res.Matches))
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
      Id = "rec2",
      Namespace = "example-namespace",
      TopK = 3,
      IncludeValues = false,
      IncludeMetadata = true
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
          "id": "rec2",
          "namespace": "example-namespace",
          "topK": 3,
          "includeMetadata": true,
          "includeValues": false
      }'
  ```
</CodeGroup>
