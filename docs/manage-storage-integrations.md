# Manage storage integrations

<Note>
  This feature is in [public preview](/release-notes/feature-availability) and available only on [Standard and Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

You can connect your Pinecone project to cloud storage by creating a storage integration. This integration allows Pinecone to access the data in your cloud storage. Once your integration is set up, you can use it to import data from your cloud storage into a Pinecone index.

For information on how to set up cloud storage for integration with Pinecone, see the following guides:

* [Amazon S3](/guides/operations/integrations/integrate-with-amazon-s3)

## Add a storage integration

After you have set up cloud storage for integration with Pinecone, you can add the storage integration through the [Pinecone console](https://app.pinecone.io/organizations/-/projects):

1. Select your project.
2. Go to [**Storage integrations**](https://app.pinecone.io/organizations/-/projects/-/storage).
3. Click **Add integration**.
4. Enter a unique integration name.
5. Select **Amazon S3**.
6. Enter the **ARN** of the [IAM role you created](/guides/operations/integrations/integrate-with-amazon-s3#2-set-up-access-using-an-iam-role).
7. Click **Add integration**.

## Update an integration

To update information for a storage integration through the [Pinecone console](https://app.pinecone.io/organizations/-/projects), take the following steps:

1. Select your project.
2. Go to [**Manage > Storage integrations**](https://app.pinecone.io/organizations/-/projects/-/storage).
3. For the integration you want to update, click the *...* (Actions) icon.
4. Click **Manage**.
5. Update the integration details as needed.
6. Click **Add integration**.

## Delete an integration

To delete a storage integration through the [Pinecone console](https://app.pinecone.io/organizations/-/projects), take the following steps:

1. Select your project.
2. Go to [**Manage > Storage integrations**](https://app.pinecone.io/organizations/-/projects/-/storage).
3. For the integration you want to update, click the *...* (Actions) icon.
4. Click **Delete**.
5. Enter the integration name.
6. Click **Confirm deletion**.
