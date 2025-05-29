# Manage assistants

This page shows you how to view a list of assistants, check the status of an assistant, update an assistant, and delete an assistant.

## List assistants for a project

You can [get the name, status, and metadata for each assistant](/reference/api/2025-01/assistant/list_assistants) in your project as in the following example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  assistants = pc.assistant.list_assistants()
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistants = await pc.listAssistants();
  console.log(assistants);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -X GET "https://api.pinecone.io/assistant/assistants" \
    -H "Api-Key: $PINECONE_API_KEY"
  ```
</CodeGroup>

This operation returns a response like the following:

```JSON
{
  "assistants": [
    {
      "name": "example-assistant",
      "instructions": "Use American English for spelling and grammar.",
      "metadata": {},
      "status": "Initializing",
      "created_on": "2023-11-07T05:31:56Z",
      "updated_on": "2023-11-07T05:31:56Z"
    }
  ]
}
```

You can use the `name` value to [check the status of an assistant](/guides/assistant/manage-assistants#get-the-status-of-an-assistant).

<Tip>
  You can list assistants using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant/-/files).
</Tip>

## Get the status of an assistant

You can [get the status and metadata for your assistant](/reference/api/2025-01/assistant/describe_assistant) as in the following example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  assistant = pc.assistant.describe_assistant(
      assistant_name="example-assistant", 
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistant = await pc.describeAssistant('example-assistant');
  console.log(assistant);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"

  curl -X GET "https://api.pinecone.io/assistant/assistants/$ASSISTANT_NAME" \
    -H "Api-Key: $PINECONE_API_KEY"
  ```
</CodeGroup>

This operation returns a response like the following:

```JSON
{
  "name": "example-assistant",
  "instructions": "Use American English for spelling and grammar.",
  "metadata": {},
  "status": "Initializing",
  "created_on": "2023-11-07T05:31:56Z",
  "updated_on": "2023-11-07T05:31:56Z"
}
```

The `status` field has the following possible values:

* Initializing
* Failed
* Ready
* Terminating

<Tip>
  You can check the status of an assistant using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant).
</Tip>

## Change the assistant's chat model

The chat model is the underlying large language model (LLM) that powers the assistant's responses. You can change the chat model for an existing assistant through the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant):

1. On the **Assistants** page, select the assistant you want to update.
2. In the sidebar on the right, select **Settings** (gear icon).
3. Select the **Chat model**.

## Add instructions to an assistant

You can [add or update the instructions](/reference/api/2025-01/assistant/update_assistant) for an existing assistant. Instructions are a short description or directive for the assistant to apply to all of its responses. For example, you can update the instructions to reflect the assistant's role or purpose.

For example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone

  pc = Pinecone(api_key=YOUR_API_KEY)

  assistant = pc.assistant.update_assistant(
      assistant_name="example-assistant", 
      instructions="Use American English for spelling and grammar.",
      region="us" # Region to deploy assistant. Options: "us" (default) or "eu".
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.updateAssistant('example-assistant', {
    instructions: 'Use American English for spelling and grammar.',
  });
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl -X PATCH "https://api.pinecone.io/assistant/assistants/example-assistant" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
    "instructions": "Use American English for spelling and grammar.",
    "metadata": {"updated": "2024-09-30"},
    "region": "us"
  }'
  ```
</CodeGroup>

The example above returns a result like the following:

```JSON
{
    "name":"example-assistant",
    "instructions":"Use American English for spelling and grammar.",
    "metadata":{"updated":"2024-09-30"},
    "status":"Ready",
    "created_at":"2024-06-14T14:58:06.573004549Z",
    "updated_at":"2024-10-01T19:44:32.813235817Z"
}
```

<Tip>
  You can add or update instructions for an assistant using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant).
</Tip>

## Delete an assistant

You can [delete an assistant](/reference/api/2025-01/assistant/delete_assistant) as in the following example:

<Warning>
  Deleting an assistant also deletes all files uploaded to the assistant.
</Warning>

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.assistant.delete_assistant(
      assistant_name="example-assistant", 
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.deleteAssistant('example-assistant');
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"

  curl -X DELETE "https://api.pinecone.io/assistant/assistants/$ASSISTANT_NAME" \
    -H "Api-Key: $PINECONE_API_KEY"
  ```
</CodeGroup>

<Tip>
  You can delete an assistant using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant).
</Tip>
