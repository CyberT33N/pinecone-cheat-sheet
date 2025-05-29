# Integrate with Amazon S3

<Note>
  This feature is in [public preview](/release-notes/feature-availability) and available only on [Standard and Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

To connect Pinecone to an Amazon S3 bucket, you need to create an IAM policy and role. Then, you can [configure audit logs](/guides/production/configure-audit-logs) or [add a storage integration](/guides/operations/integrations/manage-storage-integrations) to be used to [import data](/guides/index-data/import-data).

## Before you begin

Ensure you have the following:

* A [Pinecone account](https://app.pinecone.io/).
* An [Amazon S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-buckets.html).

## 1. Create an IAM policy

In the [AWS IAM console](https://console.aws.amazon.com/iam/home):

1. In the navigation pane, click **Policies**.
2. Click **Create policy**.
3. In **Select a service** section, select **S3**.
4. Select the following actions to allow:
   * `ListBucket`: Permission to list some or all of the objects in an S3 bucket. Required for [importing data](/guides/index-data/import-data) and [exporting audit logs](/guides/production/configure-audit-logs).
   * `GetObject`: Permission to retrieve objects from an S3 bucket. Required for [importing data](/guides/index-data/import-data).
   * `PutObject`: Permission to add an object to an S3 bucket. Required for [exporting audit logs](/guides/production/configure-audit-logs).
5. In the **Resources** section, select **Specific**.
6. For the **bucket**, specify the ARN of the bucket you created. For example: `arn:aws:s3:::example-bucket-name`
7. For the **object**, specify an object ARN as the target resource. For example: `arn:aws:s3:::example-bucket-name/*`
8. Click **Next**.
9. Specify the name of your policy. For example:  "Pinecone-S3-Access".
10. Click **Create policy**.

## 2. Set up access using an IAM role

In the [AWS IAM console](https://console.aws.amazon.com/iam/home):

1. In the navigation pane, click **Roles**.

2. Click **Create role**.

3. In the **Trusted entity type** section, select **AWS account**.

4. Select **Another AWS account**.

5. Enter the Pinecone AWS VPC account ID: `713131977538`

6. Click **Next**.

7. Select the [policy you created](#1-create-an-iam-policy).

8. Click **Next**.

9. Specify the role name. For example: "Pinecone".

10. Click **Create role**.

11. Click the role you created.

12. On the **Summary** page for the role, find the **ARN**.

    For example: `arn:aws:iam::123456789012:role/PineconeAccess`

13. Copy the **ARN**.

    You will need to enter the ARN into Pinecone later.

## Next steps

After you have configured your IAM policy and role, you can use them to do the following:

* [Add a storage integration](/guides/operations/integrations/manage-storage-integrations) and [import data](/guides/index-data/import-data) from your Amazon S3 bucket.
* [Configure audit logs](/guides/production/configure-audit-logs) to export logs to your Amazon S3 bucket.
