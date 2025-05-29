# Unable to pip install

Python `3.x` uses `pip3`. Use the following commands in your terminal to install the latest version of the [Pinecone Python SDK](/reference/python-sdk):

```Shell Shell
# If you are connecting to Pinecone via gRPC:
pip3 install -U pinecone[grpc]
```

```Shell Shell
# If you are connecting to Pinecone via HTTP:
pip3 install -U pinecone
```
