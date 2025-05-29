# List imports

> List all recent and ongoing import operations.

By default, `list_imports` returns up to 100 imports per page. If the `limit` parameter is set, `list` returns up to that number of imports instead. Whenever there are additional IDs to return, the response also includes a `pagination_token` that you can use to get the next batch of imports. When the response does not include a `pagination_token`, there are no more imports to return.

For guidance and examples, see [Import data](https://docs.pinecone.io/guides/index-data/import-data).

## OpenAPI

````yaml db_data_2025-04.oas get /bulk/imports
paths:
  path: /bulk/imports
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
              description: Max number of operations to return per page.
              maximum: 100
              minimum: 1
              default: '100'
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
              data:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/ImportModel'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/Pagination'
            description: The response for the `list_imports` operation.
            refIdentifier: '#/components/schemas/ListImportsResponse'
        examples:
          example:
            value:
              data:
                - id: '101'
                  uri: <string>
                  status: Pending
                  createdAt: '2023-11-07T05:31:56Z'
                  finishedAt: '2023-11-07T05:31:56Z'
                  percentComplete: 42.2
                  recordsImported: 1000000
                  error: <string>
              pagination:
                next: Tm90aGluZyB0byBzZWUgaGVyZQo=
        description: A list of import operations
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
    ImportModel:
      description: The model for an import operation.
      type: object
      properties:
        id:
          example: '101'
          description: Unique identifier for the import operation.
          type: string
          minLength: 1
          maxLength: 1000
        uri:
          description: The URI from where the data is imported.
          type: string
        status:
          example: Pending
          description: The status of the operation.
          type: string
          enum:
            - Pending
            - InProgress
            - Failed
            - Completed
            - Cancelled
        createdAt:
          description: The start time of the import operation.
          type: string
          format: date-time
        finishedAt:
          description: The end time of the import operation.
          type: string
          format: date-time
        percentComplete:
          example: 42.2
          description: The progress made by the operation, as a percentage.
          type: number
          format: float
          minimum: 0
          maximum: 100
        recordsImported:
          example: 1000000
          description: The number of records successfully imported.
          type: integer
          format: int64
        error:
          description: The error message if the import process failed.
          type: string
    Pagination:
      type: object
      properties:
        next:
          example: Tm90aGluZyB0byBzZWUgaGVyZQo=
          type: string
    protobufAny:
      type: object
      properties:
        typeUrl:
          type: string
        value:
          type: string
          format: byte

````