# Authentication

All requests to the [Pinecone Assistant API](/reference/api/assistant/introduction) must contain a valid [API key](/guides/production/security-overview#api-keys) for the target project.

## Get an API key

[Create a new API key](https://app.pinecone.io/organizations/-/projects/-/keys) in the Pinecone console, or use the connect widget below to generate a key.

<div style={{minWidth: '450px', minHeight:'152px'}}>
  <div id="pinecone-connect-widget">
    <div class="connect-widget-skeleton">
      <div class="skeleton-content" />
    </div>
  </div>
</div>

Copy your generated key:

```
PINECONE_API_KEY="{{YOUR_API_KEY}}"

# This API key has ReadWrite access to all indexes in your project.
```

## Initialize a client

When using a Pinecone SDK, initialize a client object with your API key and then reuse the authenicated client in subsquent function calls. For example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  # Creates an assistant using the API key stored in the client 'pc'.
  assistant = pc.assistant.create_assistant(
      assistant_name="example-assistant",
      instructions="Use American English for spelling and grammar.",
      region="us" 
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  // Creates an index using the API key stored in the client 'pc'.
  const assistant = await pc.createAssistant({
    name: 'example-assistant',
    instructions: 'Use American English for spelling and grammar.',
    region: 'us'
  });
  ```
</CodeGroup>

## Add headers to an HTTP request

All HTTP requests to the Pinecone Assistant API must contain an `Api-Key` header that specifies a valid [API key](/guides/production/security-overview#api-keys) and must be encoded as JSON with the `Content-Type: application/json` header. For example:

```bash curl
PINECONE_API_KEY="YOUR_API_KEY"

curl "https://api.pinecone.io/assistant/assistants" \
  -H "Api-Key: $PINECONE_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Pinecone-API-Version: 2025-01" \
  -d '{
  "name": "example-assistant",
  "instructions": "Use American English for spelling and grammar.",
  "region":"us"
}'
```
