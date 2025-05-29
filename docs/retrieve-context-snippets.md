# Retrieve context snippets

This page shows you how to [retrieve context snippets](/guides/assistant/context-snippets-overview).

<Tip>
  To try this in your browser, use the [Pinecone Assistant - Context colab notebook](https://colab.research.google.com/drive/1AD4QWsXBG1FQRwq-ModlaggR7Cx7NJCz).
</Tip>

## Retrieve context snippets from an assistant

You can [retrieve context snippets](/reference/api/2025-01/assistant/context_assistant) from an assistant, as in the following example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")
  assistant = pc.assistant.Assistant(assistant_name="example-assistant")

  response = assistant.context(query="Who is the CFO of Netflix?")

  for snippet in response.snippets:
      print(snippet)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistantName = 'example-assistant';
  const assistant = pc.Assistant(assistantName);
  const response = await assistant.context({
    query: 'Who is the CFO of Netflix?',
  });
  console.log(response);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"

  curl "https://prod-1-data.ke.pinecone.io/assistant/chat/$ASSISTANT_NAME/context" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "query": "Who is the CFO of Netflix?"
  }'
  ```
</CodeGroup>

The example above returns a JSON object like the following:

```json JSON
{
    "snippets":
    [
        {
            "type":"text",
            "content":"EXHIBIT 31.3\nCERTIFICATION OF CHIEF FINANCIAL OFFICER\nPURSUANT TO SECTION 302 OF THE SARBANES-OXLEY ACT OF 2002\nI, Spencer Neumann, certify that: ..."
            "score":0.9960699,
            "reference":
            {
                "type":"pdf",
                "file":
                {
                    "status":"Available",
                    "id":"e6034e51-0bb9-4926-84c6-70597dbd07a7",
                    "name":"Netflix-10-K-01262024.pdf",
                    "size":1073470,
                    "metadata":null,
                    "updated_on":"2024-11-21T22:59:10.426001030Z",
                    "created_on":"2024-11-21T22:58:35.879120257Z", 
                    "percent_done":1.0,
                    "signed_url":"https://storage.googleapis.com...",
                    "error_message":null
                    },
                "pages":[78]
            }
        },
{
    "type":"text",
    "content":"EXHIBIT 32.1\n..."
...
```

## Control the snippets retrieved

<Note>
  This is available in API versions `2025-04` and later.
</Note>

You can limit [token usage](/guides/assistant/pricing-and-limits#token-usage) by tuning `top_k * snippet_size`:

* `snippet_size`: Controls the max size of a snippet (default is 2048 tokens). Note that snippet size can vary and, in rare cases, may be bigger than the set `snippet_size`. Snippet size controls the amount of context given for each chunk of text.
* `top_k`: Controls the max number of context snippets retrieved (default is 16). `top_k` controls the diversity of information received in the returned snippets.

While additional tokens will be used for other parameters, adjusting the `top_k` and `snippet_size` can help manage token consumption.

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone

  pc = Pinecone(api_key="YOUR_API_KEY")
  assistant = pc.assistant.Assistant(assistant_name="example-assistant")

  response = assistant.context(query="Who is the CFO of Netflix?", top_k=10, snippet_size=2500)

  for snippet in response.snippets:
      print(snippet)
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"

  curl "https://prod-1-data.ke.pinecone.io/assistant/chat/$ASSISTANT_NAME/context" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
      "query": "Who is the CFO of Netflix?",
      "top_k": 10,
      "snippet_size": 2500
  }'
  ```
</CodeGroup>
