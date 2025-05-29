# Monitor your usage

This page shows you how to monitor the overall usage and costs for your Pinecone organization as well as usage and performance metrics for individual indexes.

## Monitor organization-level usage

<Note>
  You must be the [organization owner](/guides/organizations/understanding-organizations#organization-owners) to view usage across your Pinecone organization. Also, this feature is available only to organizations on the Standard or Enterprise plans.
</Note>

To view and download a report of your usage and costs for your Pinecone organization, go to [**Settings > Usage**](https://app.pinecone.io/organizations/-/settings/usage) in the Pinecone console.

All dates are given in UTC to match billing invoices.

## Monitor index-level usage

You can monitor index-level usage directly in the Pinecone console, or you can pull them into [Prometheus](https://prometheus.io/). For more details, see [Monitoring](/guides/production/monitoring).

## Monitor operation-level usage

### Read units

Read operations like `query` and `fetch` return a `usage` parameter with the [read unit](/guides/manage-cost/understanding-cost#read-units) consumption of each request that is made. For example, a query to an example index might return this result and summary of read unit usage:

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")
  index = pc.Index("pinecone-index")

  index.query(
    vector=[0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    top_k=3,
    include_values=True
  )
  # Returns:
  # {
  #     "matches": [
  #         {
  #             "id": "C",
  #             "score": -1.76717265e-07,
  #             "values": [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
  #         },
  #         {
  #             "id": "B",
  #             "score": 0.080000028,
  #             "values": [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
  #         },
  #         {
  #             "id": "D",
  #             "score": 0.0800001323,
  #             "values": [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
  #         },
  #     ],
  #     "namespace": "",
  #     "usage": {"read_units": 5}
  # }
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })
  const index = pc.index("pinecone-index")

  const queryResponse = await index.query({
      vector: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
      topK: 3,
      includeValues: true,
  });
  // Returns:
  // { 
  //   matches: [
  //             { 
  //               id: 'C',
  //               score: 0.000072891,
  //               values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
  //             },
  //             {
  //               id: 'B',
  //               score: 0.080000028,
  //               values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
  //             },
  //             {
  //               id: 'D',
  //               score: 0.0800001323,
  //               values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
  //             }
  //           ],
  //   namespace: '',
  //   usage: {readUnits: 5}
  // }
  ```
</CodeGroup>

For a more in-depth demonstration of how to use read units to inspect read costs, see [this notebook](https://github.com/pinecone-io/examples/blob/master/docs/read-units-demonstrated.ipynb).

### Embedding tokens

Requests to one of [Pinecone's hosted embedding models](/guides/index-data/create-an-index#embedding-models), either directly via the [`embed` operation](/reference/api/2025-01/inference/generate-embeddings) or automatically when upserting or querying an [index with integrated embedding](/guides/index-data/indexing-overview#integrated-embedding), return a `usage` parameter with the total tokens generated.

For example, the following request to use the `multilingual-e5-large` model to generate embeddings for sentences related to the word “apple” might return this request and summary of embedding tokens generated:

<CodeGroup>
  ```python Python
  # Import the Pinecone library
  from pinecone.grpc import PineconeGRPC as Pinecone
  from pinecone import ServerlessSpec
  import time

  # Initialize a Pinecone client with your API key
  pc = Pinecone(api_key="YOUR_API_KEY")

  # Define a sample dataset where each item has a unique ID and piece of text
  data = [
      {"id": "vec1", "text": "Apple is a popular fruit known for its sweetness and crisp texture."},
      {"id": "vec2", "text": "The tech company Apple is known for its innovative products like the iPhone."},
      {"id": "vec3", "text": "Many people enjoy eating apples as a healthy snack."},
      {"id": "vec4", "text": "Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces."},
      {"id": "vec5", "text": "An apple a day keeps the doctor away, as the saying goes."},
      {"id": "vec6", "text": "Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership."}
  ]

  # Convert the text into numerical vectors that Pinecone can index
  embeddings = pc.inference.embed(
      model="llama-text-embed-v2",
      inputs=[d['text'] for d in data],
      parameters={"input_type": "passage", "truncate": "END"}
  )

  print(embeddings)
  ```

  ```javascript JavaScript
  // Import the Pinecone library
  import { Pinecone } from '@pinecone-database/pinecone';

  // Initialize a Pinecone client with your API key
  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  // Define a sample dataset where each item has a unique ID and piece of text
  const data = [
    { id: 'vec1', text: 'Apple is a popular fruit known for its sweetness and crisp texture.' },
    { id: 'vec2', text: 'The tech company Apple is known for its innovative products like the iPhone.' },
    { id: 'vec3', text: 'Many people enjoy eating apples as a healthy snack.' },
    { id: 'vec4', text: 'Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces.' },
    { id: 'vec5', text: 'An apple a day keeps the doctor away, as the saying goes.' },
    { id: 'vec6', text: 'Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership.' }
  ];

  // Convert the text into numerical vectors that Pinecone can index
  const model = 'llama-text-embed-v2';

  const embeddings = await pc.inference.embed(
    model,
    data.map(d => d.text),
    { inputType: 'passage', truncate: 'END' }
  );

  console.log(embeddings);
  ```

  ```java Java
  // Import the required classes
  import io.pinecone.clients.Index;
  import io.pinecone.clients.Inference;
  import io.pinecone.clients.Pinecone;
  import org.openapitools.inference.client.ApiException;
  import org.openapitools.inference.client.model.Embedding;
  import org.openapitools.inference.client.model.EmbeddingsList;

  import java.math.BigDecimal;
  import java.util.*;
  import java.util.stream.Collectors;

  public class GenerateEmbeddings {
      public static void main(String[] args) throws ApiException {
          // Initialize a Pinecone client with your API key
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          Inference inference = pc.getInferenceClient();

          // Prepare input sentences to be embedded
          List<DataObject> data = Arrays.asList(
              new DataObject("vec1", "Apple is a popular fruit known for its sweetness and crisp texture."),
              new DataObject("vec2", "The tech company Apple is known for its innovative products like the iPhone."),
              new DataObject("vec3", "Many people enjoy eating apples as a healthy snack."),
              new DataObject("vec4", "Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces."),
              new DataObject("vec5", "An apple a day keeps the doctor away, as the saying goes."),
              new DataObject("vec6", "Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership.")
          );

          List<String> inputs = data.stream()
              .map(DataObject::getText)
              .collect(Collectors.toList());

          // Specify the embedding model and parameters
          String embeddingModel = "llama-text-embed-v2";

          Map<String, Object> parameters = new HashMap<>();
          parameters.put("input_type", "passage");
          parameters.put("truncate", "END");

          // Generate embeddings for the input data
          EmbeddingsList embeddings = inference.embed(embeddingModel, parameters, inputs);

          // Get embedded data
          List<Embedding> embeddedData = embeddings.getData();
      }

      private static List<Float> convertBigDecimalToFloat(List<BigDecimal> bigDecimalValues) {
          return bigDecimalValues.stream()
              .map(BigDecimal::floatValue)
              .collect(Collectors.toList());
      }
  }

  class DataObject {
      private String id;
      private String text;

      public DataObject(String id, String text) {
          this.id = id;
          this.text = text;
      }

      public String getId() {
          return id;
      }
      public String getText() {
          return text;
      }
  }
  ```

  ```go Go
  package main

  // Import the required packages
  import (
      "context"
     	"encoding/json"
      "fmt"
      "log"

      "github.com/pinecone-io/go-pinecone/v3/pinecone"
  )

  type Data struct {
      ID   string
      Text string
  }

  type Query struct {
  	Text string
  }

  func prettifyStruct(obj interface{}) string {
      bytes, _ := json.MarshalIndent(obj, "", "  ")
      return string(bytes)
  }

  func main() {
      ctx := context.Background()

      // Initialize a Pinecone client with your API key
      pc, err := pinecone.NewClient(pinecone.NewClientParams{
          ApiKey: "YOUR_API_KEY",
      })
      if err != nil {
          log.Fatalf("Failed to create Client: %v", err)
      }

      // Define a sample dataset where each item has a unique ID and piece of text
      data := []Data{
          {ID: "vec1", Text: "Apple is a popular fruit known for its sweetness and crisp texture."},
          {ID: "vec2", Text: "The tech company Apple is known for its innovative products like the iPhone."},
          {ID: "vec3", Text: "Many people enjoy eating apples as a healthy snack."},
          {ID: "vec4", Text: "Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces."},
          {ID: "vec5", Text: "An apple a day keeps the doctor away, as the saying goes."},
          {ID: "vec6", Text: "Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership."},
      }

      // Specify the embedding model and parameters
      embeddingModel := "llama-text-embed-v2"

      docParameters := pinecone.EmbedParameters{
          InputType: "passage",
          Truncate:  "END",
      }

      // Convert the text into numerical vectors that Pinecone can index
      var documents []string
      for _, d := range data {
          documents = append(documents, d.Text)
      }

      docEmbeddingsResponse, err := pc.Inference.Embed(ctx, &pinecone.EmbedRequest{
          Model:      embeddingModel,
          TextInputs: documents,
          Parameters: docParameters,
      }) 
      if err != nil {
          log.Fatalf("Failed to embed documents: %v", err)
      } else {
          fmt.Printf(prettifyStruct(docEmbeddingsResponse))
      }
  }
  ```

  ```csharp C#
  using Pinecone;
  using System;
  using System.Collections.Generic;

  // Initialize a Pinecone client with your API key
  var pinecone = new PineconeClient("YOUR_API_KEY");

  // Prepare input sentences to be embedded
  var data = new[]
  {
      new
      {
          Id = "vec1",
          Text = "Apple is a popular fruit known for its sweetness and crisp texture."
      },
      new
      {
          Id = "vec2",
          Text = "The tech company Apple is known for its innovative products like the iPhone."
      },
      new
      {
          Id = "vec3",
          Text = "Many people enjoy eating apples as a healthy snack."
      },
      new
      {
          Id = "vec4",
          Text = "Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces."
      },
      new
      {
          Id = "vec5",
          Text = "An apple a day keeps the doctor away, as the saying goes."
      },
      new
      {
          Id = "vec6",
          Text = "Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership."
      }
  };

  // Specify the embedding model and parameters
  var embeddingModel = "llama-text-embed-v2";

  // Generate embeddings for the input data
  var embeddings = await pinecone.Inference.EmbedAsync(new EmbedRequest
  {
      Model = embeddingModel,
      Inputs = data.Select(item => new EmbedRequestInputsItem { Text = item.Text }),
      Parameters = new Dictionary<string, object?>
      {
          ["input_type"] = "passage",
          ["truncate"] = "END"
      }
  });

  Console.WriteLine(embeddings);
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl https://api.pinecone.io/embed \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "Content-Type: application/json" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
        "model": "llama-text-embed-v2",
        "parameters": {
          "input_type": "passage",
          "truncate": "END"
        },
        "inputs": [
          {"text": "Apple is a popular fruit known for its sweetness and crisp texture."},
          {"text": "The tech company Apple is known for its innovative products like the iPhone."},
          {"text": "Many people enjoy eating apples as a healthy snack."},
          {"text": "Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces."},
          {"text": "An apple a day keeps the doctor away, as the saying goes."},
          {"text": "Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership."}
        ]
    }'
  ```
</CodeGroup>

The returned object looks like this:

<CodeGroup>
  ```python Python
  EmbeddingsList(
      model='llama-text-embed-v2',
      data=[
          {'values': [0.04925537109375, -0.01313018798828125, -0.0112762451171875, ...]},
          ...
      ],
      usage={'total_tokens': 130}
  )
  ```

  ```javascript JavaScript
  EmbeddingsList(1) [
    {
      values: [
        0.04925537109375, 
        -0.01313018798828125, 
        -0.0112762451171875,
        ...
      ]
    },
    ...
    model: 'llama-text-embed-v2',
    data: [ { values: [Array] } ],
    usage: { totalTokens: 130 }
  ]
  ```

  ```java Java
  class EmbeddingsList {
      model: llama-text-embed-v2
      data: [class Embedding {
          values: [0.04925537109375, -0.01313018798828125, -0.0112762451171875, ...]
          additionalProperties: null
      }, ...]
      usage: class EmbeddingsListUsage {
          totalTokens: 130
          additionalProperties: null
      }
      additionalProperties: null
  }
  ```

  ```go Go
  {
    "data": [
      {
        "values": [
          0.03942871,
          -0.010177612,
          -0.046051025,
          ...
        ]
      },
      ...
    ], 
    "model": "llama-text-embed-v2",
    "usage": {
      "total_tokens": 130
    }
  }
  ```

  ```csharp C#
  {
    "model": "llama-text-embed-v2",
    "data": [
      {
        "values": [
          0.04913330078125,
          -0.01306915283203125,
          -0.01116180419921875,
          ...
        ]
      },
      ...
    ],
    "usage": {
      "total_tokens": 130
    }
  }
  ```

  ```json curl
  {
    "data": [
      {
        "values": [
          0.04925537109375,
          -0.01313018798828125,
          -0.0112762451171875,
          ...
        ]
      }, 
      ...
    ],
    "model": "llama-text-embed-v2",
    "usage": {
      "total_tokens": 130
    }
  }
  ```
</CodeGroup>

## See also

* [Understanding cost](/guides/manage-cost/understanding-cost)
* [Managing cost](/guides/manage-cost/manage-cost)
