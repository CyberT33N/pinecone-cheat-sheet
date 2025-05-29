# Get index stats

> Return statistics about the contents of an index, including the vector count per namespace, the number of dimensions, and the index fullness.

Serverless indexes scale automatically as needed, so index fullness is relevant only for pod-based indexes.

## OpenAPI

````yaml db_data_2025-04.oas post /describe_index_stats
paths:
  path: /describe_index_stats
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
              filter:
                allOf:
                  - description: >-
                      If this parameter is present, the operation only returns
                      statistics for vectors that satisfy the filter. See
                      [Understanding
                      metadata](https://docs.pinecone.io/guides/index-data/indexing-overview#metadata).


                      Serverless indexes do not support filtering
                      `describe_index_stats` by metadata.
                    type: object
            required: true
            description: The request for the `describe_index_stats` operation.
            refIdentifier: '#/components/schemas/DescribeIndexStatsRequest'
        examples:
          example:
            value:
              filter: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              namespaces:
                allOf:
                  - description: >-
                      A mapping for each namespace in the index from the
                      namespace name to a summary of its contents. If a metadata
                      filter expression is present, the summary will reflect
                      only vectors matching that expression.
                    type: object
                    additionalProperties:
                      $ref: '#/components/schemas/NamespaceSummary'
              dimension:
                allOf:
                  - example: 1024
                    description: >-
                      The dimension of the indexed vectors. Not specified if
                      `sparse` index.
                    type: integer
                    format: int64
              indexFullness:
                allOf:
                  - example: 0.4
                    description: >-
                      The fullness of the index, regardless of whether a
                      metadata filter expression was passed. The granularity of
                      this metric is 10%.


                      Serverless indexes scale automatically as needed, so index
                      fullness  is relevant only for pod-based indexes.


                      The index fullness result may be inaccurate during pod
                      resizing; to get the status of a pod resizing process, use
                      [`describe_index`](https://docs.pinecone.io/reference/api/2024-10/control-plane/describe_index).
                    type: number
                    format: float
              totalVectorCount:
                allOf:
                  - example: 80000
                    description: >-
                      The total number of vectors in the index, regardless of
                      whether a metadata filter expression was passed
                    type: integer
                    format: int64
              metric:
                allOf:
                  - example: cosine
                    description: The metric used to measure similarity.
                    type: string
              vectorType:
                allOf:
                  - example: dense
                    description: The type of vectors stored in the index.
                    type: string
            description: The response for the `describe_index_stats` operation.
            refIdentifier: '#/components/schemas/IndexDescription'
            example:
              dimension: 1024
              index_fullness: 0.4
              namespaces:
                '':
                  vectorCount: 50000
                example-namespace-2:
                  vectorCount: 30000
              totalVectorCount: 80000
        examples:
          example:
            value:
              dimension: 1024
              index_fullness: 0.4
              namespaces:
                '':
                  vectorCount: 50000
                example-namespace-2:
                  vectorCount: 30000
              totalVectorCount: 80000
        description: A successful response.
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
    NamespaceSummary:
      description: A summary of the contents of a namespace.
      type: object
      properties:
        vectorCount:
          example: 50000
          description: >-
            The number of vectors stored in this namespace. Note that updates to
            this field may lag behind updates to the underlying index and
            corresponding query results, etc.
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