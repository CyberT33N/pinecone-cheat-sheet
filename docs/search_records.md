# Search with text

> Search a namespace with a query text, query vector, or record ID and return the most similar records, along with their similarity scores. Optionally, rerank the initial results based on their relevance to the query. 

Searching with text is supported only for [indexes with integrated embedding](https://docs.pinecone.io/guides/indexes/create-an-index#integrated-embedding). Searching with a query vector or record ID is supported for all indexes. 

For guidance and examples, see [Search](https://docs.pinecone.io/guides/search/semantic-search).

## OpenAPI

````yaml db_data_2025-04.oas post /records/namespaces/{namespace}/search
paths:
  path: /records/namespaces/{namespace}/search
  method: post
  servers:
    - url: https://{index_host}
      variables:
        index_host:
          type: string
          description: host of the index
          default: unknown
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
      path:
        namespace:
          schema:
            - type: string
              required: true
              description: The namespace to search.
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
                  - description: .
                    type: object
                    properties:
                      top_k:
                        example: 10
                        description: The number of similar records to return.
                        type: integer
                        format: int32
                      filter:
                        description: >-
                          The filter to apply. You can use vector metadata to
                          limit your search. See [Understanding
                          metadata](https://docs.pinecone.io/guides/index-data/indexing-overview#metadata).
                        type: object
                      inputs:
                        $ref: '#/components/schemas/EmbedInputs'
                      vector:
                        $ref: '#/components/schemas/SearchRecordsVector'
                      id:
                        example: example-vector-1
                        description: >-
                          The unique ID of the vector to be used as a query
                          vector.
                        type: string
                        maxLength: 512
                    required:
                      - top_k
              fields:
                allOf:
                  - example:
                      - chunk_text
                    description: >-
                      The fields to return in the search results. If not
                      specified, the response will include all fields.
                    type: array
                    items:
                      type: string
                    maxLength: 100
              rerank:
                allOf:
                  - description: Parameters for reranking the initial search results.
                    type: object
                    properties:
                      model:
                        example: bge-reranker-v2-m3
                        description: >-
                          The name of the [reranking
                          model](https://docs.pinecone.io/guides/search/rerank-results#reranking-models)
                          to use.
                        type: string
                      rank_fields:
                        example:
                          - chunk_text
                          - title
                        description: >
                          The field(s) to consider for reranking. If not
                          provided, the default is `["text"]`.


                          The number of fields supported is
                          [model-specific](https://docs.pinecone.io/guides/search/rerank-results#reranking-models).
                        type: array
                        items:
                          type: string
                      top_n:
                        example: 5
                        description: >-
                          The number of top results to return after reranking.
                          Defaults to top_k.
                        type: integer
                        format: int32
                      parameters:
                        example:
                          truncate: END
                        description: >-
                          Additional model-specific parameters. Refer to the
                          [model
                          guide](https://docs.pinecone.io/guides/search/rerank-results#reranking-models)
                          for available model parameters.
                        type: object
                        additionalProperties: true
                      query:
                        example: What is the capital of France?
                        description: >-
                          The query to rerank documents against. If a specific
                          rerank query is specified,  it overwrites the query
                          input that was provided at the top level.
                        type: string
                    required:
                      - model
                      - rank_fields
            required: true
            description: A search request for records in a specific namespace.
            refIdentifier: '#/components/schemas/SearchRecordsRequest'
            requiredProperties:
              - query
            example:
              fields:
                - chunk_text
              query:
                inputs:
                  text: your query text
                top_k: 10
        examples:
          example:
            value:
              fields:
                - chunk_text
              query:
                inputs:
                  text: your query text
                top_k: 10
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              result:
                allOf:
                  - type: object
                    properties:
                      hits:
                        description: The hits for the search document request.
                        type: array
                        items:
                          $ref: '#/components/schemas/Hit'
                    required:
                      - hits
              usage:
                allOf:
                  - $ref: '#/components/schemas/SearchUsage'
            description: The records search response.
            refIdentifier: '#/components/schemas/SearchRecordsResponse'
            requiredProperties:
              - usage
              - result
            example:
              result:
                hits:
                  - _id: example-record-1
                    _score: 0.9281134605407715
                    fields:
                      data: your example text
              usage:
                embed_total_tokens: 10
                read_units: 5
        examples:
          example:
            value:
              result:
                hits:
                  - _id: example-record-1
                    _score: 0.9281134605407715
                    fields:
                      data: your example text
              usage:
                embed_total_tokens: 10
                read_units: 5
        description: A successful search namespace response.
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - &ref_0
                    type: integer
                    format: int32
              message:
                allOf:
                  - &ref_1
                    type: string
              details:
                allOf:
                  - &ref_2
                    type: array
                    items:
                      $ref: '#/components/schemas/protobufAny'
            refIdentifier: '#/components/schemas/rpcStatus'
        examples:
          example:
            value:
              code: 123
              message: <string>
              details:
                - typeUrl: <string>
                  value: aSDinaTvuI8gbWludGxpZnk=
        description: Bad request. The request body included invalid request parameters.
    4XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - *ref_0
              message:
                allOf:
                  - *ref_1
              details:
                allOf:
                  - *ref_2
            refIdentifier: '#/components/schemas/rpcStatus'
        examples:
          example:
            value:
              code: 123
              message: <string>
              details:
                - typeUrl: <string>
                  value: aSDinaTvuI8gbWludGxpZnk=
        description: An unexpected error response.
    5XX:
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - *ref_0
              message:
                allOf:
                  - *ref_1
              details:
                allOf:
                  - *ref_2
            refIdentifier: '#/components/schemas/rpcStatus'
        examples:
          example:
            value:
              code: 123
              message: <string>
              details:
                - typeUrl: <string>
                  value: aSDinaTvuI8gbWludGxpZnk=
        description: An unexpected error response.
  deprecated: false
  type: path
components:
  schemas:
    Hit:
      example:
        _id: example-record-1
        _score: 0.9281134605407715
        fields:
          data: your example text
          more_data:
            text: your example text
      description: A record whose vector values are similar to the provided search query.
      type: object
      properties:
        _id:
          description: The record id of the search hit.
          type: string
        _score:
          description: The similarity score of the returned record.
          type: number
          format: float
        fields:
          description: The selected record fields associated with the search hit.
          type: object
      required:
        - _id
        - _score
        - fields
    SearchUsage:
      type: object
      properties:
        read_units:
          example: 5
          description: The number of read units consumed by this operation.
          type: integer
          format: int32
          minimum: 0
        embed_total_tokens:
          example: 2
          description: The number of embedding tokens consumed by this operation.
          type: integer
          format: int32
          minimum: 0
        rerank_units:
          example: 1
          description: The number of rerank units consumed by this operation.
          type: integer
          format: int32
          minimum: 0
      required:
        - read_units
    EmbedInputs:
      example:
        text: chunk_text
      type: object
    VectorValues:
      description: This is the vector data included in the request.
      type: array
      items:
        type: number
        format: float
      minLength: 1
      maxLength: 20000
    SearchRecordsVector:
      type: object
      properties:
        values:
          $ref: '#/components/schemas/VectorValues'
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
            format: int32
            minimum: 0
    protobufAny:
      type: object
      properties:
        typeUrl:
          type: string
        value:
          type: string
          format: byte

````