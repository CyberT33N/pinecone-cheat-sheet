# Pinecone Assistant quickstart

This guide shows you how to set up and use [Pinecone Assistant](/guides/assistant/overview), a service that allows you to upload documents, ask questions, and receive responses that reference your documents.

<Tip>
  To get started in your browser, use the [Assistant Quickstart colab notebook](https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/assistant-quickstart.ipynb).
</Tip>

## 1. Install an SDK

The Pinecone [Python SDK](/reference/python-sdk) and [Node.js SDK](/reference/node-sdk) provide convenient programmatic access to the [Assistant API](/reference/api/2025-01/assistant/).

<CodeGroup>
  ```shell Python
  pip install pinecone
  pip install pinecone-plugin-assistant
  ```

  ```shell JavaScript
  npm install @pinecone-database/pinecone
  ```
</CodeGroup>

## 2. Get an API key

You need an API key to make calls to your assistant.

Create a new API key in the [Pinecone console](https://app.pinecone.io/organizations/-/keys), or use the widget below to generate a key. If you don't have a Pinecone account, the widget will sign you up for the free [Starter plan](https://www.pinecone.io/pricing/).

<div style={{minWidth: '450px', minHeight:'152px'}}>
  <div id="pinecone-connect-widget">
    <div class="connect-widget-skeleton">
      <div class="skeleton-content" />
    </div>
  </div>
</div>

Your generated API key:

```shell
"{{YOUR_API_KEY}}"
```

## 3. Create an assistant

[Create an assistant](/reference/api/2025-01/assistant/create_assistant), as in the following example:

<CodeGroup>
  ```python Python
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
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  const assistant = await pc.createAssistant({
    name: 'example-assistant',
    instructions: 'Use American English for spelling and grammar.', // Description or directive for the assistant to apply to all responses.
    region: 'us'
  });
  ```
</CodeGroup>

## 4. Upload a file to the assistant

With Pinecone Assistant, you can upload documents, ask questions, and receive responses that reference your documents. This is known as retrieval-augmented generation (RAG).

For this quickstart, [download a sample 10-k filing file](https://s22.q4cdn.com/959853165/files/doc_financials/2023/ar/Netflix-10-K-01262024.pdf) to your local device.

Next, [upload the file](/reference/api/2025-01/assistant/upload_file) to your assistant:

<CodeGroup>
  ```python Python
  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  # Get the assistant.
  assistant = pc.assistant.Assistant(
      assistant_name="example-assistant", 
  )

  # Upload a file.
  response = assistant.upload_file(
      file_path="/path/to/file/Netflix-10-K-01262024.pdf",
      metadata={"company": "netflix", "document_type": "form 10k"},
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
</CodeGroup>

## 5. Chat with the assistant

With the sample file uploaded, you can now [chat with the assistant](/reference/api/2025-01/assistant/chat_assistant). Ask the assistant questions about your document. It returns either a JSON object or a text stream.

The following example requests a default response to the message, "Who is the CFO of Netflix?":

<CodeGroup>
  ```python Python
  from pinecone import Pinecone
  from pinecone_plugins.assistant.models.chat import Message

  pc = Pinecone(api_key='YOUR_API_KEY')
  assistant = pc.assistant.Assistant(assistant_name="example-assistant")

  msg = Message(role="user", content="Who is the CFO of Netflix?")
  resp = assistant.chat(messages=[msg])

  print(resp)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });
  const assistantName = 'example-assistant';

  const assistant = pc.Assistant(assistantName);
  const chatResp = await assistant.chat({
    messages: [{ role: 'user', content: 'Who is the CFO of Netflix?' }],
  });
  console.log(chatResp);
  ```
</CodeGroup>

The example above returns a response like the following:

```
{
    'id': '0000000000000000163008a05b317b7b', 
    'model': 'gpt-4o-2024-05-13', 
    'usage': {
        'prompt_tokens': 9259, 
        'completion_tokens': 30, 
        'total_tokens': 9289
        }, 
        'message': {
            'content': 'The Chief Financial Officer (CFO) of Netflix is Spencer Neumann.', 
            'role': '"assistant"'
            }, 
            'finish_reason': 'stop', 
            'citations': [
                {
                    'position': 63, 
                    'references': [
                        {
                            'pages': [78, 72, 79], 
                            'file': {
                                'name': 'Netflix-10-K-01262024.pdf', 
                                'id': '76a11dd1...', 
                                'metadata': {
                                    'company': 'netflix', 
                                    'document_type': 'form 10k'
                                    }, 
                                    'created_on': '2024-12-06T01:29:07.369208590Z', 
                                    'updated_on': '2024-12-06T01:29:50.923493799Z', 
                                    'status': 'Available', 
                                    'percent_done': 1.0, 
                                    'signed_url': 'https://storage.googleapis.com/...', 
                                    "error_message": null, 
                                    'size': 1073470.0
                                }
                            }
                        ]
                    }
                ]
            }
```

## 6. Clean up

When you no longer need the `example-assistant`, [delete the assistant](/reference/api/2025-01/assistant/delete_assistant):

<Warning>
  Deleting an assistant also deletes all files uploaded to the assistant.
</Warning>

<CodeGroup>
  ```python Python
  from pinecone import Pinecone
  pc = Pinecone(api_key="YOUR_API_KEY")

  pc.assistant.delete_assistant(
      assistant_name="example-assistant", 
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone'

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

  await pc.deleteAssistant('example-assistant');
  ```
</CodeGroup>

## Next steps

* Learn more about [Pinecone Assistant](/guides/assistant/overview)
* Learn about [additional assistant features](https://www.pinecone.io/learn/assistant-api-deep-dive/)
* [Evaluate](/guides/assistant/evaluate-answers) the assistant's responses
* View a [sample app](/examples/sample-apps/pinecone-assistant) that uses Pinecone Assistant
