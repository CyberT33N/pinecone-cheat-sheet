# Configure SSO with Okta

This page shows you how to set up Pinecone with Okta as the single sign-on (SSO) provider. These instructions can be adapted for any provider with SAML 2.0 support.

<Note>SSO is available only on Enterprise plans.</Note>

## Before you begin

This page assumes you have the following:

* Access to your organization's [Pinecone console](https://login.pinecone.io) as an [organization owner](/guides/organizations/understanding-organizations#organization-owners).
* Access to your organization's [Okta Admin console](https://login.okta.com/).

## 1. Create an app integration in Okta

1. In the [Okta Admin console](https://login.okta.com/), navigate to **Applications > Applications**.

2. Click **Create App Integrations**.

3. Select **SAML 2.0**.

4. Click **Next**.

5. Enter the **General Settings**:

   * **App name**: `Pinecone`
   * **App logo** (optional)

6. Click **Next**.

7. Enter the **SAML Settings**. For now, use placeholder values:

   * **Single sign-on URL**: `https:changeme.com`
   * **Audience URI (SP Entity ID)**: `urn:auth0:production-v2-pinecone-io:changeme`
   * **Name ID format**: `Unspecified`
   * **Application username**: `Okta username`
   * **Update application username on**: `Create and update`

   The placeholder values will be updated once the SSO keys are created.

8. Click **Finish**.

## 2. Get the application sign on URL

1. In a separate window, navigate to **Applications > Pinecone > Sign On**.
2. Click **More details**.
3. Copy the **Sign on URL**.

   You will enter this URL in [Step 4](#4-enable-sso-in-pinecone).

## 3. Generate the SAML signing certificate

1. In **Applications > Pinecone > Sign On**, click **Generate new certificate**.
2. For the new certification, click the **ellipsis (...) menu > Download certificate**.

   You will need to enter this certificate value in [Step 4](#4-enable-sso-in-pinecone).

## 4. Enable SSO in Pinecone

1. In the Pinecone console, go to [**Settings > Manage**](https://app.pinecone.io/organizations/-/settings/manage).

2. In the **Single Sign-On** section, click **Enable SSO**.

3. In the **Login URL** field, enter the URL copied in [Step 2](#2-get-the-application-sign-on-url).

4. In the **Email domain** field, enter your company's email domain. To target multiple domains, enter each domain separated by a comma.

5. In the **Certificate** field, enter the certificate value downloaded in [Step 3](#3-generate-the-saml-signing-certificate).

   <Note>Be sure to enter all of the certificate value, including the `--BEGIN--` and `--END--` tags.</Note>

6. Click **Enable SSO**.

   **SSO Keys** displays. You will need to enter these values in [Step 5](#5-update-the-saml-settings-in-okta).

## 5. Update the SAML settings in Okta

1. Back in the [Okta Admin console](https://login.okta.com/), navigate to **Application Settings > Applications > General**.

2. In the **SAML Settings** section, click **Edit**.

3. Replace the placeholder values with the information from the **SSO Keys** section in [Step 4](#4-enable-sso-in-pinecone):

   * **Single sign-on URL**: Enter the **AssertionConsumerServiceLocation** value.
   * **Audience URI (SP Entity ID)**: Enter the **entityId** value.
   * **Name ID format**: `EmailAddress`

4. In the **Attribute Statements** section, enter the following:

   * **Name**: `email`
   * **Value**: `user.email`

5. Click **Next**.

6. Click **Finish**.

Okta is now ready to be used for single sign-on. Follow the Okta docs to learn how to [add users and groups](https://help.okta.com/en-us/content/topics/users-groups-profiles/usgp-main.htm).
