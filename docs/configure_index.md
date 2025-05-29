# Configure an index

> Configure an existing index. For serverless indexes, you can configure index deletion protection, tags, and integrated inference embedding settings for the index. For pod-based indexes, you can configure the pod size, number of replicas, tags, and index deletion protection.

It is not possible to change the pod type of a pod-based index. However, you can create a collection from a pod-based index and then [create a new pod-based index with a different pod type](http://docs.pinecone.io/guides/indexes/pods/create-a-pod-based-index#create-a-pod-index-from-a-collection) from the collection. For guidance and examples, see [Configure an index](http://docs.pinecone.io/guides/indexes/pods/manage-pod-based-indexes).

## OpenAPI

````yaml db_control_2025-04.oas patch /indexes/{index_name}
paths:
  path: /indexes/{index_name}
  method: patch
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
      path:
        index_name:
          schema:
            - type: string
              required: true
              description: The name of the index to configure.
          style: simple
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              spec:
                allOf:
                  - type: object
                    properties:
                      pod:
                        type: object
                        properties:
                          replicas:
                            description: >-
                              The number of replicas. Replicas duplicate your
                              index. They provide higher availability and
                              throughput. Replicas can be scaled up or down as
                              your needs change.
                            default: 1
                            type: integer
                            format: int32
                            minimum: 1
                          pod_type:
                            description: >-
                              The type of pod to use. One of `s1`, `p1`, or `p2`
                              appended with `.` and one of `x1`, `x2`, `x4`, or
                              `x8`.
                            default: p1.x1
                            type: string
                    required:
                      - pod
              deletion_protection:
                allOf:
                  - $ref: '#/components/schemas/DeletionProtection'
              tags:
                allOf:
                  - $ref: '#/components/schemas/IndexTags'
              embed:
                allOf:
                  - example:
                      field_map:
                        text: your-text-field
                      model: multilingual-e5-large
                      read_parameters:
                        input_type: query
                        truncate: NONE
                      write_parameters:
                        input_type: passage
                    description: >-
                      Configure the integrated inference embedding settings for
                      this index.


                      You can convert an existing index to an integrated index
                      by specifying the embedding model and field_map. The index
                      vector type and dimension must match the model vector type
                      and dimension, and the index similarity metric must be
                      supported by the model. Refer to the [model
                      guide](https://docs.pinecone.io/guides/index-data/create-an-index#embedding-models)
                      for available models and model details.


                      You can later change the embedding configuration to update
                      the field map, read parameters, or write parameters. Once
                      set, the model cannot be changed.
                    type: object
                    properties:
                      model:
                        example: multilingual-e5-large
                        description: >-
                          The name of the embedding model to use with the index.
                          The index dimension and model dimension must match,
                          and the index similarity metric must be supported by
                          the model. The index embedding model cannot be changed
                          once set.
                        type: string
                      field_map:
                        example:
                          text: your-text-field
                        description: >-
                          Identifies the name of the text field from your
                          document model that will be embedded.
                        type: object
                      read_parameters:
                        description: The read parameters for the embedding model.
                        type: object
                      write_parameters:
                        description: The write parameters for the embedding model.
                        type: object
            required: true
            description: Configuration used to scale an index.
            refIdentifier: '#/components/schemas/ConfigureIndexRequest'
        examples:
          vertical-scaling:
            summary: Vertical scaling with pod size
            value:
              spec:
                pod:
                  pod_type: p1.x2
          horizontal-scaling:
            summary: Horizontal scaling with replicas
            value:
              spec:
                pod:
                  replicas: 4
          scaling-both:
            summary: Scaling both pod size and number of replicas
            value:
              spec:
                pod:
                  pod_type: p1.x2
                  replicas: 4
          disable-deletion-protection:
            summary: Disable deletion protection for the index
            value:
              delete_protection: disabled
          update-index-tags:
            summary: Update tag0 and delete tag1
            value:
              tags:
                tag0: new-val
                tag1: ''
        description: The desired pod size and replica configuration for the index.
  response:
    '202':
      application/json:
        schemaArray:
          - type: object
            properties:
              name:
                allOf:
                  - example: example-index
                    description: >
                      The name of the index. Resource name must be 1-45
                      characters long, start and end with an alphanumeric
                      character, and consist only of lower case alphanumeric
                      characters or '-'.
                    type: string
                    minLength: 1
                    maxLength: 45
              dimension:
                allOf:
                  - example: 1536
                    description: The dimensions of the vectors to be inserted in the index.
                    type: integer
                    format: int32
                    minimum: 1
                    maximum: 20000
              metric:
                allOf:
                  - description: >-
                      The distance metric to be used for similarity search. You
                      can use 'euclidean', 'cosine', or 'dotproduct'. If the
                      'vector_type' is 'sparse', the metric must be
                      'dotproduct'. If the `vector_type` is `dense`, the metric
                      defaults to 'cosine'.
                    type: string
                    enum:
                      - cosine
                      - euclidean
                      - dotproduct
              host:
                allOf:
                  - example: semantic-search-c01b5b5.svc.us-west1-gcp.pinecone.io
                    description: The URL address where the index is hosted.
                    type: string
              deletion_protection:
                allOf:
                  - $ref: '#/components/schemas/DeletionProtection'
              tags:
                allOf:
                  - $ref: '#/components/schemas/IndexTags'
              embed:
                allOf:
                  - $ref: '#/components/schemas/ModelIndexEmbed'
              spec:
                allOf:
                  - example:
                      pod:
                        environment: us-east-1-aws
                        metadata_config:
                          indexed:
                            - genre
                            - title
                            - imdb_rating
                        pod_type: p1.x1
                        pods: 1
                        replicas: 1
                        shards: 1
                    type: object
                    properties:
                      byoc:
                        $ref: '#/components/schemas/ByocSpec'
                      pod:
                        $ref: '#/components/schemas/PodSpec'
                      serverless:
                        $ref: '#/components/schemas/ServerlessSpec'
              status:
                allOf:
                  - example:
                      ready: true
                      state: ScalingUpPodSize
                    type: object
                    properties:
                      ready:
                        type: boolean
                      state:
                        type: string
                        enum:
                          - Initializing
                          - InitializationFailed
                          - ScalingUp
                          - ScalingDown
                          - ScalingUpPodSize
                          - ScalingDownPodSize
                          - Terminating
                          - Ready
                          - Disabled
                    required:
                      - ready
                      - state
              vector_type:
                allOf:
                  - description: >-
                      The index vector type. You can use 'dense' or 'sparse'. If
                      'dense', the vector dimension must be specified.  If
                      'sparse', the vector dimension should not be specified.
                    default: dense
                    type: string
            description: >-
              The IndexModel describes the configuration and status of a
              Pinecone index.
            refIdentifier: '#/components/schemas/IndexModel'
            requiredProperties:
              - name
              - metric
              - status
              - spec
              - host
              - vector_type
        examples:
          example:
            value:
              name: example-index
              dimension: 1536
              metric: cosine
              host: semantic-search-c01b5b5.svc.us-west1-gcp.pinecone.io
              deletion_protection: disabled
              tags:
                tag0: val0
                tag1: val1
              embed:
                field_map:
                  text: your-text-field
                metric: cosine
                model: multilingual-e5-large
                read_parameters:
                  input_type: query
                  truncate: NONE
                write_parameters:
                  input_type: passage
              spec:
                pod:
                  environment: us-east-1-aws
                  metadata_config:
                    indexed:
                      - genre
                      - title
                      - imdb_rating
                  pod_type: p1.x1
                  pods: 1
                  replicas: 1
                  shards: 1
              status:
                ready: true
                state: ScalingUpPodSize
              vector_type: dense
        description: >-
          The request to configure the index has been accepted. Check the  index
          status to see when the change has been applied.
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
                          - UNPROCESSABLE_ENTITY
                          - PAYMENT_REQUIRED
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
    '402':
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
          payment-required:
            summary: Payment required
            value:
              error:
                code: PAYMENT_REQUIRED
                message: >-
                  Request failed. Pay all past due invoices to lift restrictions
                  on your account.
              status: 402
        description: >-
          Payment required. Organization is on a paid plan and is delinquent on
          payment.
    '403':
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
            summary: Forbidden
            value:
              error:
                code: FORBIDDEN
                message: Increase your quota or upgrade to create more indexes.
              status: 403
        description: You've exceed your pod quota.
    '404':
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
          index-not-found:
            summary: Index not found
            value:
              error:
                code: NOT_FOUND
                message: Index example-index not found.
              status: 404
        description: Index not found.
    '422':
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
          missing-field:
            summary: Unprocessable entity
            value:
              error:
                code: UNPROCESSABLE_ENTITY
                message: >-
                  Failed to deserialize the JSON body into the target type:
                  missing field `metric` at line 1 column 16
              status: 422
        description: Unprocessable entity. The request body could not be deserialized.
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
    IndexTags:
      example:
        tag0: val0
        tag1: val1
      description: >-
        Custom user tags added to an index. Keys must be 80 characters or less.
        Values must be 120 characters or less. Keys must be alphanumeric, '_',
        or '-'.  Values must be alphanumeric, ';', '@', '_', '-', '.', '+', or '
        '. To unset a key, set the value to be an empty string.
      type: object
      additionalProperties:
        type: string
    ModelIndexEmbed:
      example:
        field_map:
          text: your-text-field
        metric: cosine
        model: multilingual-e5-large
        read_parameters:
          input_type: query
          truncate: NONE
        write_parameters:
          input_type: passage
      description: The embedding model and document fields mapped to embedding inputs.
      type: object
      properties:
        model:
          example: multilingual-e5-large
          description: The name of the embedding model used to create the index.
          type: string
        metric:
          description: >-
            The distance metric to be used for similarity search. You can use
            'euclidean', 'cosine', or 'dotproduct'. If not specified, the metric
            will be defaulted according to the model. Cannot be updated once
            set.
          type: string
          enum:
            - cosine
            - euclidean
            - dotproduct
        dimension:
          example: 1536
          description: The dimensions of the vectors to be inserted in the index.
          type: integer
          format: int32
          minimum: 1
          maximum: 20000
        vector_type:
          description: >-
            The index vector type. You can use 'dense' or 'sparse'. If 'dense',
            the vector dimension must be specified.  If 'sparse', the vector
            dimension should not be specified.
          default: dense
          type: string
        field_map:
          example:
            text: your-text-field
          description: >-
            Identifies the name of the text field from your document model that
            is embedded.
          type: object
        read_parameters:
          description: The read parameters for the embedding model.
          type: object
        write_parameters:
          description: The write parameters for the embedding model.
          type: object
      required:
        - model
    DeletionProtection:
      description: >
        Whether [deletion
        protection](http://docs.pinecone.io/guides/manage-data/manage-indexes#configure-deletion-protection)
        is enabled/disabled for the index.
      default: disabled
      type: string
      enum:
        - disabled
        - enabled
    ServerlessSpec:
      description: Configuration needed to deploy a serverless index.
      type: object
      properties:
        cloud:
          example: aws
          description: The public cloud where you would like your index hosted.
          type: string
          enum:
            - gcp
            - aws
            - azure
        region:
          example: us-east-1
          description: The region where you would like your index to be created.
          type: string
      required:
        - cloud
        - region
    PodSpec:
      example:
        environment: us-east1-gcp
        metadata_config:
          indexed:
            - genre
            - title
            - imdb_rating
        pod_type: p1.x1
        pods: 1
        replicas: 1
        shards: 1
        source_collection: movie-embeddings
      description: Configuration needed to deploy a pod-based index.
      type: object
      properties:
        environment:
          example: us-east1-gcp
          description: The environment where the index is hosted.
          type: string
        replicas:
          description: >-
            The number of replicas. Replicas duplicate your index. They provide
            higher availability and throughput. Replicas can be scaled up or
            down as your needs change.
          default: 1
          type: integer
          format: int32
          minimum: 1
        shards:
          description: >-
            The number of shards. Shards split your data across multiple pods so
            you can fit more data into an index.
          default: 1
          type: integer
          format: int32
          minimum: 1
        pod_type:
          description: >-
            The type of pod to use. One of `s1`, `p1`, or `p2` appended with `.`
            and one of `x1`, `x2`, `x4`, or `x8`.
          default: p1.x1
          type: string
        pods:
          example: 1
          description: >-
            The number of pods to be used in the index. This should be equal to
            `shards` x `replicas`.'
          default: 1
          type: integer
          minimum: 1
        metadata_config:
          example:
            indexed:
              - genre
              - title
              - imdb_rating
          description: >-
            Configuration for the behavior of Pinecone's internal metadata
            index. By default, all metadata is indexed; when `metadata_config`
            is present, only specified metadata fields are indexed. These
            configurations are only valid for use with pod-based indexes.
          type: object
          properties:
            indexed:
              description: >-
                By default, all metadata is indexed; to change this behavior,
                use this property to specify an array of metadata fields that
                should be indexed.
              type: array
              items:
                type: string
        source_collection:
          example: movie-embeddings
          description: The name of the collection to be used as the source for the index.
          type: string
      required:
        - environment
        - pod_type
    ByocSpec:
      example:
        environment: aws-us-east-1-b921
      description: Configuration needed to deploy an index in a BYOC environment.
      type: object
      properties:
        environment:
          example: aws-us-east-1-b921
          description: The environment where the index is hosted.
          type: string
      required:
        - environment

````