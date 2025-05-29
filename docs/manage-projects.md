# Manage projects

This page shows you how to view project details, rename a project, and delete a project.

<Note>
  You must be an [organization owner](/guides/assistant/admin/organizations-overview#organization-roles) or [project owner](/guides/assistant/admin/projects-overview#project-roles) to edit project details or delete a project.
</Note>

## View project details

You can view the details of a project, as in the following example:

<Note>
  An [access token](/guides/assistant/admin/manage-organization-service-accounts#retrieve-an-access-token) must be provided to complete this action through the Admin API. The Admin API is in [public preview](/assistant-release-notes/feature-availability).
</Note>

```bash curl
PINECONE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
PROJECT_ID="3fa85f64-5717-4562-b3fc-2c963f66afa6"

curl -X GET "https://api.pinecone.io/admin/projects/$PROJECT_ID" \
    -H "Authorization: Bearer $PINECONE_ACCESS_TOKEN" \
	-H "X-Pinecone-Api-Version: 2025-04" \
    -H "accept: application/json"
```

The example returns a response like the following:

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "example-project",
  "max_pods": 0,
  "force_encryption_with_cmek": false,
  "organization_id": "string",
  "created_at": "2025-03-17T00:30:23.262Z"
}
```

<Tip>
  You can view project details using the [Pinecone console](https://app.pinecone.io/organizations/-/settings/projects/-/indexes).
</Tip>

## Rename a project

You can change the name of your project:

<Tabs>
  <Tab title="Pinecone console">
    1. In the Pinecone console, got to [**Settings > Projects**](https://app.pinecone.io/organizations/-/settings/projects).

    2. Click the **ellipsis (...) menu > Configure** icon next to the project you want to update.

    3. Enter a new **Project Name**.

       <Note>
         A project name can contain up to 512 characters.
       </Note>

    4. Click **Save Changes**.
  </Tab>

  <Tab title="API">
    <Note>
      An [access token](/guides/assistant/admin/manage-organization-service-accounts#retrieve-an-access-token) must be provided to complete this action through the Admin API. The Admin API is in [public preview](/assistant-release-notes/feature-availability).
    </Note>

    ```bash curl
    PINECONE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
    PROJECT_ID="YOUR_PROJECT_ID"

    curl -X PATCH "https://api.pinecone.io/admin/projects/$PROJECT_ID" \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-Api-Version: 2025-04" \
      -d '{
        "name": "updated-example-project"
        }'
    ```

    The example returns a response like the following:

    ```json
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "updated-example-project",
      "max_pods": 0,
      "force_encryption_with_cmek": false,
      "organization_id": "string",
      "created_at": "2025-03-17T00:42:31.912Z"
    }
    ```
  </Tab>
</Tabs>

## Delete a project

To delete a project, you must first [delete all data](/guides/manage-data/delete-data), [indexes](/guides/manage-data/manage-indexes#delete-an-index), [collections](/guides/indexes/pods/back-up-a-pod-based-index#delete-a-collection), [backups](/guides/manage-data/back-up-an-index#delete-a-backup) and [assistants](/guides/assistant/manage-assistants#delete-an-assistant) associated with the project. Then, you can delete the project itself:

<Tabs>
  <Tab title="Pinecone console">
    1. In the Pinecone console, got to [**Settings > Projects**](https://app.pinecone.io/organizations/-/settings/projects).
    2. For the project you want to delete, click the **ellipsis (...) menu > Delete**.
    3. Enter the project name to confirm the deletion.
    4. Click **Delete Project**.
  </Tab>

  <Tab title="API">
    <Note>
      An [access token](/guides/assistant/admin/manage-organization-service-accounts#retrieve-an-access-token) must be provided to complete this action through the Admin API. The Admin API is in [public preview](/assistant-release-notes/feature-availability).
    </Note>

    ```bash curl
    PINECONE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
    PROJECT_ID="YOUR_KEY_ID"

    curl -X DELETE "https://api.pinecone.io/admin/projects/$PROJECT_ID" \
    	-H "X-Pinecone-Api-Version: 2025-04" \
    	-H "Authorization: Bearer $PINECONE_ACCESS_TOKEN"
    ```
  </Tab>
</Tabs>
