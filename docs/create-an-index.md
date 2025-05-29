# Create a serverless index

This page shows you how to create a dense or sparse serverless index.

* **Dense indexes** store dense vectors, which are numerical representations of the meaning and relationships of text, images, or other types of data. You use dense indexes for [semantic search](/guides/search/semantic-search) or in combination with sparse indexes for [hybrid search](/guides/search/hybrid-search).

* **Sparse indexes** store sparse vectors, which are numerical representations of the words or phrases in a document. You use sparse indexes for [lexical search](/guides/search/lexical-search), or in combination with dense indexes for [hybrid search](/guides/search/hybrid-search).

<Tip>
  You can create an index using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/create-index/serverless).
</Tip>

## Create a dense index

You can create a dense index with [integrated vector embedding](/guides/index-data/indexing-overview#integrated-embedding) or a dense index for storing vectors generated with an external embedding model.

### Integrated embedding

<Note>
  Indexes with integrated embedding do not support [updating](/guides/manage-data/update-data) or [importing](/guides/index-data/import-data) with text.
</Note>

If you want to upsert and search with source text and have Pinecone convert it to dense vectors automatically, [create a dense index with integrated embedding](/reference/api/2025-01/control-plane/create_for_model) as follows:

* Provide a `name` for the index.
* Set `cloud` and `region` to the [cloud and region](/guides/index-data/create-an-index#cloud-regions) where the index should be deployed.
* Set `embed.model` to one of [Pinecone's hosted embedding models](/guides/index-data/create-an-index#embedding-models).
* Set `embed.field_map` to the name of the field in your source document that contains the data for embedding.

Other parameters are optional. See the [API reference](/reference/api/2025-01/control-plane/create_for_model) for details.

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  index_name = "integrated-dense-py"

  if not pc.has_index(index_name):
      pc.create_index_for_model(
          name=index_name,
          cloud="aws",
          region="us-east-1",
          embed={
              "model":"llama-text-embed-v2",
              "field_map":{"text": "chunk_text"}
          }
      )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.createIndexForModel({
    name: 'integrated-dense-js',
    cloud: 'aws',
    region: 'us-east-1',
    embed: {
      model: 'llama-text-embed-v2',
      fieldMap: { text: 'chunk_text' },
    },
    waitUntilReady: true,
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.CreateIndexForModelRequest;
  import org.openapitools.db_control.client.model.CreateIndexForModelRequestEmbed;
  import org.openapitools.db_control.client.model.DeletionProtection;
  import java.util.HashMap;
  import java.util.Map;

  public class CreateIntegratedIndex {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          String indexName = "integrated-dense-java";
          String region = "us-east-1";
          HashMap<String, String> fieldMap = new HashMap<>();
          fieldMap.put("text", "chunk_text");
          CreateIndexForModelRequestEmbed embed = new CreateIndexForModelRequestEmbed()
                  .model("llama-text-embed-v2")
                  .fieldMap(fieldMap);
          Map<String, String> tags = new HashMap<>();
          tags.put("environment", "development");
          pc.createIndexForModel(
                  indexName,
                  CreateIndexForModelRequest.CloudEnum.AWS,
                  region,
                  embed,
                  DeletionProtection.DISABLED,
                  tags
          );
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

    	indexName := "integrated-dense-go"
      DeletionProtection: &deletionProtection,

      index, err := pc.CreateIndexForModel(ctx, &pinecone.CreateIndexForModelRequest{
  		Name:   indexName,
  		Cloud:  pinecone.Aws,
  		Region: "us-east-1",
  		Embed: pinecone.CreateIndexForModelEmbed{
  			Model:    "llama-text-embed-v2",
  			FieldMap: map[string]interface{}{"text": "chunk_text"},
  		},
          DeletionProtection: &deletionProtection,
          Tags:   &pinecone.IndexTags{ "environment": "development" },
  	})
      if err != nil {
          log.Fatalf("Failed to create serverless integrated index: %v", idx.Name)
      } else {
          fmt.Printf("Successfully created serverless integrated index: %v", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var createIndexRequest = await pinecone.CreateIndexForModelAsync(
      new CreateIndexForModelRequest
      {
          Name = "integrated-dense-dotnet",
          Cloud = CreateIndexForModelRequestCloud.Aws,
          Region = "us-east-1",
          Embed = new CreateIndexForModelRequestEmbed
          {
              Model = "llama-text-embed-v2",
              FieldMap = new Dictionary<string, object?>() 
              { 
                  { "text", "chunk_text" } 
              }
          },
          DeletionProtection = DeletionProtection.Disabled,
          Tags = new Dictionary<string, string> 
          { 
              { "environment", "development" }
          }
      }
  );
  ```

  ```json curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl "https://api.pinecone.io/indexes/create-for-model" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
          "name": "integrated-dense-curl",
          "cloud": "aws",
          "region": "us-east-1",
          "embed": {
            "model": "llama-text-embed-v2",
            "field_map": {
              "text": "chunk_text"
            }
          }
        }'
  ```
</CodeGroup>

### Bring your own vectors

If you use an external embedding model to convert your data to dense vectors, use the [create a dense index](/reference/api/2025-01/control-plane/create_index) as follows:

* Provide a `name` for the index.
* Set the `vector_type` to `dense`.
* Specify the `dimension` and similarity `metric` of the vectors you'll store in the index. This should match the dimension and metric supported by your embedding model.
* Set `spec.cloud` and `spec.region` to the [cloud and region](/guides/index-data/create-an-index#cloud-regions) where the index should be deployed. For Python, you also need to import the `ServerlessSpec` class.

Other parameters are optional. See the [API reference](/reference/api/2025-01/control-plane/create_index) for details.

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone
  from pinecone import ServerlessSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  index_name = "standard-dense-py"

  if not pc.has_index(index_name):
      pc.create_index(
          name=index_name,
          vector_type="dense",
          dimension=1536,
          metric="cosine",
          spec=ServerlessSpec(
              cloud="aws",
              region="us-east-1"
          ),
          deletion_protection="disabled",
          tags={
              "environment": "development"
          }
      )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.createIndex({
    name: 'standard-dense-js',
    vectorType: 'dense',
    dimension: 1536,
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      }
    },
    deletionProtection: 'disabled',
    tags: { environment: 'development' }, 
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.IndexModel;
  import org.openapitools.db_control.client.model.DeletionProtection;
  import java.util.HashMap;

  public class CreateServerlessIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          String indexName = "standard-dense-java";
          String cloud = "aws";
          String region = "us-east-1";
          String vectorType = "dense";
          Map<String, String> tags = new HashMap<>();
          tags.put("environment", "development");
          pc.createServerlessIndex(
              indexName,
              "cosine", 
              1536, 
              cloud,
              region,
              DeletionProtection.DISABLED, 
              tags, 
              vectorType
          );
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
    	indexName := "standard-dense-go"
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
          Tags:               &pinecone.IndexTags{ "environment": "development" },
      })
      if err != nil {
          log.Fatalf("Failed to create serverless index: %v", idx.Name)
      } else {
          fmt.Printf("Successfully created serverless index: %v", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var createIndexRequest = await pinecone.CreateIndexAsync(new CreateIndexRequest
  {
      Name = "standard-dense-dotnet",
      VectorType = VectorType.Dense,
      Dimension = 1536,
      Metric = MetricType.Cosine,
      Spec = new ServerlessIndexSpec
      {
          Serverless = new ServerlessSpec
          {
              Cloud = ServerlessSpecCloud.Aws,
              Region = "us-east-1"
          }
      },
      DeletionProtection = DeletionProtection.Disabled,
      Tags = new Dictionary<string, string> 
      {  
          { "environment", "development" }
      }
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
           "name": "standard-dense-curl",
           "vector_type": "dense",
           "dimension": 1536,
           "metric": "cosine",
           "spec": {
              "serverless": {
                 "cloud": "aws",
                 "region": "us-east-1"
              }
           },
          "tags": {
              "environment": "development"
          },
           "deletion_protection": "disabled"
        }'
  ```
</CodeGroup>

## Create a sparse index

<Note>
  This feature is in [public preview](/release-notes/feature-availability).
</Note>

You can create a dense index with [integrated vector embedding](/guides/index-data/indexing-overview#integrated-embedding) or a dense index for storing vectors generated with an external embedding model.

### Integrated embedding

If you want to upsert and search with source text and have Pinecone convert it to sparse vectors automatically, [create a sparse index with integrated embedding](/reference/api/2025-01/control-plane/create_for_model) as follows:

* Provide a `name` for the index.
* Set `cloud` and `region` to the [cloud and region](/guides/index-data/create-an-index#cloud-regions) where the index should be deployed.
* Set `embed.model` to one of [Pinecone's hosted sparse embedding models](/guides/index-data/create-an-index#embedding-models).
* Set `embed.field_map` to the name of the field in your source document that contains the text for embedding.

Other parameters are optional. See the [API reference](/reference/api/2025-01/control-plane/create_for_model) for details.

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  index_name = "integrated-sparse-py"

  if not pc.has_index(index_name):
      pc.create_index_for_model(
          name=index_name,
          cloud="aws",
          region="us-east-1",
          embed={
              "model":"pinecone-sparse-english-v0",
              "field_map":{"text": "chunk_text"}
          }
      )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.createIndexForModel({
    name: 'integrated-sparse-js',
    cloud: 'aws',
    region: 'us-east-1',
    embed: {
      model: 'pinecone-sparse-english-v0',
      fieldMap: { text: 'chunk_text' },
    },
    waitUntilReady: true,
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.CreateIndexForModelRequest;
  import org.openapitools.db_control.client.model.CreateIndexForModelRequestEmbed;
  import org.openapitools.db_control.client.model.DeletionProtection;
  import java.util.HashMap;
  import java.util.Map;

  public class CreateIntegratedIndex {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          String indexName = "integrated-sparse-java";
          String region = "us-east-1";
          HashMap<String, String> fieldMap = new HashMap<>();
          fieldMap.put("text", "chunk_text");
          CreateIndexForModelRequestEmbed embed = new CreateIndexForModelRequestEmbed()
                  .model("pinecone-sparse-english-v0")
                  .fieldMap(fieldMap);
          Map<String, String> tags = new HashMap<>();
          tags.put("environment", "development");
          pc.createIndexForModel(
                  indexName,
                  CreateIndexForModelRequest.CloudEnum.AWS,
                  region,
                  embed,
                  DeletionProtection.DISABLED,
                  tags
          );
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

    	indexName := "integrated-sparse-go"
      DeletionProtection: &deletionProtection,

      index, err := pc.CreateIndexForModel(ctx, &pinecone.CreateIndexForModelRequest{
  		Name:   indexName,
  		Cloud:  pinecone.Aws,
  		Region: "us-east-1",
  		Embed: pinecone.CreateIndexForModelEmbed{
  			Model:    "pinecone-sparse-english-v0",
  			FieldMap: map[string]interface{}{"text": "chunk_text"},
  		},
          DeletionProtection: &deletionProtection,
          Tags:   &pinecone.IndexTags{ "environment": "development" },

  	})
      if err != nil {
          log.Fatalf("Failed to create serverless integrated index: %v", idx.Name)
      } else {
          fmt.Printf("Successfully created serverless integrated index: %v", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var createIndexRequest = await pinecone.CreateIndexForModelAsync(
      new CreateIndexForModelRequest
      {
          Name = "integrated-sparse-dotnet",
          Cloud = CreateIndexForModelRequestCloud.Aws,
          Region = "us-east-1",
          Embed = new CreateIndexForModelRequestEmbed
          {
              Model = "pinecone-sparse-english-v0",
              FieldMap = new Dictionary<string, object?>() 
              { 
                  { "text", "chunk_text" } 
              }
          },
          DeletionProtection = DeletionProtection.Disabled,
          Tags = new Dictionary<string, string> 
          { 
              { "environment", "development" }
          }
      }
  );
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl "https://api.pinecone.io/indexes/create-for-model" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
          "name": "integrated-sparse-curl",
          "cloud": "aws",
          "region": "eu-west-1",
          "embed": {
            "model": "pinecone-sparse-english-v0",
            "field_map": {
              "text": "chunk_text"
            }
          }
        }'
  ```
</CodeGroup>

### Bring your own vectors

If you use an external embedding model to convert your data to sparse vectors, [create a sparse index](/reference/api/2025-01/control-plane/create_index) as follows:

* Provide a `name` for the index.
* Set the `vector_type` to `sparse`.
* Set the distance `metric` to `dotproduct`. Sparse indexes do not support other [distance metrics](/guides/index-data/indexing-overview#distance-metrics).
* Set `spec.cloud` and `spec.region` to the cloud and region where the index should be deployed.

Other parameters are optional. See the [API reference](/reference/api/2025-01/control-plane/create_index) for details.

<CodeGroup>
  ```python Python
  from pinecone import Pinecone, ServerlessSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  index_name = "standard-sparse-py"

  if not pc.has_index(index_name):
      pc.create_index(
          name=index_name,
          vector_type="sparse",
          metric="dotproduct",
          spec=ServerlessSpec(cloud="aws", region="eu-west-1")
      )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.createIndex({
    name: 'standard-sparse-js',
    vectorType: 'sparse',
    metric: 'dotproduct',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      },
    },
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.DeletionProtection;

  import java.util.*;

  public class SparseIndex {
      public static void main(String[] args) throws InterruptedException {
          // Instantiate Pinecone class
          Pinecone pinecone = new Pinecone.Builder("YOUR_API_KEY").build();

          // Create sparse Index
          String indexName = "standard-sparse-java";
          String cloud = "aws";
          String region = "us-east-1";
          String vectorType = "sparse";
          Map<String, String> tags = new HashMap<>();
          tags.put("env", "test");
          pinecone.createSparseServelessIndex(indexName,
                  cloud,
                  region,
                  DeletionProtection.DISABLED,
                  tags,
                  vectorType);
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

  	indexName := "standard-sparse-go"
  	vectorType := "sparse"
  	metric := pinecone.Dotproduct
  	deletionProtection := pinecone.DeletionProtectionDisabled

  	idx, err := pc.CreateServerlessIndex(ctx, &pinecone.CreateServerlessIndexRequest{
  		Name:               indexName,
  		Metric:             &metric,
  		VectorType:         &vectorType,
  		Cloud:              pinecone.Aws,
  		Region:             "us-east-1",
  		DeletionProtection: &deletionProtection,
  	})
  	if err != nil {
  		log.Fatalf("Failed to create serverless index: %v", idx.Name)
  	} else {
  		fmt.Printf("Successfully created serverless index: %v", idx.Name)
  	}
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var createIndexRequest = await pinecone.CreateIndexAsync(new CreateIndexRequest
  {
      Name = "standard-sparse-dotnet",
      VectorType = VectorType.Sparse,
      Metric = MetricType.Dotproduct,
      Spec = new ServerlessIndexSpec
      {
          Serverless = new ServerlessSpec
          {
              Cloud = ServerlessSpecCloud.Aws,
              Region = "us-east-1"
          }
      }
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
           "name": "standard-sparse-curl",
           "vector_type": "sparse",
           "metric": "dotproduct",
           "spec": {
              "serverless": {
                 "cloud": "aws",
                 "region": "eu-west-1"
              }
           }
        }'
  ```
</CodeGroup>

## Create an index from a backup

You can create a dense or sparse index from a backup. For more details, see [Restore an index](/guides/manage-data/restore-an-index).

## Index options

### Cloud regions

When creating an index, you must choose the cloud and region where you want the index to be hosted. The following table lists the available public clouds and regions and the plans that support them:

| Cloud   | Region                       | [Supported plans](https://www.pinecone.io/pricing/) | [Availability phase](/release-notes/feature-availability) |
| ------- | ---------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| `aws`   | `us-east-1` (Virginia)       | Starter, Standard, Enterprise                       | General availability                                      |
| `aws`   | `us-west-2` (Oregon)         | Standard, Enterprise                                | General availability                                      |
| `aws`   | `eu-west-1` (Ireland)        | Standard, Enterprise                                | General availability                                      |
| `gcp`   | `us-central1` (Iowa)         | Standard, Enterprise                                | General availability                                      |
| `gcp`   | `europe-west4` (Netherlands) | Standard, Enterprise                                | General availability                                      |
| `azure` | `eastus2` (Virginia)         | Standard, Enterprise                                | General availability                                      |

The cloud and region cannot be changed after a serverless index is created.

<Note>
  On the free Starter plan, you can create serverless indexes in the `us-east-1` region of AWS only. To create indexes in other regions, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan).
</Note>

### Similarity metrics

When creating a dense index, you can choose from the following similarity metrics. For the most accurate results, choose the similarity metric used to train the embedding model for your vectors. For more information, see [Vector Similarity Explained](https://www.pinecone.io/learn/vector-similarity/).

<Note>[Sparse indexes](#sparse-indexes) must use the `dotproduct` metric.</Note>

<AccordionGroup>
  <Accordion title="Euclidean">
    Querying indexes with this metric returns a similarity score equal to the squared Euclidean distance between the result and query vectors.

    This metric calculates the square of the distance between two data points in a plane. It is one of the most commonly used distance metrics. For an example, see our [IT threat detection example](https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/it-threat-detection.ipynb).

    When you use `metric='euclidean'`, the most similar results are those with the **lowest similarity score**.
  </Accordion>

  <Accordion title="Cosine">
    This is often used to find similarities between different documents. The advantage is that the scores are normalized to \[-1,1] range. For an example, see our [generative question answering example](https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/gen-qa-openai.ipynb).
  </Accordion>

  <Accordion title="Dotproduct">
    This is used to multiply two vectors. You can use it to tell us how similar the two vectors are. The more positive the answer is, the closer the two vectors are in terms of their directions. For an example, see our [semantic search example](https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/semantic-search.ipynb).
  </Accordion>
</AccordionGroup>

### Embedding models

[Dense vectors](/guides/get-started/glossary#dense-vector) and [sparse vectors](/guides/get-started/glossary#sparse-vector) are the basic units of data in Pinecone and what Pinecone was specially designed to store and work with. Dense vectors represents the semantics of data such as text, images, and audio recordings, while sparse vectors represent documents or queries in a way that captures keyword information.

To transform data into vector format, you use an embedding model. Pinecone hosts several embedding models so it's easy to manage your vector storage and search process on a single platform. You can use a hosted model to embed your data as an integrated part of upserting and querying, or you can use a hosted model to embed your data as a standalone operation.

The following embedding models are hosted by Pinecone.

<Note>
  To understand how cost is calculated for embedding, see [Understanding cost](/guides/manage-cost/understanding-cost#embed). To get model details via the API, see [List models](/reference/api/2025-04/inference/list_models) and [Describe a model](/reference/api/2025-04/inference/describe_model).
</Note>

<AccordionGroup>
  <Accordion title="multilingual-e5-large">
    [`multilingual-e5-large`](/models/multilingual-e5-large) is an efficient dense embedding model trained on a mixture of multilingual datasets. It works well on messy data and short queries expected to return medium-length passages of text (1-2 paragraphs).

    **Details**

    * Vector type: Dense
    * Modality: Text
    * Dimension: 1024
    * Recommended similarity metric: Cosine
    * Max input tokens per sequence: 507
    * Max sequences per batch: 96

    **Parameters**

    The `multilingual-e5-large` model supports the following parameters:

    | Parameter    | Type   | Required/Optional | Description                                                                                                                                                                                                                                    | Default |
    | :----------- | :----- | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
    | `input_type` | string | Required          | The type of input data. Accepted values: `query` or `passage`.                                                                                                                                                                                 |         |
    | `truncate`   | string | Optional          | How to handle inputs longer than those supported by the model. Accepted values: `END` or `NONE`.<br /><br />`END` truncates the input sequence at the input token limit. `NONE` returns an error when the input exceeds the input token limit. | `END`   |

    **Quotas**

    Quotas are defined at the project level and vary based on [pricing plan](https://www.pinecone.io/pricing/) and input type.

    | Input type | Starter plan           | Paid plans                 |
    | :--------- | :--------------------- | :------------------------- |
    | `passage`  | 250k tokens per minute | 1M tokens per minute       |
    | `query`    | 50k tokens per minute  | 250k tokens per minute     |
    | Combined   | 5M tokens per month    | Unlimited tokens per month |
  </Accordion>

  <Accordion title="llama-text-embed-v2">
    [`llama-text-embed-v2`](/models/llama-text-embed-v2) is a high-performance dense embedding model optimized for text retrieval and ranking tasks. It is trained on a diverse range of text corpora and provides strong performance on longer passages and structured documents.

    **Details**

    * Vector type: Dense
    * Modality: Text
    * Dimension: 1024 (default), 2048, 768, 512, 384
    * Recommended similarity metric: Cosine
    * Max input tokens per sequence: 2048
    * Max sequences per batch: 96

    **Parameters**

    The `llama-text-embed-v2` model supports the following parameters:

    | Parameter    | Type    | Required/Optional | Description                                                                                                                                                                                                                                    | Default |
    | :----------- | :------ | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
    | `input_type` | string  | Required          | The type of input data. Accepted values: `query` or `passage`.                                                                                                                                                                                 |         |
    | `truncate`   | string  | Optional          | How to handle inputs longer than those supported by the model. Accepted values: `END` or `NONE`.<br /><br />`END` truncates the input sequence at the input token limit. `NONE` returns an error when the input exceeds the input token limit. | `END`   |
    | `dimension`  | integer | Optional          | Dimension of the vector to return.                                                                                                                                                                                                             | 1024    |

    **Quotas**

    Quotas are defined at the project level and vary based on [pricing plan](https://www.pinecone.io/pricing/) and input type.

    | Input type | Starter plan           | Paid plans                 |
    | :--------- | :--------------------- | :------------------------- |
    | Combined   | 250k tokens per minute | 1M tokens per minute       |
    | Combined   | 5M tokens per month    | Unlimited tokens per month |
  </Accordion>

  <Accordion title="pinecone-sparse-english-v0">
    [`pinecone-sparse-english-v0`](/models/pinecone-sparse-english-v0) is a sparse embedding model for converting text to [sparse vectors](/guides/get-started/glossary#sparse-vector) for keyword or hybrid semantic/keyword search. Built on the innovations of the [DeepImpact architecture](https://arxiv.org/pdf/2104.12016), the model directly estimates the lexical importance of tokens by leveraging their context, unlike traditional retrieval models like BM25, which rely solely on term frequency.

    **Details**

    * Vector type: Sparse
    * Modality: Text
    * Recommended similarity metric: Dotproduct
    * Max input tokens per sequence: 512
    * Max sequences per batch: 96

    **Parameters**

    The `pinecone-sparse-english-v0` model supports the following parameters:

    | Parameter       | Type    | Required/Optional | Description                                                                                                                                                                                                                                    | Default |
    | :-------------- | :------ | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
    | `input_type`    | string  | Required          | The type of input data. Accepted values: `query` or `passage`.                                                                                                                                                                                 |         |
    | `truncate`      | string  | Optional          | How to handle inputs longer than those supported by the model. Accepted values: `END` or `NONE`.<br /><br />`END` truncates the input sequence at the input token limit. `NONE` returns an error when the input exceeds the input token limit. | `END`   |
    | `return_tokens` | boolean | Optional          | Whether to return the string tokens.                                                                                                                                                                                                           | `False` |

    **Quotas**

    Quotas are defined at the project level and vary based on [pricing plan](https://www.pinecone.io/pricing/).

    | Limit type        | Starter plan | Paid plans |
    | :---------------- | :----------- | :--------- |
    | Tokens per minute | 250K         | 1M         |
    | Tokens per month  | 5M           | Unlimited  |
  </Accordion>
</AccordionGroup>
