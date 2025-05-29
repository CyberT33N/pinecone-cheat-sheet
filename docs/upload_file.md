# Upload file to assistant

> Upload a file to the specified assistant.

For guidance and examples, see [Manage files](https://docs.pinecone.io/guides/assistant/manage-files#upload-a-local-file).

## OpenAPI

````yaml assistant_data_2025-04.oas POST /files/{assistant_name}
paths:
  path: /files/{assistant_name}
  method: post
  servers:
    - url: https://{assistant_host}
      variables:
        assistant_host:
          type: string
          description: host of the created assistant
          default: unknown
  request:
    security:
      - title: ApiKeyAuth
        parameters:
          query: {}
          header:
            Api-Key:
              type: apiKey
              description: Pinecone API Key
          cookie: {}
    parameters:
      path:
        assistant_name:
          schema:
            - type: string
              required: true
              description: The name of the assistant to upload files to.
          style: simple
      query:
        metadata:
          schema:
            - type: string
              description: Optional JSON-encoded metadata for files.
              format: json
          style: form
      header: {}
      cookie: {}
    body:
      multipart/form-data:
        schemaArray:
          - type: object
            properties:
              file:
                allOf:
                  - description: The file to upload.
                    type: string
                    format: binary
            required: true
            requiredProperties:
              - file
        examples:
          example:
            value: {}
        description: The desired file to be uploaded and processed into the assistant.
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              name:
                allOf:
                  - type: string
              id:
                allOf:
                  - type: string
                    format: uuid
              metadata:
                allOf:
                  - nullable: true
                    type: object
              created_on:
                allOf:
                  - type: string
                    format: date-time
              updated_on:
                allOf:
                  - type: string
                    format: date-time
              status:
                allOf:
                  - type: string
                    enum:
                      - Processing
                      - Available
                      - Deleting
                      - ProcessingFailed
              percent_done:
                allOf:
                  - nullable: true
                    description: The percentage of the file that has been processed
                    type: number
                    format: double
              signed_url:
                allOf:
                  - nullable: true
                    example: https://storage.googleapis.com/bucket/file.pdf
                    description: A signed url that gives you access to the underlying file
                    type: string
              error_message:
                allOf:
                  - nullable: true
                    description: >-
                      A message describing any error during file processing,
                      provided only if an error occurs.
                    type: string
            description: >-
              AssistantFileModel is the response format to a successful file
              upload request.
            refIdentifier: '#/components/schemas/AssistantFileModel'
            requiredProperties:
              - id
              - name
        examples:
          example:
            value:
              name: <string>
              id: 3c90c3cc-0d44-4b50-8888-8dd25736052a
              metadata: {}
              created_on: '2023-11-07T05:31:56Z'
              updated_on: '2023-11-07T05:31:56Z'
              status: Processing
              percent_done: 123
              signed_url: https://storage.googleapis.com/bucket/file.pdf
              error_message: <string>
        description: File upload has been accepted.
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
                        Uploaded file can only currently be either a pdf or txt
                        file
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
          files-validation-error:
            summary: Validation error on ingest.
            value:
              error:
                code: INVALID_ARGUMENT
                message: Uploaded file can only currently be either a pdf or txt file
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
          assistant-not-found:
            summary: Assistant not found.
            value:
              error:
                code: NOT_FOUND
                message: Assistant "example-assistant" not found.
              status: 404
        description: Assistant not found.
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