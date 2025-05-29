# Manage your billing plan

This page describes how to access and change billing plan information for your Pinecone organization through the Pinecone console. To change your billing plan, you must be the [organization owner or billing admin](/guides/assistant/admin/organizations-overview#organization-owners) for your organization.

For information on how to set up billing through a cloud marketplace, see [AWS Marketplace](/guides/assistant/admin/set-up-billing-through-aws-marketplace), [Azure Marketplace](/guides/assistant/admin/set-up-billing-through-azure-marketplace.mdx), or [GCP Marketplace](/guides/assistant/admin/set-up-billing-through-gcp-marketplace).

<Note>
  Billing data and management is only available through the Pinecone console.
</Note>

## Upgrade to pay-as-you-go billing

You can upgrade from the free [Starter plan](https://www.pinecone.io/pricing/) to pay-as-you-go billing directly in the Pinecone console:

1. In the Pinecone console, go to [**Settings > Billing > Plans**](https://app.pinecone.io/organizations/-/settings/billing/plans).
2. Click **Upgrade** in the **Standard** or **Enterprise** plan section.

After upgrading, you will immediately start paying for usage of your Pinecone indexes, including the serverless indexes that were free on the Starter plan. For more details about how costs are calculated, see [Understanding cost](/guides/manage-cost/understanding-cost).

<Tip>
  If your organization requires custom contracts, annual commitments, or tailored features, [contact Pinecone](https://www.pinecone.io/contact).
</Tip>

## Downgrade to the Starter plan

To stop recurring charges, you can downgrade to the free Starter plan. Before you can downgrade, your organization must be under the [Starter plan quotas](/reference/api/database-limits):

* No more than 5 indexes, all serverless and in the `us-east-1` region of AWS.
  * If you have pod-based indexes, [save them as collections](/guides/manage-data/back-up-an-index#create-a-backup-using-a-collection) and then [delete them](/guides/manage-data/manage-indexes#delete-an-index).
  * If you have serverless indexes in a region other than `us-east-1`, [create a new serverless index](/guides/index-data/create-an-index#create-a-serverless-index) in `us-east-1`, [re-upsert your data](/guides/index-data/upsert-data) into the new index, and [delete the old index](/guides/manage-data/manage-indexes#delete-an-index).
  * If you have more than 5 serverless indexes, [delete enough indexes](/guides/manage-data/manage-indexes#delete-an-index) to bring you within the limit.
* No more than 1 project.
  * If you have more than 1 project, delete enough projects to bring you within the limit.
  * Before you can delete a project, you must [delete all indexes](/guides/manage-data/manage-indexes#delete-an-index) and [delete all collections](/guides/manage-data/back-up-an-index#delete-a-collection) in the project.
* No more than 2 GB of data across all of your serverless indexes.
  * If you are storing more than 2 GB of data, [delete enough records](/guides/manage-data/delete-data) to bring you within the limit.
* No more than 100 namespaces per serverless index.
  * If any serverless index has more than 100 namespaces, [delete enough namespaces](/guides/manage-data/delete-data#delete-all-records-from-a-namespace) to bring you within the limit.
* No more than 3 [Assistants](/guides/assistant/overview).
  * If you have more than 3 assistants, [delete assistants](/guides/assistant/manage-assistants#delete-an-assistant) until you are below the limit.
* No more than 10 files per assistant.
  * If you have more than 10 files uploaded to an assistant, [delete uploaded files](/guides/assistant/manage-files#delete-a-file) until you are below the limit.
* No more than 1GB of Assistant storage.
  * If you have more than 1 GB of Assistant storage, [delete uploaded files](https://docs.pinecone.io/guides/assistant/manage-files#delete-a-file) until you are below the limit.

Once you meet the requirements above, downgrade to the Starter plan as follows:

1. In the Pinecone console, got to [**Settings > Billing > Plans**](https://app.pinecone.io/organizations/-/settings/billing/plans).
2. Click **Downgrade** in the **Starter** plan section.

Your billing will end immediately; however, you will receive a final invoice for any charges accrued in the current month.

## Access your billing history and invoices

You can access your billing history and invoices in the Pinecone console:

1. Go to [**Settings > Billing > Overview**](https://app.pinecone.io/organizations/-/settings/billing).
2. Scroll down to the **Payment history and invoices** section.
3. For each billing period, you can download the invoice by clicking the **Download** button.

## Update your credit card information

You can update your credit card information in the Pinecone console:

1. Go to [**Settings > Billing > Overview**](https://app.pinecone.io/organizations/-/settings/billing).
2. In the **Billing Contact** section, click **Edit**.
3. Enter your new credit card information.
4. Click **Update**.
