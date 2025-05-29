# Create and manage vectors with metadata

Performing deletes by metadata filtering can be a very expensive process for any database. By using a hierarchical naming convention for vector IDs, you can avoid this process and perform deletes by ID. This is more efficient and will reduce the impact on the compute resources, minimize query latency, and maintain a more consistent user experience.

## 1. Upsert

* Generate a hierarchical naming convention for vector IDs.
  * One recommended pattern may be `parentId-chunkId` where parentId is the ID of the document and `chunkId` is an integer starting with 0 to the total number of chunks
  * While capturing embeddings and preparing upserts for Pinecone, capture the total number of chunks for each `parentId`.
  * Append the `chunkCount` to the metadata field of the `parentId-0` vector, or you may append them to all chunks if desired. This should be an integer and cardinality will naturally be low.
  * Upsert the vectors with the `parentId-chunkId` as the ID.
  * Reverse lookups can be created where you find a chunk and want to find the parent document or sibling chunks.

## 2. Delete by ID (to avoid delete by metadata filter)

* Identify the `parentId`
  * This could be an internal process to identify documents that have been modified or deleted.
  * Or, this could be a end-user initiated process to delete a document based on a query that finds a sibling chunk or `parentId`.

* Once the `parentId` is identified, use the [`fetch`](/reference/api/2024-10/data-plane/fetch) endpoint to retrieve the `chunkCount` from the metadata field by sending the `parentId-0` vector ID.

* Build a list of IDs using the pattern of `parentId` and `chunkCount`.

* Batch these together and send them to the [`delete`](/reference/api/2024-10/data-plane/delete) endpoint using the IDs of the vectors.

  ```shell
  INDEX_NAME="docs-example"
  PROJECT_ID="example-project-id"

  curl "https://$INDEX_NAME-$PROJECT_ID.svc.environment.pinecone.io/vectors/delete" \
    -H "accept: application/json" \
    -H "content-type: application/json"\
    -H "X-Pinecone-API-Version: 2024-07" \
    -d '
    {
      "deleteAll": "false",
      "ids": [
        "someParentDoc-0",
        "someParentDoc-1",
        "someParentDoc-2"
      ]
    }'
  ```

* You may then [upsert](/reference/api/2024-10/data-plane/upsert) the new version of the document with the new vectors and metadata or if it is a delete-only process, you are finished.

## 3. Updates

* [Updates](/reference/api/2024-10/data-plane/update) are intended to apply small changes to a record whether that means updating the vector, or more commonly, the metadata.
* In cases where you are chunking data, you are more likely going to need to delete and re-upsert using the steps above.
* If you are only performing very small changes to a small number of vectors, the update process is ideal.
* If you are updating a large number of vectors, you may want to consider batching and slowing down the updates to avoid rate limiting or affecting query latency and response times.
