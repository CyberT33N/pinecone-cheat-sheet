# Projects overview

A Pinecone project belongs to an [organization](/guides/assistant/admin/organizations-overview) and contains a number of [assistants](/guides/assistant/overview) and users. Only a user who belongs to the project can access the indexes in that project. Each project also has at least one project owner.

## Project roles

If you are an [organization owner](/guides/assistant/admin/organizations-overview#organization-roles) or project owner, you can manage members in your project. You assign project members a specific role that determines the member's permissions within the Pinecone console.

When you invite a member at the project-level, you assign one of the following roles:

* **Project owner**: Project owners have global permissions across projects they own.

* **Project user**: Project users have restricted permissions for the specific projects they are invited to.

The following table summarizes the permissions for each project role:

| Permission                  | Owner | User |
| :-------------------------- | ----- | ---- |
| Update project names        | ✓     |      |
| Delete projects             | ✓     |      |
| View project members        | ✓     | ✓    |
| Update project member roles | ✓     |      |
| Delete project members      | ✓     |      |
| View API keys               | ✓     | ✓    |
| Create API keys             | ✓     |      |
| Delete API keys             | ✓     |      |
| View indexes                | ✓     | ✓    |
| Create indexes              | ✓     | ✓    |
| Delete indexes              | ✓     | ✓    |
| Upsert vectors              | ✓     | ✓    |
| Query vectors               | ✓     | ✓    |
| Fetch vectors               | ✓     | ✓    |
| Update a vector             | ✓     | ✓    |
| Delete a vector             | ✓     | ✓    |
| List vector IDs             | ✓     | ✓    |
| Get index stats             | ✓     | ✓    |

Specific to pod-based indexes:

| Permission                | Owner | User |
| :------------------------ | ----- | ---- |
| Update project pod limits | ✓     |      |
| View project pod limits   | ✓     | ✓    |
| Update index size         | ✓     | ✓    |

## API keys

Each Pinecone [project](/guides/assistant/admin/projects-overview) has one or more API keys. In order to [make calls to the Pinecone API](/guides/assistant/quickstart), you must provide a valid API key for the relevant Pinecone project.

For more information, see [Manage API keys](/guides/assistant/admin/manage-api-keys).

## Service accounts

<Note>
  This feature is in [public preview](/release-notes/feature-availability) and available only on [Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

[Service accounts](/guides/assistant/admin/manage-organization-service-accounts) enable programmatic access to Pinecone's Admin API, which can be used to create and manage projects and API keys.

Use service accounts to automate infrastructure management and integrate Pinecone into your deployment workflows, rather than through manual actions in the Pinecone console. Service accounts use the [organization roles](/guides/assistant/admin/organizations-overview#organization-roles) and [project role](/guides/assistant/admin/projects-overview#project-roles) for permissioning, and provide a secure and auditable way to handle programmatic access.

To use service accounts, [add the account to your organization](/guides/assistant/admin/manage-organization-service-accounts) before [connecting it to a project](/guides/assistant/admin/manage-project-service-accounts).

## Project IDs

Each Pinecone project has a unique product ID.

To find the ID of a project, go to the project list in the [Pinecone console](https://app.pinecone.io/organizations/-/projects).

## See also

* [Create a project](guides/assistant/admin/create-a-project)
* [Manage project members](guides/assistant/admin/manage-project-members)
* [Organizations overview](guides/assistant/admin/organizations-overview)
