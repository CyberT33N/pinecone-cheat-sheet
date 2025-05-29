# Python AttributeError: module pinecone has no attribute init

## Problem

If you are using Pinecone serverless and getting the error `"AttributeError: module 'pinecone' has no attribute 'init'`, first check that you are using the latest version of the Python SDK.

You can check the version of the client by running:

```shell
pip show pinecone
```

## Solution

Serverless requires a minimum version of 3.0. To upgrade to the latest version, run:

```shell
# If you're interacting with Pinecone via HTTP:
pip install pinecone --upgrade

# If you're using gRPC:
# pip install "pinecone[grpc]" --upgrade
```

If you're on the right version and getting this error, you just have to make some slight changes to your code to make use of serverless. Instead of calling:

```python
import pinecone

pinecone.init(api_key=api_key,environment=environment)
```

Use the following if you're interacting with Pinecone via HTTP requests:

```python
from pinecone import Pinecone

pc = Pinecone(api_key=api_key)
```

Or, use the following if you're using gRPC:

```python
from pinecone.grpc import PineconeGRPC as Pinecone

pc = Pinecone(api_key=api_key)
```

You no longer need to specify the cloud environment your index is hosted in; the API key is all you need.
