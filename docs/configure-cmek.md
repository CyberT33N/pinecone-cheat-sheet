# Configure customer-managed encryption keys

This page describes how to set up and use customer-managed encryption keys (CMEK) to secure data within a Pinecone project. CMEK allows you to encrypt your data using keys that you manage in your cloud provider's key management system (KMS). Pinecone supports CMEK using Amazon Web Services (AWS) KMS.

<Note>
  This feature is in [public preview](/release-notes/feature-availability).
</Note>

## Set up CMEK using AWS KMS

### Before you begin

The following steps assume you have:

* Access to the [AWS console](https://console.aws.amazon.com/console/home).
* A [Pinecone Enterprise plan](https://www.pinecone.io/pricing/).

### 1. Create a role

In the [AWS console](https://console.aws.amazon.com/console/home), create a role that Pinecone can use to access the AWS Key Management System (KMS) key. You can either grant Pinecone access to a key in your account, or if your customers provide their own keys, you can grant access to keys that are outside of your account.

<Tabs>
  <Tab title="Grant access to key in your account">
    1. Open the [Amazon Identity and Access Management (IAM) console](https://console.aws.amazon.com/iam/).

    2. In the navigation pane, click **Roles**.

    3. Click **Create role**.

    4. In the **Trusted entity type** section, select **Custom trust policy**.

    5. In the **Custom trust policy** section, enter one of the following JSON snippets.

       Pick a snippet based on whether you want to allow Pinecone to assume a role from all regions or from explicit regions. Add an optional external ID for additional security. If you use an external ID, you must provide it to Pinecone when [adding a CMEK key](#add-a-key).

       <AccordionGroup>
         <Accordion title="Explicit regions + external ID">
           ```json JSON
           {
               "Version": "2012-10-17",
               "Statement": [
                   {
                       "Sid": "AllowPineconeToAssumeIntoRoleFromExplicitRegionswithID",
                       "Effect": "Allow",
                       "Principal": {
                           "AWS": [
                               // Explicit role per Pinecone region. Replace XXXXXXXXXXXX with Pinecone's AWS account number.
                               "arn:aws:iam::XXXXXXXXXXXX:role/pinecone_cmek_access_us-east-1",
                               "arn:aws:iam::XXXXXXXXXXXX:role/pinecone_cmek_access_us-west-2",
                               "arn:aws:iam::XXXXXXXXXXXX:role/pinecone_cmek_access_eu-west-1"
                           ]
                       },
                       "Action": "sts:AssumeRole",
                       "Condition": {
                           "StringEquals": {
                               // Optional. Replace with a UUID v4 for additional security. If you use an external ID, you must provide it to Pinecone when adding an API key.
                               "sts:ExternalId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                           }
                       }
                   }
               ]
           }
           ```
         </Accordion>

         <Accordion title="Explicit regions + no external ID">
           ```json JSON
           {
               "Version": "2012-10-17",
               "Statement": [
                   {
                       "Sid": "AllowPineconeToAssumeIntoRoleFromExplicitRegions",
                       "Effect": "Allow",
                       "Principal": {
                           "AWS": [
                               // Explicit role per Pinecone region. Replace XXXXXXXXXXXX with Pinecone's AWS account number.
                               "arn:aws:iam::XXXXXXXXXXXX:role/pinecone_cmek_access_us-east-1",
                               "arn:aws:iam::XXXXXXXXXXXX:role/pinecone_cmek_access_us-west-2",
                               "arn:aws:iam::XXXXXXXXXXXX:role/pinecone_cmek_access_eu-west-1"
                           ]
                       },
                       "Action": "sts:AssumeRole"
                   }
               ]
           }
           ```
         </Accordion>

         <Accordion title="All regions + external ID">
           ```json JSON
           {
               "Version": "2012-10-17",
               "Statement": [
                   {
                       "Sid": "AllowPineconeToAssumeIntoRoleFromAllRegions",
                       "Effect": "Allow",
                       "Principal": {
                           "AWS": "*"
                       },
                       "Action": "sts:AssumeRole",
                       "Condition": {
                           "StringEquals": {
                               // Optional. Replace with a UUID v4 for additional security. If you use an external ID, you must provide it to Pinecone when adding an API key.
                               "sts:ExternalId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                           },
                           "StringLike": {
                               // Replace XXXXXXXXXXXX with Pinecone's AWS account number.
                               "aws:PrincipalArn": "arn:aws:iam::XXXXXXXXXXXX:role/pinecone_cmek_access_*"
                           }
                       }
                   }
               ]
           }
           ```
         </Accordion>
       </AccordionGroup>

       <Note>
         Replace `XXXXXXXXXXXX` with Pinecone's AWS account number, which can be found by going to [**Manage > CMEK**](https://app.pinecone.io/organizations/-/projects/-/cmek-encryption) in the Pinecone console and clicking **Add CMEK**.
       </Note>

    6. Click **Next**.

    7. Keep the default permissions as is and click **Next**.

    8. Enter a **Role name** and click **Create role**.

    9. Copy the **Role ARN** (e.g., `arn:aws:iam::XXXXXX:role/YYYYYY`). This will be used to [create a CMEK-enabled project](#3-create-a-cmek-enabled-project).
  </Tab>

  <Tab title="Grant access to keys outside your account">
    1. Open the [Amazon Identity and Access Management (IAM) console](https://console.aws.amazon.com/iam/).

    2. In the navigation pane, click **Roles**.

    3. Click **Create role**.

    4. In the **Trusted entity type** section, select **Custom trust policy**.

    5. In the **Custom trust policy** section, enter the following JSON:

       ```json JSON
       {
           "Version": "2012-10-17",
           "Statement": [
               {
                   "Sid": "VisualEditor0",
                   "Effect": "Allow",
                   "Action": [
                       "kms:Decrypt",
                       "kms:Encrypt"
                   ],
                   "Resource": "arn:aws:kms:*:XXXXXX:key/*"
               }
           ]
       }
       ```

       * Replace `XXXXXX` with the account ID of the customer who owns the key.
       * Add a `Statement` array for each customer account ID.

    6. Click **Next**.

    7. Keep the default permissions as is and click **Next**.

    8. Enter a **Role name** and click **Create role**.

    9. Copy the **Role ARN** (e.g., `arn:aws:iam::XXXXXX:role/YYYYYY`). This will be used to [create a CMEK-enabled project](#3-create-a-cmek-enabled-project).
  </Tab>
</Tabs>

### 2. Create an AWS KMS key

In the [AWS console](https://console.aws.amazon.com/console/home), create the KMS key that Pinecone will use to encrypt your data:

1. Open the [Amazon Key Management Service (KMS) console](https://console.aws.amazon.com/kms/home).

2. In the navigation pane, click **Customer managed keys**.

3. Click **Create key**.

4. In the **Key type** section, select **Symmetric**.

5. In the **Key usage** section, select **Encrypt and decrypt**.

6. Under **Advanced options > Key material origin**, select **KMS**.

7. In the **Regionality** section, select **Single-Region key**.

   <Note>
     You can create a multi-regional key to safeguard against data loss in case of regional failure. However, Pinecone only accepts one Key ARN per project. If you set a multi-regional key and need to change the Key ARN to switch region, please [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket) for help.
   </Note>

8. Click **Next**.

9. Enter an **Alias** and click **Next**.

10. Keep the default administrators as is and click **Next**.

11. Select the [role you created](#1-create-a-role) from the **Key users** list and click **Next**.

12. Click **Finish**.

13. Copy the **Key ARN** (e.g., `arn:aws:kms:us-east-1:XXXXXXX:key/YYYYYYY`). This will be used to [create a CMEK-enabled project](#create-a-cmek-enabled-project).

### 3. Create a CMEK-enabled project

Once your [role and key is configured](#set-up-cmek-using-aws-kms), you can create a CMEK-enabled project using the Pinecone console:

1. Go to [**Settings > Organization settings > Projects**](https://app.pinecone.io/organizations/-/settings/projects).

2. Click **+Create project**.

3. Enter a **Name**.

4. Select **Encrypt with Customer Managed Encryption Key**.

5. Click **Create project**.

6. Copy and save the generated API key in a secure place for future use.

   <Warning>
     You will not be able to see the API key again after you close the dialog.
   </Warning>

7. Click **Close**.

## Add a key

To start encrypting your data with a customer-managed key, you need to add the key to the [CMEK-enabled project](#3-create-a-cmek-enabled-project) using the Pinecone console:

1. Go to [**Manage > CMEK**](https://app.pinecone.io/organizations/-/projects/-/cmek-encryption) for the CMEK-enabled project.

2. Click **Add CMEK**.

   <Warning>
     You can only add one key per project, and you cannot change the key in Pinecone once it is set.
   </Warning>

3. Enter a **Key name**.

4. Enter the **Role ARN** for the [role you created](#1-create-a-role).

5. Enter a **Key ARN** for the [key you created](#2-create-a-aws-kms-key).

6. If you [created a role](#1-create-a-role) with an external ID, enter the **External ID**. If not, leave this field blank.

7. Click **Create key**.

## Delete a key

Before a key can be deleted from a project, all indexes in the project must be deleted. Then, you can delete the key using the Pinecone console:

1. Go to the [Manage > CMEK tab](https://app.pinecone.io/organizations/-/projects/-/cmek-encryption) for the project in which the key was created.
2. For the key you want to delete, click the **ellipsis (..) menu > Delete**.
3. Enter the key name to confirm deletion.
4. Click **Delete key**.

## Limitations

* CMEK can be enabled for serverless indexes in AWS regions only.
* [Backups](/guides/manage-data/back-up-an-index) are unavailable for indexes created in a CMEK-enabled project.
* You cannot change a key once it is set.
* You can add only one key per project.
