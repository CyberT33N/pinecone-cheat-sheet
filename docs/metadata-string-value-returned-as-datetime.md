# Metadata string value returned as a datetime object

When using the Pinecone [Python SDK](/reference/python-sdk) you may encounter a bug where strings in metadata are interpreted as datetime objects. This is because of a bug in the OpenAPI code used for the REST interface in the client. The OpenAPI spec does not clearly define all accepted data types.

While we fix this, we recommend using [GRPCIndex](/guides/index-data/upsert-data#grpc-python-sdk) to instantiate your index connections. Because of differences between the REST and GRPC connections this bug does not affect GRPCIndex objects.
