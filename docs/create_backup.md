# Create a backup of an index

> Create a backup of an index.


## OpenAPI

````yaml db_control_2025-04.oas post /indexes/{index_name}/backups
paths:
  path: /indexes/{index_name}/backups
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
      path:
        index_name:
          schema:
            - type: string
              required: true
              description: Name of the index to backup
          style: simple
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
                  - description: The name of the backup.
                    type: string
              description:
                allOf:
                  - description: A description of the backup.
                    type: string
            required: true
            description: The configuration needed to create a backup of an index.
            refIdentifier: '#/components/schemas/CreateBackupRequest'
        examples:
          backup-index-no-name:
            summary: Creating a backup of an index with no name
            value: {}
          backup-index-with-name:
            summary: Creating a backup of an index with a name
            value:
              name: backup-index
          backup-index-with-name-and-description:
            summary: Creating a backup of an index with a name and description
            value:
              description: Backup of the index
              name: backup-index
        description: The desired configuration for the backup.
  response:
    '201':
      application/json:
        schemaArray:
          - type: object
            properties:
              backup_id:
                allOf:
                  - example: 670e8400-e29b-41d4-a716-446655440001
                    description: Unique identifier for the backup.
                    type: string
              source_index_name:
                allOf:
                  - example: my-index
                    description: Name of the index from which the backup was taken.
                    type: string
              source_index_id:
                allOf:
                  - example: 670e8400-e29b-41d4-a716-446655440000
                    description: ID of the index.
                    type: string
              name:
                allOf:
                  - example: backup-2025-02-04
                    description: Optional user-defined name for the backup.
                    type: string
              description:
                allOf:
                  - example: Backup before bulk update.
                    description: Optional description providing context for the backup.
                    type: string
              status:
                allOf:
                  - example: Ready
                    description: >-
                      Current status of the backup (e.g., Initializing, Ready,
                      Failed).
                    type: string
              cloud:
                allOf:
                  - example: aws
                    description: Cloud provider where the backup is stored.
                    type: string
              region:
                allOf:
                  - example: us-east-1
                    description: Cloud region where the backup is stored.
                    type: string
              dimension:
                allOf:
                  - example: 1536
                    description: The dimensions of the vectors to be inserted in the index.
                    type: integer
                    format: int32
                    minimum: 1
                    maximum: 20000
              metric:
                allOf:
                  - description: >-
                      The distance metric to be used for similarity search. You
                      can use 'euclidean', 'cosine', or 'dotproduct'. If the
                      'vector_type' is 'sparse', the metric must be
                      'dotproduct'. If the `vector_type` is `dense`, the metric
                      defaults to 'cosine'.
                    type: string
                    enum:
                      - cosine
                      - euclidean
                      - dotproduct
              record_count:
                allOf:
                  - example: 120000
                    description: Total number of records in the backup.
                    type: integer
              namespace_count:
                allOf:
                  - example: 3
                    description: Number of namespaces in the backup.
                    type: integer
              size_bytes:
                allOf:
                  - example: 10000000
                    description: Size of the backup in bytes.
                    type: integer
              tags:
                allOf:
                  - $ref: '#/components/schemas/IndexTags'
              created_at:
                allOf:
                  - description: Timestamp when the backup was created.
                    type: string
            description: >-
              The BackupModel describes the configuration and status of a
              Pinecone backup.
            refIdentifier: '#/components/schemas/BackupModel'
            requiredProperties:
              - backup_id
              - source_index_name
              - source_index_id
              - status
              - cloud
              - region
        examples:
          example:
            value:
              backup_id: 670e8400-e29b-41d4-a716-446655440001
              source_index_name: my-index
              source_index_id: 670e8400-e29b-41d4-a716-446655440000
              name: backup-2025-02-04
              description: Backup before bulk update.
              status: Ready
              cloud: aws
              region: us-east-1
              dimension: 1536
              metric: cosine
              record_count: 120000
              namespace_count: 3
              size_bytes: 10000000
              tags:
                tag0: val0
                tag1: val1
              created_at: <string>
        description: The backup has been successfully created.
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
                message: Increase your quota or upgrade to create more backups.
              status: 403
        description: You've exceed your backup quota.
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
  schemas:
    IndexTags:
      example:
        tag0: val0
        tag1: val1
      description: >-
        Custom user tags added to an index. Keys must be 80 characters or less.
        Values must be 120 characters or less. Keys must be alphanumeric, '_',
        or '-'.  Values must be alphanumeric, ';', '@', '_', '-', '.', '+', or '
        '. To unset a key, set the value to be an empty string.
      type: object
      additionalProperties:
        type: string

````