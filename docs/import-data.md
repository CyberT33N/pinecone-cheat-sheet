# Import records

This page shows you how to import records from object storage into an index and interact with the import. Importing from object storage is the most efficient and cost-effective way to load large numbers of records into an index.

To run through this guide in your browser, see the [Bulk import colab notebook](https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/pinecone-import.ipynb).

<Note>
  This feature is in [public preview](/release-notes/feature-availability) and available only on [Standard and Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

## Before you import

Before you can import records, ensure you have a serverless index, a storage integration, and data formatted in a Parquet file and uploaded to the Amazon S3 bucket.

### Create an index

[Create a serverless index](/guides/index-data/create-an-index) for your data.

* Import does not support [integrated embedding](/guides/index-data/indexing-overview#vector-embedding), so make sure your index is not associated with an integrated embedding model.
* Import only supports AWS S3 as a data source, so make sure your index is also on AWS.
* You cannot import records into existing namespaces, so make sure your index does not have namespaces with the same name as the namespaces you want to import into.

### Add a storage integration

To import records from a secure data source, you must create an integration to allow Pinecone access to data in your object storage. For information on how to add, edit, and delete a storage integration, see [Manage storage integrations](/guides/operations/integrations/manage-storage-integrations).

<Note>
  To import records from a public data source, a storage integration is not required.
</Note>

### Prepare your data

For each namespace you want to import into, create a Parquet file and upload it to object storage.

<Tabs>
  <Tab title="Parquet file format">
    #### Dense index

    To import into a dense index, the Parquet file must contain the following columns:

    | Column name | Parquet type  | Description                                                                                                                     |
    | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
    | `id`        | `STRING`      | Required. The unique [identifier for each record](/guides/get-started/glossary#record-id).                                      |
    | `values`    | `LIST<FLOAT>` | Required. A list of floating-point values that make up the [dense vector embedding](/guides/get-started/glossary#dense-vector). |
    | `metadata`  | `STRING`      | Optional. Additional [metadata](/guides/get-started/glossary#metadata) for each record. To omit from specific rows, use `NULL`. |

    <Warning>
      The Parquet file cannot contain additional columns.
    </Warning>

    For example:

    ```parquet
    id | values                   | metadata
    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    1  | [ 3.82  2.48 -4.15 ... ] | {"year": 1984, "month": 6, "source": "source1", "title": "Example1", "text": "When ..."}
    2  | [ 1.82  3.48 -2.15 ... ] | {"year": 1990, "month": 4, "source": "source2", "title": "Example2", "text": "Who ..."}
    ```

    #### Sparse index

    To import into a sparse index, the Parquet file must contain the following columns:

    | Column name     | Parquet type                  | Description                                                                                                                                                                                     |
    | --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `id`            | `STRING`                      | Required. The unique [identifier for each record](/guides/get-started/glossary#record-id).                                                                                                      |
    | `sparse_values` | `LIST<INT>` and `LIST<FLOAT>` | Required. A list of floating-point values (sparse values) and a list of integer values (sparse indices) that make up the [sparse vector embedding](/guides/get-started/glossary#sparse-vector). |
    | `metadata`      | `STRING`                      | Optional. Additional [metadata](/guides/get-started/glossary#metadata) for each record. To omit from specific rows, use `NULL`.                                                                 |

    <Warning>
      The Parquet file cannot contain additional columns.
    </Warning>

    For example:

    ```parquet
    id | sparse_values                                                                                       | metadata
    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    1  | {"indices": [ 822745112 1009084850 1221765879 ... ], "values": [1.7958984 0.41577148 2.828125 ...]} | {"year": 1984, "month": 6, "source": "source1", "title": "Example1", "text": "When ..."}
    2  | {"indices": [ 504939989 1293001993 3201939490 ... ], "values": [1.4383747 0.72849722 1.384775 ...]} | {"year": 1990, "month": 4, "source": "source2", "title": "Example2", "text": "Who ..."}
    ```
  </Tab>

  <Tab title="Directory structure">
    In object storage, your directory structure determines which Pinecone namespaces your data is imported into. The files associated with each namespace must be in a separate prefix (or sub-directory). The namespace cannot be the same as an existing namespace in the index you are importing into.

    To import records, specify the URI of the prefix containing the namespace and Parquet files you want to import. For example:

    ```
    s3://BUCKET_NAME/PATH/TO/NAMESPACES
    --/example_namespace/
    ----0.parquet
    ----1.parquet
    ----2.parquet
    ----3.parquet
    ----.log
    --/example_namespace2/
    ----4.parquet
    ----5.parquet
    ----6.parquet
    ----7.parquet
    ----.log
    ```

    Pinecone then finds all `.parquet` files inside the namespace prefix and imports them into the namespace. All other file types are ignored.

    In the example above, the import is located at the top-level URL of `s3://BUCKET_NAME/PATH/TO/NAMESPACES/`. When scanning this directory, Pinecone finds the namespace `example_namespace`, which contains four `.parquet` files and one `.log` file. Pinecone ignores the `.log` file.

    <Warning>
      Each import request can import up 1TB of data, or 100,000,000 records into a maximum of 100 namespaces, whichever limit is met first.
    </Warning>
  </Tab>
</Tabs>

## Import records into an index

<Warning>
  Review current [limitations](#limitations) before starting an import.
</Warning>

Use the [`start_import`](/reference/api/2025-01/data-plane/start_import) operation to start an asynchronous import of vectors from object storage into an index.

To import from a private bucket, specify the Integration ID (`integration`) of the Amazon S3 integration you created. The ID is found on the [Storage integrations](https://app.pinecone.io/organizations/-/projects/-/storage) page of the Pinecone console. An ID is not needed to import from a public bucket.

The operation returns an `id` that you can use to [check the status of the import](#list-imports).

<Note>
  If you set the import to continue on error, the operation will skip records that fail to import and continue with the next record. The operation will complete, but there will not be any notification about which records, if any, failed to import. To see how many records were successfully imported, use the [`describe_import`](#describe-an-import) operation.
</Note>

<CodeGroup>
  ```python Python
  from pinecone import Pinecone, ImportErrorMode

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")
  root = "s3://BUCKET_NAME/PATH/TO/DIR"

  index.start_import(
      uri=root,
      error_mode=ImportErrorMode.CONTINUE, # or ImportErrorMode.ABORT
      integration_id="a12b3d4c-47d2-492c-a97a-dd98c8dbefde" # Optional for public buckets
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  const storageURI = 's3://BUCKET_NAME/PATH/TO/DIR';
  const errorMode = 'continue'; // or 'abort'
  const integrationID = 'a12b3d4c-47d2-492c-a97a-dd98c8dbefde'; // Optional for public buckets

  await index.startImport(storageURI, errorMode, integrationID); 
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import io.pinecone.clients.AsyncIndex;
  import org.openapitools.db_data.client.ApiException;
  import org.openapitools.db_data.client.model.ImportErrorMode;
  import org.openapitools.db_data.client.model.StartImportResponse;

  public class StartImport {
      public static void main(String[] args) throws ApiException {
          // Initialize a Pinecone client with your API key
          Pinecone pinecone = new Pinecone.Builder("YOUR_API_KEY").build();

          // Get async imports connection object
          AsyncIndex asyncIndex = pinecone.getAsyncIndexConnection("docs-example");

          // s3 uri
          String uri = "s3://BUCKET_NAME/PATH/TO/DIR";

          // Integration ID (optional for public buckets)
          String integrationId = "a12b3d4c-47d2-492c-a97a-dd98c8dbefde";

          // Start an import
          StartImportResponse response = asyncIndex.startImport(uri, integrationId, ImportErrorMode.OnErrorEnum.CONTINUE);
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
  	}

      uri := "s3://BUCKET_NAME/PATH/TO/DIR"
      errorMode := "continue" // or "abort"
      importRes, err := idxConnection.StartImport(ctx, uri, nil, (*pinecone.ImportErrorMode)(&errorMode))
      if err != nil {
          log.Fatalf("Failed to start import: %v", err)
      }
      fmt.Printf("Import started with ID: %s", importRes.Id)
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var uri = "s3://BUCKET_NAME/PATH/TO/DIR";

  var response = await index.StartBulkImportAsync(new StartImportRequest
  {
      Uri = uri,
      IntegrationId = "a12b3d4c-47d2-492c-a97a-dd98c8dbefde",
      ErrorMode = new ImportErrorMode { OnError = ImportErrorModeOnError.Continue }
  });
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl "https://$INDEX_HOST/bulk/imports" \
    -H 'Api-Key: $YOUR_API_KEY' \
    -H 'Content-Type: application/json' \
    -H 'X-Pinecone-API-Version: 2025-04' \
    -d '{
          "integrationId": "a12b3d4c-47d2-492c-a97a-dd98c8dbefde",
          "uri": "s3://BUCKET_NAME/PATH/TO/DIR",
          "errorMode": {
              "onError": "continue"
              }
          }'
  ```
</CodeGroup>

```json Response
{
   "operation_id": "101"
}
```

Once all the data is loaded, the [index builder](/reference/architecture/serverless-architecture#index-builder) will index the records, which usually takes at least 10 minutes. During this indexing process, the expected job status is `InProgress`, but `100.0` percent complete. Once all the imported records are indexed and fully available for querying, the import operation will be set to `Completed`.

<Tip>
  You can start a new import using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes). Find the index you want to import into, and click the **ellipsis (..) menu > Import data**.
</Tip>

## Manage imports

### List imports

Use the [`list_imports`](/reference/api/2025-01/data-plane/list_imports) operation to list all of the recent and ongoing imports. By default, the operation returns up to 100 imports per page. If the `limit` parameter is passed, the operation returns up to that number of imports per page instead. For example, if `limit=3`, up to 3 imports are returned per page. Whenever there are additional imports to return, the response includes a `pagination_token` for fetching the next page of imports.

<Tabs>
  <Tab title="Implicit pagination">
    When using the Python SDK, `list_import` paginates automatically.

    ```python Python
    from pinecone import Pinecone, ImportErrorMode

    pc = Pinecone(api_key="YOUR_API_KEY")

    # To get the unique host for an index, 
    # see https://docs.pinecone.io/guides/manage-data/target-an-index
    index = pc.Index(host="INDEX_HOST")

    # List using a generator that handles pagination
    for i in index.list_imports():
        print(f"id: {i.id} status: {i.status}")

    # List using a generator that fetches all results at once
    operations = list(index.list_imports())
    print(operations)
    ```

    ```json Response
    {
      "data": [
        {
          "id": "1",
          "uri": "s3://BUCKET_NAME/PATH/TO/DIR",
          "status": "Pending",
          "started_at": "2024-08-19T20:49:00.754Z",
          "finished_at": "2024-08-19T20:49:00.754Z",
          "percent_complete": 42.2,
          "records_imported": 1000000
        }
      ],
      "pagination": {
        "next": "Tm90aGluZyB0byBzZWUgaGVyZQo="
      }
    }
    ```

    <Tip>
      You can view the list of imports for an index in the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes/). Select the index and navigate to the **Imports** tab.
    </Tip>
  </Tab>

  <Tab title="Manual pagination">
    When using the Node.js SDK, Go SDK, .NET SDK, or REST API to list recent and ongoing imports, you must manually fetch each page of results. To view the next page of results, include the `paginationToken` provided in the response of the [`list_imports`](#list-imports) / `GET` request.

    <CodeGroup>
      ```javascript JavaScript
      import { Pinecone } from '@pinecone-database/pinecone';

      const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      const index = pc.index("INDEX_NAME", "INDEX_HOST")

      const results = await index.listImports({ limit: 10, paginationToken: 'Tm90aGluZyB0byBzZWUgaGVyZQo' });
      console.log(results);
      ```

      ```java Java
      import io.pinecone.clients.Pinecone;
      import io.pinecone.clients.AsyncIndex;
      import org.openapitools.db_data.client.ApiException;
      import org.openapitools.db_data.client.model.ListImportsResponse;

      public class ListImports {
          public static void main(String[] args) throws ApiException {
              // Initialize a Pinecone client with your API key
              Pinecone pinecone = new Pinecone.Builder("YOUR_API_KEY").build();

              // Get async imports connection object
              AsyncIndex asyncIndex = pinecone.getAsyncIndexConnection("docs-example");

              // List imports
              ListImportsResponse response = asyncIndex.listImports(10, "Tm90aGluZyB0byBzZWUgaGVyZQo");

              System.out.println(response);
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

          // To get the unique host for an index, 
          // see https://docs.pinecone.io/guides/manage-data/target-an-index
          idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST"})
          if err != nil {
              log.Fatalf("Failed to create IndexConnection for Host: %v", err)
        	}

          limit := int32(10)
          firstImportPage, err := idxConnection.ListImports(ctx, &limit, nil)
          if err != nil {
              log.Fatalf("Failed to list imports: %v", err)
          }
          fmt.Printf("First page of imports: %+v", firstImportPage.Imports)

          paginationToken := firstImportPage.NextPaginationToken
          nextImportPage, err := idxConnection.ListImports(ctx, &limit, paginationToken)
          if err != nil {
              log.Fatalf("Failed to list imports: %v", err)
          }
          fmt.Printf("Second page of imports: %+v", nextImportPage.Imports)
      }
      ```

      ```csharp C#
      using Pinecone;

      var pinecone = new PineconeClient("YOUR_API_KEY");

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      var index = pinecone.Index(host: "INDEX_HOST");

      var imports = await index.ListBulkImportsAsync(new ListBulkImportsRequest
      {
          Limit = 10,
          PaginationToken = "Tm90aGluZyB0byBzZWUgaGVyZQo"
      });
      ```

      ```bash curl
      # To get the unique host for an index,
      # see https://docs.pinecone.io/guides/manage-data/target-an-index
      PINECONE_API_KEY="YOUR_API_KEY"
      INDEX_HOST="INDEX_HOST"

      curl -X GET "https://$INDEX_HOST/bulk/imports?paginationToken==Tm90aGluZyB0byBzZWUgaGVyZQo" \
        -H 'Api-Key: $YOUR_API_KEY' \
        -H 'X-Pinecone-API-Version: 2025-04'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

### Describe an import

Use the [`describe_import`](/reference/api/2025-01/data-plane/describe_import) operation to get details about a specific import.

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.describe_import(id="101")
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });


  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  const results = await index.describeImport(id='101');
  console.log(results);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import io.pinecone.clients.AsyncIndex;
  import org.openapitools.db_data.client.ApiException;
  import org.openapitools.db_data.client.model.ImportModel;

  public class DescribeImport {
      public static void main(String[] args) throws ApiException {
          // Initialize a Pinecone client with your API key
          Pinecone pinecone = new Pinecone.Builder("YOUR_API_KEY").build();

          // Get async imports connection object
          AsyncIndex asyncIndex = pinecone.getAsyncIndexConnection("docs-example");

          // Describe import
          ImportModel importDetails = asyncIndex.describeImport("101");

          System.out.println(importDetails);
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      importID := "101"

      importDesc, err := idxConnection.DescribeImport(ctx, importID)
      if err != nil {
          log.Fatalf("Failed to describe import: %s - %v", importID, err)
      }
      fmt.Printf("Import ID: %s, Status: %s", importDesc.Id, importDesc.Status)
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var importDetails = await index.DescribeBulkImportAsync("101");
  ```

  ```bash curl
  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X GET "https://{INDEX_HOST}/bulk/imports/101" \
    -H 'Api-Key: $YOUR_API_KEY' \
    -H 'X-Pinecone-API-Version: 2025-04'
  ```
</CodeGroup>

```json Response
{
  "id": "101",
  "uri": "s3://BUCKET_NAME/PATH/TO/DIR",
  "status": "Pending",
  "created_at": "2024-08-19T20:49:00.754Z",
  "finished_at": "2024-08-19T20:49:00.754Z",
  "percent_complete": 42.2,
  "records_imported": 1000000
}
```

<Tip>
  You can view the details of your import using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/import).
</Tip>

### Cancel an import

The [`cancel_import`](/reference/api/2025-01/data-plane/cancel_import) operation cancels an import if it is not yet finished. It has no effect if the import is already complete.

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # To get the unique host for an index, 
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  index = pc.Index(host="INDEX_HOST")

  index.cancel_import(id="101")
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  const index = pc.index("INDEX_NAME", "INDEX_HOST")

  await index.cancelImport(id='101');
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import io.pinecone.clients.AsyncIndex;
  import org.openapitools.db_data.client.ApiException;

  public class CancelImport {
      public static void main(String[] args) throws ApiException {
          // Initialize a Pinecone client with your API key
          Pinecone pinecone = new Pinecone.Builder("YOUR_API_KEY").build();

          // Get async imports connection object
          AsyncIndex asyncIndex = pinecone.getAsyncIndexConnection("docs-example");

          // Cancel import
          asyncIndex.cancelImport("2");
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

      // To get the unique host for an index, 
      // see https://docs.pinecone.io/guides/manage-data/target-an-index
      idxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "INDEX_HOST"})
      if err != nil {
          log.Fatalf("Failed to create IndexConnection for Host: %v", err)
    	}

      importID := "101"

      err = idxConnection.CancelImport(ctx, importID)
      if err != nil {
          log.Fatalf("Failed to cancel import: %s", importID)
      }

      importDesc, err := idxConnection.DescribeImport(ctx, importID)
      if err != nil {
          log.Fatalf("Failed to describe import: %s - %v", importID, err)
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  // To get the unique host for an index, 
  // see https://docs.pinecone.io/guides/manage-data/target-an-index
  var index = pinecone.Index(host: "INDEX_HOST");

  var cancelResponse = await index.CancelBulkImportAsync("101");
  ```

  ```bash curl
  # To get the unique host for an index,
  # see https://docs.pinecone.io/guides/manage-data/target-an-index
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_HOST="INDEX_HOST"

  curl -X DELETE "https://{INDEX_HOST}/bulk/imports/101" \
    -H 'Api-Key: $YOUR_API_KEY' \
    -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

```json Response
{}
```

<Tip>
  You can cancel your import using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/import). To cancel an ongoing import, select the index you are importing into and navigate to the **Imports** tab. Then, click the **ellipsis (..) menu > Cancel**.
</Tip>
