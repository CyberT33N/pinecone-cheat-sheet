# Manage serverless indexes

This page shows you how to manage your existing serverless indexes.

For guidance on pod-based indexes, see [Manage pod-based indexes](/guides/indexes/pods/manage-pod-based-indexes).

## List indexes

Use the [`list_indexes`](/reference/api/2024-10/control-plane/list_indexes) operation to get a complete description of all indexes in a project:

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  index_list = pc.list_indexes()

  print(index_list)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const indexList = await pc.listIndexes();

  console.log(indexList);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;

  public class ListIndexesExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          IndexList indexList = pc.listIndexes();
          System.out.println(indexList);
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

      idxs, err := pc.ListIndexes(ctx)
      if err != nil {
          log.Fatalf("Failed to list indexes: %v", err)
      } else {
          for _, index := range idxs {
              fmt.Printf("index: %v\n", prettifyStruct(index))
          }
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var indexList = await pinecone.ListIndexesAsync();

  Console.WriteLine(indexList);
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -i -X GET "https://api.pinecone.io/indexes" \
  -H "Api-Key: $PINECONE_API_KEY" \
  -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

The response will look like this:

<CodeGroup>
  ```python Python
  [{
      "name": "docs-example-sparse",
      "metric": "dotproduct",
      "host": "docs-example-sparse-govk0nt.svc.aped-4627-b74a.pinecone.io",
      "spec": {
          "serverless": {
              "cloud": "aws",
              "region": "us-east-1"
          }
      },
      "status": {
          "ready": true,
          "state": "Ready"
      },
      "vector_type": "sparse",
      "dimension": null,
      "deletion_protection": "disabled",
      "tags": {
          "environment": "development"
      }
  }, {
      "name": "docs-example-dense",
      "metric": "cosine",
      "host": "docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io",
      "spec": {
          "serverless": {
              "cloud": "aws",
              "region": "us-east-1"
          }
      },
      "status": {
          "ready": true,
          "state": "Ready"
      },
      "vector_type": "dense",
      "dimension": 1536,
      "deletion_protection": "disabled",
      "tags": {
          "environment": "development"
      }
  }]
  ```

  ```javascript JavaScript
  {
    indexes: [
      {
        name: 'docs-example-sparse',
        dimension: undefined,
        metric: 'dotproduct',
        host: 'docs-example-sparse-govk0nt.svc.aped-4627-b74a.pinecone.io',
        deletionProtection: 'disabled',
        tags: { environment: 'development', example: 'tag' },
        embed: undefined,
        spec: { pod: undefined, serverless: { cloud: 'aws', region: 'us-east-1' } },
        status: { ready: true, state: 'Ready' },
        vectorType: 'sparse'
      },
      {
        name: 'docs-example-dense',
        dimension: 1536,
        metric: 'cosine',
        host: 'docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io',
        deletionProtection: 'disabled',
        tags: { environment: 'development', example: 'tag' },
        embed: undefined,
        spec: { pod: undefined, serverless: { cloud: 'aws', region: 'us-east-1' } },
        status: { ready: true, state: 'Ready' },
        vectorType: 'dense'
      }
    ]
  }
  ```

  ```java Java
  class IndexList {
      indexes: [class IndexModel {
          name: docs-example-sparse
          dimension: null
          metric: dotproduct
          host: docs-example-sparse-govk0nt.svc.aped-4627-b74a.pinecone.io
          deletionProtection: disabled
          tags: {environment=development}
          embed: null
          spec: class IndexModelSpec {
              pod: null
              serverless: class ServerlessSpec {
                  cloud: aws
                  region: us-east-1
                  additionalProperties: null
              }
              additionalProperties: null
          }
          status: class IndexModelStatus {
              ready: true
              state: Ready
              additionalProperties: null
          }
          vectorType: sparse
          additionalProperties: null
      }, class IndexModel {
          name: docs-example-dense
          dimension: 1536
          metric: cosine
          host: docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io
          deletionProtection: disabled
          tags: {environment=development}
          embed: null
          spec: class IndexModelSpec {
              pod: null
              serverless: class ServerlessSpec {
                  cloud: aws
                  region: us-east-1
                  additionalProperties: null
              }
              additionalProperties: null
          }
          status: class IndexModelStatus {
              ready: true
              state: Ready
              additionalProperties: null
          }
          vectorType: dense
          additionalProperties: null
      }]
      additionalProperties: null
  }
  ```

  ```go Go
  index: {
    "name": "docs-example-sparse",
    "host": "docs-example-sparse-govk0nt.svc.aped-4627-b74a.pinecone.io",
    "metric": "dotproduct",
    "vector_type": "sparse",
    "deletion_protection": "disabled",
    "dimension": null,
    "spec": {
      "serverless": {
        "cloud": "aws",
        "region": "us-east-1"
      }
    },
    "status": {
      "ready": true,
      "state": "Ready"
    },
    "tags": {
      "environment": "development"
    }
  }
  index: {
    "name": "docs-example-dense",
    "host": "docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io",
    "metric": "cosine",
    "vector_type": "dense",
    "deletion_protection": "disabled",
    "dimension": 1536,
    "spec": {
      "serverless": {
        "cloud": "aws",
        "region": "us-east-1"
      }
    },
    "status": {
      "ready": true,
      "state": "Ready"
    },
    "tags": {
      "environment": "development"
    }
  }
  ```

  ```csharp C#
  {
    "indexes": [
      {
        "name": "docs-example-sparse",
        "metric": "dotproduct",
        "host": "docs-example-sparse-govk0nt.svc.aped-4627-b74a.pinecone.io",
        "deletion_protection": "disabled",
        "tags": {
          "environment": "development"
        },
        "spec": {
          "serverless": {
            "cloud": "aws",
            "region": "us-east-1"
          }
        },
        "status": {
          "ready": true,
          "state": "Ready"
        },
        "vector_type": "sparse"
      },
      {
        "name": "docs-example-dense",
        "dimension": 1536,
        "metric": "cosine",
        "host": "docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io",
        "deletion_protection": "disabled",
        "tags": {
          "environment": "development"
        },
        "spec": {
          "serverless": {
            "cloud": "aws",
            "region": "us-east-1"
          }
        },
        "status": {
          "ready": true,
          "state": "Ready"
        },
        "vector_type": "dense"
      }
    ]
  }
  ```

  ```json curl
  {
    "indexes": [
      {
        "name": "docs-example-sparse",
        "vector_type": "sparse",
        "metric": "dotproduct",
        "dimension": null,
        "status": {
          "ready": true,
          "state": "Ready"
        },
        "host": "docs-example-sparse-govk0nt.svc.aped-4627-b74a.pinecone.io",
        "spec": {
          "serverless": {
            "region": "us-east-1",
            "cloud": "aws"
          }
        },
        "deletion_protection": "disabled",
        "tags": {
          "environment": "development"
        }
      },
      {
        "name": "docs-example-dense",
        "vector_type": "dense",
        "metric": "cosine",
        "dimension": 1536,
        "status": {
          "ready": true,
          "state": "Ready"
        },
        "host": "docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io",
        "spec": {
          "serverless": {
            "region": "us-east-1",
            "cloud": "aws"
          }
        },
        "deletion_protection": "disabled",
        "tags": {
          "environment": "development"
        }
      }
    ]
  }
  ```
</CodeGroup>

With the Python SDK, you can use the `.names()` helper function to iterate over the index names in the `list_indexes()` response, for example:

```Python Python
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec

for index_name in pc.list_indexes().names:
    print(index_name)
```

## Describe an index

Use the [`describe_index`](/reference/api/2024-10/control-plane/describe_index/) endpoint to get a complete description of a specific index:

<CodeGroup>
  ```Python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.describe_index(name="docs-example")
  ```

  ```JavaScript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.describeIndex('docs-example');
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;

  public class DescribeIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOURE_API_KEY").build();
          IndexModel indexModel = pc.describeIndex("docs-example");
          System.out.println(indexModel);
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

      idx, err := pc.DescribeIndex(ctx, "docs-example")
      if err != nil {
          log.Fatalf("Failed to describe index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("index: %v\n", prettifyStruct(idx))
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var indexModel = await pinecone.DescribeIndexAsync("docs-example");

  Console.WriteLine(indexModel);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -i -X GET "https://api.pinecone.io/indexes/docs-example" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

The response will look like this:

<CodeGroup>
  ```Python Python
  {'deletion_protection': 'disabled',
   'dimension': 1536,
   'host': 'docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io',
   'metric': 'cosine',
   'name': 'docs-example-dense',
   'spec': {'serverless': {'cloud': 'aws', 'region': 'us-east-1'}},
   'status': {'ready': True, 'state': 'Ready'},
   'tags': {'environment': 'development'},
   'vector_type': 'dense'}
  ```

  ```javaScript JavaScript
  {
    name: 'docs-example-dense',
    dimension: 1536,
    metric: 'cosine',
    host: 'docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io',
    deletionProtection: 'disabled',
    tags: { environment: 'development', example: 'tag' },
    embed: undefined,
    spec: { pod: undefined, serverless: { cloud: 'aws', region: 'us-east-1' } },
    status: { ready: true, state: 'Ready' },
    vectorType: 'dense'
  }
  ```

  ```java Java
  class IndexModel {
      name: docs-example-dense
      dimension: 1536
      metric: cosine
      host: docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io
      deletionProtection: disabled
      tags: {environment=development}
      embed: null
      spec: class IndexModelSpec {
          pod: null
          serverless: class ServerlessSpec {
              cloud: aws
              region: us-east-1
              additionalProperties: null
          }
          additionalProperties: null
      }
      status: class IndexModelStatus {
          ready: true
          state: Ready
          additionalProperties: null
      }
      vectorType: dense
      additionalProperties: null
  }
  ```

  ```go Go
  index: {
    "name": "docs-example-dense",
    "host": "docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io",
    "metric": "cosine",
    "vector_type": "dense",
    "deletion_protection": "disabled",
    "dimension": 1536,
    "spec": {
      "serverless": {
        "cloud": "aws",
        "region": "us-east-1"
      }
    },
    "status": {
      "ready": true,
      "state": "Ready"
    },
    "tags": {
      "environment": "development"
    }
  }
  ```

  ```csharp C#
  {
    "name": "docs-example-dense",
    "dimension": 1536,
    "metric": "cosine",
    "host": "docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io",
    "deletion_protection": "disabled",
    "tags": {
      "environment": "development"
    },
    "spec": {
      "serverless": {
        "cloud": "aws",
        "region": "us-east-1"
      }
    },
    "status": {
      "ready": true,
      "state": "Ready"
    },
    "vector_type": "dense"
  }
  ```

  ```json curl
  {
    "name": "docs-example-dense",
    "vector_type": "dense",
    "metric": "cosine",
    "dimension": 1536,
    "status": {
      "ready": true,
      "state": "Ready"
    },
    "host": "docs-example-dense-govk0nt.svc.aped-4627-b74a.pinecone.io",
    "spec": {
      "serverless": {
        "region": "us-east-1",
        "cloud": "aws"
      }
    },
    "deletion_protection": "disabled",
    "tags": {
      "environment": "development"
    }
  }
  ```
</CodeGroup>

<Warning>
  **Do not target an index by name in production.**

  When you target an index by name for data operations such as `upsert` and `query`, the SDK gets the unique DNS host for the index using the `describe_index` operation. This is convenient for testing but should be avoided in production because `describe_index` uses a different API than data operations and therefore adds an additional network call and point of failure. Instead, you should get an index host once and cache it for reuse or specify the host directly.
</Warning>

## Delete an index

Use the [`delete_index`](reference/api/2024-10/control-plane/delete_index) operation to delete an index and all of its associated resources.

<CodeGroup>
  ```python Python
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone, PodSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.delete_index(name="docs-example")
  ```

  ```javascript JavaScript
  // npm install @pinecone-database/pinecone
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({
    apiKey: 'YOUR_API_KEY'
  });

  await pc.deleteIndex('docs-example');
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;

  public class DeleteIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.deleteIndex("docs-example");
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

      indexName := "docs-example"

      err = pc.DeleteIndex(ctx, indexName)
      if err != nil {
          log.Fatalf("Failed to delete index: %v", err)
      } else {
          fmt.Println("Index \"%v\" deleted successfully", indexName)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  await pinecone.DeleteIndexAsync("docs-example");
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -i -X DELETE "https://api.pinecone.io/indexes/docs-example" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

If deletion protection is enabled on an index, requests to delete it will fail and return a `403 - FORBIDDEN` status with the following error:

```
Deletion protection is enabled for this index. Disable deletion protection before retrying.
```

Before you can delete such an index, you must first [disable deletion protection](/guides/manage-data/manage-indexes#configure-deletion-protection).

<Tip>
  You can delete an index using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes). For the index you want to delete, click the three dots to the right of the index name, then click **Delete**.
</Tip>

## Associate an embedding model

[Integrated inference](/guides/index-data/indexing-overview#integrated-embedding) lets you upsert and search without extra steps for embedding data and reranking results.

To configure an existing serverless index for an embedding model, use the [`configure_index`](/reference/api/2025-01/control-plane/configure_index) operation as follows:

* Set `embed.model` to one of [Pinecone's hosted embedding models](/guides/index-data/create-an-index#embedding-models).
* Set `embed.field_map` to the name of the field in your source document that contains the data for embedding.

<Warning>
  The `vector_type`, `metric`, and `dimension` of the index must be supported by the specified embedding model.
</Warning>

<CodeGroup>
  ```python Python
  # pip install --upgrade pinecone
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.configure_index(
      name="docs-example",
      embed={
        "model":"llama-text-embed-v2",
        "field_map":{"text": "chunk_text"}
      }
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.configureIndex('docs-example', {
    embed: {
      model: 'llama-text-embed-v2',
      fieldMap: { text: 'chunk_text' },
    },
  });
  ```

  ```json curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s -X PATCH "https://api.pinecone.io/indexes/docs-example" \
      -H "Content-Type: application/json" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
        "embed": {
            "model": "llama-text-embed-v2",
            "field_map": {
                "text": "chunk_text"
            }
        }
    }'
  ```
</CodeGroup>

## Configure deletion protection

<Note>
  This feature requires [Pinecone API version](/reference/api/versioning) `2024-07`, [Python SDK](/reference/python-sdk) v5.0.0, [Node.js SDK](/reference/node-sdk) v3.0.0, [Java SDK](/reference/java-sdk) v2.0.0, or [Go SDK](/reference/go-sdk) v1.0.0 or later.
</Note>

### Enable deletion protection

You can prevent an index and its data from accidental deleting when [creating a new index](/guides/index-data/create-an-index) or after its been created. In both cases, you set the `deletion_protection` parameter to `enabled`.

<Warning>
  Enabling deletion protection does *not* prevent [namespace deletions](/guides/manage-data/manage-namespaces#delete-a-namespace).
</Warning>

To enable deletion protection when creating a new index:

<CodeGroup>
  ```python Python
  # pip install "pinecone[grpc]"
  # Serverless index
  from pinecone.grpc import PineconeGRPC as Pinecone
  from pinecone import ServerlessSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.create_index(
    name="docs-example",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(
      cloud="aws",
      region="us-east-1"
    ),
    deletion_protection="enabled"
  )
  ```

  ```javascript JavaScript
  // npm install @pinecone-database/pinecone
  // Serverles index
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
    },
    deletionProtection: 'enabled',
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.IndexModel;
  import org.openapitools.db_control.client.model.DeletionProtection;

  // Serverless index
  public class CreateServerlessIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.createServerlessIndex("docs-example", "cosine", 1536, "aws", "us-east-1", DeletionProtection.enabled);
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

  // Serverless index
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
      DeletionProtection = DeletionProtection.Enabled
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  # Serverless index
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
           },
           "deletion_protection": "enabled"
        }'
  ```
</CodeGroup>

To enable deletion protection when configuring an existing index:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.configure_index(
     name="docs-example", 
     deletion_protection="enabled"
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const client = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await client.configureIndex('docs-example', { deletionProtection: 'enabled' });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;

  public class ConfigureIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.configureServerlessIndex("docs-example", DeletionProtection.ENABLED);
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

      idx, err := pc.ConfigureIndex(ctx, "docs-example", pinecone.ConfigureIndexParams{DeletionProtection: "enabled"})
    	if err != nil {
          log.Fatalf("Failed to configure index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("Successfully configured index \"%v\"", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var indexMetadata = await pinecone.ConfigureIndexAsync("docs-example", new ConfigureIndexRequest
  {
      DeletionProtection = DeletionProtection.Enabled,
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s -X PATCH "https://api.pinecone.io/indexes/docs-example-curl" \
      -H "Content-Type: application/json" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
          "deletion_protection": "enabled"
          }'
  ```
</CodeGroup>

When deletion protection is enabled on an index, requests to delete the index fail and return a `403 - FORBIDDEN` status with the following error:

```
Deletion protection is enabled for this index. Disable deletion protection before retrying.
```

### Disable deletion protection

Before you can [delete an index](#delete-an-index) with deletion protection enabled, you must first disable deletion protection as follows:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.configure_index(
     name="docs-example", 
     deletion_protection="disabled"
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const client = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await client.configureIndex('docs-example', { deletionProtection: 'disabled' });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;

  public class ConfigureIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          pc.configureServerlessIndex("docs-example", DeletionProtection.DISABLED);
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

      idx, err := pc.ConfigureIndex(ctx, "docs-example", pinecone.ConfigureIndexParams{DeletionProtection: "disabled"})
    	if err != nil {
          log.Fatalf("Failed to configure index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("Successfully configured index \"%v\"", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var configureIndexRequest = await pinecone.ConfigureIndexAsync("docs-example", new ConfigureIndexRequest
  {
      DeletionProtection = DeletionProtection.Disabled,
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s -X PATCH "https://api.pinecone.io/indexes/docs-example-curl" \
      -H "Content-Type: application/json" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
          "deletion_protection": "disabled"
          }'
  ```
</CodeGroup>

## Configure index tags

Tags are key-value pairs that you can use to categorize and identify the index.

### Add tags

To add tags to an index, use the `tags` parameter when [creating a new index](/guides/index-data/create-an-index) or when [configuring an existing index](/guides/indexes/pods/manage-pod-based-indexes).

To add tags when creating a new index:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone
  from pinecone import ServerlessSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.create_index(
      name="docs-example",
      dimension=1536,
      metric="cosine",
      spec=ServerlessSpec(
          cloud="aws",
          region="us-east-1"
      ),
      deletion_protection="disabled",
      tags={
          "example": "tag", 
          "environment": "development"
      }
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const client = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.createIndex({
    name: 'docs-example',
    dimension: 1536,
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      }
    },
    deletionProtection: 'disabled',
    tags: { example: 'tag', environment: 'development' }, 
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.IndexModel;
  import org.openapitools.db_control.client.model.DeletionProtection;
  import java.util.HashMap;

  // Serverless index
  public class CreateServerlessIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          HashMap<String, String> tags = new HashMap<>();
          tags.put("tag", "development");
          pc.createServerlessIndex("docs-example", "cosine", 1536, "aws", "us-east-1", DeletionProtection.DISABLED, tags);
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
      idx, err := pc.CreateServerlessIndex(ctx, &pinecone.CreateServerlessIndexRequest{
          Name:               "docs-example",
          Dimension:          1536,
          Metric:             pinecone.Cosine,
          Cloud:              pinecone.Aws,
          Region:             "us-east-1",
          DeletionProtection: "disabled",
          Tags:               &pinecone.IndexTags{ "example": "tag", "environment": "development" },
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
      Name = "docs-example",
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
          { "example", "tag" }, 
          { "environment", "development" }
      }
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  # Serverless index
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
           },
          "tags": {
              "example": "tag",
              "environment": "development"
          },
           "deletion_protection": "disabled"
        }'
  ```
</CodeGroup>

<Tip>
  You can add tags during index creation using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/create-index/).
</Tip>

To add or update tags when configuring an existing index:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.configure_index(
      name="docs-example", 
      tags={
          example: "tag", 
          environment: "development" 
      }
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const client = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await client.configureIndex('docs-example', { tags: { example: 'tag', environment: 'development' }});
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;
  import java.util.HashMap;

  public class ConfigureIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          HashMap<String, String> tags = new HashMap<>();
          tags.put("tag", "development");

          pc.configureServerlessIndex("docs-example", DeletionProtection.ENABLED, tags);
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

      idx, err := pc.ConfigureIndex(ctx, 
          "docs-example", 
          pinecone.ConfigureIndexParams{
              Tags: pinecone.IndexTags{
  			    "example": "tag",
                  "environment": "development",
              },
          },
      )    
    	if err != nil {
          log.Fatalf("Failed to configure index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("Successfully configured index \"%v\"", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var configureIndexRequest = await pinecone.ConfigureIndexAsync("docs-example", new ConfigureIndexRequest
  {
      Tags = new Dictionary<string, string> 
      { 
          { "example", "tag" }, 
          { "environment", "development" }
      }
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s -X PATCH "https://api.pinecone.io/indexes/docs-example-curl" \
      -H "Content-Type: application/json" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
              "tags": {
                  "example": "tag",
                  "environment": "development"
              }
          }'
  ```
</CodeGroup>

<Tip>
  You can add or update tags when configuring an existing index using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes). Find the index to edit and click the **ellipsis (..) menu > Add tags**.
</Tip>

### View tags

To view the tags of an index, [list all indexes](/guides/manage-data/manage-indexes) in a project or [get information about a specific index](/guides/manage-data/manage-indexes).

### Remove tags

To remove a tag from an index, [configure the index](/reference/api/2024-10/control-plane/configure_index) and use the `tags` parameter to send the tag key with an empty value (`""`).

The following example removes the `example: tag` tag from `docs-example`:

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.configure_index(
      name="docs-example", 
      tags={"example": ""}
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const client = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await client.configureIndex('docs-example', { tags: { example: '' }});
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.model.*;
  import java.util.HashMap;

  public class ConfigureIndexExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
          HashMap<String, String> tags = new HashMap<>();
          tags.put("example", "");

          pc.configureServerlessIndex("docs-example", DeletionProtection.ENABLED, tags);
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

      idx, err := pc.ConfigureIndex(ctx, 
          "docs-example", 
          pinecone.ConfigureIndexParams{
              Tags: pinecone.IndexTags{
  			    "example": "",
              },
          },
      )    
    	if err != nil {
          log.Fatalf("Failed to configure index \"%v\": %v", idx.Name, err)
      } else {
          fmt.Printf("Successfully configured index \"%v\"", idx.Name)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var configureIndexRequest = await pinecone.ConfigureIndexAsync("docs-example", new ConfigureIndexRequest
  {
      Tags = new Dictionary<string, string> 
      { 
          { "example", "" } 
      }
  });
  ```

  ```shell curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -s -X PATCH "https://api.pinecone.io/indexes/docs-example-curl" \
      -H "Content-Type: application/json" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
              "tags": {
                  "example": ""
              }
          }'
  ```
</CodeGroup>

<Tip>
  You can remove tags from an index using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes). Find the index to edit and click the **ellipsis (..) menu > \_\_ tags**.
</Tip>

## View backups for an index

Serverless indexes can be [backed up](/guides/manage-data/back-up-an-index). You can [view all backups for a specific index](/reference/api/2025-04/control-plane/list_index_backups), as in the following example:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  index_backups = pc.list_backups(index_name="docs-example")

  print(index_backups)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const indexBackups = await pc.listBackups({ indexName: 'docs-example' });

  console.log(indexBackups);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.*;

  public class CreateBackup {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();

          String indexName = "docs-example";
          BackupList indexBackupList = pc.listIndexBackups(indexName);

          System.out.println(indexBackupList);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var indexBackups = await pinecone.Backups.ListByIndexAsync( "docs-example", new ListBackupsByIndexRequest());

  Console.WriteLine(indexBackups);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_NAME="docs-example"

  curl -X GET "https://api.pinecone.io/indexes/$INDEX_NAME/backups" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -H "accept: application/json"
  ```
</CodeGroup>

The example returns a response like the following:

<CodeGroup>
  ```python Python
  [{
      "backup_id": "8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
      "source_index_name": "docs-example",
      "source_index_id": "f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74",
      "status": "Ready",
      "cloud": "aws",
      "region": "us-east-1",
      "tags": {},
      "name": "example-backup",
      "description": "Monthly backup of production index",
      "dimension": 1024,
      "record_count": 98,
      "namespace_count": 3,
      "size_bytes": 1069169,
      "created_at": "2025-05-15T00:52:10.809305882Z"
  }]
  ```

  ```javascript JavaScript
  {
    data: [
      {
        backupId: '8c85e612-ed1c-4f97-9f8c-8194e07bcf71',
        sourceIndexName: 'docs-example',
        sourceIndexId: 'f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74',
        name: 'example-backup',
        description: 'Monthly backup of production index',
        status: 'Ready',
        cloud: 'aws',
        region: 'us-east-1',
        dimension: 1024,
        metric: undefined,
        recordCount: 98,
        namespaceCount: 3,
        sizeBytes: 1069169,
        tags: {},
        createdAt: '2025-05-14T16:37:25.625540Z'
      }
    ],
    pagination: undefined
  }
  ```

  ```java Java
  class BackupList {
      data: [class BackupModel {
          backupId: 8c85e612-ed1c-4f97-9f8c-8194e07bcf71
          sourceIndexName: docs-example
          sourceIndexId: f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74
          name: example-backup
          description: Monthly backup of production index
          status: Initializing
          cloud: aws
          region: us-east-1
          dimension: null
          metric: null
          recordCount: null
          namespaceCount: null
          sizeBytes: null
          tags: {}
          createdAt: 2025-05-16T19:46:26.248428Z
          additionalProperties: null
      }]
      pagination: null
      additionalProperties: null
  }
  ```

  ```csharp C#
  {
    "data":
    [
      {
        "backup_id":"9947520e-d5a1-4418-a78d-9f464c9969da",
        "source_index_id":"8433941a-dae7-43b5-ac2c-d3dab4a56b2b",
        "source_index_name":"docs-example",
        "tags":{},
        "name":"example-backup",
        "description":"Monthly backup of production index",
        "status":"Pending",
        "cloud":"aws",
        "region":"us-east-1",
        "dimension":1024,
        "record_count":98,
        "namespace_count":3,
        "size_bytes":1069169,
        "created_at":"2025-03-11T18:29:50.549505Z"
      }
    ]
  }
  ```

  ```json curl
  {
    "data":
    [
      {
        "backup_id":"9947520e-d5a1-4418-a78d-9f464c9969da",
        "source_index_id":"8433941a-dae7-43b5-ac2c-d3dab4a56b2b",
        "source_index_name":"docs-example",
        "tags":{},
        "name":"example-backup",
        "description":"Monthly backup of production index",
        "status":"Pending",
        "cloud":"aws",
        "region":"us-east-1",
        "dimension":1024,
        "record_count":98,
        "namespace_count":3,
        "size_bytes":1069169,
        "created_at":"2025-03-11T18:29:50.549505Z"
        }
      ],
    "pagination":null
  }
  ```
</CodeGroup>

<Tip>
  You can view the backups for a specific index from either the [Backups](https://app.pinecone.io/organizations/-/projects/-/backups) tab or the [Indexes](https://app.pinecone.io/organizations/-/projects/-/indexes) tab in the Pinecone console.
</Tip>
