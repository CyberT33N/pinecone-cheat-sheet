# List backups for an index

> List all backups for an index.

## OpenAPI

````yaml db_control_2025-04.oas get /indexes/{index_name}/backups
paths:
  path: /indexes/{index_name}/backups
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
        index_name:
          schema:
            - type: string
              required: true
              description: Name of the backed up index
          style: simple
      query:
        limit:
          schema:
            - type: integer
              description: The number of results to return per page.
              maximum: 100
              minimum: 1
              default: 10
          style: form
        paginationToken:
          schema:
            - type: string
              description: The token to use to retrieve the next page of results.
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
                      $ref: '#/components/schemas/BackupModel'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
            description: The list of backups that exist in the project.
            refIdentifier: '#/components/schemas/BackupList'
        examples:
          backups:
            summary: A list containing backups.
            value:
              data:
                - backup_id: bkp_123abc
                  cloud: aws
                  created_at: '2024-03-15T10:30:00.000Z'
                  description: Monthly backup of production index
                  dimension: 1536
                  metric: cosine
                  name: backup_2024_03_15
                  namespace_count: 3
                  record_count: 120000
                  region: us-east-1
                  size_bytes: 10000000
                  source_index_id: idx_456
                  source_index_name: my-index
                  status: Ready
                  tags:
                    environment: production
                    type: monthly
                - backup_id: bkp_789xyz
                  cloud: aws
                  created_at: '2024-03-20T15:45:00.000Z'
                  description: Pre-deployment safety backup
                  dimension: 1536
                  metric: cosine
                  name: backup_2024_03_20
                  namespace_count: 4
                  record_count: 125000
                  region: us-east-1
                  size_bytes: 10500000
                  source_index_id: idx_456
                  source_index_name: my-index
                  status: Ready
                  tags:
                    environment: production
                    type: pre-deploy
              pagination:
                next: dXNlcl9pZD11c2VyXzE=
        description: >-
          This operation returns a list of all the backups that you have
          previously created, and which are associated with the given index.
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
          index-not-found:
            summary: Index not found
            value:
              error:
                code: NOT_FOUND
                message: Index example-index not found.
              status: 404
        description: Index not found.
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
    PaginationResponse:
      example:
        next: dXNlcl9pZD11c2VyXzE=
      description: The pagination object that is returned with paginated responses.
      type: object
      properties:
        next:
          example: dXNlcl9pZD11c2VyXzE=
          description: The token to use to retrieve the next page of results.
          type: string
      required:
        - next
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
    BackupModel:
      description: >-
        The BackupModel describes the configuration and status of a Pinecone
        backup.
      type: object
      properties:
        backup_id:
          example: 670e8400-e29b-41d4-a716-446655440001
          description: Unique identifier for the backup.
          type: string
        source_index_name:
          example: my-index
          description: Name of the index from which the backup was taken.
          type: string
        source_index_id:
          example: 670e8400-e29b-41d4-a716-446655440000
          description: ID of the index.
          type: string
        name:
          example: backup-2025-02-04
          description: Optional user-defined name for the backup.
          type: string
        description:
          example: Backup before bulk update.
          description: Optional description providing context for the backup.
          type: string
        status:
          example: Ready
          description: Current status of the backup (e.g., Initializing, Ready, Failed).
          type: string
        cloud:
          example: aws
          description: Cloud provider where the backup is stored.
          type: string
        region:
          example: us-east-1
          description: Cloud region where the backup is stored.
          type: string
        dimension:
          example: 1536
          description: The dimensions of the vectors to be inserted in the index.
          type: integer
          format: int32
          minimum: 1
          maximum: 20000
        metric:
          description: >-
            The distance metric to be used for similarity search. You can use
            'euclidean', 'cosine', or 'dotproduct'. If the 'vector_type' is
            'sparse', the metric must be 'dotproduct'. If the `vector_type` is
            `dense`, the metric defaults to 'cosine'.
          type: string
          enum:
            - cosine
            - euclidean
            - dotproduct
        record_count:
          example: 120000
          description: Total number of records in the backup.
          type: integer
        namespace_count:
          example: 3
          description: Number of namespaces in the backup.
          type: integer
        size_bytes:
          example: 10000000
          description: Size of the backup in bytes.
          type: integer
        tags:
          $ref: '#/components/schemas/IndexTags'
        created_at:
          description: Timestamp when the backup was created.
          type: string
      required:
        - backup_id
        - source_index_name
        - source_index_id
        - status
        - cloud
        - region

````