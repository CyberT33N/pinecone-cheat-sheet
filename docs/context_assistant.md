# Retrieve context from an assistant

> Retrieve context snippets from an assistant to use as part of RAG or any agentic flow.

For guidance and examples, see [Retrieve context snippets](https://docs.pinecone.io/guides/assistant/retrieve-context-snippets).

## OpenAPI

````yaml assistant_data_2025-04.oas POST /chat/{assistant_name}/context
paths:
  path: /chat/{assistant_name}/context
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
              description: The name of the assistant to be described.
          style: simple
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              query:
                allOf:
                  - description: >-
                      The query that is used to generate the context. Exactly
                      one of query or messages should be provided.
                    type: string
              filter:
                allOf:
                  - example:
                      genre:
                        $ne: documentary
                    description: >-
                      Optionally filter which documents can be retrieved using
                      the following metadata fields.
                    type: object
              messages:
                allOf:
                  - description: >-
                      The list of messages to use for generating the context.
                      Exactly one of query or messages should be provided.
                    type: array
                    items:
                      $ref: '#/components/schemas/MessageModel'
              top_k:
                allOf:
                  - example: 20
                    description: >-
                      The maximum number of context snippets to return. Default
                      is 16. Maximum is 64.
                    type: integer
              snippet_size:
                allOf:
                  - example: 4096
                    description: >-
                      The maximum context snippet size. Default is 2048 tokens.
                      Minimum is 512 tokens. Maximum is 8192 tokens.
                    type: integer
            required: true
            description: Parameters to retrieve context from an assistant.
            refIdentifier: '#/components/schemas/ContextRequest'
        examples:
          example:
            value:
              query: <string>
              filter:
                genre:
                  $ne: documentary
              messages:
                - role: <string>
                  content: <string>
              top_k: 20
              snippet_size: 4096
        description: The desired configuration to retrieve context from an assistant.
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - type: string
              snippets:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/SnippetModel'
              usage:
                allOf:
                  - $ref: '#/components/schemas/UsageModel'
            description: The response format containing the context from an assistant.
            refIdentifier: '#/components/schemas/ContextModel'
            requiredProperties:
              - snippets
              - usage
        examples:
          example:
            value:
              id: <string>
              snippets:
                - type: text
                  content: <string>
                  score: 123
                  reference: {}
              usage:
                prompt_tokens: 123
                completion_tokens: 123
                total_tokens: 123
        description: Context retrieval process successful.
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
  schemas:
    TypedReferenceModel:
      description: >-
        The TypedReferenceModel represents a reference for the information
        provided.
      discriminator:
        propertyName: type
      type: object
    UsageModel:
      description: The UsageModel describes the usage of a chat completion.
      type: object
      properties:
        prompt_tokens:
          type: integer
        completion_tokens:
          type: integer
        total_tokens:
          type: integer
    SnippetModel:
      description: >-
        The SnippetModel represents a part of a document that is relevant to the
        user query.
      type: object
      properties:
        type:
          type: string
          enum:
            - text
        content:
          type: string
        score:
          type: number
          format: float
        reference:
          $ref: '#/components/schemas/TypedReferenceModel'
      required:
        - content
        - score
        - reference
    MessageModel:
      description: The MessageModel describes the format of a message in a chat.
      type: object
      properties:
        role:
          description: Role of the message such as 'user' or 'assistant'
          type: string
        content:
          description: Content of the message
          type: string

````