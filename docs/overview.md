# Pinecone Assistant

Pinecone Assistant is a service that allow you to build production-grade chat and agent-based applications quickly.

<CardGroup cols={2}>
  <Card title="Assistant quickstart" icon="comments" href="/guides/assistant/quickstart">
    Create an AI assistant that answers complex questions about your proprietary data
  </Card>

  <Card title="Database quickstart" icon="database" href="/guides/get-started/quickstart">
    Set up a fully managed vector database for high-performance semantic search
  </Card>
</CardGroup>

## Use cases

Pinecone Assistant is useful for a variety of tasks, especially for the following:

* Prototyping and deploying an AI assistant quickly.
* Providing context-aware answers about your proprietary data without training an LLM.
* Retrieving answers grounded in your data, with references.

## SDK support

You can use the [Assistant API](/reference/api/2025-01/assistant/) directly, through the [Pinecone Python SDK](/reference/python-sdk), or through the [Pinecone Node.js SDK](/reference/node-sdk).

## Workflow

You can use the Pinecone Assistant through the [Pinecone console](https://app.pinecone.io/organizations/-/projects/-/assistant) or [Pinecone API](/reference/api/2025-01/assistant/list_assistants).

<Tabs>
  <Tab title="Overview">
    The following steps outline the general Pinecone Assistant workflow:

    <Steps>
      <Step title="Create an assistant">
        [Create an assistant](/guides/assistant/create-assistant) to answer questions about your documents.
      </Step>

      <Step title="Upload documents">
        [Upload documents](/guides/assistant/manage-files) to your assistant. Your assistant manages chunking, embedding, and storage for you.
      </Step>

      <Step title="Chat with an assistant">
        [Chat with your assistant](/guides/assistant/chat-with-assistant) and receive responses as a JSON object or as a text stream. For each chat, your assistant queries a large language model (LLM) with context from your documents to ensure the LLM provides grounded responses.
      </Step>

      <Step title="Evaluate answers">
        [Evaluate the assistant's responses](/guides/assistant/evaluation-overview) for correctness and completeness.
      </Step>

      <Step title="Optimize performance">
        [Use custom instructions](https://www.pinecone.io/learn/assistant-api-deep-dive/#Custom-Instructions) to tailor your assistant's behavior and responses to specific use cases or requirements. [Filter by metadata associated with files](https://www.pinecone.io/learn/assistant-api-deep-dive/#Using-Metadata) to reduce latency and improve the accuracy of responses.
      </Step>

      <Step title="Retrieve context snippets">
        [Retrieve context snippets](/guides/assistant/retrieve-context-snippets) to understand what relevant data snippets Pinecone Assistant is using to generate responses. You can use the retrieved snippets with your own LLM, RAG application, or agentic workflow.
      </Step>
    </Steps>

    <Note>
      For information on how the Pinecone Assistant works, see [Assistant architecture](/reference/architecture/assistant-architecture).
    </Note>
  </Tab>

  <Tab title="Code sample">
    The following code samples outline the Pinecone Assistant workflow using either the [Pinecone Python SDK](/reference/python-sdk) and [Pinecone Assistant plugin](/reference/python-sdk#install-the-pinecone-assistant-python-plugin) or the [Pinecone Node.js SDK](/reference/node-sdk).

    <CodeGroup>
      ```python Python
      # pip install pinecone
      # pip install pinecone-plugin-assistant

      from pinecone import Pinecone
      import requests
      from pinecone_plugins.assistant.models.chat import Message

      pc = Pinecone(api_key="YOUR_API_KEY")

      # Create an assistant.
      assistant = pc.assistant.create_assistant(
          assistant_name="example-assistant", 
          instructions="Use American English for spelling and grammar.", # Description or directive for the assistant to apply to all responses.
          region="us", # Region to deploy assistant. Options: "us" (default) or "eu".    
          timeout=30 # Maximum seconds to wait for assistant status to become "Ready" before timing out.
      )

      # Upload a file to your assistant.
      response = assistant.upload_file(
          file_path="/Users/jdoe/Downloads/Netflix-10-K-01262024.pdf",
          metadata={"company": "netflix", "document_type": "form 10k"},
          timeout=None
      )

      # Set up for evaluation later.
      payload = {
          "question": "Who is the CFO of Netflix?", # Question to ask the assistant.
          "ground_truth_answer": "Spencer Neumann" # Expected answer to evaluate the assistant's response.
      }

      # Chat with the assistant.
      msg = Message(role="user", content=payload["question"])
      resp = assistant.chat(messages=[msg])
      print(resp)

      # {
      #    'id': '0000000000000000163008a05b317b7b', 
      #    'model': 'gpt-4o-2024-05-13', 
      #    'usage': {
      #        'prompt_tokens': 9259, 
      #        'completion_tokens': 30, 
      #        'total_tokens': 9289
      #        }, 
      #        'message': {
      #            'content': 'The Chief Financial Officer (CFO) of Netflix is Spencer Neumann.', 
      #            'role': '"assistant"'
      #            }, 
      #            'finish_reason': 'stop', 
      #            'citations': [
      #                {
      #                    'position': 63, 
      #                    'references': [
      #                        {
      #                            'pages': [78, 72, 79], 
      #                            'file': {
      #                                'name': 'Netflix-10-K-01262024.pdf', 
      #                                'id': '76a11dd1...', 
      #                                'metadata': {
      #                                    'company': 'netflix', 
      #                                    'document_type': 'form 10k'
      #                                    }, 
      #                                    'created_on': '2024-12-06T01:29:07.369208590Z', 
      #                                    'updated_on': '2024-12-06T01:29:50.923493799Z', 
      #                                    'status': 'Available', 
      #                                    'percent_done': 1.0, 
      #                                    'signed_url': 'https://storage.googleapis.com/...', 
      #                                    'error_message': None,
      #                                    'size': 1073470.0
      #                                }
      #                            }
      #                        ]
      #                    }
      #                ]
      #            }

      # Evaluate the assistant's response.
      payload["answer"] = resp.message.content

      headers = {
          "Api-Key": "YOUR_API_KEY",
          "Content-Type": "application/json"
      }

      url = "https://prod-1-data.ke.pinecone.io/assistant/evaluation/metrics/alignment"

      response = requests.request("POST", url, json=payload, headers=headers)

      print(response.text)

      # {
      #    "metrics":
      #    {
      #        "correctness":1.0,
      #        "completeness":1.0,
      #        "alignment":1.0
      #    },
      #    "reasoning":
      #    {
      #        "evaluated_facts":
      #        [
      #            {
      #                "fact":
      #                {
      #                    "content":"Spencer Neumann is the CFO of Netflix."
      #                    },
      #                    "entailment":"entailed"
      #                }
      #            ]
      #        },
      #        "usage":
      #        {
      #            "prompt_tokens":1221,
      #            "completion_tokens":24,
      #            "total_tokens":1245
      #            }
      #        }
      ```

      ```javascript JavaScript
      import { Pinecone } from "@pinecone-database/pinecone";

      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      async function testPinecone() {
        try {
          console.log("Initializing Pinecone client...");

          const pc = new Pinecone({
            apiKey: "YOUR_API_KEY",
          });

          console.log("Pinecone client initialized successfully.");

          const assistantName = "test-assistant";

          // Create a new assistant.
          console.log(`Creating new assistant: ${assistantName}...`);
          await pc.createAssistant({
            name: assistantName,
            region: "us",
            metadata: { 'test-key': 'test-value' },
          });

          // Validate Assistant was created through describe.
          const asstDesc = await pc.describeAssistant(assistantName);
          console.log(`Described Assistant: ${JSON.stringify(asstDesc)}`);

          // Delay to ensure the Assistant is ready.
          await sleep(4000);

          // Upload file
          const assistant = pc.Assistant(assistantName);
          await assistant.uploadFile({
            path: '/Users/jdoe/Downloads/Netflix-10-K-01262024.pdf',
            metadata: { 'test-key': 'test-value' },
          });
          console.log("File uploaded. Processsing...");

          // Delay to ensure file is available.
          await sleep(45000);

          // Chat
          const chatResp = await assistant.chat({
            messages: [{ role: 'user', content: 'Who is the CFO of Netflix?' }]
          });
          console.log(chatResp);
          
        // Error handling
        } catch (error) {
          console.error("Error:", error);
        }
      }

      // Run the sample code
      testAssistant();
      ```
    </CodeGroup>
  </Tab>
</Tabs>

## Learn more

<CardGroup cols={3}>
  <Card title="API Reference" icon="code-simple" href="/reference">
    Comprehensive details about the Pinecone APIs, SDKs, utilities, and architecture.
  </Card>

  <Card title="Blog" icon="blog" href="https://www.pinecone.io/learn/assistant-api-deep-dive/">
    Four features of the Assistant API you aren't using - but should
  </Card>

  <Card title="Releases" icon="party-horn" href="/release-notes">
    News about features and changes in Pinecone and related tools.
  </Card>
</CardGroup>
