# List collections

> List all collections in a project.
Serverless indexes do not support collections.


## OpenAPI

````yaml db_control_2025-04.oas get /collections
paths:
  path: /collections
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
      path: {}
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
              collections:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/CollectionModel'
            description: The list of collections that exist in the project.
            refIdentifier: '#/components/schemas/CollectionList'
        examples:
          multiple-collections:
            summary: Multiple collections with different states
            value:
              collections:
                - dimension: 3
                  environment: us-east1-gcp
                  name: small-collection
                  size: 3126700
                  status: Ready
                  vector_count: 99
                - dimension: 3
                  environment: us-east1-gcp
                  name: small-collection-new
                  size: 3126700
                  status: Initializing
                  vector_count: 99
                - dimension: 1536
                  environment: us-east1-gcp
                  name: big-collection
                  size: 160087040000000
                  status: Ready
                  vector_count: 10000000
          no-collections:
            summary: No collections created yet
            value:
              collections: []
        description: List all the collections in your current project.
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
  schemas:
    CollectionModel:
      description: >-
        The CollectionModel describes the configuration and status of a Pinecone
        collection.
      type: object
      properties:
        name:
          example: example-collection
          description: The name of the collection.
          type: string
        size:
          example: 10000000
          description: The size of the collection in bytes.
          type: integer
          format: int64
        status:
          example: Initializing
          description: The status of the collection.
          type: string
          enum:
            - Initializing
            - Ready
            - Terminating
        dimension:
          example: 1536
          description: >-
            The dimension of the vectors stored in each record held in the
            collection.
          type: integer
          format: int32
          minimum: 1
          maximum: 20000
        vector_count:
          example: 120000
          description: The number of records stored in the collection.
          type: integer
          format: int32
        environment:
          example: us-east1-gcp
          description: The environment where the collection is hosted.
          type: string
      required:
        - name
        - status
        - environment

````