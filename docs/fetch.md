# Fetch vectors

> Look up and return vectors by ID from a single namespace. The returned vectors include the vector data and/or metadata.

For guidance and examples, see [Fetch data](https://docs.pinecone.io/guides/manage-data/fetch-data).

## OpenAPI

````yaml db_data_2025-04.oas get /vectors/fetch
paths:
  path: /vectors/fetch
  method: get
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
      query:
        ids:
          schema:
            - type: array
              items:
                allOf:
                  - type: string
              required: true
              description: >-
                The vector IDs to fetch. Does not accept values containing
                spaces.
          style: form
          explode: true
        namespace:
          schema:
            - type: string
          style: form
      header: {}
      cookie: {}
    body: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              vectors:
                allOf:
                  - title: >-
                      The fetched vectors, in the form of a map between the
                      fetched ids and the fetched vectors
                    type: object
                    additionalProperties:
                      $ref: '#/components/schemas/Vector'
              namespace:
                allOf:
                  - example: example-namespace
                    description: The namespace of the vectors.
                    type: string
              usage:
                allOf:
                  - $ref: '#/components/schemas/Usage'
            description: The response for the `fetch` operation.
            refIdentifier: '#/components/schemas/FetchResponse'
            example:
              namespace: example-namespace
              usage:
                readUnits: 1
              vectors:
                id-1:
                  id: id-1
                  values:
                    - 1
                    - 1.5
                id-2:
                  id: id-2
                  values:
                    - 2
                    - 1
        examples:
          example:
            value:
              namespace: example-namespace
              usage:
                readUnits: 1
              vectors:
                id-1:
                  id: id-1
                  values:
                    - 1
                    - 1.5
                id-2:
                  id: id-2
                  values:
                    - 2
                    - 1
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
    Vector:
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
          description: This is the vector data included in the request.
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
        metadata:
          example:
            genre: documentary
            year: 2019
          description: This is the metadata included in the request.
          type: object
      required:
        - id
    protobufAny:
      type: object
      properties:
        typeUrl:
          type: string
        value:
          type: string
          format: byte

````