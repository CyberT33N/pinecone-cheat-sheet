# PineconeAttribute errors with LangChain

## Problem

When using an outdated version of LangChain, you may encounter errors like the following:

```console
Pinecone has no attribute 'from_texts'
```

```console
Pinecone has no attribute `from_documents'
```

## Solution

Previously, the Python classes for both LangChain and Pinecone had objects named `Pinecone`, but this is no longer an issue in the latest LangChain version. To resolve these errors, upgrade LangChain to >=0.0.3:

```shell
pip install --upgrade langchain-pinecone
```

Depending on which version of LangChain you are upgrading from, you may need to update your code. You can find more information about using LangChain with Pinecone in our [documentation](/integrations/langchain#4-initialize-a-langchain-vector-store).
