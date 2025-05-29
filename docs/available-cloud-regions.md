# Available cloud regions

When [creating an index](/guides/index-data/create-an-index), you must choose the cloud region where you want the index to be hosted.

## Regions available for serverless indexes

The following cloud regions are available for [serverless indexes](/guides/index-data/indexing-overview):

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

## Regions available for pod-based indexes

The following cloud regions are available for [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes):

| Cloud | Region                       | Environment                   |
| ----- | ---------------------------- | ----------------------------- |
| GCP   | us-west-1 (N. California)    | `us-west1-gcp`                |
| GCP   | us-central-1 (Iowa)          | `us-central1-gcp`             |
| GCP   | us-west-4 (Las Vegas)        | `us-west4-gcp`                |
| GCP   | us-east-4 (Virginia)         | `us-east4-gcp`                |
| GCP   | northamerica-northeast-1     | `northamerica-northeast1-gcp` |
| GCP   | asia-northeast-1 (Japan)     | `asia-northeast1-gcp`         |
| GCP   | asia-southeast-1 (Singapore) | `asia-southeast1-gcp`         |
| GCP   | us-east-1 (South Carolina)   | `us-east1-gcp`                |
| GCP   | eu-west-1 (Belgium)          | `eu-west1-gcp`                |
| GCP   | eu-west-4 (Netherlands)      | `eu-west4-gcp`                |
| AWS   | us-east-1 (Virginia)         | `us-east-1-aws`               |
| Azure | eastus (Virginia)            | `eastus-azure`                |

[Contact us](http://www.pinecone.io/contact/) if you need a dedicated deployment in other regions.

The environment cannot be changed after the index is created.
