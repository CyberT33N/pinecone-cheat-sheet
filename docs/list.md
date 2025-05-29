# List vector IDs

> List the IDs of vectors in a single namespace of a serverless index. An optional prefix can be passed to limit the results to IDs with a common prefix.

Returns up to 100 IDs at a time by default in sorted order (bitwise "C" collation). If the `limit` parameter is set, `list` returns up to that number of IDs instead. Whenever there are additional IDs to return, the response also includes a `pagination_token` that you can use to get the next batch of IDs. When the response does not include a `pagination_token`, there are no more IDs to return.

For guidance and examples, see [List record IDs](https://docs.pinecone.io/guides/manage-data/list-record-ids).

**Note:** `list` is supported only for serverless indexes.

## OpenAPI

````yaml db_data_2025-04.oas get /vectors/list
paths:
  path: /vectors/list
  method: get
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
      path: {}
      query:
        prefix:
          schema:
            - type: string
              description: >-
                The vector IDs to fetch. Does not accept values containing
                spaces.
          style: form
        limit:
          schema:
            - type: integer
              description: Max number of IDs to return per page.
              default: '100'
          style: form
        paginationToken:
          schema:
            - type: string
              description: Pagination token to continue a previous listing operation.
          style: form
        namespace:
          schema:
            - type: string
          style: form
      header: {}
      cookie: {}
    body: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              vectors:
                allOf:
                  - example:
                      - id: document1#abb
                      - id: document1#abc
                    title: A list of ids
                    type: array
                    items:
                      $ref: '#/components/schemas/ListItem'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/Pagination'
              namespace:
                allOf:
                  - example: example-namespace
                    description: The namespace of the vectors.
                    type: string
              usage:
                allOf:
                  - $ref: '#/components/schemas/Usage'
            description: The response for the `list` operation.
            refIdentifier: '#/components/schemas/ListResponse'
        examples:
          example:
            value:
              vectors:
                - id: document1#abb
                - id: document1#abc
              pagination:
                next: Tm90aGluZyB0byBzZWUgaGVyZQo=
              namespace: example-namespace
              usage:
                readUnits: 5
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
    ListItem:
      type: object
      properties:
        id:
          example: document1#abb
          type: string
    Pagination:
      type: object
      properties:
        next:
          example: Tm90aGluZyB0byBzZWUgaGVyZQo=
          type: string
    Usage:
      type: object
      properties:
        readUnits:
          example: 5
          description: The number of read units consumed by this operation.
          type: integer
          format: int64
    protobufAny:
      type: object
      properties:
        typeUrl:
          type: string
        value:
          type: string
          format: byte

````