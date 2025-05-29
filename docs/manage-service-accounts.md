# Manage service accounts at the organization-level

<Note>
  This feature is in [public preview](/release-notes/feature-availability) and available only on [Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

This page shows how [organization owners](/guides/organizations/understanding-organizations#organization-roles) can add and manage service accounts at the organization-level. Service accounts enable programmatic access to Pinecone's Admin API, which can be used to create and manage projects and API keys.

<Tip>
  Once a service account is added at the organization-level, it can be added to a project. For more information, see [Manage service accounts at the project-level](/guides/projects/manage-service-accounts).
</Tip>

## Create a service account

You can create a service account in the [Pinecone console](https://app.pinecone.io):

1. Go to [**Settings > Access > Service accounts**](https://app.pinecone.io/organizations/-/settings/access/service-accounts).

2. Enter a **Name** for the service account.

3. Choose an [**Organization Role**](/guides/organizations/understanding-organizations#organization-roles) for the service account. The role determines the service account's permissions within Pinecone.

4. Click **Create**.

5. Copy and save the **Client secret** in a secure place for future use. You will need the client secret to retrieve an access token.

   <Warning>
     You will not be able to see the client secret again after you close the dialog.
   </Warning>

6. Click **Close**.

Once you have created a service account, [add it to a project](/guides/projects/manage-service-accounts#add-a-service-account-to-a-project) to allow it access to the project's resources.

## Retrieve an access token

To access the Admin API, you must provide an access token to authenticate. Retrieve the access token using the client secret of a service account, which was [provided at time of creation](#create-a-service-account).

You can retrieve an access token for a service account from the `https://login.pinecone.io/oauth/token` endpoint, as shown in the following example:

```bash curl
curl "https://login.pinecone.io/oauth/token" \ # Note: Base URL is login.pinecone.io
	-H "X-Pinecone-Api-Version: 2025-04" \
	-H "Content-Type: application/json" \
	-d '{
		"grant_type": "client_credentials",
		"client_id": "YOUR_CLIENT_ID",
		"client_secret": "YOUR_CLIENT_SECRET",
		"audience": "https://api.pinecone.io/"
	}'
```

The response will include an `access_token` field, which you can use to authenticate with the Admin API.

```
{
    "access_token":"YOUR_ACCESS_TOKEN",
    "expires_in":86400,
    "token_type":"Bearer"
}
```

## Change a service account's role

You can change a service account's role in the [Pinecone console](https://app.pinecone.io):

1. Go to [**Settings > Access > Service accounts**](https://app.pinecone.io/organizations/-/settings/service-accounts).
2. In the row of the service account you want to update, click **ellipsis (..) menu > Manage**.
3. Select an [**Organization role**](/guides/organizations/understanding-organizations#organization-roles) for the service account.
4. Click **Update**.

## Update service account name

You can change a service account's name in the [Pinecone console](https://app.pinecone.io):

1. Go to [**Settings > Access > Service accounts**](https://app.pinecone.io/organizations/-/settings/service-accounts).
2. In the row of the service account you want to update, click **ellipsis (..) menu > Manage**.
3. Enter a new **Service account name**.
4. Click **Update**.

## Rotate a service account's secret

You can rotate a service account's client secret in the [Pinecone console](https://app.pinecone.io):

1. Go to [**Settings > Access > Service accounts**](https://app.pinecone.io/organizations/-/settings/service-accounts).

2. In the row of the service account you want to update, click **ellipsis (..) menu > Rotate secret**.

3. **Enter the service account name** to confirm.

4. Click **Rotate client secret**.

5. Copy and save the **Client secret** in a secure place for future use.

   <Warning>
     You will not be able to see the client secret again after you close the dialog.
   </Warning>

6. Click **Close**.

## Delete a service account

Deleting a service account will remove it from all projects and will disrupt any applications using it to access Pinecone. You delete a service account in the [Pinecone console](https://app.pinecone.io):

1. Go to [**Settings > Access > Service accounts**](https://app.pinecone.io/organizations/-/settings/service-accounts).
2. In the row of the service account you want to update, click **ellipsis (..) menu > Delete**.
3. **Enter the service account name** to confirm.
4. Click **Delete service account**.
