# Manage service accounts at the project-level

<Note>
  This feature is in [public preview](/release-notes/feature-availability) and available only on [Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

This page shows how [organization owners](/guides/assistant/admin/organizations-overview#organization-roles) and [project owners](/guides/assistant/admin/projects-overview#project-roles) can add and manage service accounts at the project-level. Service accounts enable programmatic access to Pinecone's Admin API, which can be used to create and manage projects and API keys.

## Add a service account to a project

After a service account has been [added to an organization](/guides/assistant/admin/manage-organization-service-accounts#create-a-service-account), it can be added to a project in the [Pinecone console](https://app.pinecone.io/organizations/-/projects):

1. Select your project.
2. Go to the [**Manage > Access > Service accounts** tab](https://app.pinecone.io/organizations/-/projects/-/access/service-accounts).
3. Select the service account to add.
4. Select a [**Project role**](/guides/assistant/admin/projects-overview#project-roles) for the service account. The role determines its permissions within Pinecone.
5. Click **Connect**.

## Change project role

To change a service account's role in the [Pinecone console](https://app.pinecone.io/organizations/-/projects):

1. Select your project.
2. Go to the [**Manage > Access > Service accounts** tab](https://app.pinecone.io/organizations/-/projects/-/access/service-accounts).
3. In the row of the service account you want to edit, click **ellipsis (..) menu > Edit role**.
4. Select a [**Project role**](/guides/projects/understanding-projects#project-roles) for the service account.
5. Click **Edit role**.

## Remove a service account from a project

To remove a service account from a project in the [Pinecone console](https://app.pinecone.io/organizations/-/projects):

1. Select your project.
2. Go to the [**Manage > Access > Service accounts** tab](https://app.pinecone.io/organizations/-/projects/-/access/service-accounts).
3. In the row of the service account you want to remove, click **ellipsis (..) menu > Disconnect**.
4. Enter the service account name to confirm.
5. Click **Disconnect**.
