# Understanding projects

A Pinecone project belongs to an [organization](/guides/organizations/understanding-organizations) and contains a number of [indexes](/guides/index-data/indexing-overview) and users. Only a user who belongs to the project can access the indexes in that project. Each project also has at least one project owner.

## Project environments

You choose a cloud environment for each index in a project. This makes it easy to manage related resources across environments and use the same API key to access them.

## Project roles

If you are an [organization owner](/guides/organizations/understanding-organizations#organization-roles) or project owner, you can manage members in your project. Project members are assigned a role, which determines their permissions within the project. The project roles are as follows:

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

Each Pinecone [project](/guides/projects/understanding-projects) has one or more API keys. In order to [make calls to the Pinecone API](/guides/get-started/quickstart), you must provide a valid API key for the relevant Pinecone project.

For more information, see [Manage API keys](/guides/projects/manage-api-keys).

## Project IDs

Each Pinecone project has a unique product ID.

To find the ID of a project, go to the project list in the [Pinecone console](https://app.pinecone.io/organizations/-/projects).

## Project pod limit

To control costs, [project owners](/guides/projects/understanding-projects#project-roles) can [set the maximum total number of pods](/reference/api/database-limits#pods-per-project) allowed across all pod-based indexes in a project.

<Info>
  Pod limits do not apply to [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes). Serverless indexes auto-scale based on usage.
</Info>

## See also

* [Understanding organizations](guides/organizations/understanding-organizations)
* [Manage organization members](guides/organizations/manage-organization-members)
