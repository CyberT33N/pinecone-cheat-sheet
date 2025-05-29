# Pinecone Database limits

This page describes different types of limits for Pinecone Database.

## Rate limits

Rate limits are restrictions on the frequency of requests within a specified period of time. Rate limits vary based on [pricing plan](https://www.pinecone.io/pricing/) and apply to [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes) only.

| Metric                                                                                                    | Starter plan | Standard plan | Enterprise plan |
| :-------------------------------------------------------------------------------------------------------- | :----------- | :------------ | :-------------- |
| [Read units per month per project](#read-units-per-month-per-project)                                     | 1,000,000    | N/A           | N/A             |
| [Write units per month per project](#write-units-per-month-per-project)                                   | 2,000,000    | N/A           | N/A             |
| [Upsert size per second per namespace](#upsert-size-per-second-per-namespace)                             | 50 MB        | 50 MB         | 50 MB           |
| [Query read units per second per index](#query-read-units-per-second-per-index)                           | 2,000        | 2,000         | 2,000           |
| [Update records per second per namespace](#update-records-per-second-per-namespace)                       | 100          | 100           | 100             |
| [Fetch requests per second per index](#fetch-requests-per-second-per-index)                               | 100          | 100           | 100             |
| [List requests per second per index](#list-requests-per-second-per-index)                                 | 200          | 200           | 200             |
| [Describe index stats requests per second per index](#describe-index-stats-requests-per-second-per-index) | 100          | 100           | 100             |
| Delete records per second per namespace                                                                   | 5,000        | 5,000         | 5,000           |
| Delete records per second per index                                                                       | 5,000        | 5,000         | 5,000           |

### Read units per month per project

<Note>This limit applies to organizations on the Starter plan only.</Note>

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 1,000,000    | N/A           | N/A             |

[Read units](/guides/manage-cost/understanding-cost#read-units) measure the compute, I/O, and network resources used by [fetch](/guides/manage-data/fetch-data), [query](/guides/search/search-overview), and [list](/guides/manage-data/list-record-ids) requests to serverless indexes. When you reach the monthly read unit limit for a project, fetch, query, and list requests to serverless indexes in the project will fail and return a `429 - TOO_MANY_REQUESTS` status with the following error:

```
Request failed. You've reached your read unit limit for the current month limit. 
To continue reading data, upgrade your plan. 
```

To continue reading from serverless indexes in the project, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan).

To check how close you are to the monthly read unit limit for a project, do the following:

1. Open the [Pinecone console](https://app.pinecone.io/organizations/-/projects).
2. Select the project.
3. Select any index in the project.
4. Look under **Starter Usage**.

### Write units per month per project

<Note>This limit applies to organizations on the Starter plan only.</Note>

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 2,000,000    | N/A           | N/A             |

[Write units](/guides/manage-cost/understanding-cost#write-units) measure the storage and compute resources used by [upsert](/guides/index-data/upsert-data), [update](/guides/manage-data/update-data), and [delete](/guides/manage-data/delete-data) requests to serverless indexes. When you reach the monthly write unit limit for a project, upsert, update, and delete requests to serverless indexes in the project will fail and return a `429 - TOO_MANY_REQUESTS` status with the following error:

```
Request failed. You've reached your write unit limit for the current month. 
To continue writing data, upgrade your plan.
```

To continue writing data to serverless indexes in the project, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan).

To check how close you are to the monthly read unit limit for a project, do the following:

1. Open the [Pinecone console](https://app.pinecone.io/organizations/-/projects).
2. Select the project.
3. Select any index in the project.
4. Look under **Starter Usage**.

### Upsert size per second per namespace

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 50 MB        | 50 MB         | 50 MB           |

When you reach the per second [upsert](/guides/index-data/upsert-data) size for a namespace in an index, additional upserts will fail and return a `429 - TOO_MANY_REQUESTS` status with the following error:

```
Request failed. You've reached the max upsert size limit per second for index <index name>. 
Pace your upserts or upgrade your plan.
```

To increase this limit, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan). Otherwise, you can handle this limit by [automatically retrying requests with an exponential backoff](https://www.pinecone.io/blog/working-at-scale/).

### Query read units per second per index

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 2,000        | 2,000         | 2,000           |

Pinecone measures [query](/guides/search/search-overview) usage in [read units](/guides/manage-cost/understanding-cost#read-units). When you reach the per second limit for queries across all namespaces in an index, additional queries will fail and return a `429 - TOO_MANY_REQUESTS` status with the following error:

```
Request failed. You've reached the max query read units per second for index <index name>. 
Pace your queries.
```

To handle this limit, [automatically retry requests with an exponential backoff](https://www.pinecone.io/blog/working-at-scale/).

To check how many read units a query consumes, [check the query response](/guides/manage-cost/monitor-your-usage).

### Update records per second per namespace

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 100          | 100           | 100             |

When you reach the per second [update](/guides/manage-data/update-data) limit for a namespace in an index, additional updates will fail and return a `429 - TOO_MANY_REQUESTS` status with the following error:

```
Request failed. You've reached the max update records per second for namespace <namespace name>. 
Pace your update requests or upgrade your plan.
```

To increase this limit, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan). Otherwise, you can handle this limit by [automatically retrying requests with an exponential backoff](https://www.pinecone.io/blog/working-at-scale/).

### Fetch requests per second per index

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 100          | 100           | 100             |

When you reach the per second [fetch](/guides/manage-data/fetch-data) limit across all namespaces in an index, additional fetch requests will fail and return a `429 - TOO_MANY_REQUESTS` status with the following error:

```
Request failed. You've reached the max fetch requests per second for index <index name>.
Pace your fetch requests.
```

To handle this limit, [automatically retry requests with an exponential backoff](https://www.pinecone.io/blog/working-at-scale/).

### List requests per second per index

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 200          | 200           | 200             |

When you reach the per second [list](/guides/manage-data/list-record-ids) limit across all namespaces in an index, additional list requests will fail and return a `429 - TOO_MANY_REQUESTS` status with the following error:

```
Request failed. You've reached the max list requests per second for index <index name>.
Pace your list requests.
```

To handle this limit, [automatically retry requests with an exponential backoff](https://www.pinecone.io/blog/working-at-scale/).

### Describe index stats requests per second per index

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 100          | 100           | 100             |

When you reach the per second [describe index stats](/reference/api/2024-10/data-plane/describeindexstats) limit across all namespaces in an index, additional list requests will fail and return a `429 - TOO_MANY_REQUESTS` status with the following error:

```
Request failed. You've reached the max describe_index_stats requests per second for index <index>. 
Pace your describe_index_stats requests.
```

To handle this limit, [automatically retry requests with an exponential backoff](https://www.pinecone.io/blog/working-at-scale/).

## Object limits

Object limits are restrictions on the number or size of objects in Pinecone. Object limits vary based on [pricing plan](https://www.pinecone.io/pricing/).

| Metric                                                                         | Starter plan | Standard plan | Enterprise plan |
| :----------------------------------------------------------------------------- | :----------- | :------------ | :-------------- |
| [Projects per organization](#projects-per-organization)                        | 1            | 20            | 100             |
| [Pods per organization](#pods-per-organization)                                | 0            | 100           | 100             |
| [Serverless indexes per project](#serverless-indexes-per-project) <sup>1</sup> | 5            | 20            | 200             |
| [Serverless index storage per project](#serverless-index-storage-per-project)  | 2 GB         | N/A           | N/A             |
| [Namespaces per serverless index](#namespaces-per-serverless-index)            | 100          | 25,000        | 100,000         |
| [Serverless backups per project](#serveless-backups-per-project)               | N/A          | 500           | 1000            |
| [Namespaces per serverless backup](#namespaces-per-serverless-backup)          | N/A          | 2000          | 2000            |
| [Pod-based indexes per project](#pod-based-indexes-per-project)                | 0            | N/A           | N/A             |
| [Pods per project](#pods-per-project) <sup>2</sup>                             | 0            | 2             | 2               |
| [Collections per project](#collections-per-project)                            | 100          | N/A           | N/A             |

<sup>1 On the Starter plan, all serverless must be in the `us-east-1` region of AWS.</sup><br />
<sup>2 The limit on the number of [pods per project](#pods-per-project) can be customized for organizations on Standard and Enterprise plans after creating a project.</sup>

### Projects per organization

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 1            | 20            | 100             |

When you reach this quota for an organization, trying to [create projects](/guides/projects/create-a-project) will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Request failed. You've reached the max projects allowed in organization <org name>. 
To add more projects, upgrade your plan.
```

To increase this quota, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan) or [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket).

### Pods per organization

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 0            | 100           | 100             |

When you reach this quota for an organization, trying to [create pod-based indexes](/guides/index-data/create-an-index#create-a-pod-based-index) in any project in the organization will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Request failed. You've reached the max pods allowed in organization ORGANIZATION_NAME (LIMIT). To increase this limit, contact support@pinecone.io.
```

To increase this quota, [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket).

### Serverless indexes per project

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 5            | 20            | 200             |

When you reach this quota for a project, trying to [create serverless indexes](/guides/index-data/create-an-index#create-a-serverless-index) in the project will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Request failed. You've reached the max serverless indexes allowed in project <project>. 
To add more serverless indexes, upgrade your plan.
```

On the Starter plan, all serverless must be in the `us-east-1` region of AWS. To create indexes in different regions or to increase this quota, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan) or [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket).

### Serverless index storage per project

<Note>This limit applies to organizations on the Starter plan only.</Note>

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 2 GB         | N/A           | N/A             |

When you've reached this quota for a project, updates and upserts into serverless indexes will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Request failed. You've reached the max storage allowed for project <project name>. 
To update or upsert new data, delete records or upgrade your plan.
```

To continue writing data into your serverless indexes, [delete records](/guides/manage-data/delete-data) to bring you under the limit or [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan).

### Namespaces per serverless index

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 100          | 25,000        | 100,000         |

When you reach this quota for a serverless index, trying to [upsert records into a new namespace](/guides/index-data/upsert-data) in the index will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Request failed. You've reached the max namespaces allowed in serverless index <index name>. To add more namespaces, upgrade your plan.
```

To increase this quota, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan).

<Note>
  These quotas are intended to provide reasonable boundaries and prevent unexpected or unintentional misuse. To increase your quota beyond the standard allotment, [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket).
</Note>

### Serverless backups per project

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| N/A          | 500           | 1000            |

When you reach this quota for a project, trying to [create serverless backups](/guides/manage-data/back-up-an-index) in the project will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Backup failed to create. Quota for number of backups per index exceeded.
```

### Namespaces per serverless backup

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| N/A          | 2000          | 2000            |

When you reach this quota for a backup, trying to [create serverless backups](/guides/manage-data/back-up-an-index) will fail and return a `403 - QUOTA_EXCEEDED` status.

### Pod-based indexes per project

<Note>This limit applies to organizations on the Starter plan only.</Note>

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 0            | N/A           | N/A             |

When you try to create a pod-based index on the Starter plan, the request will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Request failed. You've reach the max pod-based indexes allowed in project <project name>. 
To add more pod-based indexes, upgrade your plan.
```

To create pod-based indexes, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan).

### Pods per project

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 0            | 2             | 2               |

When you reach this quota for a project, trying to [create pod-based indexes](/guides/index-data/create-an-index#create-a-pod-based-index) in the project will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Request failed. You've reached the max pods allowed in project PROJECT_NAME. To increase this limit, adjust your project settings in the console. Contact a project owner if you don't have permission.
```

To set or change the default limit, [set a project pod limit](/guides/projects/manage-projects#set-a-project-pod-limit).

### Collections per project

| Starter plan | Standard plan | Enterprise plan |
| ------------ | ------------- | --------------- |
| 100          | N/A           | N/A             |

When you reach this quota for a project, trying to [create collections](/guides/manage-data/back-up-an-index) in the project will fail and return a `403 - QUOTA_EXCEEDED` status with the following error:

```
Request failed. You've reached the max collections allowed in project <project name>. 
To add more collections, upgrade your plan.
```

To increase this quota, [upgrade your plan](/guides/organizations/manage-billing/manage-your-billing-plan).

## Operation limits

Operation limits are restrictions on the size, number, or other characteristics of operations in Pinecone. Operation limits are fixed and do not vary based on pricing plan.

### Upsert limits

| Metric                                 | Limit               |
| :------------------------------------- | :------------------ |
| Max upsert size                        | 2MB or 1000 records |
| Max metadata size per record           | 40 KB               |
| Max length for a record ID             | 512 characters      |
| Max dimensionality for dense vectors   | 20,000              |
| Max non-zero values for sparse vectors | 2048                |
| Max dimensionality for sparse vectors  | 4.2 billion         |

### Query limits

| Metric            | Limit  |
| :---------------- | :----- |
| Max `top_k` value | 10,000 |
| Max result size   | 4MB    |

The query result size is affected by the dimension of the dense vectors and whether or not dense vector values and metadata are included in the result.

<Tip>
  If a query fails due to exceeding the 4MB result size limit, choose a lower `top_k` value, or use `include_metadata=False` or `include_values=False` to exclude metadata or values from the result.
</Tip>

### Fetch limits

|                               | Limit |
| :---------------------------- | :---- |
| Max records per fetch request | 1,000 |

### Delete limits

| Delete                         | Limit |
| :----------------------------- | :---- |
| Max records per delete request | 1,000 |

## Identifier limits

An identifier is a string of characters (up to 255 characters in length) used to identify "named" [objects in Pinecone](/guides/get-started/glossary). The following Pinecone objects use strings as identifiers:

| Object                                                    | Field       | Max # characters | Allowed characters           |
| --------------------------------------------------------- | ----------- | ---------------- | ---------------------------- |
| [Organization](/guides/get-started/glossary#organization) | `name`      | 512              | UTF-8 except `\0`            |
| [Project](/guides/get-started/glossary#project)           | `name`      | 512              | UTF-8 except `\0`            |
| [Index](/guides/get-started/glossary#index)               | `name`      | 45               | `A-Z`, `a-z`, `0-9`, and `-` |
| [Namespace](/guides/get-started/glossary#namespace)       | `namespace` | 512              | ASCII except `\0`            |
| [Record](/guides/get-started/glossary#record)             | `id`        | 512              | ASCII except `\0`            |
