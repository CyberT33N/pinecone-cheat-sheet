# Generate vectors

> Generate vector embeddings for input data. This endpoint uses Pinecone's [hosted embedding models](https://docs.pinecone.io/guides/index-data/create-an-index#embedding-models).

## OpenAPI

````yaml inference_2025-04.oas post /embed
paths:
  path: /embed
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
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              model:
                allOf:
                  - example: multilingual-e5-large
                    description: >-
                      The
                      [model](https://docs.pinecone.io/guides/index-data/create-an-index#embedding-models)
                      to use for embedding generation.
                    type: string
              parameters:
                allOf:
                  - example:
                      input_type: passage
                      truncate: END
                    description: >-
                      Additional model-specific parameters. Refer to the [model
                      guide](https://docs.pinecone.io/guides/index-data/create-an-index#embedding-models)
                      for available model parameters.
                    type: object
                    additionalProperties: true
              inputs:
                allOf:
                  - description: List of inputs to generate embeddings for.
                    type: array
                    items:
                      type: object
                      properties:
                        text:
                          example: The quick brown fox jumps over the lazy dog.
                          type: string
            refIdentifier: '#/components/schemas/EmbedRequest'
            requiredProperties:
              - model
              - inputs
        examples:
          example:
            value:
              model: multilingual-e5-large
              parameters:
                input_type: passage
                truncate: END
              inputs:
                - text: The quick brown fox jumps over the lazy dog.
        description: Generate embeddings for inputs.
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              model:
                allOf:
                  - example: multilingual-e5-large
                    description: The model used to generate the embeddings
                    type: string
              vector_type:
                allOf:
                  - example: dense
                    description: >-
                      Indicates whether the response data contains 'dense' or
                      'sparse' embeddings.
                    type: string
              data:
                allOf:
                  - description: The embeddings generated for the inputs.
                    type: array
                    items:
                      $ref: '#/components/schemas/Embedding'
              usage:
                allOf:
                  - description: Usage statistics for the model inference.
                    type: object
                    properties:
                      total_tokens:
                        example: 205
                        description: Total number of tokens consumed across all inputs.
                        type: integer
                        format: int32
                        minimum: 0
            description: Embeddings generated for the input.
            refIdentifier: '#/components/schemas/EmbeddingsList'
            requiredProperties:
              - model
              - vector_type
              - data
              - usage
        examples:
          example:
            value:
              model: multilingual-e5-large
              vector_type: dense
              data:
                - values:
                    - 0.1
                    - 0.2
                    - 0.3
                  vector_type: <string>
              usage:
                total_tokens: 205
        description: OK
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
    Embedding:
      description: Embedding of a single input
      discriminator:
        propertyName: vector_type
        mapping:
          dense: '#/components/schemas/DenseEmbedding'
          sparse: '#/components/schemas/SparseEmbedding'
      type: object
      oneOf:
        - $ref: '#/components/schemas/DenseEmbedding'
        - $ref: '#/components/schemas/SparseEmbedding'
    DenseEmbedding:
      description: A dense embedding of a single input
      type: object
      properties:
        values:
          example:
            - 0.1
            - 0.2
            - 0.3
          description: The dense embedding values.
          type: array
          items:
            type: number
            format: float
        vector_type:
          $ref: '#/components/schemas/VectorType'
      required:
        - values
        - vector_type
    VectorType:
      description: Indicates whether this is a 'dense' or 'sparse' embedding.
      type: string
    SparseEmbedding:
      description: A sparse embedding of a single input
      type: object
      properties:
        sparse_values:
          example:
            - 0.1
            - 0.2
            - 0.3
          description: The sparse embedding values.
          type: array
          items:
            type: number
            format: float
        sparse_indices:
          example:
            - 10
            - 3
            - 156
          description: The sparse embedding indices.
          type: array
          items:
            type: integer
            format: int64
            minimum: 0
            maximum: 4294967295
        sparse_tokens:
          example:
            - quick
            - brown
            - fox
          description: The normalized tokens used to create the sparse embedding.
          type: array
          items:
            type: string
        vector_type:
          $ref: '#/components/schemas/VectorType'
      required:
        - sparse_values
        - sparse_indices
        - vector_type

````