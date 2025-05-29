# Configure Private Endpoints for AWS PrivateLink

This page describes how to create and use [Private Endpoints](/guides/production/security-overview#private-endpoints-for-aws-privatelink) to connect AWS PrivateLink to Pinecone while keeping your VPC private from the public internet.

## Use Private Endpoints to connect to PrivateLink

### Before you begin

The following steps assume you have:

* Access to the [AWS console](https://console.aws.amazon.com/console/home).

* [Created an Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html#create-vpc-and-other-resources) in the same AWS [region](/guides/index-data/create-an-index#cloud-regions) as the index you want to connect to. You can optionally enable DNS hostnames and resolution, if you want your VPC to automatically discover the DNS CNAME for your PrivateLink and do not want configure a CNAME.

  * To [configure the routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-vpc-interface-endpoint.html) yourself, use one of Pinecone's DNS entry for the corresponding region:

  | Index region              | Pinecone DNS entry                     |
  | ------------------------- | -------------------------------------- |
  | `us-east-1` (N. Virginia) | `*.private.aped-4627-b74a.pinecone.io` |
  | `us-west-2` (Oregon)      | `*.private.apw5-4e34-81fa.pinecone.io` |
  | `eu-west-1` (Ireland)     | `*.private.apu-57e2-42f6.pinecone.io`  |

* A [Pinecone Enterprise plan](https://www.pinecone.io/pricing/).

* [Created a serverless index](/guides/index-data/create-an-index#create-a-serverless-index) in the same AWS [region](/guides/index-data/create-an-index#cloud-regions) as your Amazon VPC.

<Note>
  Private Endpoints are configured at the project-level and you can add up to 10 endpoints per project. If you have multiple projects in your organization, Private Endpoints need to be set up separately for each.
</Note>

### 1. Create an Amazon VPC endpoint

In the [AWS console](https://console.aws.amazon.com/console/home):

1. Open the [Amazon VPC console](https://console.aws.amazon.com/vpc/).

2. In the navigation pane, click **Endpoint**.

3. Click **Create endpoint**.

4. For **Service category**, select **Other endpoint services**.

5. In **Service settings**, enter the **Service name**, based on the region your Pinecone index is in:
   | Index region              | Service name                                              |
   | ------------------------- | --------------------------------------------------------- |
   | `us-east-1` (N. Virginia) | `com.amazonaws.vpce.us-east-1.vpce-svc-05ef6f1f0b9130b54` |
   | `us-west-2` (Oregon)      | `com.amazonaws.vpce.us-west-2.vpce-svc-04ecb9a0e0d5aab01` |
   | `eu-west-1` (Ireland)     | `com.amazonaws.vpce.eu-west-1.vpce-svc-03c6b7e17ff02a70f` |

6. Click **Verify service**.

7. Select the **VPC** to host the endpoint.

8. (Optional) In **Additional settings**, **Enable DNS name**.
   The enables you to access our service with the DNS name we configure. An additional CNAME record is needed if you disable this option.

9. Select the **Subnets** and **Subnet ID** for the endpoint.

10. Select the **Security groups** to apply to the endpoint.

11. Click **Create endpoint**.

12. Copy the **VPC endpoint ID** (e.g., `vpce-XXXXXXX`).
    This will be used to [add a Private Endpoint in Pinecone](#2-add-a-private-endpoint-in-pinecone).

### 2. Add a Private Endpoint in Pinecone

To add a Private Endpoint using the [Pinecone console](https://app.pinecone.io/organizations/-/projects):

1. Select your project.
2. Go to **Manage > Network**.
3. Click **Add a connection**.
4. Select your VPC region.
   Only indexes in the selected region in this project will be affected.
5. Click **Next**.
6. Enter the AWS VPC endpoint ID you copied in the [section above](#create-an-amazon-vpc-endpoint).
7. Click **Next**.
8. (optional) To **enable VPC endpoint access only**, turn the toggle on.
   This can also be enabled later. For more information, see [Manage internet access to your project](#optional-manage-internet-access-to-your-project).
9. Click **Finish setup**.

<Note>
  Private Endpoints only affect [data plane](/reference/api/2024-10/data-plane) access. [Control plane](/reference/api/2024-10/control-plane) access will continue over the public internet.
</Note>

## Run data plane commands

Once your Private Endpoint is configured, to run data operations against an index (e.g., [`upsert`](/guides/index-data/upsert-data), [`query`](/guides/search/search-overview), [`update`](/guides/manage-data/update-data), [`delete`](/guides/manage-data/delete-data), etc.), you must target the index using the Private Endpoint URL for the index. The only difference in the URL is that `.svc.` is changed to `svc.private.` as shown in the example below.

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

If you run the same command from outside of the Private Endpoint, you will get an `Unauthorized` response.

## Manage internet access to your project

Once your Private Endpoint is configured, you can turn off internet access to your project. To enable VPC endpoint access only:

1. Open the [Pinecone console](https://app.pinecone.io/organizations/-/projects).
2. Select your project.
3. Go to **Network > Access**.
4. Turn the **VPC endpoint access only** toggle on.
   This will turn off internet access to the project. This can be turned off at any point.

   <Warning>
     This access control is set at the *project-level* and can unintentionally affect Pinecone indexes that communicate via the internet in the same project. Only indexes communicating through Private Endpoints will continue to work.
   </Warning>

## Manage Private Endpoints

In addition to [creating Private Endpoints](#2-add-a-private-endpoint-in-pinecone), you can also:

* [View Private Endpoints](#view-private-endpoints)
* [Delete a Private Endpoint](#delete-a-private-endpoint)

### View Private Endpoints

To view Private Endpoints using the [Pinecone console](https://app.pinecone.io/organizations/-/projects):

1. Select your project.
2. Go to **Manage > Network**.
   A list of Private Endpoints displays with the associated **VPC ID** and **Cloud** provider.

### Delete a Private Endpoint

To delete a Private Endpoint using the [Pinecone console](https://app.pinecone.io/organizations/-/projects):

1. Select your project.
2. Go to **Manage > Network**.
3. For the Private Endpoint you want to delete, click the *...* (Actions) icon.
4. Click **Delete**.
5. Enter the endpoint name.
6. Click **Delete Endpoint**.
