# Restore an index

You can restore a serverless index by creating a new index from a [backup](/guides/manage-data/backups-overview).

## Create a serverless index from a backup

<Warning>
  Serverless index [backups](/guides/manage-data/backups-overview) are in [public preview](/release-notes/feature-availability) and available only on [Standard and Enterprise plans](https://www.pinecone.io/pricing/).
</Warning>

You can create a new serverless index from a backup. The new index can differ from the source index in name, but it must be created in the same cloud provider and region, and have the same dimensions and similarity metric as the source index. The new index is queryable and writable. You cannot create a pod-based index from a backup of a serverless index.

To [create a serverless index from a backup](/reference/api/2025-04/control-plane/create_index_from_backup), provide the `backup_id` parameter containing the ID of the backup from which you wish to create an index:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.create_index_from_backup(
      backup_id="a65ff585-d987-4da5-a622-72e19a6ed5f4",
      name="restored-index",
      tags={
          "tag0": "val0", 
          "tag1": "val1"
      },
      deletion_protection="enabled"
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const response = await pc.createIndexFromBackup({
    backupId: 'a65ff585-d987-4da5-a622-72e19a6ed5f4',
    name: 'restored-index',
    tags: {
      tag0: 'val0',
      tag1: 'val1'
    },
    deletionProtection: 'enabled'
  });

  console.log(response);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.*;

  public class CreateIndexFromBackup {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();

          String backupID = "a65ff585-d987-4da5-a622-72e19a6ed5f4";
          String indexName = "restored-index";

          CreateIndexFromBackupResponse backupResponse = pc.createIndexFromBackup(backupID, indexName);
          System.out.println(backupResponse);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var response = await pinecone.Backups.CreateIndexFromBackupAsync(
      "a65ff585-d987-4da5-a622-72e19a6ed5f4", 
      new CreateIndexFromBackupRequest
      {
          Name = "restored-index",
          Tags = new Dictionary<string, string> 
          { 
              { "tag0", "val0" },
              { "tag1", "val1" }
          },
          DeletionProtection = DeletionProtection.Enabled
      }
  );

  Console.WriteLine(response);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  BACKUP_ID="a65ff585-d987-4da5-a622-72e19a6ed5f4"

  curl "https://api.pinecone.io/backups/$BACKUP_ID/create-index" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -H 'Content-Type: application/json' \
    -d '{
          "name": "restored-index",
          "tags": {
            "tag0": "val0",
            "tag1": "val1"
          },
          "deletion_protection": "enabled"
        }'
  ```
</CodeGroup>

The example returns a response like the following:

<CodeGroup>
  ```python Python
  {'deletion_protection': 'enabled',
   'dimension': 1024,
   'embed': {'dimension': 1024,
             'field_map': {'text': 'chunk_text'},
             'metric': 'cosine',
             'model': 'multilingual-e5-large',
             'read_parameters': {'input_type': 'query', 'truncate': 'END'},
             'vector_type': 'dense',
             'write_parameters': {'input_type': 'passage', 'truncate': 'END'}},
   'host': 'example-dense-index-python3-govk0nt.svc.aped-4627-b74a.pinecone.io',
   'metric': 'cosine',
   'name': 'example-dense-index-python3',
   'spec': {'serverless': {'cloud': 'aws', 'region': 'us-east-1'}},
   'status': {'ready': True, 'state': 'Ready'},
   'tags': {'tag0': 'val0', 'tag1': 'val1'},
   'vector_type': 'dense'}
  ```

  ```javascript JavaScript
  {
    restoreJobId: 'e9ba8ff8-7948-4cfa-ba43-34227f6d30d4',
    indexId: '025117b3-e683-423c-b2d1-6d30fbe5027f'
  }
  ```

  ```java Java
  class CreateIndexFromBackupResponse {
      restoreJobId: e9ba8ff8-7948-4cfa-ba43-34227f6d30d4
      indexId: 025117b3-e683-423c-b2d1-6d30fbe5027f
      additionalProperties: null
  }
  ```

  ```csharp C#
  {
      "restore_job_id":"e9ba8ff8-7948-4cfa-ba43-34227f6d30d4",
      "index_id":"025117b3-e683-423c-b2d1-6d30fbe5027f"
  }
  ```

  ```json curl
  {
      "restore_job_id":"e9ba8ff8-7948-4cfa-ba43-34227f6d30d4",
      "index_id":"025117b3-e683-423c-b2d1-6d30fbe5027f"
  }
  ```
</CodeGroup>

<Tip>
  You can create a serverless index from a backup using the [Pinecone console](https://app.pinecone.io/organizations/-/projects).
</Tip>

## Create a serverless index from a collection

You can migrate a pod-based index to serverless by creating a new serverless index from a collection. For more information, see [Migrate a pod-based index to serverless](/guides/indexes/pods/migrate-a-pod-based-index-to-serverless).

## List restore jobs

You can [list all restore jobs](/reference/api/2025-04/control-plane/list_restore_jobs) as follows.

<Note>
  Up to 100 restore jobs are returned at a time by default, in sorted order (bitwise “C” collation). If the `limit` parameter is set, up to that number of restore jobs are returned instead. Whenever there are additional restore jobs to return, the response also includes a `pagination_token` that you can use to get the next batch of jobs. When the response does not include a `pagination_token`, there are no more restore jobs to return.
</Note>

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  restore_jobs = pc.list_restore_jobs()

  print(restore_jobs)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const restoreJobs = await pc.listRestoreJobs();

  console.log(restoreJobs);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.*;

  public class CreateIndexFromBackup {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API-KEY").build();

          // List all restore jobs with default pagination limit
          RestoreJobList restoreJobList = pc.listRestoreJobs(null, null);

          // List all restore jobs with pagination limit of 5
          RestoreJobList restoreJobListWithLimit = pc.listRestoreJobs(5);

          // List all restore jobs with pagination limit and token
          RestoreJobList restoreJobListPaginated = pc.listRestoreJobs(5, "eyJza2lwX3Bhc3QiOiIxMDEwMy0=");

          System.out.println(restoreJobList);
          System.out.println(restoreJobListWithLimit);
          System.out.println(restoreJobListPaginated);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var jobs = await pinecone.RestoreJobs.ListAsync(new ListRestoreJobsRequest());

  Console.WriteLine(jobs);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl "https://api.pinecone.io/restore-jobs" \
  	-H "X-Pinecone-Api-Version: 2025-04" \
  	-H "Api-Key: $PINECONE_API_KEY"
  ```
</CodeGroup>

The example returns a response like the following:

<CodeGroup>
  ```python Python
  [{
      "restore_job_id": "06b08366-a0a9-404d-96c2-e791c71743e5",
      "backup_id": "95707edb-e482-49cf-b5a5-312219a51a97",
      "target_index_name": "restored-index",
      "target_index_id": "027aff93-de40-4f48-a573-6dbcd654f961",
      "status": "Completed",
      "created_at": "2025-05-15T13:59:51.439479+00:00",
      "completed_at": "2025-05-15T14:00:09.222998+00:00",
      "percent_complete": 100.0
  }, {
      "restore_job_id": "4902f735-b876-4e53-a05c-bc01d99251cb",
      "backup_id": "8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
      "target_index_name": "restored-index2",
      "target_index_id": "027aff93-de40-4f48-a573-6dbcd654f961",
      "status": "Completed",
      "created_at": "2025-05-15T21:06:19.906074+00:00",
      "completed_at": "2025-05-15T21:06:39.360509+00:00",
      "percent_complete": 100.0
  }]
  ```

  ```javascript JavaScript
  {
    data: [
      {
        restoreJobId: '69acc1d0-9105-4fcb-b1db-ebf97b285c5e',
        backupId: '8c85e612-ed1c-4f97-9f8c-8194e07bcf71',
        targetIndexName: 'restored-index2',
        targetIndexId: 'e6c0387f-33db-4227-9e91-32181106e56b',
        status: 'Completed',
        createdAt: 2025-05-14T17:25:59.378Z,
        completedAt: 2025-05-14T17:26:23.997Z,
        percentComplete: 100
      },
      {
        restoreJobId: '9857add2-99d4-4399-870e-aa7f15d8d326',
        backupId: '94a63aeb-efae-4f7a-b059-75d32c27ca57',
        targetIndexName: 'restored-index',
        targetIndexId: '0d8aed24-adf8-4b77-8e10-fd674309dc85',
        status: 'Completed',
        createdAt: 2025-04-25T18:14:05.227Z,
        completedAt: 2025-04-25T18:14:11.074Z,
        percentComplete: 100
      }
    ],
    pagination: undefined
  }
  ```

  ```java Java
  class RestoreJobList {
      data: [class RestoreJobModel {
          restoreJobId: cf597d76-4484-4b6c-b07c-2bfcac3388aa
          backupId: 0d75b99f-be61-4a93-905e-77201286c02e
          targetIndexName: restored-index
          targetIndexId: 8a810881-1505-46c0-b906-947c048b15f5
          status: Completed
          createdAt: 2025-05-16T20:09:18.700631Z
          completedAt: 2025-05-16T20:11:30.673296Z
          percentComplete: 100.0
          additionalProperties: null
      }, class RestoreJobModel {
          restoreJobId: 4902f735-b876-4e53-a05c-bc01d99251cb
          backupId: 8c85e612-ed1c-4f97-9f8c-8194e07bcf71
          targetIndexName: restored-index2
          targetIndexId: 710cb6e6-bfb4-4bf5-a425-9754e5bbc832
          status: Completed
          createdAt: 2025-05-15T21:06:19.906074Z
          completedAt: 2025-05-15T21:06:39.360509Z
          percentComplete: 100.0
          additionalProperties: null
      }]
      pagination: class PaginationResponse {
          next: eyJsaW1pdCI6Miwib2Zmc2V0IjoyfQ==
          additionalProperties: null
      }
      additionalProperties: null
  }
  ```

  ```csharp C#
  {
    "data": [
      {
        "restore_job_id": "9857add2-99d4-4399-870e-aa7f15d8d326",
        "backup_id": "94a63aeb-efae-4f7a-b059-75d32c27ca57",
        "target_index_name": "restored-index",
        "target_index_id": "0d8aed24-adf8-4b77-8e10-fd674309dc85",
        "status": "Completed",
        "created_at": "2025-04-25T18:14:05.227526Z",
        "completed_at": "2025-04-25T18:14:11.074618Z",
        "percent_complete": 100
      },
      {
        "restore_job_id": "69acc1d0-9105-4fcb-b1db-ebf97b285c5e",
        "backup_id": "8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
        "target_index_name": "restored-index2",
        "target_index_id": "e6c0387f-33db-4227-9e91-32181106e56b",
        "status": "Completed",
        "created_at": "2025-05-14T17:25:59.378989Z",
        "completed_at": "2025-05-14T17:26:23.997284Z",
        "percent_complete": 100
      }
    ]
  }
  ```

  ```json curl
  {
    "data": [
      {
        "restore_job_id": "9857add2-99d4-4399-870e-aa7f15d8d326",
        "backup_id": "94a63aeb-efae-4f7a-b059-75d32c27ca57",
        "target_index_name": "restored-index",
        "target_index_id": "0d8aed24-adf8-4b77-8e10-fd674309dc85",
        "status": "Completed",
        "created_at": "2025-04-25T18:14:05.227526Z",
        "completed_at": "2025-04-25T18:14:11.074618Z",
        "percent_complete": 100
      },
      {
        "restore_job_id": "69acc1d0-9105-4fcb-b1db-ebf97b285c5e",
        "backup_id": "8c85e612-ed1c-4f97-9f8c-8194e07bcf71",
        "target_index_name": "restored-index2",
        "target_index_id": "e6c0387f-33db-4227-9e91-32181106e56b",
        "status": "Completed",
        "created_at": "2025-05-14T17:25:59.378989Z",
        "completed_at": "2025-05-14T17:26:23.997284Z",
        "percent_complete": 100
      }
    ],
    "pagination": null
  }
  ```
</CodeGroup>

## View restore job details

You can [view the details of a specific restore job](/reference/api/2025-04/control-plane/describe_restore_job), as in the following example:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  restore_job = pc.describe_restore_job(job_id="9857add2-99d4-4399-870e-aa7f15d8d326")

  print(restore_job)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' })

  const restoreJob = await pc.describeRestoreJob('9857add2-99d4-4399-870e-aa7f15d8d326');

  console.log(restoreJob);
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;
  import org.openapitools.db_control.client.ApiException;
  import org.openapitools.db_control.client.model.*;

  public class CreateIndexFromBackup {
      public static void main(String[] args) throws ApiException {
          Pinecone pc = new Pinecone.Builder("YOUR_API-KEY").build();

          RestoreJobModel restoreJob = pc.describeRestoreJob("9857add2-99d4-4399-870e-aa7f15d8d326");

          System.out.println(restoreJob);
      }
  }
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY");

  var job = await pinecone.RestoreJobs.GetAsync("9857add2-99d4-4399-870e-aa7f15d8d326");

  Console.WriteLine(job);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  JOB_ID="9857add2-99d4-4399-870e-aa7f15d8d326"

  curl "https://api.pinecone.io/restore-jobs/$JOB_ID" \
      -H "X-Pinecone-Api-Version: 2025-04" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H 'accept: application/json'
  ```
</CodeGroup>

The example returns a response like the following:

<CodeGroup>
  ```python Python
  {'backup_id': '94a63aeb-efae-4f7a-b059-75d32c27ca57',
   'completed_at': datetime.datetime(2025, 4, 25, 18, 14, 11, 74618, tzinfo=tzutc()),
   'created_at': datetime.datetime(2025, 4, 25, 18, 14, 5, 227526, tzinfo=tzutc()),
   'percent_complete': 100.0,
   'restore_job_id': '9857add2-99d4-4399-870e-aa7f15d8d326',
   'status': 'Completed',
   'target_index_id': '0d8aed24-adf8-4b77-8e10-fd674309dc85',
   'target_index_name': 'restored-index'}
  ```

  ```javascript JavaScript
  {
    restoreJobId: '9857add2-99d4-4399-870e-aa7f15d8d326',
    backupId: '94a63aeb-efae-4f7a-b059-75d32c27ca57',
    targetIndexName: 'restored-index',
    targetIndexId: '0d8aed24-adf8-4b77-8e10-fd674309dc85',
    status: 'Completed',
    createdAt: 2025-04-25T18:14:05.227Z,
    completedAt: 2025-04-25T18:14:11.074Z,
    percentComplete: 100
  }
  ```

  ```java Java
  class RestoreJobModel {
      restoreJobId: cf597d76-4484-4b6c-b07c-2bfcac3388aa
      backupId: 0d75b99f-be61-4a93-905e-77201286c02e
      targetIndexName: restored-index
      targetIndexId: 0d8aed24-adf8-4b77-8e10-fd674309dc85
      status: Completed
      createdAt: 2025-05-16T20:09:18.700631Z
      completedAt: 2025-05-16T20:11:30.673296Z
      percentComplete: 100.0
      additionalProperties: null
  }
  ```

  ```csharp C#
  {
    "restore_job_id": "9857add2-99d4-4399-870e-aa7f15d8d326",
    "backup_id": "94a63aeb-efae-4f7a-b059-75d32c27ca57",
    "target_index_name": "restored-index",
    "target_index_id": "0d8aed24-adf8-4b77-8e10-fd674309dc85",
    "status": "Completed",
    "created_at": "2025-04-25T18:14:05.227526Z",
    "completed_at": "2025-04-25T18:14:11.074618Z",
    "percent_complete": 100
  }
  ```

  ```json curl
  {
    "restore_job_id": "9857add2-99d4-4399-870e-aa7f15d8d326",
    "backup_id": "94a63aeb-efae-4f7a-b059-75d32c27ca57",
    "target_index_name": "restored-index",
    "target_index_id": "0d8aed24-adf8-4b77-8e10-fd674309dc85",
    "status": "Completed",
    "created_at": "2025-04-25T18:14:05.227526Z",
    "completed_at": "2025-04-25T18:14:11.074618Z",
    "percent_complete": 100
  }
  ```
</CodeGroup>
