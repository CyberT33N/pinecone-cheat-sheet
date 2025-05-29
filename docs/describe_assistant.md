# Check assistant status

> Get the status of an assistant.

For guidance and examples, see [Manage assistants](https://docs.pinecone.io/guides/assistant/manage-assistants#get-the-status-of-an-assistant)

## OpenAPI

````yaml assistant_control_2025-04.oas GET /assistants/{assistant_name}
paths:
  path: /assistants/{assistant_name}
  method: get
  servers:
    - url: https://api.pinecone.io/assistant
      description: Production API endpoints
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
              description: The name of the assistant to get a status on.
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
                  - example: example-assistant
                    description: >
                      The name of the assistant. Resource name must be 1-45
                      characters long, start and end with an alphanumeric
                      character, and consist only of lower case alphanumeric
                      characters or '-'.
                    type: string
                    minLength: 1
                    maxLength: 45
              instructions:
                allOf:
                  - nullable: true
                    description: >-
                      Description or directive for the assistant to apply to all
                      responses.
                    type: string
              metadata:
                allOf:
                  - nullable: true
                    type: object
              status:
                allOf:
                  - type: string
                    enum:
                      - Initializing
                      - Failed
                      - Ready
                      - Terminating
                      - InitializationFailed
              host:
                allOf:
                  - description: The host where the assistant is deployed.
                    type: string
              created_at:
                allOf:
                  - type: string
                    format: date-time
              updated_at:
                allOf:
                  - type: string
                    format: date-time
            description: >-
              The AssistantModel describes the configuration and status of a
              Pinecone Assistant.
            refIdentifier: '#/components/schemas/Assistant'
            requiredProperties:
              - name
              - status
        examples:
          example:
            value:
              name: example-assistant
              instructions: <string>
              metadata: {}
              status: Initializing
              host: <string>
              created_at: '2023-11-07T05:31:56Z'
              updated_at: '2023-11-07T05:31:56Z'
        description: Poll request successful.
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