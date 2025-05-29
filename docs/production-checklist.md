# Production checklist

This page provides recommendations and best practices for preparing your Pinecone indexes for production, anticipating production issues, and enabling reliability and growth.

<Note>
  For high-scale use cases, consider using the [Pinecone AWS Reference Architecture](https://github.com/pinecone-io/aws-reference-architecture-pulumi) as a starting point, and read up on [code best practices](https://www.pinecone.io/blog/working-at-scale).
</Note>

## Prepare your project structure

One of the first steps towards building a production-ready Pinecone index is configuring your project correctly.

* Consider [creating a separate project](/guides/projects/create-a-project) for your development and production indexes, to allow for testing changes to your index before deploying them to production.
* Ensure that you have properly [configured user access](/guides/projects/understanding-projects#project-roles) to the Pinecone console, so that only those users who need to access the production index can do so.
* Ensure that you have properly configured access through the API by [managing API keys](/guides/projects/manage-api-keys) and using API key permissions.

Consider how best to [manage the API keys](/guides/projects/manage-api-keys) associated with your production project. In order to [make calls to the Pinecone API](/guides/get-started/quickstart), you must provide a valid API key for the relevant Pinecone project.

## Test your query results

Before you move your index to production, make sure that your index is returning accurate results in the context of your application by [identifying the appropriate metrics](https://www.pinecone.io/learn/offline-evaluation/) for evaluating your results.

## Target indexes by host

Before moving your project to production, make sure that you are [targeting indexes by host](/guides/manage-data/target-an-index) rather than by name.

## Backup up your indexes

In order to enable long-term retention, compliance archiving, and deployment of new indexes, consider backing up your production indexes by [creating a backup or collection](/guides/manage-data/back-up-an-index).

## Enforce security

Use Pinecone's [security features](/guides/production/security-overview) to protect your production data:

* Data security
  * Private endpoints
  * Customer-managed encryption keys (CMEK)
* Authorization
  * API keys
  * Role-based access control (RBAC)
  * Organization single sign-on (SSO)
* Audit logs
* Bring your own cloud

## Tune for performance

Before serving production workloads, identify ways to [increase search relevance](/guides/optimize/increase-relevance), [increase throughput](/guides/optimize/increase-throughput), and [decrease latency](/guides/optimize/decrease-latency).

## Configure monitoring

Prepare to [monitor the production performance and availability of your indexes](/guides/production/monitoring).

## Configure CI/CD

Use [Pinecone in CI/CD](/guides/production/automated-testing) to safely test changes before deploying them to production.

## Know how to get support

If you need help, [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket), or talk to the [Pinecone community](https://www.pinecone.io/community/). Ensure that your [plan tier](https://www.pinecone.io/pricing/) matches the support and availability SLAs you need. This may require you to upgrade to Enterprise.
