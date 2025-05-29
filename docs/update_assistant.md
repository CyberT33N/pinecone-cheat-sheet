# Update an assistant

> Update an existing assistant. You can modify the assistant's instructions.

For guidance and examples, see [Manage assistants](https://docs.pinecone.io/guides/assistant/manage-assistants#add-instructions-to-an-assistant).

## OpenAPI

````yaml assistant_control_2025-04.oas PATCH /assistants/{assistant_name}
paths:
  path: /assistants/{assistant_name}
  method: patch
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
              description: The name of the assistant to update.
          style: simple
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
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
            required: true
            description: The configuration updates for the assistant.
        examples:
          example:
            value:
              instructions: <string>
              metadata: {}
        description: The desired configuration updates for the assistant.
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              assistant_name:
                allOf:
                  - type: string
              instructions:
                allOf:
                  - description: >-
                      Description or directive for the assistant to apply to all
                      responses.
                    type: string
              metadata:
                allOf:
                  - type: object
        examples:
          example:
            value:
              assistant_name: <string>
              instructions: <string>
              metadata: {}
        description: Update request successful.
    '400':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Bad Request
        examples: {}
        description: Bad Request
    '401':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Unauthorized
        examples: {}
        description: Unauthorized
    '404':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Assistant not found
        examples: {}
        description: Assistant not found
    '500':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Internal Server Error
        examples: {}
        description: Internal Server Error
  deprecated: false
  type: path
components:
  schemas: {}

````