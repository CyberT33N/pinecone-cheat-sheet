# Configure audit logs

This page describes how to configure audit logs in Pinecone. Audit logs provide a detailed record of user, service account, and API actions that occur within Pinecone. Pinecone supports Amazon S3 as a destination for audit logs.

<Note>
  To enable and manage audit logs, you must be an [organization owner](/guides/assistant/admin/organizations-overview#organization-roles). This feature is in [public preview](/assistant-release-notes/feature-availability) and available only on [Enterprise plans](https://www.pinecone.io/pricing/).
</Note>

## Enable audit logs

Before you can enable audit logs, you need to create an IAM policy and role in Amazon S3. To start, ensure you have the following:

* A [Pinecone account](https://app.pinecone.io/).
* An [Amazon S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-buckets.html).

### 1. Create an IAM policy

In the [AWS IAM console](https://console.aws.amazon.com/iam/home):

1. In the navigation pane, click **Policies**.
2. Click **Create policy**.
3. In **Select a service** section, select **S3**.
4. Select the following actions to allow:
   * `ListBucket`: Permission to list some or all of the objects in an S3 bucket.
   * `PutObject`: Permission to add an object to an S3 bucket.
5. In the **Resources** section, select **Specific**.
6. For the **bucket**, specify the ARN of the bucket you created. For example: `arn:aws:s3:::example-bucket-name`
7. For the **object**, specify an object ARN as the target resource. For example: `arn:aws:s3:::example-bucket-name/*`
8. Click **Next**.
9. Specify the name of your policy. For example:  "Pinecone-S3-Access".
10. Click **Create policy**.

### 2. Set up access using an IAM role

In the [AWS IAM console](https://console.aws.amazon.com/iam/home):

1. In the navigation pane, click **Roles**.

2. Click **Create role**.

3. In the **Trusted entity type** section, select **AWS account**.

4. Select **Another AWS account**.

5. Enter the Pinecone AWS VPC account ID: `713131977538`

6. Click **Next**.

7. Select the policy you created.

8. Click **Next**.

9. Specify the role name. For example: "Pinecone".

10. Click **Create role**.

11. Click the role you created.

12. On the **Summary** page for the role, find the **ARN**.

    For example: `arn:aws:iam::123456789012:role/PineconeAccess`

13. Copy the **ARN**.

    You will need to enter the ARN into Pinecone later.

### 3. Connect Pinecone to Amazon S3

1. Go to [**Settings > Audit logs**](https://app.pinecone.io/organizations/-/settings/logging) in the Pinecone console.
2. Enter the **Role ARN** of the IAM role you created.
3. Enter the name of the Amazon S3 bucket you created.
4. Click **Enable audit logging**.

Once you enable audit logs, Pinecone will start writing logs to the S3 bucket. In your bucket, you will also see a file named `audit-log-access-test`, which is a test file that Pinecone writes to verify that it has the necessary permissions to write logs to the bucket.

## View audit logs

Logs are written to the S3 bucket approximately every 30 minutes. Each log batch will be saved into its own file as a JSON blob, keyed by the time of the log to be written. Only logs since the integration was created and enabled will be saved.

For more information about the log schema and captured events, see [Security overview - Audit logs](/guides/assistant/admin/security-overview#audit-logs).

## Edit audit log integration details

You can edit the details of the audit log integration in the Pinecone console:

1. Go to [**Settings > Audit logs**](https://app.pinecone.io/organizations/-/settings/logging).
2. Enter the new **Role ARN** or **AWS Bucket**.
3. Click **Update settings**.

## Disable audit logs

If you disable audit logs, logs not yet saved will be lost. You can disable audit logs in the Pinecone console:

1. Go to [**Settings > Audit logs**](https://app.pinecone.io/organizations/-/settings/logging).
2. Click the toggle next to **Audit logs are active**.
3. Click **Confirm**.

## Remove audit log integration

If you remove the audit log integration, logs not yet saved will be lost. You can remove the audit log integration in the Pinecone console:

1. Go to [**Settings > Audit logs**](https://app.pinecone.io/organizations/-/settings/logging).
2. At the top of the page, click the **ellipsis (...) menu > Remove integration**.
3. Click **Remove integration**.
