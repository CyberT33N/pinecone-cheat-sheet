# Data deletion on Pinecone

Pinecone follows a secure process to ensure that customer data is permanently deleted from our system. This page gives an overview of the process.

As defined in the [Master Subscription Agreement](https://www.pinecone.io/legal/master-subscription-agreement/), customer data is data that you provide to Pinecone through the services of the Pinecone system, or such data provided on your behalf by connected systems. This includes objects such as [records](/guides/get-started/glossary#record), [indexes](/guides/get-started/glossary#index), [backups](/guides/get-started/glossary#backup-or-collection), [projects](/guides/get-started/glossary#project), [API keys](/guides/get-started/glossary#api-key), [users](/guides/get-started/glossary#user), [assistants](/guides/get-started/glossary#pinecone-assistant), and [organizations](/guides/get-started/glossary#organization).

## Deletion request

The deletion of customer data begins when you initiate a deletion request through the Pinecone API, console, or a connected service. A deletion request can delete a single resource, such as a record, or can delete a resource and all its dependent resources, such as an index and all its records.

Deletion of your customer data also occurs automatically when you end your relationship with Pinecone.

## Soft deletion

After you initiate a deletion request, Pinecone marks the data for deletion. The data is not immediately removed from the system. Instead, Pinecone retains the data for a maximum of 90 days. During this period, the data is not accessible to you or any other user.

## Permanent deletion

Before the end of the 90-day retention window, Pinecone permanently deletes the data from its system. Once the data is permanently deleted, it is no longer recoverable.

<Note>
  Pinecone creates an [audit log](/guides/production/security-overview#audit-logs) of user, service account, and API events. Events are captured within two hours of occurrence and are retained for 90 days, after which they are permanently deleted.
</Note>

## See also

* [Delete records](/guides/manage-data/delete-data)
* [Delete an index](/guides/manage-data/manage-indexes#delete-an-index)
* [Delete a project](/guides/projects/manage-projects#delete-a-project)
* [Delete an API key](/guides/projects/manage-api-keys#delete-an-api-key)
* [Delete a user](/guides/projects/manage-project-members#remove-members)
* [Delete an organization](/troubleshooting/delete-your-organization)
* [Master Subscription Agreement](https://www.pinecone.io/legal/master-subscription-agreement/)
