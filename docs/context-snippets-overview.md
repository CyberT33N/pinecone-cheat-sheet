# Context snippets overview

You can [retrieve the context snippets](/guides/assistant/retrieve-context-snippets) that Pinecone Assistant uses to generate its responses. This data includes relevant chunks, relevancy scores, and references.

## Use cases

Retrieving context snippets is useful for performing tasks like the following:

* Understanding what relevant data snippets Pinecone Assistant is providing to the LLM for chat generation.
* Using the retrieved snippets with your own LLM.
* Using the retrieved snippets with your own RAG application or agentic workflow.

## SDK support

The Pinecone [Python SDK](/reference/python-sdk) and [Node.js SDK](/reference/node-sdk) provide convenient programmatic access to [retrieve context snippets](/reference/api/2025-01/assistant/context_assistant).

## Pricing

Context retrieval usage is [measured in tokens](/guides/assistant/pricing-and-limits#token-usage), similar to Pinecone Assistant. See [Pricing](https://www.pinecone.io/pricing/) for up-to-date pricing information.

<Note>
  Pricing updates specific to context retrieval will be made as the feature becomes generally available.
</Note>
