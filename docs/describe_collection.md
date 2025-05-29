# Describe a collection

> Get a description of a collection.
Serverless indexes do not support collections.


## OpenAPI

````yaml db_control_2025-04.oas get /collections/{collection_name}
paths:
  path: /collections/{collection_name}
  method: get
  servers:
    - url: https://api.pinecone.io
      description: Production API endpoints
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
        collection_name:
          schema:
            - type: string
              required: true
              description: The name of the collection to be described.
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
              name:
                allOf:
                  - example: example-collection
                    description: The name of the collection.
                    type: string
              size:
                allOf:
                  - example: 10000000
                    description: The size of the collection in bytes.
                    type: integer
                    format: int64
              status:
                allOf:
                  - example: Initializing
                    description: The status of the collection.
                    type: string
                    enum:
                      - Initializing
                      - Ready
                      - Terminating
              dimension:
                allOf:
                  - example: 1536
                    description: >-
                      The dimension of the vectors stored in each record held in
                      the collection.
                    type: integer
                    format: int32
                    minimum: 1
                    maximum: 20000
              vector_count:
                allOf:
                  - example: 120000
                    description: The number of records stored in the collection.
                    type: integer
                    format: int32
              environment:
                allOf:
                  - example: us-east1-gcp
                    description: The environment where the collection is hosted.
                    type: string
            description: >-
              The CollectionModel describes the configuration and status of a
              Pinecone collection.
            refIdentifier: '#/components/schemas/CollectionModel'
            requiredProperties:
              - name
              - status
              - environment
        examples:
          tiny-collection:
            summary: A small collection.
            value:
              dimension: 3
              environment: us-east1-gcp
              name: tiny-collection
              size: 3126700
              status: Ready
              vector_count: 99
        description: Configuration information and status of the collection.
    '401':
      application/json:
        schemaArray:
          - type: object
            properties:
              status:
                allOf:
                  - &ref_0
                    example: 500
                    description: The HTTP status code of the error.
                    type: integer
              error:
                allOf:
                  - &ref_1
                    example:
                      code: INVALID_ARGUMENT
                      message: >-
                        Index name must contain only lowercase alphanumeric
                        characters or hyphens, and must not begin or end with a
                        hyphen.
                    description: Detailed information about the error that occurred.
                    type: object
                    properties:
                      code:
                        type: string
                        enum:
                          - OK
                          - UNKNOWN
                          - INVALID_ARGUMENT
                          - DEADLINE_EXCEEDED
                          - QUOTA_EXCEEDED
                          - NOT_FOUND
                          - ALREADY_EXISTS
                          - PERMISSION_DENIED
                          - UNAUTHENTICATED
                          - RESOURCE_EXHAUSTED
                          - FAILED_PRECONDITION
                          - ABORTED
                          - OUT_OF_RANGE
                          - UNIMPLEMENTED
                          - INTERNAL
                          - UNAVAILABLE
                          - DATA_LOSS
                          - FORBIDDEN
                          - UNPROCESSABLE_ENTITY
                          - PAYMENT_REQUIRED
                      message:
                        example: >-
                          Index name must contain only lowercase alphanumeric
                          characters or hyphens, and must not begin or end with
                          a hyphen.
                        type: string
                      details:
                        description: >-
                          Additional information about the error. This field is
                          not guaranteed to be present.
                        type: object
                    required:
                      - code
                      - message
            description: The response shape used for all error responses.
            refIdentifier: '#/components/schemas/ErrorResponse'
            requiredProperties: &ref_2
              - status
              - error
            example: &ref_3
              error:
                code: QUOTA_EXCEEDED
                message: >-
                  The index exceeds the project quota of 5 pods by 2 pods.
                  Upgrade your account or change the project settings to
                  increase the quota.
              status: 429
        examples:
          unauthorized:
            summary: Unauthorized
            value:
              error:
                code: UNAUTHENTICATED
                message: Invalid API key.
              status: 401
        description: 'Unauthorized. Possible causes: Invalid API key.'
    '404':
      application/json:
        schemaArray:
          - type: object
            properties:
              status:
                allOf:
                  - *ref_0
              error:
                allOf:
                  - *ref_1
            description: The response shape used for all error responses.
            refIdentifier: '#/components/schemas/ErrorResponse'
            requiredProperties: *ref_2
            example: *ref_3
        examples:
          collection-not-found:
            summary: Collection not found.
            value:
              error:
                code: NOT_FOUND
                message: Collection example-collection not found.
              status: 404
        description: Collection not found.
    '500':
      application/json:
        schemaArray:
          - type: object
            properties:
              status:
                allOf:
                  - *ref_0
              error:
                allOf:
                  - *ref_1
            description: The response shape used for all error responses.
            refIdentifier: '#/components/schemas/ErrorResponse'
            requiredProperties: *ref_2
            example: *ref_3
        examples:
          internal-server-error:
            summary: Internal server error
            value:
              error:
                code: UNKNOWN
                message: Internal server error
              status: 500
        description: Internal server error.
  deprecated: false
  type: path
components:
  schemas: {}

````