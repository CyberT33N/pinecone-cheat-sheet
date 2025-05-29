# Update a vector

> Update a vector in a namespace. If a value is included, it will overwrite the previous value. If a `set_metadata` is included, the values of the fields specified in it will be added or overwrite the previous value.

For guidance and examples, see [Update data](https://docs.pinecone.io/guides/manage-data/update-data).

## OpenAPI

````yaml db_data_2025-04.oas post /vectors/update
paths:
  path: /vectors/update
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
              id:
                allOf:
                  - example: example-vector-1
                    description: Vector's unique id.
                    type: string
                    required:
                      - id
                    minLength: 1
                    maxLength: 512
              values:
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
                    description: Vector data.
                    type: array
                    items:
                      type: number
                      format: float
                    minLength: 1
                    maxLength: 20000
              sparseValues:
                allOf:
                  - $ref: '#/components/schemas/SparseValues'
              setMetadata:
                allOf:
                  - example:
                      genre: documentary
                      year: 2019
                    description: Metadata to set for the vector.
                    type: object
              namespace:
                allOf:
                  - example: example-namespace
                    description: The namespace containing the vector to update.
                    type: string
            required: true
            description: The request for the `update` operation.
            refIdentifier: '#/components/schemas/UpdateRequest'
            requiredProperties:
              - id
        examples:
          example:
            value:
              id: example-vector-1
              values:
                - 0.1
                - 0.2
                - 0.3
                - 0.4
                - 0.5
                - 0.6
                - 0.7
                - 0.8
              sparseValues:
                indices:
                  - 1
                  - 312
                  - 822
                  - 14
                  - 980
                values:
                  - 0.1
                  - 0.2
                  - 0.3
                  - 0.4
                  - 0.5
              setMetadata:
                genre: documentary
                year: 2019
              namespace: example-namespace
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties: {}
            description: The response for the `update` operation.
            refIdentifier: '#/components/schemas/UpdateResponse'
        examples:
          example:
            value: {}
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
    protobufAny:
      type: object
      properties:
        typeUrl:
          type: string
        value:
          type: string
          format: byte

````