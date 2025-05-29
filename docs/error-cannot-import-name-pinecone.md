# Error: Cannot import name 'Pinecone' from 'pinecone'

## Problem

When using an older version of the [Python SDK](https://github.com/pinecone-io/pinecone-python-client/blob/main/README.md) (earlier than 3.0.0), trying to import the `Pinecone` class raises the following error:

```console console
ImportError: cannot import name 'Pinecone' from 'pinecone'
```

## Solution

Upgrade the SDK version and try again:

```Shell Shell
# If you're interacting with Pinecone via HTTP requests, use:
pip install pinecone --upgrade
```

```Shell Shell
# If you're interacting with Pinecone via gRPC, use:
pip install "pinecone[grpc]" --upgrade
```
