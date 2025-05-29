# Manage files

This page shows you how to view a list of files, check the status of a file, and delete a file from your [assistant](/guides/assistant/overview).

<Note>
  File upload limitations depend on the plan you are using. For more information, see [Pricing and limitations](/guides/assistant/pricing-and-limits#limits).
</Note>

## List files in an assistant

### View all files

You can [get the status, ID, and metadata for each file in your assistant](/reference/api/2025-01/assistant/list_files), as in the following example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  # Get your assistant.
  assistant = pc.assistant.Assistant(
      assistant_name="example-assistant", 
  )

  # List files in your assistant.
  files = assistant.list_files()
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistantName = 'example-assistant';
  const assistant = pc.Assistant(assistantName);
  const files = await assistant.listFiles();
  console.log(files);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"

  curl -X GET "https://prod-1-data.ke.pinecone.io/assistant/files/$ASSISTANT_NAME" \
    -H "Api-Key: $PINECONE_API_KEY"
  ```
</CodeGroup>

This operation returns a response like the following:

```JSON
{
  "files": [
    {
      "name": "example_file.txt",
      "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
      "metadata": {},
      "created_on": "2023-11-07T05:31:56Z",
      "updated_on": "2023-11-07T05:31:56Z",
      "status": "Processing"
    }
  ]
}
```

You can use the `id` value to [check the status of an individual file](#get-the-status-of-a-file).

<Tip>
  You can list file in an assistant using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant). Select the assistant and view the files in the Assistant playground.
</Tip>

### View a filtered list of files

Metadata filter expressions can be included when listing files. This will limit the list of files to only those matching the filter expression. Use the `filter` parameter to specify the metadata filter expression.

For more information about filtering with metadata, see [Understanding files](/guides/assistant/files-overview#metadata-query-language).

The following example lists files that are a manuscript:

<CodeGroup>
  ```Python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  # Get your assistant.
  assistant = pc.assistant.Assistant(
      assistant_name="example-assistant", 
  )

  # List files in your assistant that match the metadata filter.
  files = assistant.list_files(filter={"document_type":"manuscript"})
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistantName = 'example-assistant';
  const assistant = pc.Assistant(assistantName);
  const files = await assistant.listFiles({
    filter: { metadata: { document_type: 'manuscript' } },
  });
  console.log(files);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"

  curl -X GET "https://prod-1-data.ke.pinecone.io/assistant/files/$ASSISTANT_NAME" \
    -H "Api-Key: $PINECONE_API_KEY"
    -d '{
      "filter": {"document_type": "manuscript"}
    }'
  ```
</CodeGroup>

## Get the status of a file

You can [get the status and metadata for your assistant](/reference/api/2025-01/assistant/describe_file), as in the following example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  # Get an assistant.
  assistant = pc.assistant.Assistant(
      assistant_name="example-assistant", 
  )

  # Describe a file.
  file = assistant.describe_file(file_id="070513b3-022f-4966-b583-a9b12e0290ff")
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistantName = 'example-assistant';
  const assistant = pc.Assistant(assistantName);

  const file = await assistant.describeFile("070513b3-022f-4966-b583-a9b12e0290ff")
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"
  FILE_ID="070513b3-022f-4966-b583-a9b12e0290ff"

  curl -X GET "https://prod-1-data.ke.pinecone.io/assistant/files/$ASSISTANT_NAME/$FILE_ID" \
    -H "Api-Key: $PINECONE_API_KEY"
  ```
</CodeGroup>

This operation returns a response like the following:

```JSON
{
  "name": "<string>",
  "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "metadata": {},
  "created_on": "2023-11-07T05:31:56Z",
  "updated_on": "2023-11-07T05:31:56Z",
  "status": "Processing",
  "percent_done": 0.5,
  "signed_url": "https://storage.googleapis.com...",
  "error_message": null,
  "size": 1073470
}
```

<Tip>
  You can check the status a file using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant). In the Assistant playground, click the file for more details.
</Tip>

## Delete a file

You can [delete a file](/reference/api/2025-01/assistant/delete_file) from an assistant.

<Warning>Once a file is deleted, you cannot recover it.</Warning>

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  # Get your assistant.
  assistant = pc.assistant.Assistant(
      assistant_name="example-assistant", 
  )

  # Delete a file from your assistant.
  assistant.delete_file(file_id="070513b3-022f-4966-b583-a9b12e0290ff")
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistantName = 'example-assistant';
  const assistant = pc.Assistant(assistantName);

  const file = await assistant.deleteFile("070513b3-022f-4966-b583-a9b12e0290ff")
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"
  FILE_ID="070513b3-022f-4966-b583-a9b12e0290ff"

  curl -X DELETE "https://prod-1-data.ke.pinecone.io/assistant/files/$ASSISTANT_NAME/$FILE_ID" \
    -H "Api-Key: $PINECONE_API_KEY"
  ```
</CodeGroup>

<Tip>
  You can delete a file from an assistant using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant). In the Assistant playground, find the file and click the **ellipsis (..) menu > Delete**.
</Tip>
