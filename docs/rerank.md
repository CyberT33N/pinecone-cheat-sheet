# Rerank documents

> Rerank results according to their relevance to a query.

For guidance and examples, see [Rerank results](https://docs.pinecone.io/guides/search/rerank-results).

## OpenAPI

````yaml inference_2025-04.oas post /rerank
paths:
  path: /rerank
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
                  - example: bge-reranker-v2-m3
                    description: >-
                      The
                      [model](https://docs.pinecone.io/guides/search/rerank-results#reranking-models)
                      to use for reranking.
                    type: string
              query:
                allOf:
                  - example: What is the capital of France?
                    description: The query to rerank documents against.
                    type: string
              top_n:
                allOf:
                  - example: 5
                    description: >-
                      The number of results to return sorted by relevance.
                      Defaults to the number of inputs.
                    type: integer
              return_documents:
                allOf:
                  - example: true
                    description: Whether to return the documents in the response.
                    default: true
                    type: boolean
              rank_fields:
                allOf:
                  - description: >
                      The field(s) to consider for reranking. If not provided,
                      the default is `["text"]`.


                      The number of fields supported is
                      [model-specific](https://docs.pinecone.io/guides/search/rerank-results#reranking-models).
                    default:
                      - text
                    type: array
                    items:
                      type: string
              documents:
                allOf:
                  - description: The documents to rerank.
                    type: array
                    items:
                      $ref: '#/components/schemas/Document'
              parameters:
                allOf:
                  - example:
                      truncate: END
                    description: >-
                      Additional model-specific parameters. Refer to the [model
                      guide](https://docs.pinecone.io/guides/search/rerank-results#reranking-models)
                      for available model parameters.
                    type: object
                    additionalProperties: true
            refIdentifier: '#/components/schemas/RerankRequest'
            requiredProperties:
              - model
              - documents
              - query
        examples:
          example:
            value:
              model: bge-reranker-v2-m3
              query: What is the capital of France?
              top_n: 5
              return_documents: true
              rank_fields:
                - text
              documents:
                - id: '1'
                  text: Paris is the capital of France.
                  title: France
                  url: https://example.com
              parameters:
                truncate: END
        description: Rerank documents for the given query
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              model:
                allOf:
                  - example: bge-reranker-v2-m3
                    description: The model used to rerank documents.
                    type: string
              data:
                allOf:
                  - description: The reranked documents.
                    type: array
                    items:
                      $ref: '#/components/schemas/RankedDocument'
              usage:
                allOf:
                  - description: Usage statistics for the model inference.
                    type: object
                    properties:
                      rerank_units:
                        example: 1
                        description: The number of rerank units consumed by this operation.
                        type: integer
                        format: int32
                        minimum: 0
            description: The result of a reranking request.
            refIdentifier: '#/components/schemas/RerankResult'
            requiredProperties:
              - model
              - data
              - usage
        examples:
          example:
            value:
              model: bge-reranker-v2-m3
              data:
                - index: 123
                  score: 0.5
                  document:
                    id: '1'
                    text: Paris is the capital of France.
                    title: France
                    url: https://example.com
              usage:
                rerank_units: 1
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
    Document:
      example:
        id: '1'
        text: Paris is the capital of France.
        title: France
        url: https://example.com
      description: Document for reranking
      type: object
      additionalProperties: true
    RankedDocument:
      description: A ranked document with a relevance score and an index position.
      type: object
      properties:
        index:
          description: The index position of the document from the original request.
          type: integer
        score:
          example: 0.5
          description: >-
            The relevance of the document to the query, normalized between 0 and
            1, with scores closer to 1 indicating higher relevance.
          type: number
        document:
          $ref: '#/components/schemas/Document'
      required:
        - index
        - score

````