# Create an index

> Create a Pinecone index. This is where you specify the measure of similarity, the dimension of vectors to be stored in the index, which cloud provider you would like to deploy with, and more.
  
For guidance and examples, see [Create an index](https://docs.pinecone.io/guides/index-data/create-an-index).


## OpenAPI

````yaml db_control_2025-04.oas post /indexes
paths:
  path: /indexes
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
              deletion_protection:
                allOf:
                  - $ref: '#/components/schemas/DeletionProtection'
              tags:
                allOf:
                  - $ref: '#/components/schemas/IndexTags'
              spec:
                allOf:
                  - $ref: '#/components/schemas/IndexSpec'
              vector_type:
                allOf:
                  - description: >-
                      The index vector type. You can use 'dense' or 'sparse'. If
                      'dense', the vector dimension must be specified.  If
                      'sparse', the vector dimension should not be specified.
                    default: dense
                    type: string
            required: true
            description: The configuration needed to create a Pinecone index.
            refIdentifier: '#/components/schemas/CreateIndexRequest'
            requiredProperties:
              - name
              - spec
        examples:
          serverless-index:
            summary: Creating a serverless index
            value:
              deletion_protection: enabled
              dimension: 1536
              metric: cosine
              name: movie-recommendations
              spec:
                serverless:
                  cloud: gcp
                  region: us-east1
                  source_collection: movie-embeddings
          serverless-sparse-index:
            summary: Creating a sparse serverless index
            value:
              deletion_protection: enabled
              metric: dotproduct
              name: sparse-index
              spec:
                serverless:
                  cloud: gcp
                  region: us-east1
              vector_type: sparse
          pod-index:
            summary: Creating a pod-based index
            value:
              deletion_protection: enabled
              dimension: 1536
              metric: cosine
              name: movie-recommendations
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
                  source_collection: movie-embeddings
        description: The desired configuration for the index.
  response:
    '201':
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
        description: The index has been successfully created.
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
          serverless-spec-cloud-not-found:
            summary: Cannot create serverless index with invalid spec.
            value:
              error:
                code: NOT_FOUND
                message: 'Resource cloud: aws region: us-west1 not found.'
              status: 404
        description: Unknown cloud or region when creating a serverless index.
    '409':
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
          index-name-already-exists:
            summary: Index name needs to be unique.
            value:
              error:
                code: ALREADY_EXISTS
                message: Resource already exists.
              status: 409
        description: Index of given name already exists.
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
    IndexSpec:
      description: >
        The spec object defines how the index should be deployed.


        For serverless indexes, you set only the [cloud and
        region](http://docs.pinecone.io/guides/index-data/create-an-index#cloud-regions)
        where the index should be hosted. For pod-based indexes, you set the
        [environment](http://docs.pinecone.io/guides/indexes/pods/understanding-pod-based-indexes#pod-environments)
        where the index should be hosted, the [pod type and
        size](http://docs.pinecone.io/guides/indexes/pods/understanding-pod-based-indexes#pod-types)
        to use, and other index characteristics. For [BYOC
        indexes](http://docs.pinecone.io/guides/production/bring-your-own-cloud),
        you set the environment name provided to you during onboarding.
      type: object
      properties:
        serverless:
          $ref: '#/components/schemas/ServerlessSpec'
        pod:
          $ref: '#/components/schemas/PodSpec'
        byoc:
          $ref: '#/components/schemas/ByocSpec'
      additionalProperties: false
      oneOf:
        - required:
            - serverless
        - required:
            - pod
        - required:
            - byoc
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