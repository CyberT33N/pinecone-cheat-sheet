# Create a collection

> Create a Pinecone collection.
  
Serverless indexes do not support collections.


## OpenAPI

````yaml db_control_2025-04.oas post /collections
paths:
  path: /collections
  method: post
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
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              name:
                allOf:
                  - description: >
                      The name of the collection to be created. Resource name
                      must be 1-45 characters long, start and end with an
                      alphanumeric character, and consist only of lower case
                      alphanumeric characters or '-'.
                    type: string
                    minLength: 1
                    maxLength: 45
              source:
                allOf:
                  - example: example-source-index
                    description: >-
                      The name of the index to be used as the source for the
                      collection.
                    type: string
            required: true
            description: The configuration needed to create a Pinecone collection.
            refIdentifier: '#/components/schemas/CreateCollectionRequest'
            requiredProperties:
              - name
              - source
        examples:
          creating-collection:
            summary: Creating a collection
            value:
              name: example-collection
              source: example-source-index
        description: The desired configuration for the collection.
  response:
    '201':
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
          example:
            value:
              name: example-collection
              size: 10000000
              status: Initializing
              dimension: 1536
              vector_count: 120000
              environment: us-east1-gcp
        description: The collection has been successfully created.
    '400':
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
          index-metric-validation-error:
            summary: Validation error
            value:
              error:
                code: INVALID_ARGUMENT
                message: >-
                  Bad request. The request body included invalid request
                  parameters.
              status: 400
        description: Bad request. The request body included invalid request parameters.
    '401':
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
          unauthorized:
            summary: Unauthorized
            value:
              error:
                code: UNAUTHENTICATED
                message: Invalid API key.
              status: 401
        description: 'Unauthorized. Possible causes: Invalid API key.'
    '402':
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
          payment-required:
            summary: Payment required
            value:
              error:
                code: PAYMENT_REQUIRED
                message: >-
                  Request failed. Pay all past due invoices to lift restrictions
                  on your account.
              status: 402
        description: >-
          Payment required. Organization is on a paid plan and is delinquent on
          payment.
    '403':
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
          unauthorized:
            summary: Forbidden
            value:
              error:
                code: FORBIDDEN
                message: >-
                  Collection exceeds quota. Maximum allowed on your account is
                  1. Currently have 1.
              status: 403
        description: You've exceed your collections quota.
    '409':
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
          collection-name-already-exists:
            summary: Collection name needs to be unique.
            value:
              error:
                code: ALREADY_EXISTS
                message: Resource already exists.
              status: 409
        description: Collection of given name already exists.
    '422':
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
          missing-field:
            summary: Unprocessable entity
            value:
              error:
                code: UNPROCESSABLE_ENTITY
                message: >-
                  Failed to deserialize the JSON body into the target type:
                  missing field `metric` at line 1 column 16
              status: 422
        description: Unprocessable entity. The request body could not be deserialized.
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