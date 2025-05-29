# Manage namespaces

This page describes how to list, describe, and delete a [namespace](/guides/index-data/indexing-overview#namespaces) in Pinecone.

<Note>
  These operations are available in API versions `2025-04` and later.
</Note>

## List all namespaces in an index

You can [list all namespaces](/reference/api/2025-04/data-plane/listnamespaces) in a serverless index as follows.

Up to 100 namespaces are returned at a time by default, in sorted order (bitwise “C” collation). If the `limit` parameter is set, up to that number of namespaces are returned instead. Whenever there are additional namespaces to return, the response also includes a `pagination_token` that you can use to get the next batch of namespaces. When the response does not include a `pagination_token`, there are no more namespaces to return.

<CodeGroup>
  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  const namespaceList = await index.listNamespaces();

  console.log(namespaceList);
  ```

  ```java Java
  import io.pinecone.clients.AsyncIndex;
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.ListNamespacesResponse;
  import org.openapitools.db_data.client.ApiException;

  public class Namespaces {
      public static void main(String[] args) throws ApiException {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);

          Index index = new Index(config, connection, "docs-example");

          ListNamespacesResponse listNamespacesResponse = index.listNamespaces();

          // List all restore jobs with default pagination limit (100)
          ListNamespacesResponse listNamespacesResponse = index.listNamespaces(null, null);

          // List all restore jobs with pagination limit of 2
          ListNamespacesResponse listNamespacesResponseWithLimit = index.listNamespaces(2);

          // List all restore jobs with pagination limit and token
          ListNamespacesResponse listNamespacesResponsePaginated = index.listNamespaces(5, "eyJza2lwX3Bhc3QiOiIxMDEwMy0=");

          System.out.println(restoreJobListWithLimit);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("PINECONE_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var namespaces = await index.ListNamespacesAsync(new ListNamespacesRequest());

  Console.WriteLine(namespaces);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://$INDEX_HOST/namespaces" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

The response will look like the following:

<CodeGroup>
  ```javascript JavaScript
  {
    namespaces: [
      { name: 'example-namespace', recordCount: '20000' },
      { name: 'example-namespace2', recordCount: '10500' },
      ...
    ],
    pagination: "Tm90aGluZyB0byBzZWUgaGVyZQo="
  }
  ```

  ```java Java
  namespaces {
    name: "example-namespace"
    record_count: 20000
  }
  namespaces {
    name: "example-namespace2"
    record_count: 10500
  }
  pagination {
    next: "eyJza2lwX3Bhc3QiOiJlZDVhYzFiNi1kMDFiLTQ2NTgtYWVhZS1hYjJkMGI2YzBiZjQiLCJwcmVmaXgiOm51bGx9"
  }
  ```

  ```csharp C#
  {
    "namespaces":[
      {"name":"example-namespace","recordCount":20000},
      {"name":"example-namespace2","recordCount":10500},
      ...
    ],
    "pagination":"Tm90aGluZyB0byBzZWUgaGVyZQo="
  }
  ```

  ```json curl
  {
    "namespaces": [
      {
        "name": "example-namespace",
        "record_count": 20000
      },
      {
        "name": "example-namespace-2",
        "record_count": 10500
      },
      ...
    ],
    "pagination": {
      "next": "Tm90aGluZyB0byBzZWUgaGVyZQo="
    }
  }
  ```
</CodeGroup>

## Describe a namespace

To [get details about a namespace](/reference/api/2025-04/data-plane/describenamespace) in a serverless index, including the total number of vectors in the namespace:

<CodeGroup>
  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const index = pc.index('docs-example');

  const namespace = await index.describeNamespace('example-namespace');

  console.log(namespace);
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;
  import io.pinecone.proto.NamespaceDescription;

  import org.openapitools.db_data.client.ApiException;

  public class Namespaces {
      public static void main(String[] args) throws ApiException {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);

          Index index = new Index(config, connection, "docs-example");

          NamespaceDescription namespaceDescription = index.describeNamespace("example-namespace");

          System.out.println(namespaceDescription);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("PINECONE_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var @namespace = await index.DescribeNamespaceAsync("example-namespace");

  Console.WriteLine(@namespace);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="YOUR_INDEX_HOST"
  NAMESPACE="YOUR_NAMESPACE"  # To target the default namespace, use "__default__".

  curl -X GET "https://$INDEX_HOST/namespaces/$NAMESPACE" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

The response will look like the following:

<CodeGroup>
  ```javascript JavaScript
  { name: 'example-namespace', recordCount: '20000' }
  ```

  ```java Java
  name: "example-namespace"
  record_count: 20000
  ```

  ```csharp C#
  {"name":"example-namespace","recordCount":20000}
  ```

  ```json curl
  {
    "name": "example-namespace",
    "record_count": 20000
  }
  ```
</CodeGroup>

## Delete a namespace

To [delete a namespace](/reference/api/2025-04/data-plane/deletenamespace) in a serverless index:

<Warning>
  Deleting a namespace is irreversible. All data in the namespace will be permanently deleted.
</Warning>

<CodeGroup>
  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const index = pc.index('docs-example');

  const namespace = await index.deleteNamespace('example-namespace');

  console.log(namespace);
  ```

  ```java Java
  import io.pinecone.clients.Index;
  import io.pinecone.configs.PineconeConfig;
  import io.pinecone.configs.PineconeConnection;

  import java.util.concurrent.ExecutionException;

  public class DeleteNamespace {
      public static void main(String[] args) throws ExecutionException, InterruptedException {
          PineconeConfig config = new PineconeConfig("YOUR_API_KEY");
        // To get the unique host for an index, 
        // see https://docs.pinecone.io/guides/manage-data/target-an-index
          config.setHost("INDEX_HOST");
          PineconeConnection connection = new PineconeConnection(config);

          Index index = new Index(config, connection, "docs-example");

          index.deleteNamespace("example-namespace");
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("PINECONE_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  await index.DeleteNamespaceAsync("example-namespace");
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="YOUR_INDEX_HOST"
  NAMESPACE="YOUR_NAMESPACE" # To target the default namespace, use "__default__".

  curl -X DELETE "https://$INDEX_HOST/namespaces/$NAMESPACE" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

## Rename a namespace

Pinecone does not support renaming namespaces directly. Instead, you must [delete the records](/guides/manage-data/delete-data) in the namespace and [upsert the records](/guides/index-data/upsert-data) to a new namespace.

## Move records to a new namespace

Pinecone does not support moving records between namespaces directly. Instead, you must [delete the records](/guides/manage-data/delete-data) in the old namespace and [upsert the records](/guides/index-data/upsert-data) to the new namespace.
