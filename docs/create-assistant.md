# Create an assistant

This page shows you how to create an [assistant](/guides/assistant/overview).

You can [create an assistant](/reference/api/2025-01/assistant/create_assistant), as in the following example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")

  assistant = pc.assistant.create_assistant(
      assistant_name="example-assistant", 
      instructions="Use American English for spelling and grammar.", # Description or directive for the assistant to apply to all responses.
      region="us", # Region to deploy assistant. Options: "us" (default) or "eu".
      timeout=30 # Maximum seconds to wait for assistant status to become "Ready" before timing out.
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistant = await pc.createAssistant({
    name: 'example-assistant',
    instructions: 'Use American English for spelling and grammar.',
    region: 'us'
  });
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl "https://api.pinecone.io/assistant/assistants" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
    "name": "example-assistant",
    "instructions": "Use American English for spelling and grammar.",
    "region":"us"
  }'
  ```
</CodeGroup>

<Tip>
  You can create an assistant using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant/-/files).
</Tip>
