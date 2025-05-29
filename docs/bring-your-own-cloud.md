# Bring your own cloud

Bring your own cloud (BYOC) lets you deploy Pinecone Database in your own AWS or GCP account to ensure data sovereignty and compliance, with Pinecone handling provisioning, operations, and maintenance.

<Note>
  BYOC is in [public preview](/release-notes/feature-availability) on AWS and GCP. To learn more about the offering, [contact Pinecone](https://www.pinecone.io/contact/?contact_form_inquiry_type=Product+Information).
</Note>

## Use cases

Pinecone BYOC is designed for organizations with high security and compliance requirements, for example:

* **Data sovereignty**: If your organization has strict data governance policies, Pinecone BYOC can help ensure that all data is stored and processed locally and does not leave your security perimeter.
* **Data residency**: The standard Pinecone managed service can be deployed in several [AWS or GCP cloud regions](/guides/index-data/create-an-index#cloud-regions). If your organization has specific data residency or latency constraints that require you to deploy in regions that Pinecone does not yet support, Pinecone BYOC gives you that flexibility.

## Architecture

<img className="block max-w-full dark:hidden" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/byoc.png" />

<img className="hidden max-w-full dark:block" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/byoc-dark.png" />

The BYOC architecture employs a split model:

* **Data plane**: The data plane is responsible for storing and processing your records, executing queries, and interacting with object storage for index data. In a BYOC deployment, the data plane is hosted in your own AWS or GCP account within a dedicated VPC, ensuring that all data is stored and processed locally and does not leave your organizational boundaries. You use a [private endpoint](#configure-a-private-endpoint) (AWS PrivateLink or GCP Private Service Connect) as an additional measure to secure requests to your indexes.
* **Control plane**: The control plane is responsible for managing the index lifecycle as well as region-agnostic services such as user management, authentication, and billing. The control plane does not hold or process any records. In a BYOC deployment, the control plane is managed by Pinecone and hosted globally. Communication between the data plane and control plane is encrypted using TLS and employs role-based access control (RBAC) with minimal IAM permissions.

## Onboarding

The onboarding process for BYOC in AWS or GCP involves the following general stages:

<Steps>
  <Step title="Set up AWS or GCP account">
    If you don't already have an AWS or GCP account where you want to deploy Pinecone, you create one for this purpose.
  </Step>

  <Step title="Execute Terraform template">
    You download and run a Terraform template provided by Pinecone. This template creates essential resources, including an IAM role with scoped-down permissions and a trust relationship with Pinecone's AWS or GCP account.
  </Step>

  <Step title="Create environment">
    Pinecone deploys a data plane cluster within a dedicated VPC in your AWS or GCP account, and you [configure a private endpoint](#configure-a-private-endpoint) for securely connecting to your indexes via AWS PrivateLink or GCP Private Service Connect.
  </Step>

  <Step title="Validate">
    Once the environment is operational, Pinecone performs validation tests to ensure proper functionality.
  </Step>
</Steps>

## Configure a private endpoint

You use a private endpoint to securely connect to your BYOC indexes. On AWS, you use the [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html) service; on GCP, you use the [GCP Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect) service.

<Tabs>
  <Tab title="AWS">
    Follow the instructions in the AWS documentation to [create a VPC endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html#create-interface-endpoint-aws) for connecting to your indexes via AWS PrivateLink.

    * For **Resource configurations**, select the relevant resource for your Pinecone BYOC deployment.

    * For **Network settings**, select the VPC for your BYOC deployment.

    * In **Additional settings**, select **Enable DNS name** to allow you to access your indexes using a DNS name.
  </Tab>

  <Tab title="GCP">
    <Steps>
      <Step title="Create a private endpoint">
        Follow the instructions in the GCP documentation to [create a private endpoint](https://cloud.google.com/vpc/docs/configure-private-service-connect-services#create-endpoint) for connecting to your indexes via GCP Private Service Connect.

        * Set the **Target service** to the following:

          ```
          projects/<YOUR-BYOC-PROJECT>/regions/<YOUR-BYOC-REGION>/serviceAttachments/pinecone-psc
          ```
        * Copy the IP address of the private endpoint. You'll need it later.
      </Step>

      <Step title="Create a private DNS zone">
        Follow the instructions in the GCP documentation to [create a private DNS zone](https://cloud.google.com/dns/docs/zones#create-private-zone).

        * Set the **DNS name** to the following:

          ```
          private.<YOUR-BYOC-ENVIRONMENT>.pinecone.io
          ```
        * Select the same VPC network as the private endpoint.
      </Step>

      <Step title="Add a resource record set">
        Follow the instructions in the GCP documentation to [add a resource record set](https://cloud.google.com/dns/docs/records#add-rrset).

        * Set the **DNS name** to **\***.

        * Set the **Resource record type** to **A**.

        * Set the **Ipv4 Address** to the IP address of the private endpoint.
      </Step>
    </Steps>
  </Tab>
</Tabs>

## Create an index

Once your BYOC environment is ready, you can create a BYOC index in the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes) or via Pinecone API or [Python SDK](/reference/python-sdk).

To create a BYOC index, set the `spec` parameter to the environment name provided to you during onboarding, for example:

<CodeGroup>
  ```python Python {9-11}
  from pinecone import Pinecone, ByocSpec

  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.create_index(
      name="example-byoc-index", 
      dimension=1536, 
      metric="cosine", 
      spec=ByocSpec(
          environment="aws-us-east-1-b921"
      ),
      deletion_protection="disabled",
      tags={
          "example": "tag"
      }
  )
  ```

  ```shell curl {11-15}
  curl -s "https://api.pinecone.io/indexes" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
          "name": "example-byoc-index",
          "vector_type": "dense",
          "dimension": 1536,
          "metric": "cosine",
          "spec": {
              "byoc": {
                  "environment": "aws-us-east-1-b921"
              }
          },
          "tags"={
              "example": "tag"
          },
          "deletion_protection": "disabled"
        }'
  ```
</CodeGroup>

## Read and write data

Once your [private endpoint](#configure-a-private-endpoint) is configured, you can run data operations against a BYOC index as usual, but you must target the index using its private endpoint URL. The only difference in the URL is that `.svc.` is changed to `svc.private.` as shown in the example below.

<Note>
  BYOC does not support reading and writing data from the index browser in the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes/-/browser).
</Note>

<CodeGroup>
  ```python Python {8}
  # pip install "pinecone[grpc]"
  from pinecone.grpc import PineconeGRPC as Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # Use the Private Endpoint URL for host, which can be found in the 
  # Pinecone console after you select the index to view more details.
  index = pc.Index(host="https://docs-example-a1b234c.svc.private.aped-4627-b74a.pinecone.io")

  upsert_response = index.upsert(
      vectors=[
          {
            "id": "I",
            "values": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
          },
          {
            "id": "J", 
            "values": [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
          },
          {
            "id": "K", 
            "values": [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
          },
          {
            "id": "L", 
            "values": [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
          }
      ]
  )
  ```

  ```bash curl {3}
  # Use the Private Endpoint URL for host, which can be found in the 
  # Pinecone console after you select the index to view more details.
  INDEX_PRIVATE_HOST="https://docs-example-a1b234c.svc.private.aped-4627-b74a.pinecone.io"

  curl "https://$INDEX_PRIVATE_HOST/vectors/upsert" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -H 'Content-Type: application/json' \
      -H "X-Pinecone-API-Version: 2025-04" \
      -d '{
            "vectors": [
              {
                "id": "I", 
                "values": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
              },
              {
                "id": "J", 
                "values": [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
              },
              {
                "id": "K", 
                "values": [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
              },
              {
                "id": "L", 
                "values": [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
              }
            ]
          }'
  ```
</CodeGroup>

## Monitoring

Pinecone engineers monitor the state of your BYOC deployment and manage incidents if they arise. In addition, you can [monitor performance metrics](/guides/production/monitoring) for your BYOC indexes in the Pinecone Console or with Prometheus or Datadog.

<Note>
  To use Prometheus, your monitoring tool must have access to your VPC.
</Note>

## FAQs

<AccordionGroup>
  <Accordion title="What is the difference between BYOC and Pinecone's standard service?">
    In the standard service, Pinecone manages all cloud resources and includes their cost in the service fee. In BYOC, customers provision and pay for cloud resources directly through their AWS or GCP account, providing greater control and data sovereignty as well as access to available AWS or GCP credits or discounts.

    Also, BYOC does not support integrated inference, which relies on Pinecone's infrastructure for model hosting.
  </Accordion>

  <Accordion title="How is data secured in BYOC?">
    Data is stored and processed exclusively within the customer's AWS or GCP account, with encryption applied at rest and in transit. Communication between the data plane and control plane is encrypted using TLS, and access is controlled via RBAC and scoped IAM permissions. AWS PrivateLink or GCP Private Service Connect is used for secure data plane API calls.
  </Accordion>

  <Accordion title="Is BYOC available in other cloud providers?">
    Currently, BYOC is available in AWS and GCP. Support for Azure is planned for future releases.
  </Accordion>

  <Accordion title="Are there unsupported features in BYOC?">
    * BYOC does not support using [integrated embedding](/guides/index-data/indexing-overview#integrated-embedding) to upsert and search with text and have Pinecone generate vectors automatically. Integrated embedding relies on models hosted by Pinecone that are outsite of your AWS or GCP account.

    * BYOC does not support reading and writing data from the index browser in the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/indexes/-/browser). You must use the Pinecone API or SDKs instead.
  </Accordion>
</AccordionGroup>
