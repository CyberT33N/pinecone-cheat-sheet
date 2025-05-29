# Search with a vector

> Search a namespace using a query vector. It retrieves the ids of the most similar items in a namespace, along with their similarity scores.

For guidance and examples, see [Search](https://docs.pinecone.io/guides/search/semantic-search).

## OpenAPI

````yaml db_data_2025-04.oas post /query
paths:
  path: /query
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
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              namespace:
                allOf:
                  - example: example-namespace
                    description: The namespace to query.
                    type: string
              topK:
                allOf:
                  - example: 10
                    description: The number of results to return for each query.
                    type: integer
                    minimum: 1
                    maximum: 10000
                    required:
                      - top_k
                    format: int64
              filter:
                allOf:
                  - example:
                      genre:
                        $in:
                          - comedy
                          - documentary
                          - drama
                      year:
                        $eq: 2019
                    description: >-
                      The filter to apply. You can use vector metadata to limit
                      your search. See [Understanding
                      metadata](https://docs.pinecone.io/guides/index-data/indexing-overview#metadata).
                    type: object
              includeValues:
                allOf:
                  - example: true
                    description: >-
                      Indicates whether vector values are included in the
                      response.
                    default: 'false'
                    type: boolean
              includeMetadata:
                allOf:
                  - example: true
                    description: >-
                      Indicates whether metadata is included in the response as
                      well as the ids.
                    default: 'false'
                    type: boolean
              queries:
                allOf:
                  - deprecated: true
                    description: DEPRECATED. Use `vector` or `id` instead.
                    type: array
                    items:
                      $ref: '#/components/schemas/QueryVector'
                    minLength: 1
                    maxLength: 10
              vector:
                allOf:
                  - example:
                      - 0.1
                      - 0.2
                      - 0.3
                      - 0.4
                      - 0.5
                      - 0.6
                      - 0.7
                      - 0.8
                    description: >-
                      The query vector. This should be the same length as the
                      dimension of the index being queried. Each `query` request
                      can contain only one of the parameters `id` or `vector`.
                    type: array
                    items:
                      type: number
                      format: float
                    minLength: 1
                    maxLength: 20000
              sparseVector:
                allOf:
                  - $ref: '#/components/schemas/SparseValues'
              id:
                allOf:
                  - example: example-vector-1
                    description: >-
                      The unique ID of the vector to be used as a query vector.
                      Each request  can contain either the `vector` or `id`
                      parameter.
                    type: string
                    maxLength: 512
            required: true
            description: The request for the `query` operation.
            refIdentifier: '#/components/schemas/QueryRequest'
            requiredProperties:
              - topK
        examples:
          example:
            value:
              namespace: example-namespace
              topK: 10
              filter:
                genre:
                  $in:
                    - comedy
                    - documentary
                    - drama
                year:
                  $eq: 2019
              includeValues: true
              includeMetadata: true
              queries:
                - values:
                    - 0.1
                    - 0.2
                    - 0.3
                    - 0.4
                    - 0.5
                    - 0.6
                    - 0.7
                    - 0.8
                  sparseValues:
                    indices: &ref_0
                      - 1
                      - 312
                      - 822
                      - 14
                      - 980
                    values: &ref_1
                      - 0.1
                      - 0.2
                      - 0.3
                      - 0.4
                      - 0.5
                  topK: 10
                  namespace: example-namespace
                  filter:
                    genre:
                      $in:
                        - comedy
                        - documentary
                        - drama
                    year:
                      $eq: 2019
              vector:
                - 0.1
                - 0.2
                - 0.3
                - 0.4
                - 0.5
                - 0.6
                - 0.7
                - 0.8
              sparseVector:
                indices: *ref_0
                values: *ref_1
              id: example-vector-1
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              results:
                allOf:
                  - deprecated: true
                    description: >-
                      DEPRECATED. The results of each query. The order is the
                      same as `QueryRequest.queries`.
                    type: array
                    items:
                      $ref: '#/components/schemas/SingleQueryResults'
              matches:
                allOf:
                  - description: The matches for the vectors.
                    type: array
                    items:
                      $ref: '#/components/schemas/ScoredVector'
              namespace:
                allOf:
                  - description: The namespace for the vectors.
                    type: string
              usage:
                allOf:
                  - $ref: '#/components/schemas/Usage'
            description: >-
              The response for the `query` operation. These are the matches
              found for a particular query vector. The matches are ordered from
              most similar to least similar.
            refIdentifier: '#/components/schemas/QueryResponse'
        examples:
          example:
            value:
              results:
                - matches:
                    - id: example-vector-1
                      score: 0.08
                      values: &ref_2
                        - 0.1
                        - 0.2
                        - 0.3
                        - 0.4
                        - 0.5
                        - 0.6
                        - 0.7
                        - 0.8
                      sparseValues:
                        indices: &ref_3
                          - 1
                          - 312
                          - 822
                          - 14
                          - 980
                        values: &ref_4
                          - 0.1
                          - 0.2
                          - 0.3
                          - 0.4
                          - 0.5
                      metadata: &ref_5
                        genre: documentary
                        year: 2019
                  namespace: example-namespace
              matches:
                - id: example-vector-1
                  score: 0.08
                  values: *ref_2
                  sparseValues:
                    indices: *ref_3
                    values: *ref_4
                  metadata: *ref_5
              namespace: <string>
              usage:
                readUnits: 5
        description: A successful response.
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - &ref_6
                    type: integer
                    format: int32
              message:
                allOf:
                  - &ref_7
                    type: string
              details:
                allOf:
                  - &ref_8
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
                  - *ref_6
              message:
                allOf:
                  - *ref_7
              details:
                allOf:
                  - *ref_8
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
                  - *ref_6
              message:
                allOf:
                  - *ref_7
              details:
                allOf:
                  - *ref_8
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
    QueryVector:
      deprecated: true
      description: A single query vector within a `QueryRequest`.
      type: object
      properties:
        values:
          example:
            - 0.1
            - 0.2
            - 0.3
            - 0.4
            - 0.5
            - 0.6
            - 0.7
            - 0.8
          description: >-
            The query vector values. This should be the same length as the
            dimension of the index being queried.
          type: array
          required:
            - values
          items:
            type: number
            format: float
          minLength: 1
          maxLength: 20000
        sparseValues:
          $ref: '#/components/schemas/SparseValues'
        topK:
          example: 10
          description: >-
            An override for the number of results to return for this query
            vector.
          type: integer
          format: int64
          minimum: 1
          maximum: 10000
        namespace:
          example: example-namespace
          description: An override the namespace to search.
          type: string
        filter:
          example:
            genre:
              $in:
                - comedy
                - documentary
                - drama
            year:
              $eq: 2019
          description: >-
            An override for the metadata filter to apply. This replaces the
            request-level filter.
          type: object
      required:
        - values
    ScoredVector:
      type: object
      properties:
        id:
          example: example-vector-1
          description: This is the vector's unique id.
          type: string
          required:
            - id
          minLength: 1
          maxLength: 512
        score:
          example: 0.08
          description: >-
            This is a measure of similarity between this vector and the query
            vector.  The higher the score, the more they are similar.
          type: number
          format: float
        values:
          example:
            - 0.1
            - 0.2
            - 0.3
            - 0.4
            - 0.5
            - 0.6
            - 0.7
            - 0.8
          description: This is the vector data, if it is requested.
          type: array
          items:
            type: number
            format: float
        sparseValues:
          $ref: '#/components/schemas/SparseValues'
        metadata:
          example:
            genre: documentary
            year: 2019
          description: This is the metadata, if it is requested.
          type: object
      required:
        - id
    SingleQueryResults:
      title: The query results for a single `QueryVector`
      type: object
      properties:
        matches:
          description: The matches for the vectors.
          type: array
          items:
            $ref: '#/components/schemas/ScoredVector'
        namespace:
          example: example-namespace
          description: The namespace for the vectors.
          type: string
    SparseValues:
      description: >-
        Vector sparse data. Represented as a list of indices and a list of 
        corresponded values, which must be with the same length.
      type: object
      properties:
        indices:
          example:
            - 1
            - 312
            - 822
            - 14
            - 980
          description: The indices of the sparse data.
          type: array
          required:
            - indices
          items:
            type: integer
            format: int64
          minLength: 1
          maxLength: 1000
        values:
          example:
            - 0.1
            - 0.2
            - 0.3
            - 0.4
            - 0.5
          description: >-
            The corresponding values of the sparse data, which must be with the
            same length as the indices.
          type: array
          required:
            - values
          items:
            type: number
            format: float
          minLength: 1
          maxLength: 1000
      required:
        - indices
        - values
    Usage:
      type: object
      properties:
        readUnits:
          example: 5
          description: The number of read units consumed by this operation.
          type: integer
          format: int64
    protobufAny:
      type: object
      properties:
        typeUrl:
          type: string
        value:
          type: string
          format: byte

````