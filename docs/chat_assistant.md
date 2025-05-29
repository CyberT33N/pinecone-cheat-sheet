# Chat with an assistant

> Chat with an assistant and get back citations in structured form. 

This is the recommended way to chat with an assistant, as it offers more functionality and control over the assistant's responses and references than the OpenAI-compatible chat interface.

For guidance and examples, see [Chat with an assistant](https://docs.pinecone.io/guides/assistant/chat-with-assistant).

## OpenAPI

````yaml assistant_data_2025-04.oas POST /chat/{assistant_name}
paths:
  path: /chat/{assistant_name}
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
              json_response:
                allOf:
                  - description: >-
                      If true, the assistant will be instructed to return a JSON
                      response. Cannot be used with streaming.
                    default: 'false'
                    type: boolean
              include_highlights:
                allOf:
                  - description: >-
                      If true, the assistant will be instructed to return
                      highlights from the referenced documents that support its
                      response.
                    default: 'false'
                    type: boolean
              context_options:
                allOf:
                  - $ref: '#/components/schemas/ContextOptionsModel'
            required: true
            description: The list of queries / chats to chat an assistant
            refIdentifier: '#/components/schemas/Chat'
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
              json_response: 'false'
              include_highlights: 'false'
              context_options:
                top_k: 20
                snippet_size: 4096
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
              finish_reason:
                allOf:
                  - type: string
                    enum:
                      - stop
                      - length
                      - content_filter
                      - function_call
              message:
                allOf:
                  - $ref: '#/components/schemas/MessageModel'
              model:
                allOf:
                  - type: string
              citations:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/CitationModel'
              usage:
                allOf:
                  - $ref: '#/components/schemas/UsageModel'
            description: >-
              The ChatModel describes the response format of a chat request from
              the citation api.
            refIdentifier: '#/components/schemas/ChatModel'
        examples:
          example:
            value:
              id: <string>
              finish_reason: stop
              message:
                role: <string>
                content: <string>
              model: <string>
              citations:
                - position: 123
                  references:
                    - file:
                        name: <string>
                        id: 3c90c3cc-0d44-4b50-8888-8dd25736052a
                        metadata: {}
                        created_on: '2023-11-07T05:31:56Z'
                        updated_on: '2023-11-07T05:31:56Z'
                        status: Processing
                        percent_done: 123
                        signed_url: https://storage.googleapis.com/bucket/file.pdf
                        error_message: <string>
                      pages:
                        - 123
                      highlight:
                        type: <string>
                        content: <string>
              usage:
                prompt_tokens: 123
                completion_tokens: 123
                total_tokens: 123
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
    ContextOptionsModel:
      description: Controls the context snippets sent to the LLM.
      type: object
      properties:
        top_k:
          example: 20
          description: >-
            The maximum number of context snippets to use. Default is 16.
            Maximum is 64.
          type: integer
        snippet_size:
          example: 4096
          description: >-
            The maximum context snippet size. Default is 2048 tokens. Minimum is
            512 tokens. Maximum is 8192 tokens.
          type: integer
    CitationModel:
      description: >-
        The CitationModel describes a single cited source returned by a chat
        request.
      type: object
      properties:
        position:
          description: The index position of the citation in the complete text response.
          type: integer
        references:
          type: array
          items:
            $ref: '#/components/schemas/ReferenceModel'
    HighlightModel:
      nullable: true
      description: >-
        The HighlightModel represents a portion of a referenced document that
        directly supports or is relevant to the response.
      type: object
      properties:
        type:
          description: The type of the highlight. Currently it is always text.
          type: string
        content:
          type: string
      required:
        - type
        - content
    ReferenceModel:
      description: The ReferenceModel describes a single reference in a citation.
      type: object
      properties:
        file:
          $ref: '#/components/schemas/AssistantFileModel'
        pages:
          type: array
          items:
            type: integer
        highlight:
          $ref: '#/components/schemas/HighlightModel'
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
    AssistantFileModel:
      description: >-
        AssistantFileModel is the response format to a successful file upload
        request.
      type: object
      properties:
        name:
          type: string
        id:
          type: string
          format: uuid
        metadata:
          nullable: true
          type: object
        created_on:
          type: string
          format: date-time
        updated_on:
          type: string
          format: date-time
        status:
          type: string
          enum:
            - Processing
            - Available
            - Deleting
            - ProcessingFailed
        percent_done:
          nullable: true
          description: The percentage of the file that has been processed
          type: number
          format: double
        signed_url:
          nullable: true
          example: https://storage.googleapis.com/bucket/file.pdf
          description: A signed url that gives you access to the underlying file
          type: string
        error_message:
          nullable: true
          description: >-
            A message describing any error during file processing, provided only
            if an error occurs.
          type: string
      required:
        - id
        - name

````