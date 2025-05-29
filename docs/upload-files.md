# Upload files

This page shows you how to upload a local file to an [assistant](/guides/assistant/overview).

<Note>
  File upload limitations depend on the plan you are using. For more information, see [Pricing and limitations](/guides/assistant/pricing-and-limits#limits).
</Note>

## Upload a local file

You can [upload a file to your assistant](/reference/api/2025-01/assistant/upload_file) from your local device, as in the following example:

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

  # Upload a file.
  response = assistant.upload_file(
      file_path="/Users/jdoe/Downloads/example_file.txt",
      timeout=None
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistantName = 'example-assistant';
  const assistant = pc.Assistant(assistantName);
  await assistant.uploadFile({
    path: '/Users/jdoe/Downloads/example_file.txt'
  });
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"
  LOCAL_FILE_PATH="/Users/jdoe/Downloads/example_file.txt"

  curl -X POST "https://prod-1-data.ke.pinecone.io/assistant/files/$ASSISTANT_NAME" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -F "file=@$LOCAL_FILE_PATH"
  ```
</CodeGroup>

It may take several minutes for your assistant to process your file. You can [check the status of your file](/guides/assistant/manage-files#get-the-status-of-a-file) to determine if it is ready to use.

<Tip>
  You can upload a file to an assistant using the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant). Select the assistant you want to upload to and add the file in the Assistant playground.
</Tip>

## Upload a file with metadata

You can upload a file with metadata. Metadata is a dictionary of key-value pairs that you can use to store additional information about the file. For example, you can use metadata to store the file's name, document type, publish date, or any other relevant information.

<CodeGroup>
  ```Python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  # Get the assistant.
  assistant = pc.assistant.Assistant(
      assistant_name="example-assistant", 
  )

  # Upload a file.
  response = assistant.upload_file(
      file_path="/Users/jdoe/Downloads/example_file.txt",
      metadata={"published": "2024-01-01", "document_type": "manuscript"},
      timeout=None
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistantName = 'example-assistant';
  const assistant = pc.Assistant(assistantName);
  await assistant.uploadFile({
    path: '/Users/jdoe/Downloads/example_file.txt',
    metadata: { 'published': '2024-01-01', 'document_type': 'manuscript' },
  });
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"
  ENCODED_METADATA="%7B%22published%22%3A%222024-01-01%22%2C%22document_type%22%3A%22script%22%7D" # URL encoded metadata - See w3schools.com/tags/ref_urlencode.ASP
  LOCAL_FILE_PATH="/Users/jdoe/Downloads/example_file.txt"

  curl -X POST "https://prod-1-data.ke.pinecone.io/assistant/files/$ASSISTANT_NAME?metadata=$ENCODED_METADATA" \
      -H "Api-Key: $PINECONE_API_KEY" \
      -F "file=@$LOCAL_FILE_PATH"
  ```
</CodeGroup>

When a file is uploaded with metadata, you can use the metadata to [filter a list of files](/guides/assistant/manage-files#view-a-filtered-list-of-files) and [filter chat responses](/guides/assistant/chat-with-assistant#filter-chat-with-metadata).

## Upload from a binary stream

You can upload a file directly from an in-memory binary stream using the Python SDK and the [BytesIO class](https://docs.python.org/3/library/io.html#io.BytesIO).

<Note>
  When uploading text-based files (like .txt, .md, .json, etc.) through BytesIO streams, make sure the content is encoded in UTF-8 format.
</Note>

```python Python
from pinecone import Pinecone
from io import BytesIO

pc = Pinecone(api_key="YOUR_API_KEY")

# Get an assistant
assistant = pc.assistant.Assistant(
    assistant_name="example-assistant", 
)

# Create a BytesIO stream with some content
md_text = "# Title\n\ntext"
# Note: Assistant currently supports only utf-8 for text-based files
stream = BytesIO(md_text.encode("utf-8"))

# Upload the stream
response = assistant.upload_bytes_stream(
    stream=stream,
    filename="example_file.md",
    timeout=None
)
```
