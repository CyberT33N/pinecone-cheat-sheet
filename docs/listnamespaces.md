# List namespaces

> Get a list of all [namespaces](https://docs.pinecone.io/guides/index-data/indexing-overview#namespaces) in a serverless index.

Up to 100 namespaces are returned at a time by default, in sorted order (bitwise “C” collation). If the `limit` parameter is set, up to that number of namespaces are returned instead. Whenever there are additional namespaces to return, the response also includes a `pagination_token` that you can use to get the next batch of namespaces. When the response does not include a `pagination_token`, there are no more namespaces to return.

## OpenAPI

````yaml db_data_2025-04.oas get /namespaces
paths:
  path: /namespaces
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
        limit:
          schema:
            - type: integer
              description: Max number namespaces to return per page.
          style: form
        paginationToken:
          schema:
            - type: string
              description: Pagination token to continue a previous listing operation.
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
              namespaces:
                allOf:
                  - description: The list of namespaces belonging to this index.
                    type: array
                    items:
                      $ref: '#/components/schemas/NamespaceDescription'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/Pagination'
            refIdentifier: '#/components/schemas/ListNamespacesResponse'
        examples:
          example:
            value:
              namespaces:
                - name: example-namespace
                  record_count: 20000
              pagination:
                next: Tm90aGluZyB0byBzZWUgaGVyZQo=
        description: A successful response
    4XX:
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
    Pagination:
      type: object
      properties:
        next:
          example: Tm90aGluZyB0byBzZWUgaGVyZQo=
          type: string
    NamespaceDescription:
      description: A description of a namespace, including the name and record count.
      type: object
      properties:
        name:
          example: example-namespace
          description: The name of the namespace.
          type: string
        record_count:
          example: 20000
          description: The total amount of records within the namespace.
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