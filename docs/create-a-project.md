# Create a project

This page shows you how to create a project.

If you are an [organization owner or user](/guides/assistant/admin/organizations-overview#organization-roles), you can create a project in your organization:

<Tabs>
  <Tab title="Pinecone console">
    1. In the Pinecone console, got to [**your profile > Organization settings > Projects**](https://app.pinecone.io/organizations/-/settings/projects).

    2. Click **+ Create Project**.

    3. Enter a **Name**.

       <Note>
         A project name can contain up to 512 characters.
       </Note>

    4. Click **Create project**.

    <Note>
      Organizations on the Starter plan are limited to 1 project. To create additional projects, [upgrade to the Standard or Enterprise plan](/guides/assistant/admin/manage-your-billing-plan).
    </Note>
  </Tab>

  <Tab title="API">
    <Note>
      An [access token](/guides/assistant/admin/manage-organization-service-accounts#retrieve-an-access-token) must be provided to complete this action through the Admin API. The Admin API is in [public preview](/assistant-release-notes/feature-availability).
    </Note>

    ```bash curl
    PINECONE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"

    curl "https://api.pinecone.io/admin/projects" \
        -H "X-Pinecone-Api-Version: 2025-04" \
    	-H "Authorization: Bearer $PINECONE_ACCESS_TOKEN" \
    	-d '{
            "name":"example-project"
            }'
    ```

    The example returns a response like the following:

    ```json
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "example-project",
      "max_pods": 0,
      "force_encryption_with_cmek": false,
      "organization_id": "string",
      "created_at": "2025-03-16T22:46:45.030Z"
    }
    ```
  </Tab>
</Tabs>

## Next steps

* [Add users to your project](/guides/assistant/admin/manage-project-members#add-members-to-a-project)
* [Create an assistant](/guides/assistant/create-assistant)
