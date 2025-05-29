# Serverless index connection errors

## Problem

To connect to a serverless index, you must use an updated Pinecone client. Trying to connect to a serverless index with an outdated client will raise errors similar to one of the following:

```console console
Failed to resolve 'controller.us-west-2.pinecone.io'

controller.us-west-2-aws.pinecone.io not found

Request failed to reach Pinecone while calling https://controller.us-west-2.pinecone.io/actions/whoami
```

## Solution

Upgrade to the latest [Python](https://github.com/pinecone-io/pinecone-python-client/blob/main/README.md) or [Node.js](https://sdk.pinecone.io/typescript/) client and try again:

<CodeGroup>
  ```python Python
  pip install "pinecone[grpc]" --upgrade
  ```

  ```js JavaScript
  npm install @pinecone-database/pinecone@latest
  ```
</CodeGroup>
