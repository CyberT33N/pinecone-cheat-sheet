# Chat through the OpenAI-compatible interface

After [uploading files](/guides/assistant/manage-files) to an assistant, you can chat with the assistant.

This page shows you how to chat with an assistant using the [OpenAI-compatible chat interface](/reference/api/2025-01/assistant/chat_completion_assistant). This interface is based on the OpenAI Chat Completion API, a commonly used and adopted API. It is useful if you need inline citations or OpenAI-compatible responses, but has limited functionality compared to the [standard chat interface](/guides/assistant/chat-with-assistant).

<Tip>
  The [standard chat interface](/guides/assistant/chat-with-assistant) is the recommended way to chat with an assistant, as it offers more functionality and control over the assistant's responses and references.
</Tip>

## Chat with an assistant

The [OpenAI-compatible chat interface](/reference/api/2025-01/assistant/chat_completion_assistant) can return responses in two different formats:

* [Default response](#default-response): The assistant returns a response in a single string field, which includes citation information.
* [Streaming response](#streaming-response): The assistant returns the response as a text stream.

### Default response

The following example sends a message and requests a response in the default format:

<Note>
  The `content` parameter in the request cannot be empty.
</Note>

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  from pinecone_plugins.assistant.models.chat import Message

  pc = Pinecone(api_key="YOUR_API_KEY")

  # Get your assistant.
  assistant = pc.assistant.Assistant(
      assistant_name="example-assistant", 
  )

  # Chat with the assistant.
  chat_context = [Message(role="user", content='What is the maximum height of a red pine?')]
  response = assistant.chat_completions(messages=chat_context)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });
  const assistantName = 'example-assistant';

  const assistant = pc.Assistant(assistantName);
  const chatResp = await assistant.chatCompletion({
        messages: [{ role: 'user', content: 'Who is the CFO of Netflix?' }]
      });
  console.log(chatResp);
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"

  curl "https://prod-1-data.ke.pinecone.io/assistant/chat/$ASSISTANT_NAME/chat/completions" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "Content-Type: application/json" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
    "messages": [
      {
        "role": "user",
        "content": "What is the maximum height of a red pine?"
      }
    ]
  }'
  ```
</CodeGroup>

The example above returns a result like the following:

```JSON
{"chat_completion":
  {
    "id":"chatcmpl-9OtJCcR0SJQdgbCDc9JfRZy8g7VJR",
    "choices":[
      {
        "finish_reason":"stop",
        "index":0,
        "message":{
          "role":"assistant",
          "content":"The maximum height of a red pine (Pinus resinosa) is up to 25 meters."
        }
      }
    ],
    "model":"my_assistant"
  }
}
```

### Streaming response

The following example sends a messages and requests a streaming response:

<Note>
  The `content` parameter in the request cannot be empty.
</Note>

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant

  from pinecone import Pinecone
  from pinecone_plugins.assistant.models.chat import Message

  pc = Pinecone(api_key="YOUR_API_KEY")

  # Get your assistant.
  assistant = pc.assistant.Assistant(
      assistant_name="example-assistant" 
  )

  # Streaming chat with the Assistant.
  chat_context = [Message(role="user", content="What is the maximum height of a red pine?")]
  response = assistant.chat_completions(messages=[chat_context], stream=True, model="gpt-4o")

  for data in response:
      if data:
          print(data)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });
  const assistantName = 'example-assistant';
  const assistant = pc.Assistant(assistantName);
  const chatResp = await assistant.chatCompletionStream({
      messages: [{ role: 'user', content: 'Who is the CFO of Netflix?' }]
  });

  for await (const response of chatResp) {
      if (response) {
          console.log(response);
      }
  }
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"
  ASSISTANT_NAME="example-assistant"

  curl "https://prod-1-data.ke.pinecone.io/assistant/chat/$ASSISTANT_NAME/chat/completions" \
    -H "Api-Key: $PINECONE_API_KEY "\
    -H "Content-Type: application/json" \
    -H "X-Pinecone-API-Version: 2025-04" \
    -d '{
    "messages": [
      {
        "role": "user",
        "content": "What is the maximum height of a red pine?"
      }
    ],
    "stream": true
  }'
  ```
</CodeGroup>

The example above returns a result like the following:

```shell
{
  'id': '000000000000000009de65aa87adbcf0', 
  'choices': [
      {
      'index': 0, 
      'delta': 
        {
        'role': 'assistant', 
        'content': 'The'
        }, 
      'finish_reason': None
      }
    ], 
  'model': 'gpt-4o-2024-05-13'
}

...

{
  'id': '00000000000000007a927260910f5839',
  'choices': [
      {
      'index': 0,
      'delta':
        {
          'role': '', 
          'content': 'The'
        }, 
      'finish_reason': None
      }
    ], 
  'model': 'gpt-4o-2024-05-13'
}

...

{
  'id': '00000000000000007a927260910f5839', 
  'choices': [
    {
      'index': 0, 
      'delta': 
        {
        'role': None, 
        'content': None
        }, 
      'finish_reason': 'stop'
      }
    ], 
  'model': 'gpt-4o-2024-05-13'
}
```

There are three types of messages in a chat completion response:

* **Message start**: Includes `"role":"assistant"`, which indicates that the assistant is responding to the user's message.
* **Content**: Includes a value in the `content` field (e.g., `"content":"The"`), which is part of the assistant's streamed response to the user's message.
* **Message end**: Includes `"finish_reason":"stop"`, which indicates that the assistant has finished responding to the user's message.

## Extract the response content

The assistant's response is returned in a JSON response object along with other information. The message string is contained in the following JSON object:

* `choices.[0].message.content` for the default chat response
* `choices[0].delta.content` for the streaming chat response

You can extract the message content and print it to the console:

<Tabs>
  <Tab title="Default response">
    <CodeGroup>
      ```python Python
      import sys

      # Print the assistant's response to the console.
      print(str(response.choices[0].message.content))
      ```

      ```bash curl
      | jq '.choices.[0].message.content'
      ```
    </CodeGroup>

    This creates output like the following:

    ```bash
    A red pine, scientifically known as *Pinus resinosa*, is a medium-sized tree that can grow up to 25 meters high and 75 centimeters in diameter. [1, pp. 1]
    ```
  </Tab>

  <Tab title="Streaming response">
    <CodeGroup>
      ```python Python
      import sys

      # Store streaming response.
      response = assistant.chat_completions(messages=chat_context, stream=True)

      for data in response:
          if data:
              print(str(data.choices[0].delta.content))
      ```

      ```bash curl
      |  sed -u 's/.*"content":"\([^"]*\)".*/\1/'
      ```
    </CodeGroup>

    This creates output like the following:

    ```bash Streaming response
    The
     maximum
     height
     of
     a
     red
     pine
     (
    Pin
    us
     resin
    osa
    )
     is
     up
     to
     twenty
    -five
     meters

     [1, pp. 1]
    .
    ```
  </Tab>
</Tabs>
