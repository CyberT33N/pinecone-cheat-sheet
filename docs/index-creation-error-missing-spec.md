# Index creation error - missing spec parameter

## Problem

Using the [new API](/reference/api), creating an index requires passing appropriate values into the `spec` parameter. Without this `spec` parameter, the `create_index` method raises the following error:

```console console
TypeError: Pinecone.create_index() missing 1 required positional argument: 'spec'
```

## Solution

Set the `spec` parameter. For guidance on how to set this parameter, see [Create a serverless index](/guides/index-data/create-an-index#create-a-serverless-index) and [Create a pod-based index](/guides/index-data/create-an-index#create-a-pod-based-index).
