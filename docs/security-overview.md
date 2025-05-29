# Security overview

This page describes Pinecone's security protocols, practices, and features.

## Access management

### API keys

Each Pinecone [project](/guides/assistant/admin/projects-overview) has one or more [API keys](/guides/assistant/admin/manage-api-keys). In order to make calls to the Pinecone API, a user must provide a valid API key for the relevant Pinecone project.

You can [manage API key permissions](/guides/assistant/admin/manage-api-keys) in the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/keys). The available permission roles are as follows:

#### General permissions

| Role | Permissions                                     |
| :--- | :---------------------------------------------- |
| All  | Permissions to read and write all project data. |

#### Control plane permissions

| Role      | Permissions                                                                                                 |
| :-------- | :---------------------------------------------------------------------------------------------------------- |
| ReadWrite | Permissions to list, describe, create, delete, and configure indexes, backups, collections, and assistants. |
| ReadOnly  | Permissions to list and describe indexes, backups, collections, and assistants.                             |
| None      | No control plane permissions.                                                                               |

#### Data plane permissions

<Note>
  For pod-based indexes, the data plane is limited to ReadWrite.
</Note>

| Role      | Permissions                                                                                                                                                                                                                                                                                                            |
| :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ReadWrite | <ul><li>Indexes: Permissions to query, import, fetch, add, update, and delete index data.</li><li>Pinecone Assistant: Permissions to add, list, view, and delete files; chat with an assistant, and evaluate responses.</li><li>Pinecone Inference: Permissions to generate embeddings and rerank documents.</li></ul> |
| ReadOnly  | <ul><li>Indexes: Permissions to query, fetch, list ID, and view stats.</li><li>Pinecone Assistant: Permissions to list and view files, chat with an assistant, and evaluate responses.</li></ul>                                                                                                                       |
| None      | No data plane permissions.                                                                                                                                                                                                                                                                                             |

### Organization single sign-on (SSO)

SSO allows organizations to manage their teams' access to Pinecone through their identity management solution. Once your integration is configured, you can require that users from your domain sign in through SSO, and you can specify a default role for teammates when they sign up. Only organizations in the Enterprise dedicated tier can set up SSO.

For more information, see [configure single sign on](/guides/assistant/admin/configure-sso-with-okta).

### Role-based access controls (RBAC)

Pinecone uses role-based access controls (RBAC) to manage access to resources.

Service accounts, API keys, and users are all *principals*. A principal's access is determined by the *roles* assigned to it. Roles are assigned to a principal for a *resource*, either a project or an organization. The roles available to be assigned depend on the type of principal and resource.

#### Service account roles

A service account can be assigned roles for the organization it belongs to, and any projects within that organization. A user can be assigned roles for each organization they belong to, and any projects within that organization. For more information, see [Organization roles](/guides/assistant/admin/organizations-overview#organization-roles) and [Project roles](/guides/assistant/admin/projects-overview#project-roles).

#### API key roles

An API key can only be assigned permissions for the projects it belongs to. For more information, see [API keys](#api-keys).

#### User roles

A user can be assigned roles for each organization they belong to, and any projects within that organization. For more information, see [Organization roles](/guides/assistant/admin/organizations-overview#organization-roles) and [Project roles](/guides/assistant/admin/projects-overview#project-roles).

## Compliance

<Note>
  To learn more about data privacy and compliance at Pinecone, visit the [Pinecone Trust and Security Center](https://security.pinecone.io/).
</Note>

### Audit logs

<publicPreviewEnt />

[Audit logs](/guides/assistant/admin/configure-audit-logs) provide a detailed record of user and API actions that occur within Pinecone.

Events are captured every 30 minutes and each log batch will be saved into its own file as a JSON blob, keyed by the time of the log to be written. Only logs since the integration was created and enabled will be saved.

Audit log events adhere to a standard JSON schema and include the following fields:

```json JSON
{
    "id": "00000000-0000-0000-0000-000000000000",
    "organization_id": "AA1bbbbCCdd2EEEe3FF",
    "organization_name": "example-org",
    "client": {
        "userAgent": "rawUserAgent"
    },
    "actor": {
        "principal_id": "00000000-0000-0000-0000-000000000000",
        "principal_name": "example@pinecone.io",
        "principal_type": "user", // user, api_key, service_account
        "display_name": "Example Person" // Only in case of user
    },
	"event": {
        "time": "2024-10-21T20:51:53.697Z",
        "action": "create",
        "resource_type": "index",
        "resource_id": "uuid",
        "resource_name": "docs-example",
        "outcome": {
            "result": "success",
            "reason": "", // Only displays for "result": "failure"
            "error_code": "", // Only displays for "result": "failure"
        },
        "parameters": { // Varies based on event
        }
	}
}
```

The following events are captured in the audit logs:

* [Organization events](#organization-events)
* [Project events](#project-events)
* [Index events](#index-events)
* [User and API key events](#user-and-api-key-events)
* [Security and governance events](#security-and-governance-events)

#### Organization events

| Action            | Query parameters                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Rename org        | `event.action: update`, `event.resource_type: organization`, `event.resource_id: NEW_ORG_NAME`                 |
| Delete org        | `event.action: delete`, `event.resource_type: organization`, `event.resource_id: DELETED_ORG_NAME`             |
| Create org member | `event.action: create`, `event.resource_type: user`, `event.resource_id: [ARRAY_OF_USER_EMAILS]`               |
| Update org member | `event.action: update`, `event.resource_type: user`, `event.resource_id: { user: USER_EMAIL, role: NEW_ROLE }` |
| Delete org member | `event.action: delete`, `event.resource_type: user`, `event.resource_id: USER_EMAIL`                           |

#### Project events

| Action                     | Query parameters                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Create project             | `event.action: create`, `event.resource_type: project`, `event.resouce_id: PROJ_NAME`                              |
| Update project             | `event.action: update`, `event.resource_type: project`, `event.resource_id: PROJECT_NAME`                          |
| Delete project             | `event.action: delete`, `event.resource_type: project`, `event.resource_id: PROJECT_NAME`                          |
| Invite project member      | `event.action: create`, `event.resource_type: user`, `event.resource_id: [ARRAY_OF_USER_EMAILS]`                   |
| Update project member role | `event.action: update`, `event.resource_type: user`, `event.resource_id: { user: USER_EMAIL, role: NEW_ROLE }`     |
| Delete project member      | `event.action: delete`, `event.resource_type: user`, `event.resource_id: { user: USER_EMAIL, project: PROJ_NAME }` |

#### Index events

| Action        | Query parameters                                                                        |
| ------------- | --------------------------------------------------------------------------------------- |
| Create index  | `event.action: create`, `event.resource_type: index`, `event.resouce_id: INDEX_NAME`    |
| Update index  | `event.action: update`, `event.resource_type: index`, `event.resource_id: INDEX_NAME`   |
| Delete index  | `event.action: delete`, `event.resource_type: index`, `event.resource_id: INDEX_NAME`   |
| Create backup | `event.action: create`, `event.resource_type: backup`, `event.resource_id: BACKUP_NAME` |
| Delete backup | `event.action: delete`, `event.resource_type: backup`, `event.resource_id: BACKUP_NAME` |

#### User and API key events

| Action         | Query parameters                                                                        |
| -------------- | --------------------------------------------------------------------------------------- |
| User login     | `event.action: login`, `event.resource_type: user`, `event.resouce_id: USERNAME`        |
| Create API key | `event.action: create`, `event.resource_type: api-key`, `event.resource_id: API_KEY_ID` |
| Delete API key | `event.action: delete`, `event.resource_type: api-key`, `event.resource_id: API_KEY_ID` |

#### Security and governance events

| Action                  | Query parameters                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Create Private Endpoint | `event.action: create`, `event.resource_type: private-endpoints`, `event.resource_id: PRIVATE_ENDPOINT_ID` |
| Delete Private Endpoint | `event.action: delete`, `event.resource_type: private-endpoints`, `event.resource_id: PRIVATE_ENDPOINT_ID` |

## Data protection

### Encryption at rest

Pinecone encrypts stored data using the 256-bit Advanced Encryption Standard (AES-256) encryption algorithm.

### Encryption in transit

Pinecone uses standard protocols to encrypt user data in transit. Clients open HTTPS or gRPC connections to the Pinecone API; the Pinecone API gateway uses gRPC connections to user deployments in the cloud. These HTTPS and gRPC connections use the TLS 1.2 protocol with 256-bit Advanced Encryption Standard (AES-256) encryption.

![Diagram showing encryption protocols for user data in transit](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/encryption-in-transit-2.png)

Traffic is also encrypted in transit between the Pinecone backend and cloud infrastructure services, such as S3 and GCS. For more information, see [Google Cloud Platform](https://cloud.google.com/docs/security/encryption-in-transit) and [AWS security documentation](https://docs.aws.amazon.com/AmazonS3/userguide/UsingEncryption.html).

## Network security

### Proxies

The following Pinecone SDKs support the use of proxies:

* [Python SDK](/reference/python-sdk#proxy-configuration)
* [Node.js SDK](/reference/node-sdk#proxy-configuration)
