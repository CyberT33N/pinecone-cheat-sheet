# Back up an index

This page describes how to create a static copy of a serverless index, also known as a [backup](/guides/manage-data/backups-overview).

<Warning>
  Serverless index [backups](/guides/manage-data/backups-overview) are in [public preview](/release-notes/feature-availability) and available only on [Standard and Enterprise plans](https://www.pinecone.io/pricing/).
</Warning>

## Create a backup

You can [create a backup from a serverless index](/reference/api/2025-04/control-plane/create_backup), as in the following example:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  backup = pc.create_backup(
      index_name="docs-example", 
      backup_name="example-backup", 
      description="Monthly backup of production index"
  )

  print(backup)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const backup = await pc.createBackup({
    indexName: 'docs-example',
    name: 'example-backup',
    description: 'Monthly backup of production index',
  });

  console.log(backup);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.*;

  public class CreateBackup {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();

          String indexName = "docs-example";
          String backupName = "example-backup";
          String backupDescription = "Monthly backup of production index";

          BackupModel backup = pc.createBackup(indexName,backupName, backupDescription);

          System.out.println(backup);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("PINECONE_API_KEY");

  var backup = await pinecone.Backups.BackupIndexAsync(
      "docs-example", 
      new BackupIndexRequest
      {
          Name = "example-backup",
          Description = "Monthly backup of production index"
      }
  );

  Console.WriteLine(backup);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  INDEX_NAME="docs-example"

  curl "https://api.pinecone.io/indexes/$INDEX_NAME/backups" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
        "name": "example-backup", 
        "description": "Monthly backup of production index"
        }'
  ```
</CodeGroup>

The example returns a response like the following:

<CodeGroup>
  ```python Python
  {'backup_id': '8c85e612-ed1c-4f97-9f8c-8194e07bcf71',
   'cloud': 'aws',
   'created_at': '2025-05-15T00:52:10.809305882Z',
   'description': 'Monthly backup of production index',
   'dimension': 1024,
   'name': 'example-backup',
   'namespace_count': 3,
   'record_count': 98,
   'region': 'us-east-1',
   'size_bytes': 1069169,
   'source_index_id': 'f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74',
   'source_index_name': 'docs-example',
   'status': 'Ready',
   'tags': {}}
  ```

  ```javascript JavaScript
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
  ```

  ```java Java
  class BackupModel {
      backupId: 0d75b99f-be61-4a93-905e-77201286c02e
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
      createdAt: 2025-05-16T19:42:23.804787550Z
      additionalProperties: null
  }
  ```

  ```csharp C#
  {
      "backup_id": "8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
      "source_index_name": "docs-example",
      "source_index_id": "f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74",
      "name": "example-backup",
      "description": "Monthly backup of production index",
      "status": "Ready",
      "cloud": "aws",
      "region": "us-east-1",
      "tags": {},
      "created_at": "2025-05-15T00:52:10.809305882Z"
  }
  ```

  ```json curl
  {
    "backup_id":"8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
    "source_index_id":"f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74",
    "source_index_name":"docs-example",
    "tags":{},
    "name":"example-backup",
    "description":"Monthly backup of production index",
    "status":"Ready",
    "cloud":"aws",
    "region":"us-east-1",
    "dimension":1024,
    "record_count":96,
    "namespace_count":3,
    "size_bytes":1069169,
    "created_at":"2025-05-14T16:37:25.625540Z"
    }
  ```
</CodeGroup>

<Tip>
  You can create a backup using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/backups).
</Tip>

## View all backups for an index

You can [view all backups for an index](/reference/api/2025-04/control-plane/list_index_backups) as follows.

Up to 100 backups are returned at a time by default, in sorted order (bitwise “C” collation). If the `limit` parameter is set, up to that number of backups are returned instead. Whenever there are additional backups to return, the response also includes a `pagination_token` that you can use to get the next batch of backups. When the response does not include a `pagination_token`, there are no more backups to return.

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

## View all backups in a project

You can [view backups for all indexes in a project](/reference/api/2025-04/control-plane/list_project_backups) as follows.

Up to 100 backups are returned at a time by default, in sorted order (bitwise “C” collation). If the `limit` parameter is set, up to that number of backups are returned instead. Whenever there are additional backups to return, the response also includes a `pagination_token` that you can use to get the next batch of backups. When the response does not include a `pagination_token`, there are no more backups to return.

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  project_backups = pc.list_backups()

  print(project_backups)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const projectBackups = await pc.listBackups();

  console.log(projectBackups);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.*;

  public class CreateBackup {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();

          String indexName = "docs-example";
          BackupList projectBackupList = pc.listProjectBackups();

          System.out.println(projectBackupList);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("PINECONE_API_KEY");

  var backups = await pinecone.Backups.ListAsync();

  Console.WriteLine(backups);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -X GET "https://api.pinecone.io/backups" \
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
      "created_at": "2025-05-15T20:26:21.248515Z"
  }, {
      "backup_id": "95707edb-e482-49cf-b5a5-312219a51a97",
      "source_index_name": "docs-example2",
      "source_index_id": "b49f27d1-1bf3-49c6-82b5-4ae46f00f0e6",
      "status": "Ready",
      "cloud": "aws",
      "region": "us-east-1",
      "tags": {},
      "name": "example-backup2",
      "description": "Monthly backup of production index",
      "dimension": 1024,
      "record_count": 97,
      "namespace_count": 2,
      "size_bytes": 1069169,
      "created_at": "2025-05-15T00:52:10.809354Z"
  }, {
      "backup_id": "8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
      "source_index_name": "docs-example3",
      "source_index_id": "f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74",
      "status": "Ready",
      "cloud": "aws",
      "region": "us-east-1",
      "tags": {},
      "name": "example-backup3",
      "description": "Monthly backup of production index",
      "dimension": 1024,
      "record_count": 98,
      "namespace_count": 3,
      "size_bytes": 1069169,
      "created_at": "2025-05-14T16:37:25.625540Z"
  }]
  ```

  ```javascript JavaScript
  {
    data: [
      {
        backupId: 'e12269b0-a29b-4af0-9729-c7771dec03e3',
        sourceIndexName: 'docs-example',
        sourceIndexId: 'bcb5b3c9-903e-4cb6-8b37-a6072aeb874f',
        name: 'example-backup',
        description: undefined,
        status: 'Ready',
        cloud: 'aws',
        region: 'us-east-1',
        dimension: 0,
        metric: undefined,
        recordCount: 96,
        namespaceCount: 1,
        sizeBytes: 86393,
        tags: undefined,
        createdAt: '2025-05-14T17:00:45.803146Z'
      },
      {
        backupId: 'd686451d-1ede-4004-9f72-7d22cc799b6e',
        sourceIndexName: 'docs-example2',
        sourceIndexId: 'b49f27d1-1bf3-49c6-82b5-4ae46f00f0e6',
        name: 'example-backup2',
        description: undefined,
        status: 'Ready',
        cloud: 'aws',
        region: 'us-east-1',
        dimension: 1024,
        metric: undefined,
        recordCount: 50,
        namespaceCount: 1,
        sizeBytes: 545171,
        tags: undefined,
        createdAt: '2025-05-14T17:00:34.814371Z'
      },
      {
        backupId: '8c85e612-ed1c-4f97-9f8c-8194e07bcf71',
        sourceIndexName: 'docs-example3',
        sourceIndexId: 'f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74',
        name: 'example-backup3',
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
          backupId: 13761d20-7a0b-4778-ac27-36dd91c4be43
          sourceIndexName: example-dense-index
          sourceIndexId: f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74
          name: example-backup-java2
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
      }, class BackupModel {
          backupId: 0d75b99f-be61-4a93-905e-77201286c02e
          sourceIndexName: example-dense-index
          sourceIndexId: f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74
          name: example-backup-java
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
          createdAt: 2025-05-16T19:42:23.804820Z
          additionalProperties: null
      }, class BackupModel {
          backupId: bf2cda5d-b233-4a0a-aae9-b592780ad3ff
          sourceIndexName: example-sparse-index
          sourceIndexId: bcb5b3c9-903e-4cb6-8b37-a6072aeb874f
          name: example-sparse-python
          description: Monthly backup of production index
          status: Ready
          cloud: aws
          region: us-east-1
          dimension: 0
          metric: null
          recordCount: 96
          namespaceCount: 1
          sizeBytes: 86393
          tags: {}
          createdAt: 2025-05-16T18:01:51.531129Z
          additionalProperties: null
      }]
      pagination: null
      additionalProperties: null
  }
  ```

  ```csharp C#
  {
    "data": [
      {
        "backup_id": "95707edb-e482-49cf-b5a5-312219a51a97",
        "source_index_name": "docs-example",
        "source_index_id": "f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74",
        "name": "example-backup",
        "description": "Monthly backup of production index",
        "status": "Ready",
        "cloud": "aws",
        "region": "us-east-1",
        "dimension": 1024,
        "record_count": 97,
        "namespace_count": 2,
        "size_bytes": 1069169,
        "tags": {},
        "created_at": "2025-05-15T00:52:10.809354Z"
      },
      {
        "backup_id": "e12269b0-a29b-4af0-9729-c7771dec03e3",
        "source_index_name": "docs-example2",
        "source_index_id": "bcb5b3c9-903e-4cb6-8b37-a6072aeb874f",
        "name": "example-backup2",
        "status": "Ready",
        "cloud": "aws",
        "region": "us-east-1",
        "dimension": 0,
        "record_count": 96,
        "namespace_count": 1,
        "size_bytes": 86393,
        "created_at": "2025-05-14T17:00:45.803146Z"
      },
      {
        "backup_id": "d686451d-1ede-4004-9f72-7d22cc799b6e",
        "source_index_name": "docs-example3",
        "source_index_id": "b49f27d1-1bf3-49c6-82b5-4ae46f00f0e6",
        "name": "example-backup3",
        "status": "Ready",
        "cloud": "aws",
        "region": "us-east-1",
        "dimension": 1024,
        "record_count": 50,
        "namespace_count": 1,
        "size_bytes": 545171,
        "created_at": "2025-05-14T17:00:34.814371Z"
      }
    ]
  }
  ```

  ```json curl 
  {
    "data": [
      {
        "backup_id": "e12269b0-a29b-4af0-9729-c7771dec03e3",
        "source_index_id": "bcb5b3c9-903e-4cb6-8b37-a6072aeb874f",
        "source_index_name": "docs-example",
        "tags": null,
        "name": "example-backup",
        "description": null,
        "status": "Ready",
        "cloud": "aws",
        "region": "us-east-1",
        "dimension": 0,
        "record_count": 96,
        "namespace_count": 1,
        "size_bytes": 86393,
        "created_at": "2025-05-14T17:00:45.803146Z"
      },
      {
        "backup_id": "d686451d-1ede-4004-9f72-7d22cc799b6e",
        "source_index_id": "b49f27d1-1bf3-49c6-82b5-4ae46f00f0e6",
        "source_index_name": "docs-example2",
        "tags": null,
        "name": "example-backup2",
        "description": null,
        "status": "Ready",
        "cloud": "aws",
        "region": "us-east-1",
        "dimension": 1024,
        "record_count": 50,
        "namespace_count": 1,
        "size_bytes": 545171,
        "created_at": "2025-05-14T17:00:34.814371Z"
      },
      {
        "backup_id": "8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
        "source_index_id": "f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74",
        "source_index_name": "docs-example3",
        "tags": {},
        "name": "example-backup3",
        "description": "Monthly backup of production index",
        "status": "Ready",
        "cloud": "aws",
        "region": "us-east-1",
        "dimension": 1024,
        "record_count": 98,
        "namespace_count": 3,
        "size_bytes": 1069169,
        "created_at": "2025-05-14T16:37:25.625540Z"
      }
    ],
    "pagination": null
  }
  ```
</CodeGroup>

<Tip>
  You can view all backups in a project using the [Pinecone console](https://app.pinecone.io/organizations/-/projects-/backups).
</Tip>

## View backup details

You can [view the details of a backup](/reference/api/2025-04/control-plane/describe_backup), as in the following example:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  backup = pc.describe_backup(backup_id="8c85e612-ed1c-4f97-9f8c-8194e07bcf71")

  print(backup)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const backupDesc = await pc.describeBackup('8c85e612-ed1c-4f97-9f8c-8194e07bcf71');

  console.log(backupDesc);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.*;

  public class CreateBackup {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();

          BackupModel backupModel = pc.describeBackup("8c85e612-ed1c-4f97-9f8c-8194e07bcf71");

          System.out.println(backupModel);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("PINECONE_API_KEY");

  var backup = await pinecone.Backups.GetAsync("8c85e612-ed1c-4f97-9f8c-8194e07bcf71");

  Console.WriteLine(backup);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  BACKUP_ID="8c85e612-ed1c-4f97-9f8c-8194e07bcf71"

  curl -X GET "https://api.pinecone.io/backups/$BACKUP_ID" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04" \
      -H "accept: application/json"
  ```
</CodeGroup>

The example returns a response like the following:

<CodeGroup>
  ```python Python
  {'backup_id': '8c85e612-ed1c-4f97-9f8c-8194e07bcf71',
   'cloud': 'aws',
   'created_at': '2025-05-15T00:52:10.809354Z',
   'description': 'Monthly backup of production index',
   'dimension': 1024,
   'name': 'example-backup',
   'namespace_count': 3,
   'record_count': 98,
   'region': 'us-east-1',
   'size_bytes': 1069169,
   'source_index_id': 'f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74',
   'source_index_name': 'docs-example',
   'status': 'Ready',
   'tags': {}}
  ```

  ```javascript JavaScript
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
  ```

  ```java Java
  class BackupList {
      data: [class BackupModel {
          backupId: 95707edb-e482-49cf-b5a5-312219a51a97
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
    "backup_id": "95707edb-e482-49cf-b5a5-312219a51a97",
    "source_index_name": "docs-example",
    "source_index_id": "f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74",
    "name": "example-backup",
    "description": "Monthly backup of production index",
    "status": "Ready",
    "cloud": "aws",
    "region": "us-east-1",
    "dimension": 1024,
    "record_count": 97,
    "namespace_count": 2,
    "size_bytes": 1069169,
    "tags": {},
    "created_at": "2025-05-15T00:52:10.809354Z"
  }
  ```

  ```json curl
  {
    "backup_id":"8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
    "source_index_id":"f73b36c9-faf5-4a2c-b1d6-4013d8b1cc74",
    "source_index_name":"docs-example",
    "tags":{},
    "name":"example-backup",
    "description":"Monthly backup of production index",
    "status":"Ready",
    "cloud":"aws",
    "region":"us-east-1",
    "dimension":1024,
    "record_count":98,
    "namespace_count":3,
    "size_bytes":1069169,
    "created_at":"2025-03-11T18:29:50.549505Z"
  }
  ```
</CodeGroup>

<Tip>
  You can view backup details using the [Pinecone console](https://app.pinecone.io/organizations/-/projects-/backups).
</Tip>

## Delete a backup

You can [delete a backup](/reference/api/2025-04/control-plane/delete_backup), as in the following example:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.delete_backup(backup_id="9947520e-d5a1-4418-a78d-9f464c9969da")
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  await pc.deleteBackup('9947520e-d5a1-4418-a78d-9f464c9969da');
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.*;

  public class CreateBackup {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();

          pc.deleteBackup("9947520e-d5a1-4418-a78d-9f464c9969da");
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("PINECONE_API_KEY");

  await pinecone.Backups.DeleteAsync("9947520e-d5a1-4418-a78d-9f464c9969da");
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  BACKUP_ID="9947520e-d5a1-4418-a78d-9f464c9969da"

  curl -X DELETE "https://api.pinecone.io/backups/$BACKUP_ID" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>

<Tip>
  You can delete a backup using the [Pinecone console](https://app.pinecone.io/organizations/-/projects-/backups).
</Tip>
