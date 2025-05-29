# Create an API key

> Create a new API key for a project. Developers can use the API key to authenticate requests to Pinecone's Data Plane and Control Plane APIs.


## OpenAPI

````yaml admin_2025-04.oas post /admin/projects/{project_id}/api-keys
paths:
  path: /admin/projects/{project_id}/api-keys
  method: post
  servers:
    - url: https://api.pinecone.io
      description: Production API endpoints
  request:
    security:
      - title: BearerAuth
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
              description: >
                An [access
                token](https://docs.pinecone.io/guides/organizations/manage-service-accounts#retrieve-an-access-token)
                must be provided in the `Authorization` header using the
                `Bearer` scheme.
          cookie: {}
    parameters:
      path:
        project_id:
          schema:
            - type: string
              required: true
              description: Project ID
              format: uuid
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
                  - example: devkey
                    description: >
                      The name of the API key. The name must be 1-80 characters
                      long.
                    type: string
                    minLength: 1
                    maxLength: 80
              roles:
                allOf:
                  - description: >
                      The roles to create the API key with. Default is
                      `["ProjectEditor"]`.
                    type: array
                    items:
                      example: ProjectEditor
                      description: A role that can be assigned to an API key.
                      type: string
                      enum:
                        - ProjectEditor
                        - ProjectViewer
                        - ControlPlaneEditor
                        - ControlPlaneViewer
                        - DataPlaneEditor
                        - DataPlaneViewer
            required: true
            refIdentifier: '#/components/schemas/CreateAPIKeyRequest'
            requiredProperties:
              - name
        examples:
          example:
            value:
              name: devkey
              roles:
                - ProjectEditor
        description: The details of the new API key.
  response:
    '201':
      application/json:
        schemaArray:
          - type: object
            properties:
              key:
                allOf:
                  - $ref: '#/components/schemas/APIKey'
              value:
                allOf:
                  - description: >
                      The value to use as an API key. New keys will have the
                      format `"pckey_<public-label>_<unique-key>"`. The entire
                      string should be used when authenticating.
                    type: string
            description: >
              The details of an API key, including the secret. Only returned on
              API key creation.
            refIdentifier: '#/components/schemas/APIKeyWithSecret'
            requiredProperties:
              - key
              - value
        examples:
          example:
            value:
              key:
                id: 3c90c3cc-0d44-4b50-8888-8dd25736052a
                name: <string>
                project_id: 3c90c3cc-0d44-4b50-8888-8dd25736052a
                roles:
                  - ProjectEditor
              value: <string>
        description: API key created successfully.
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              status:
                allOf:
                  - example: 500
                    description: The HTTP status code of the error.
                    type: integer
              error:
                allOf:
                  - example:
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
            requiredProperties:
              - status
              - error
            example:
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
                  - example: 500
                    description: The HTTP status code of the error.
                    type: integer
              error:
                allOf:
                  - example:
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
            requiredProperties:
              - status
              - error
            example:
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
    '403':
      application/json:
        schemaArray:
          - type: object
            properties:
              status:
                allOf:
                  - example: 500
                    description: The HTTP status code of the error.
                    type: integer
              error:
                allOf:
                  - example:
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
            requiredProperties:
              - status
              - error
            example:
              error:
                code: QUOTA_EXCEEDED
                message: >-
                  The index exceeds the project quota of 5 pods by 2 pods.
                  Upgrade your account or change the project settings to
                  increase the quota.
              status: 429
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
        description: Not enough available quota to complete this operation.
    '500':
      application/json:
        schemaArray:
          - type: object
            properties:
              status:
                allOf:
                  - example: 500
                    description: The HTTP status code of the error.
                    type: integer
              error:
                allOf:
                  - example:
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
            requiredProperties:
              - status
              - error
            example:
              error:
                code: QUOTA_EXCEEDED
                message: >-
                  The index exceeds the project quota of 5 pods by 2 pods.
                  Upgrade your account or change the project settings to
                  increase the quota.
              status: 429
        examples:
          internal-server-error:
            summary: Internal server error
            value:
              error:
                code: UNKNOWN
                message: Internal server error
              status: 500
        description: Internal server error.
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              status:
                allOf:
                  - example: 500
                    description: The HTTP status code of the error.
                    type: integer
              error:
                allOf:
                  - example:
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
            requiredProperties:
              - status
              - error
            example:
              error:
                code: QUOTA_EXCEEDED
                message: >-
                  The index exceeds the project quota of 5 pods by 2 pods.
                  Upgrade your account or change the project settings to
                  increase the quota.
              status: 429
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
        description: Unexpected error on request.
  deprecated: false
  type: path
components:
  schemas:
    APIKey:
      description: The details of an API key, without the secret.
      type: object
      properties:
        id:
          description: The unique ID of the API key.
          type: string
          format: uuid
        name:
          description: The name of the API key.
          type: string
        project_id:
          description: The ID of the project containing the API key.
          type: string
          format: uuid
        roles:
          description: The roles assigned to the API key.
          type: array
          items:
            example: ProjectEditor
            description: A role that can be assigned to an API key.
            type: string
            enum:
              - ProjectEditor
              - ProjectViewer
              - ControlPlaneEditor
              - ControlPlaneViewer
              - DataPlaneEditor
              - DataPlaneViewer
      required:
        - id
        - name
        - project_id
        - roles

````