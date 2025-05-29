# Connect your users to Pinecone

To reduce friction for users using your integration, you can create a [custom object](#custom-object), like a button or link, to trigger a **Connect to Pinecone** popup from your app, website, or [Colab](https://colab.google/) notebook. Within this popup, your users can sign up for or log in to Pinecone, select or create an organization and project to connect to, and generate an API key. The API key is then communicated back to the user to copy or directly sent to the hosting page, app, or notebook.

Alternatively, you can embed our [pre-built widget](#pre-built-widget), which provides the same functionality, but with the ease of a drop-in component.

To start, [create an integration ID](#create-an-integration-id) for your app.

<Note>
  Only [organization owners](/guides/organizations/manage-organization-members) can add or manage integrations.
</Note>

## Create an integration ID

Create a unique `integrationId` to enable usage of the **Connect to Pinecone** [popup](#custom-object) and [widget](#pre-built-widget):

1. On the the [**Integrations**](https://app.pinecone.io/organizations/-/settings/integrations) tab in the Pinecone console, click the **Create Integration** button.

   <Note>The **Integrations** tab does not display unless your organization already has integrations. [Follow this link to create your first integration](https://app.pinecone.io/organizations/-/settings/integrations?create=true).</Note>

2. Fill out the **Create integration** form:
   * **Integration name**: Give your integration a name.

   * **URL Slug**: This is your `integrationID`. Enter a human-readable string that uniquely identifies your integration and that may appear in URLs. Your integration URL slug is public and cannot be changed.

   * **Logo**: Upload a logo for your integration.

   * **Return mechanism**: Select one of the following return methods for the generated API key:
     * **Web Message**: Your application will receive the Pinecone API key via a web message. Select this option if you are using the [@pinecone-database/connect library](/integrations/build-integration/connect-your-users-to-pinecone#javascript). The API key will only be provided to the allowed origin(s) specified below.
     * **Copy/Paste**: The API key will display in the success message, and users will need to copy and paste their Pinecone API keys into your application.

   * **Allowed origin**: If you selected **Web Message** as your **Return mechanism**, list the URL origin(s) where your integration is hosted. The [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) is the part of the URL that specifies the protocol, hostname, and port.

3. Click **Create**.

<Note>
  Anyone can create an integration, but [becoming an official Pinecone partner](/integrations/build-integration/become-a-partner) can help accelerate your go-to-market and add value to your customers.
</Note>

## Custom object

[Once you have created your `integrationId`](#create-an-integration-id), you can create a custom object, like a button or link, that loads a **Connect to Pinecone** popup that displays as follows:

![Connect popup](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/connect-popup.png)

The `ConnectPopup` function can be called with either the JavaScript library or script. The JavaScript library is the most commonly used method, but the script can be used in instances where you cannot build and use a custom library, like within the constraints of a content management system (CMS).

The function includes the following **required** configuration option:

* `integrationId`: The slug assigned to the integration. If `integrationId` is not passed, the widget will not render.

  <Note>To create a unique `integrationId`, fill out the [Create Integration form](#create-an-integration-id).</Note>

The function returns an object containing the following:

* `open`: A function that opens the popup. Suitable for use as an on-click handler.

Example usage of the library and script:

<CodeGroup>
  ```javascript JavaScriptlibrary
  import { ConnectPopup } from '@pinecone-database/connect'

  /*  Define a function called connectWithAPIKey */
  const connectWithAPIKey = () => {
    return new Promise((resolve, reject) => {
      /* Call ConnectPopup function with an object containing options */
      const popup = ConnectPopup({
        onConnect: (key) => {
          resolve(key);
        },
        integrationId: 'myApp'
      }).open();
    });
  };

  /* Handle button click event */
  document.getElementById('connectButton').addEventListener('click', () => {
    connectWithAPIKey()
      .then(apiKey => {
        console.log("API Key:", apiKey);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
  ```

  ```html JavaScript script
  <head>
  ...
  <script src="https://connect.pinecone.io/embed.js"></script>
  <script>
    const pineconePopup = ConnectPopup({
      onConnect: (key) => console.log(key),
      onCancel: () => console.log("Cancelled"),
      integrationId: 'myApp'
    });
  </script>
  ...
  </head>
  <body>
  ...
  <button onclick="pineconePopup.open()">Connect to Pinecone!</button>
  ...
  </body>
  ```
</CodeGroup>

Once you have created your integration, be sure to [attribute usage to your integration](/integrations/build-integration/attribute-usage-to-your-integration).

## Pre-built widget

The pre-built **Connect** widget displays as follows:

![Connect widget](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/connect-widget.png)

[Once you have created your `integrationId`](#create-an-integration-id), you can embed the **Connect** widget multiple ways:

* [JavaScript](#javascript) library (`@pinecone-database/connect`) or script: Renders the widget in apps and websites.
* [Colab](#colab) (`pinecone-notebooks`): Renders the widget in Colab notebooks using Python.

Once you have created your integration, be sure to [attribute usage to your integration](/integrations/build-integration/attribute-usage-to-your-integration).

### JavaScript

To embed the **Connect to Pinecone** widget in your app or website using the [`@pinecone-database/connect` library](https://www.npmjs.com/package/@pinecone-database/connect), install the necessary dependencies:

```shell Shell
# Install dependencies
npm i -S @pinecone-database/connect
```

You can use the JavaScript library to render the **Connect to Pinecone** widget and obtain the API key with the [`connectToPinecone` function](#connecttopinecone-function). It displays the widget and calls the provided callback function with the Pinecone API key, once the user completes the flow.

The function includes the following **required** configuration options:

* `integrationId`: The slug assigned to the integration. If `integrationId` is not passed, the widget will not render.

  <Note>To create a unique `integrationId`, [fill out the Create Integration form](#create-an-integration-id) with Pinecone.</Note>

* `container`: The HTML element where the **Connect** widget will render.

Example usage:

```JavaScript JavaScript
import {connectToPinecone} from '@pinecone-database/connect'

const setupPinecone = (apiKey) => { /* Set up a Pinecone client using the API key */ }

connectToPinecone(
  setupPinecone,
  {
    integrationId: 'myApp',
    container: document.getElementById('connect-widget')
  }
)
```

If you cannot use the JavaScript library, you can directly call the script. For example:

```html HTML
<head>
  ...
  <script src="https://connect.pinecone.io/embed.js">
  ...
</head>
<body>

<div id="widgetContainer"></div>
...

<script>
  connectToPinecone(
    (apiKey) => {/* Use the apiKey to create an index*/},
    {
      integrationId: 'myApp',
      container: document.getElementById('widgetContainer'),
    }
  );
</script>

...
</body>
```

### Colab

To embed the **Connect** widget in your Colab notebook, use the [`pinecone-notebooks` Python library](https://pypi.org/project/pinecone-notebooks/#description):

```shell
# Install dependencies using Colab syntax

pip install -qU pinecone-notebooks pinecone[grpc]
```

```python
# Render the Connect widget for the user to authenticate and generate an API key

from pinecone_notebooks.colab import Authenticate

Authenticate()

# The generated API key is available in the PINECONE_API_KEY environment variable

from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
import os

api_key = os.environ.get('PINECONE_API_KEY')

# Use the API key to initialize the Pinecone client
pc = Pinecone(api_key=api_key)
```

<Tip>
  To see this flow in practice, see our [example notebook](https://colab.research.google.com/drive/1VZ-REFRbleJG4tfJ3waFIrSveqrYQnNx?usp=sharing).
</Tip>

## Manage generated API keys

Your users can [manage the API keys](/guides/projects/manage-api-keys) generated by your integration in the Pinecone console.
