# List restore jobs

> List all restore jobs for a project.

## OpenAPI

````yaml db_control_2025-04.oas get /restore-jobs
paths:
  path: /restore-jobs
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
                      $ref: '#/components/schemas/RestoreJobModel'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
            description: The list of restore jobs that exist in the project.
            refIdentifier: '#/components/schemas/RestoreJobList'
            requiredProperties:
              - data
        examples:
          paginated-restore-jobs:
            summary: A list containing restore jobs.
            value:
              data:
                - backup_id: 670e8400-e29b-41d4-a716-446655440000
                  completed_at: '2024-03-15T10:35:00.000Z'
                  created_at: '2024-03-15T10:30:00.000Z'
                  percent_complete: 100
                  restore_job_id: 670e8400-e29b-41d4-a716-446655440001
                  status: Completed
                  target_index_id: idx_456
                  target_index_name: my-index
              pagination:
                next: dXNlcl9pZD11c2VyXzE=
          non-paginated-restore-jobs:
            summary: A list containing restore jobs.
            value:
              data:
                - backup_id: 670e8400-e29b-41d4-a716-446655440000
                  completed_at: '2024-03-15T10:35:00.000Z'
                  created_at: '2024-03-15T10:30:00.000Z'
                  percent_complete: 100
                  restore_job_id: 670e8400-e29b-41d4-a716-446655440001
                  status: Completed
                  target_index_id: idx_456
                  target_index_name: my-index
              pagination: null
          no-restore-jobs:
            summary: An empty list.
            value:
              data: []
              pagination: null
        description: >-
          This operation returns a list of all the restore jobs that you have
          previously created.
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
    RestoreJobModel:
      description: The RestoreJobModel describes the status of a restore job.
      type: object
      properties:
        restore_job_id:
          example: 670e8400-e29b-41d4-a716-446655440001
          description: Unique identifier for the restore job
          type: string
        backup_id:
          example: 670e8400-e29b-41d4-a716-446655440000
          description: Backup used for the restore
          type: string
        target_index_name:
          example: sample-index
          description: Name of the index into which data is being restored
          type: string
        target_index_id:
          example: 670e8400-e29b-41d4-a716-446655440002
          description: ID of the index
          type: string
        status:
          example: Completed
          description: Status of the restore job
          type: string
        created_at:
          example: '2025-02-04T13:00:00.000Z'
          description: Timestamp when the restore job started
          type: string
          format: date-time
        completed_at:
          example: '2025-02-04T14:00:00.000Z'
          description: Timestamp when the restore job finished
          type: string
          format: date-time
        percent_complete:
          example: 42.2
          description: The progress made by the restore job out of 100
          type: number
          format: float
          minimum: 0
          maximum: 100
      required:
        - restore_job_id
        - backup_id
        - target_index_name
        - target_index_id
        - status
        - created_at

````