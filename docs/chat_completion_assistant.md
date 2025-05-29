# Chat through an OpenAI-compatible interface

> Chat with an assistant. This endpoint is based on the OpenAI Chat Completion API, a commonly used and adopted API. 

It is useful if you need inline citations or OpenAI-compatible responses, but has limited functionality compared to the standard chat interface.

For guidance and examples, see [Chat with an assistant](https://docs.pinecone.io/guides/assistant/chat-with-assistant).

## OpenAPI

````yaml assistant_data_2025-04.oas POST /chat/{assistant_name}/chat/completions
paths:
  path: /chat/{assistant_name}/chat/completions
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
              messages:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/MessageModel'
              stream:
                allOf:
                  - description: >-
                      If false, the assistant will return a single JSON
                      response. If true, the assistant will return a stream of
                      responses.
                    default: 'false'
                    type: boolean
              model:
                allOf:
                  - description: The large language model to use for answer generation
                    default: gpt-4o
                    type: string
                    enum:
                      - gpt-4o
                      - claude-3-5-sonnet
              filter:
                allOf:
                  - example:
                      genre:
                        $ne: documentary
                    description: >-
                      Optionally filter which documents can be retrieved using
                      the following metadata fields.
                    type: object
            required: true
            description: The list of queries / chats to chat an assistant
            refIdentifier: '#/components/schemas/SearchCompletions'
            requiredProperties:
              - messages
        examples:
          example:
            value:
              messages:
                - role: <string>
                  content: <string>
              stream: 'false'
              model: gpt-4o
              filter:
                genre:
                  $ne: documentary
        description: The desired configuration to chat an assistant.
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - type: string
              choices:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/ChoiceModel'
              model:
                allOf:
                  - type: string
              usage:
                allOf:
                  - $ref: '#/components/schemas/UsageModel'
            description: >-
              The ChatCompletionModel describes the response format of a chat
              request.
            refIdentifier: '#/components/schemas/ChatCompletionModel'
        examples:
          example:
            value:
              id: <string>
              choices:
                - finish_reason: stop
                  index: 123
                  message:
                    role: <string>
                    content: <string>
              model: <string>
              usage:
                prompt_tokens: 123
                completion_tokens: 123
                total_tokens: 123
        description: Search request successful.
      text/event-stream:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - type: string
              choices:
                allOf:
                  - type: array
                    items:
                      description: >-
                        The ChoiceChunkModel describes a single choice in a chat
                        completion response.
                      x-component-name: ChoiceChunkModel
                      type: object
                      properties:
                        finish_reason:
                          type: string
                          enum:
                            - stop
                            - length
                            - content_filter
                            - function_call
                        index:
                          type: integer
                        delta:
                          description: Chat completion message
                          type: object
                          properties:
                            role:
                              type: string
                            content:
                              type: string
              model:
                allOf:
                  - type: string
            description: >-
              The ChatCompletionModel describes the response format of a chat
              request.
        examples:
          example:
            value:
              id: <string>
              choices:
                - finish_reason: stop
                  index: 123
                  delta:
                    role: <string>
                    content: <string>
              model: <string>
        description: Search request successful.
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
    ChoiceModel:
      description: The ChoiceModel describes a single choice in a chat completion response
      type: object
      properties:
        finish_reason:
          type: string
          enum:
            - stop
            - length
            - content_filter
            - function_call
        index:
          type: integer
        message:
          $ref: '#/components/schemas/MessageModel'

````