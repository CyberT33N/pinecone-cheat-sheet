# Files in Pinecone Assistant

export const word_0 = "files"

Before you can chat with the assistant, you need to [upload files](/guides/assistant/manage-files#upload-a-local-file). The files provide your assistant with context and information to reference when generating responses. Files are not shared across assistants.

### Supported size and types

The maximum file size is 100MB for PDFs and 10MB for all other file types. When uploading files to an assistant, it is recommended to upload file sizes of 1MB or less for faster processing.

Pinecone Assistant supports the following file types:

* DOCX (.docx)
* JSON (.json)
* Markdown (.md)
* PDF (.pdf)
* Text (.txt)

Scanned PDFs and text extraction from images (OCR) are not supported. If a document contains images, the images are not processed, and the assistant generates responses based on the text content only.

### File storage

Files are uploaded to Google Cloud Storage (`us-central1` region) and to your organization's Pinecone vector database. The assistant processes the files, so data is not sent outside of blob storage or Pinecone. A signed URL for the file is generated and stored in the assistant's details, so the assistant can retrieve the file when generating responses. To view the signed URL, you can [list the files in the assistant](/guides/assistant/manage-files#list-files-in-an-assistant).

### File metadata

You can [upload a file with metadata](/guides/assistant/manage-files#upload-a-file-with-metadata), which allows you to store additional information about the file as key-value pairs.

<Warning>
  File metadata can be set only when the file is uploaded. You cannot update metadata after the file is uploaded.
</Warning>

File metadata can be used for the following purposes:

* [Filtering chat responses](/guides/assistant/chat-with-assistant#filter-chat-with-metadata): Specify filters on assistant responses so only files that match the metadata filter are referenced in the response. Chat requests without metadata filters do not consider metadata.
* [Viewing a filtered list of files](/guides/assistant/manage-files#view-a-filtered-list-of-files): Use metadata filters to list files in an assistant that match specific criteria.

#### Supported metadata size and types

Pinecone Assistant supports 1KB of metadata per file.

Metadata payloads must be key-value pairs in a JSON object. Keys must be strings, and values can be one of the following data types:

* String
* Number (integer or floating point, gets converted to a 64 bit floating point)
* Booleans (true, false)
* List of strings

<Warning>
  Null metadata values are not supported. Instead of setting a key to hold a\
  null value, we recommend you remove that key from the metadata payload.
</Warning>

For example, the following would be valid metadata payloads:

```JSON JSON
{
    "genre": "action",
    "year": 2020,
    "length_hrs": 1.5
}

{
    "color": "blue",
    "fit": "straight",
    "price": 29.99,
    "is_jeans": true
}
```

#### Metadata query language

Pinecone's filtering query language is based on [MongoDB's query and projection operators](https://docs.mongodb.com/manual/reference/operator/query/). Pinecone currently supports a subset of those selectors:

| Filter    | Description                                                                                                                        | Supported types         |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `$eq`     | Matches {word_0} with metadata values that are equal to a specified value. Example: `{"genre": {"$eq": "documentary"}}`            | Number, string, boolean |
| `$ne`     | Matches {word_0} with metadata values that are not equal to a specified value. Example: `{"genre": {"$ne": "drama"}}`              | Number, string, boolean |
| `$gt`     | Matches {word_0} with metadata values that are greater than a specified value. Example: `{"year": {"$gt": 2019}}`                  | Number                  |
| `$gte`    | Matches {word_0} with metadata values that are greater than or equal to a specified value. Example:`{"year": {"$gte": 2020}}`      | Number                  |
| `$lt`     | Matches {word_0} with metadata values that are less than a specified value. Example: `{"year": {"$lt": 2020}}`                     | Number                  |
| `$lte`    | Matches {word_0} with metadata values that are less than or equal to a specified value. Example: `{"year": {"$lte": 2020}}`        | Number                  |
| `$in`     | Matches {word_0} with metadata values that are in a specified array. Example: `{"genre": {"$in": ["comedy", "documentary"]}}`      | String, number          |
| `$nin`    | Matches {word_0} with metadata values that are not in a specified array. Example: `{"genre": {"$nin": ["comedy", "documentary"]}}` | String, number          |
| `$exists` | Matches {word_0} with the specified metadata field. Example: `{"genre": {"$exists": true}}`                                        | Number, string, boolean |
| `$and`    | Joins query clauses with a logical `AND`. Example: `{"$and": [{"genre": {"$eq": "drama"}}, {"year": {"$gte": 2020}}]}`             | -                       |
| `$or`     | Joins query clauses with a logical `OR`. Example: `{"$or": [{"genre": {"$eq": "drama"}}, {"year": {"$gte": 2020}}]}`               | -                       |

For example, the following has a `"genre"` metadata field with a list of strings:

```JSON JSON
{ "genre": ["comedy", "documentary"] }
```

This means `"genre"` takes on both values, and requests with the following filters will match:

```JSON JSON
{"genre":"comedy"}

{"genre": {"$in":["documentary","action"]}}

{"$and": [{"genre": "comedy"}, {"genre":"documentary"}]}
```

However, requests with the following filter will **not** match:

```JSON JSON
{ "$and": [{ "genre": "comedy" }, { "genre": "drama" }] }
```

Additionally, requests with the following filters will **not** match because they are invalid. They will result in a compilation error:

```
# INVALID QUERY:
{"genre": ["comedy", "documentary"]}
```

```
# INVALID QUERY:
{"genre": {"$eq": ["comedy", "documentary"]}}
```

## Limitations

<fileLimits />
