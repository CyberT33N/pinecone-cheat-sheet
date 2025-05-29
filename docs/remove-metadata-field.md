# Remove a metadata field from a record

You must perform an [`upsert`](/reference/api/2024-10/data-plane/upsert) operation to remove existing metadata fields from a record.

You will need to provide the existing ID and values of the vector. The metadata you provide in the upsert operation will replace any existing metadata, thus clearing the fields you seek to drop.

Metadata fields cannot be removed using the `update` operation.
