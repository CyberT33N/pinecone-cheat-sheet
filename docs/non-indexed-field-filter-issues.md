# Non-indexed field filter issues

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

In your daily operations with Pinecone, you might encounter issues related to filtering on non-indexed fields. This article aims to help you understand and resolve such problems.

## Problem

A common issue our customers experience is trying to filter on a non-indexed field while using Pinecone's metadata filtering feature. For instance, you might be attempting to filter on the `some_field_id` field, which is not listed in the indexed section of the metadata\_config for your specific index. Consequently, enabling the filter for `some_field_id` might return zero results.

## Root Cause

This behavior usually arises from the fact that the field you're trying to filter on is not included in the indexed section of the metadata\_config. Pinecone's metadata filtering feature only works with fields that are indexed. If a field is not indexed, it will not be available for filtering, leading to zero results.

## Solution

To avoid this issue, carefully consider which fields to include in the indexed section of your metadata\_config for your Pinecone index. It's crucial to ensure that all relevant fields are included in this section to prevent unexpected behavior when using metadata filtering.

If you find yourself experiencing such an issue, the first step is to check your metadata\_config and verify the fields listed in the indexed section.

**Here's an example of how you can check your Pinecone index using cURL:**

```shell
INDEX_NAME = "docs-example"
PINECONE_API_KEY="YOUR_API_KEY"

curl -X GET https://controller.eu-west1-gcp.pinecone.io/databases/$INDEX_NAME \
-H "Api-Key: $PINECONE_API_KEY" \
-H "accept: application/json" \
-H "X-Pinecone-API-Version: 2024-07"
```

Please replace `docs-example` and `YOUR_API_KEY` with your actual index name and API key respectively.

This will return a JSON object describing your index. Look for the `metadata_config` field, and within it, the `indexed` array.

For example:

```
{
"database":{
"name":"your\_database\_name",
"metric":"cosine",
"dimension":1536,
"replicas":1,
"shards":1,
"pods":1,
"pod\_type":"p1.x1",
"metadata\_config":{
***"indexed":["source","source\_id","url","created\_at","author","document\_id"]***
}},
"status":{
"waiting":[],
"crashed":[],
"host":"your\_host\_name.svc.eu-west1-gcp.pinecone.io",
"port":433,
"state":"Ready",
"ready":true
}
}
```

If the field you are trying to filter on is not present in the `indexed` array, you have identified the issue. To resolve it, add the necessary field(s) to the indexed section of your metadata\_config.

## Conclusion

Pinecone's metadata filtering feature is a powerful tool, but it's important to correctly configure your index to ensure you can leverage it to its fullest potential. By carefully selecting the fields you index, you can avoid issues related to filtering on non-indexed fields and ensure seamless data operations.
