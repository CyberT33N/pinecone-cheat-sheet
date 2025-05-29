# Create an index from a backup

> Create an index from a backup.

## OpenAPI

````yaml db_control_2025-04.oas post /backups/{backup_id}/create-index
paths:
  path: /backups/{backup_id}/create-index
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
        backup_id:
          schema:
            - type: string
              required: true
              description: The ID of the backup to create an index from.
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
                  - example: example-index
                    description: >
                      The name of the index. Resource name must be 1-45
                      characters long, start and end with an alphanumeric
                      character, and consist only of lower case alphanumeric
                      characters or '-'.
                    type: string
                    minLength: 1
                    maxLength: 45
              tags:
                allOf:
                  - $ref: '#/components/schemas/IndexTags'
              deletion_protection:
                allOf:
                  - $ref: '#/components/schemas/DeletionProtection'
            required: true
            description: The configuration needed to create a Pinecone index from a backup.
            refIdentifier: '#/components/schemas/CreateIndexFromBackupRequest'
            requiredProperties:
              - name
        examples:
          example:
            value:
              name: example-index
              tags:
                tag0: val0
                tag1: val1
              deletion_protection: disabled
        description: The desired configuration for the index created from a backup.
  response:
    '202':
      application/json:
        schemaArray:
          - type: object
            properties:
              restore_job_id:
                allOf:
                  - example: 670e8400-e29b-41d4-a716-446655440000
                    description: The ID of the restore job that was created.
                    type: string
              index_id:
                allOf:
                  - example: 123e4567-e89b-12d3-a456-426614174000
                    description: The ID of the index that was created from the backup.
                    type: string
            description: The response for creating an index from a backup.
            refIdentifier: '#/components/schemas/CreateIndexFromBackupResponse'
            requiredProperties:
              - restore_job_id
              - index_id
        examples:
          example:
            value:
              restore_job_id: 670e8400-e29b-41d4-a716-446655440000
              index_id: 123e4567-e89b-12d3-a456-426614174000
        description: The request to create the index has been accepted.
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
                message: Increase your quota or upgrade to create more indexes.
              status: 403
        description: You've exceed your pod quota.
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
          backup-not-found:
            summary: Backup not found
            value:
              error:
                code: NOT_FOUND
                message: Backup bkp_123abc not found.
              status: 404
        description: Backup not found.
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
          example:
            value:
              error:
                code: QUOTA_EXCEEDED
                message: >-
                  The index exceeds the project quota of 5 pods by 2 pods.
                  Upgrade your account or change the project settings to
                  increase the quota.
              status: 429
        description: Index of given name already exists.
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
    DeletionProtection:
      description: >
        Whether [deletion
        protection](http://docs.pinecone.io/guides/manage-data/manage-indexes#configure-deletion-protection)
        is enabled/disabled for the index.
      default: disabled
      type: string
      enum:
        - disabled
        - enabled

````