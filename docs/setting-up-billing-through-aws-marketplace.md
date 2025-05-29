# Set up billing through AWS Marketplace

This page shows you how to set up pay-as-you-go billing for your Pinecone organization through the Amazon Web Services (AWS) Marketplace. To commit to annual spending, [contact Pinecone](https://www.pinecone.io/contact).

## Upgrade to a paid plan and connect to AWS

<Note>
  You must be an [organization owner](/guides/organizations/understanding-organizations#organization-roles) to connect your organization to a cloud marketplace.
</Note>

If you are upgrading from the [Starter plan](https://www.pinecone.io/pricing/), you can connect your organization to AWS:

1. In the Pinecone console, go to [**Settings > Billing**](https://app.pinecone.io/organizations/-/settings/billing).

2. In the **Billing Contact** section, click **Connect to cloud marketplace**.

3. Select **Amazon Web Services**.

4. Click **Continue to marketplace**.

5. Click the **Set up your account** button in the top right. This takes you to an AWS-specific Pinecone sign-up page.

   <Warning>
     If the [Pinecone subscription page](https://aws.amazon.com/marketplace/saas/ordering?productId=738798c3-eeca-494a-a2a9-161bee9450b2) shows a message stating, “You are currently subscribed to this offer,” contact your team members to request an invitation to the existing AWS-linked organization. The **Set up your account** button is clickable, but Pinecone does not create a new AWS-linked organization.
   </Warning>

6. Choose an authentication method. Use the same authentication method as your existing Pinecone organization.

7. Select an organization from the list. You can only connect to organizations that are on the [Starter plan](https://www.pinecone.io/pricing/).

   Alternatively, you can opt to create a new organization.

8. Click **Connect to Pinecone**.

   Follow the prompts. Once your organization is connected, you will receive a confirmation message.

## Create a new organization connected to AWS

You can create a new Pinecone organization linked to AWS Marketplace billing:

1. Go to [the Pinecone listing](https://aws.amazon.com/marketplace/pp/prodview-xhgyscinlz4jk) on the AWS Marketplace.
2. Click **View purchase options** in the top right.
3. Click **Subscribe**.
4. Click the **Set up your account** button in the top right. This takes you to an AWS-specific Pinecone sign up page.
5. Choose an authentication method.
6. Create a new organization.
7. Click **Connect to Pinecone**.

   Follow the prompts. Once your organization is connected, you will receive a confirmation message.

## Next steps

* [Create an index](/guides/index-data/create-an-index)
* [Upsert data](/guides/index-data/upsert-data)
* [Query data](/guides/search/search-overview)
