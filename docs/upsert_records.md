# Upsert text

> Upsert text into a namespace. Pinecone converts the text to vectors automatically using the hosted embedding model associated with the index.

Upserting text is supported only for [indexes with integrated embedding](https://docs.pinecone.io/reference/api/2025-01/control-plane/create_for_model).

For guidance and examples, see [Upsert data](https://docs.pinecone.io/guides/index-data/upsert-data#upsert-text).

## OpenAPI

````yaml db_data_2025-04.oas post /records/namespaces/{namespace}/upsert
paths:
  path: /records/namespaces/{namespace}/upsert
  method: post
  servers:
    - url: https://{index_host}
      variables:
        index_host:
          type: string
          description: host of the index
          default: unknown
  request:
    security:
      - title: ApiKeyAuth
        parameters:
          query: {}
          header:
            Api-Key:
              type: apiKey
              description: >-
                An API Key is required to call Pinecone APIs. Get yours from the
                [console](https://app.pinecone.io/).
          cookie: {}
    parameters:
      path:
        namespace:
          schema:
            - type: string
              required: true
              description: The namespace to upsert records into.
          style: simple
      query: {}
      header: {}
      cookie: {}
    body:
      application/x-ndjson:
        schemaArray:
          - type: array
            items:
              allOf:
                - $ref: '#/components/schemas/UpsertRecord'
            required: true
        examples:
          example:
            value:
              - _id: example-record-1
  response:
    '201':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: A successful response.
        examples: {}
        description: A successful response.
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - &ref_0
                    type: integer
                    format: int32
              message:
                allOf:
                  - &ref_1
                    type: string
              details:
                allOf:
                  - &ref_2
                    type: array
                    items:
                      $ref: '#/components/schemas/protobufAny'
            refIdentifier: '#/components/schemas/rpcStatus'
        examples:
          example:
            value:
              code: 123
              message: <string>
              details:
                - typeUrl: <string>
                  value: aSDinaTvuI8gbWludGxpZnk=
        description: Bad request. The request body included invalid request parameters.
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - *ref_0
              message:
                allOf:
                  - *ref_1
              details:
                allOf:
                  - *ref_2
            refIdentifier: '#/components/schemas/rpcStatus'
        examples:
          example:
            value:
              code: 123
              message: <string>
              details:
                - typeUrl: <string>
                  value: aSDinaTvuI8gbWludGxpZnk=
        description: An unexpected error response.
    5XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - *ref_0
              message:
                allOf:
                  - *ref_1
              details:
                allOf:
                  - *ref_2
            refIdentifier: '#/components/schemas/rpcStatus'
        examples:
          example:
            value:
              code: 123
              message: <string>
              details:
                - typeUrl: <string>
                  value: aSDinaTvuI8gbWludGxpZnk=
        description: An unexpected error response.
  deprecated: false
  type: path
components:
  schemas:
    UpsertRecord:
      example:
        _id: example-record-1
      description: The request for the `upsert` operation.
      type: object
      properties:
        _id:
          description: >-
            The unique ID of the record to upsert. Note that `id` can be used as
            an alias for `_id`.
          type: string
      required:
        - _id
    protobufAny:
      type: object
      properties:
        typeUrl:
          type: string
        value:
          type: string
          format: byte

````