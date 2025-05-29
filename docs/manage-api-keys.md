# Manage API keys

Each Pinecone [project](/guides/assistant/admin/projects-overview) has one or more API keys. In order to [make calls to the Pinecone API](/guides/assistant/quickstart), you must provide a valid API key for the relevant Pinecone project.

This page shows you how to [create](#create-an-api-key), [view](#view-api-keys), [change permissions for](#change-api-key-permissions), and [delete](#delete-an-api-key) API keys.

## Create an API key

You can create a new API key for your project, as follows:

<Tabs>
  <Tab title="Pinecone console">
    1. Open the [Pinecone console](https://app.pinecone.io/organizations/-/projects).

    2. Select your project.

    3. Go to **API keys**.

    4. Click **Create API key**.

    5. Enter an **API key name**.

    6. Select the **Permissions** to grant to the API key. For a description of the permission roles, see [API key permissions](/guides/assistant/admin/security-overview#api-keys).

       <Note>
         Users on the Starter plan can set the permissions to **All** only. To customize the permissions further, [upgrade to the Standard or Enterprise plan](/guides/assistant/admin/manage-your-billing-plan).
       </Note>

    7. Click **Create key**.

    8. Copy and save the generated API key in a secure place for future use.

       <Warning>
         You will not be able to see the API key again after you close the dialog.
       </Warning>

    9. Click **Close**.
  </Tab>

  <Tab title="API">
    <Note>
      An [access token](/guides/assistant/admin/manage-organization-service-accounts#retrieve-an-access-token) must be provided to complete this action through the Admin API. The Admin API is in [public preview](/assistant-release-notes/feature-availability).
    </Note>

    ```bash curl
    PINECONE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
    PINECONE_PROJECT_ID="YOUR_PROJECT_ID"

    curl "https://api.pinecone.io/admin/projects/$PINECONE_PROJECT_ID/api_keys" \
    	-H "X-Pinecone-Api-Version: 2025-04" \
    	-H "Authorization: Bearer $PINECONE_ACCESS_TOKEN" \
    	-d '{
    		"name": "Example API Key",
    		"roles": ["ProjectEditor"]
    	}'
    ```

    The example returns a response like the following:

    ```json
    {
      "key": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "Example API key",
        "project_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "roles": [
          "ProjectEditor"
        ]
      },
      "value": "string"
    }
    ```
  </Tab>
</Tabs>

## View project API keys

You can [view the API keys](/reference/api/2025-04/admin/list_api_keys) for your project as in the following example:

<Note>
  An [access token](/guides/assistant/admin/manage-organization-service-accounts#retrieve-an-access-token) must be provided to complete this action through the Admin API. The Admin API is in [public preview](/assistant-release-notes/feature-availability).
</Note>

```bash curl
PINECONE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
PROJECT_ID="3fa85f64-5717-4562-b3fc-2c963f66afa6"

curl -X GET "https://api.pinecone.io/admin/projects/$PROJECT_ID/api-keys" \
	-H "Authorization: Bearer $PINECONE_ACCESS_TOKEN" \
    -H "accept: application/json" \
    -H "X-Pinecone-Api-Version: 2025-04" 
```

The example returns a response like the following:

```json
{
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "project_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "roles": [
        "ProjectEditor"
      ]
    }
  ]
}
```

<Tip>
  You can view the API keys for your project in the Pinecone console, on the [**API keys** tab](https://app.pinecone.io/organizations/-/projects/-/keys).
</Tip>

## View API key details

You can [view the details of an API key](/reference/api/2025-04/admin/fetch_api_key), as shown in the following example:

<Note>
  An [access token](/guides/assistant/admin/manage-organization-service-accounts#retrieve-an-access-token) must be provided to complete this action through the Admin API. The Admin API is in [public preview](/assistant-release-notes/feature-availability).
</Note>

```bash curl
PINECONE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
PINECONE_API_KEY_ID="3fa85f64-5717-4562-b3fc-2c963f66afa6"

curl -X GET "https://api.pinecone.io/admin/api-keys/$PINECONE_API_KEY_ID" \
	-H "Authorization: Bearer $PINECONE_ACCESS_TOKEN" \
    -H "accept: application/json" \
    -H "X-Pinecone-Api-Version: 2025-04"
```

The example returns a response like the following:

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "project_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "roles": [
    "ProjectEditor"
  ]
}
```

## Change API key permissions

<Info>
  Users on the Starter plan cannot change API key permissions once they are set. Instead, [create a new API key](#create-an-api-key) or [upgrade to the Standard or Enterprise plan](/guides/assistant/admin/manage-your-billing-plan).
</Info>

If you are a [project owner](/guides/assistant/admin/projects-overview#project-roles), you can change API key permissions:

1. Open the [Pinecone console](https://app.pinecone.io/organizations/-/projects).

2. Select your project.

3. Go to the **API keys** tab.

4. In the row of the API key you want to change, click the **ellipsis (...) menu > Manage**.

5. Change the permissions for the API key as needed.

   For information about the different API key permissions, refer to [Understanding security - API keys](/guides/assistant/admin/security-overview#api-keys).

6. Click **Update**.

## Delete an API key

If you are a [project owner](/guides/projects/understanding-projects#project-roles), you can delete your API key:

<Tabs>
  <Tab title="Pinecone console">
    1. Open the [Pinecone console](https://app.pinecone.io/organizations/-/projects).
    2. Select your project.
    3. Go to the **API keys** tab.
    4. In the row of the API key you want to change, click the **ellipsis (...) menu > Delete**.
    5. Enter the **API key name**.
    6. Click **Confirm deletion**.
  </Tab>

  <Tab title="API">
    <Note>
      An [access token](/guides/assistant/admin/manage-organization-service-accounts#retrieve-an-access-token) must be provided to complete this action through the Admin API. The Admin API is in [public preview](/assistant-release-notes/feature-availability).
    </Note>

    ```bash curl
    PINECONE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
    PINECONE_API_KEY_ID="YOUR_KEY_ID"

    curl -X DELETE "https://api.pinecone.io/admin/api-keys/$PINECONE_API_KEY_ID" \
    	-H "X-Pinecone-Api-Version: 2025-04" \
    	-H "Authorization: Bearer $PINECONE_ACCESS_TOKEN"
    ```
  </Tab>
</Tabs>

<Warning>
  Deleting an API key is irreversible and will immediately disable any applications using the API key.
</Warning>
