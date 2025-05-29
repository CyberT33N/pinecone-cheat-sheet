# Organizations overview

A Pinecone organization is a set of [projects](/guides/assistant/admin/projects-overview) that use the same billing. Organizations allow one or more users to control billing and project permissions for all of the projects belonging to the organization. Each project belongs to an organization.

<Note>
  While an email address can be associated with multiple organizations, it cannot be used to create more than one organization. For information about managing organization members, see [Manage organization members](/guides/assistant/admin/manage-organization-members).
</Note>

## Projects in an organization

Each organization contains one or more projects that share the same organization owners and billing settings. Each project belongs to exactly one organization. If you need to move a project from one organization to another, [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket).

## Billing settings

All of the projects in an organization share the same billing method and settings. The billing settings for the organization are controlled by the organization owners.

Organization owners can update the billing contact information, update the payment method, and view and download invoices using the [Pinecone console](https://app.pinecone.io/organizations/-/settings/billing).

## Organization roles

Organization owners can manage access to their organizations and projects by assigning roles to organization members and service accounts. The role determines the entity's permissions within Pinecone. The organization roles are as follows:

* **Organization owner**: Organization owners have global permissions across the organization. This includes managing billing details, organization members, and all projects. Organization owners are automatically [project owners](/guides/assistant/admin/projects-overview#project-roles) and, therefore, have all project owner permissions as well.

* **Organization user**: Organization users have restricted organization-level permissions. When inviting organization users, you also choose the projects they belong to and the project role they should have. Organization users are automatically [project owners](/guides/assistant/admin/projects-overview#project-roles) and, therefore, have all project owner permissions as well.

* **Billing admin**: Billing admins have permissions to view and update billing details, but they cannot manage organization members. Billing admins cannot manage projects unless they are also [project owners](/guides/assistant/admin/projects-overview#project-roles).

The following table summarizes the permissions for each organization role:

| Permission                           | Org Owner | Org User | Billing Admin |
| ------------------------------------ | --------- | -------- | ------------- |
| View account details                 | ✓         | ✓        | ✓             |
| Update organization name             | ✓         |          |               |
| Delete the organization              | ✓         |          |               |
| View billing details                 | ✓         |          | ✓             |
| Update billing details               | ✓         |          | ✓             |
| View usage details                   | ✓         |          | ✓             |
| View support plans                   | ✓         |          | ✓             |
| Invite members to the organization   | ✓         |          |               |
| Delete pending member invites        | ✓         |          |               |
| Remove members from the organization | ✓         |          |               |
| Update organization member roles     | ✓         |          |               |
| Create projects                      | ✓         | ✓        |               |

## Organization single sign-on (SSO)

SSO allows organizations to manage their teams' access to Pinecone through their identity management solution. Once your integration is configured, you can specify a default role for teammates when they sign up.

For more information, see [Configure single sign-on](/guides/assistant/admin/configure-sso-with-okta).

<Note>SSO is available only on Enterprise plans.</Note>

## Service accounts

<Note>
  This feature is in [public preview](/release-notes/feature-availability) and available only on [Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

[Service accounts](/guides/assistant/admin/manage-organization-service-accounts) enable programmatic access to Pinecone's Admin API, which can be used to create and manage projects and API keys.

Use service accounts to automate infrastructure management and integrate Pinecone into your deployment workflows, rather than through manual actions in the Pinecone console. Service accounts use the [organization roles](/guides/assistant/admin/organizations-overview#organization-roles) and [project role](/guides/assistant/admin/projects-overview#project-roles) for permissioning, and provide a secure and auditable way to handle programmatic access.

## See also

* [Manage organization members](/guides/assistant/admin/manage-organization-members)
* [Manage project members](/guides/assistant/admin/manage-project-members)

- [Project overview](/guides/assistant/admin/projects-overview)
