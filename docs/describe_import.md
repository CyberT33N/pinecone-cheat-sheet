# Describe an import

> Return details of a specific import operation.

For guidance and examples, see [Import data](https://docs.pinecone.io/guides/index-data/import-data).

## OpenAPI

````yaml db_data_2025-04.oas get /bulk/imports/{id}
paths:
  path: /bulk/imports/{id}
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
      path:
        id:
          schema:
            - type: string
              required: true
              description: Unique identifier for the import operation.
              maxLength: 1000
              minLength: 1
          style: simple
      query: {}
      header: {}
      cookie: {}
    body: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - example: '101'
                    description: Unique identifier for the import operation.
                    type: string
                    minLength: 1
                    maxLength: 1000
              uri:
                allOf:
                  - description: The URI from where the data is imported.
                    type: string
              status:
                allOf:
                  - example: Pending
                    description: The status of the operation.
                    type: string
                    enum:
                      - Pending
                      - InProgress
                      - Failed
                      - Completed
                      - Cancelled
              createdAt:
                allOf:
                  - description: The start time of the import operation.
                    type: string
                    format: date-time
              finishedAt:
                allOf:
                  - description: The end time of the import operation.
                    type: string
                    format: date-time
              percentComplete:
                allOf:
                  - example: 42.2
                    description: The progress made by the operation, as a percentage.
                    type: number
                    format: float
                    minimum: 0
                    maximum: 100
              recordsImported:
                allOf:
                  - example: 1000000
                    description: The number of records successfully imported.
                    type: integer
                    format: int64
              error:
                allOf:
                  - description: The error message if the import process failed.
                    type: string
            description: The model for an import operation.
            refIdentifier: '#/components/schemas/ImportModel'
        examples:
          example:
            value:
              id: '101'
              uri: <string>
              status: Pending
              createdAt: '2023-11-07T05:31:56Z'
              finishedAt: '2023-11-07T05:31:56Z'
              percentComplete: 42.2
              recordsImported: 1000000
              error: <string>
        description: Details of the import operation.
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
    protobufAny:
      type: object
      properties:
        typeUrl:
          type: string
        value:
          type: string
          format: byte

````