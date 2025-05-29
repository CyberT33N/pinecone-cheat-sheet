# Get an access token

> Obtain an access token for a service account using the OAuth2 client credentials flow. An access token is needed to authorize requests to the Pinecone Admin API.
The host domain for OAuth endpoints is `login.pinecone.io`.


## OpenAPI

````yaml oauth_2025-04.oas post /oauth/token
paths:
  path: /oauth/token
  method: post
  servers:
    - url: https://login.pinecone.io
  request:
    security: []
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              client_id:
                allOf:
                  - description: |
                      The service account's client ID.
                    type: string
              client_secret:
                allOf:
                  - description: |
                      The service account's client secret.
                    type: string
              grant_type:
                allOf:
                  - description: |
                      The type of grant to use.
                    type: string
                    enum:
                      - client_credentials
              audience:
                allOf:
                  - description: |
                      The audience for the token.
                    type: string
                    enum:
                      - https://api.pinecone.io/
            required: true
            description: A request to obtain an access token.
            refIdentifier: '#/components/schemas/TokenRequest'
            requiredProperties:
              - client_id
              - client_secret
              - grant_type
              - audience
            example:
              audience: https://api.pinecone.io/
              client_id: I1r8m4i6jX9JTFYk0t3q85HWzciEgcA5
              client_secret: EriX...j2ci
              grant_type: client_credentials
        examples:
          example:
            value:
              audience: https://api.pinecone.io/
              client_id: I1r8m4i6jX9JTFYk0t3q85HWzciEgcA5
              client_secret: EriX...j2ci
              grant_type: client_credentials
        description: |
          A request to exchange client credentials for an access token.
      application/x-www-form-urlencoded:
        schemaArray:
          - type: object
            properties:
              client_id:
                allOf:
                  - description: |
                      The service account's client ID.
                    type: string
              client_secret:
                allOf:
                  - description: |
                      The service account's client secret.
                    type: string
              grant_type:
                allOf:
                  - description: |
                      The type of grant to use.
                    type: string
                    enum:
                      - client_credentials
              audience:
                allOf:
                  - description: |
                      The audience for the token.
                    type: string
                    enum:
                      - https://api.pinecone.io/
            required: true
            description: A request to obtain an access token.
            requiredProperties:
              - client_id
              - client_secret
              - grant_type
              - audience
            example:
              audience: https://api.pinecone.io/
              client_id: I1r8m4i6jX9JTFYk0t3q85HWzciEgcA5
              client_secret: EriX...j2ci
              grant_type: client_credentials
        examples:
          example:
            value:
              audience: https://api.pinecone.io/
              client_id: I1r8m4i6jX9JTFYk0t3q85HWzciEgcA5
              client_secret: EriX...j2ci
              grant_type: client_credentials
        description: |
          A request to exchange client credentials for an access token.
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              access_token:
                allOf:
                  - description: The access token.
                    type: string
              token_type:
                allOf:
                  - description: The type of token.
                    type: string
                    enum:
                      - Bearer
              expires_in:
                allOf:
                  - description: The number of seconds until the token expires.
                    type: integer
            description: A response that contains the access token.
            refIdentifier: '#/components/schemas/TokenResponse'
            requiredProperties:
              - access_token
              - token_type
              - expires_in
            example:
              access_token: eyJz93a...k4laUWw
              expires_in: 1800
              token_type: Bearer
        examples:
          example:
            value:
              access_token: eyJz93a...k4laUWw
              expires_in: 1800
              token_type: Bearer
        description: A response that contains the access token.
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - description: A code identifying the error that occurred.
                    type: string
              error_description:
                allOf:
                  - description: A human-readable description of the error.
                    type: string
            description: A response indicating that an error occurred.
            example:
              error: access_denied
              error_description: Unauthorized
        examples:
          example:
            value:
              error: access_denied
              error_description: Unauthorized
        description: Invalid request.
    '401':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - description: A code identifying the error that occurred.
                    type: string
              error_description:
                allOf:
                  - description: A human-readable description of the error.
                    type: string
            description: A response indicating that an error occurred.
            example:
              error: access_denied
              error_description: Unauthorized
        examples:
          example:
            value:
              error: access_denied
              error_description: Unauthorized
        description: Unauthorized.
    '403':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - description: A code identifying the error that occurred.
                    type: string
              error_description:
                allOf:
                  - description: A human-readable description of the error.
                    type: string
            description: A response indicating that an error occurred.
            example:
              error: access_denied
              error_description: Unauthorized
        examples:
          example:
            value:
              error: access_denied
              error_description: Unauthorized
        description: Forbidden.
    '429':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - description: A code identifying the error that occurred.
                    type: string
              error_description:
                allOf:
                  - description: A human-readable description of the error.
                    type: string
            description: A response indicating that an error occurred.
            example:
              error: access_denied
              error_description: Unauthorized
        examples:
          example:
            value:
              error: access_denied
              error_description: Unauthorized
        description: Too many requests.
    '500':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - description: A code identifying the error that occurred.
                    type: string
              error_description:
                allOf:
                  - description: A human-readable description of the error.
                    type: string
            description: A response indicating that an error occurred.
            example:
              error: access_denied
              error_description: Unauthorized
        examples:
          example:
            value:
              error: access_denied
              error_description: Unauthorized
        description: Internal server error.
    '501':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - description: A code identifying the error that occurred.
                    type: string
              error_description:
                allOf:
                  - description: A human-readable description of the error.
                    type: string
            description: A response indicating that an error occurred.
            example:
              error: access_denied
              error_description: Unauthorized
        examples:
          example:
            value:
              error: access_denied
              error_description: Unauthorized
        description: Not implemented.
    '503':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - description: A code identifying the error that occurred.
                    type: string
              error_description:
                allOf:
                  - description: A human-readable description of the error.
                    type: string
            description: A response indicating that an error occurred.
            example:
              error: access_denied
              error_description: Unauthorized
        examples:
          example:
            value:
              error: access_denied
              error_description: Unauthorized
        description: Service unavailable.
  deprecated: false
  type: path
components:
  schemas: {}

````