# Evaluate an answer

> Evaluate the correctness and completeness of a response from an assistant or a RAG system. The correctness and completeness are evaluated based on the precision and recall of the generated answer with respect to the ground truth answer facts. Alignment is the harmonic mean of correctness and completeness.

For guidance and examples, see [Evaluate answers](https://docs.pinecone.io/guides/assistant/evaluate-answers).

## OpenAPI

````yaml assistant_evaluation_2025-04.oas POST /evaluation/metrics/alignment
paths:
  path: /evaluation/metrics/alignment
  method: post
  servers:
    - url: https://prod-1-data.ke.pinecone.io/assistant
      description: Evaluation US Production API endpoints
    - url: https://prod-eu-data.ke.pinecone.io/assistant
      description: Evaluation EU Production API endpoints
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
              question:
                allOf:
                  - example: What is the capital city of Spain?
                    title: Question
                    description: The question for which the answer was generated.
                    type: string
              answer:
                allOf:
                  - example: Barcelona.
                    title: Answer
                    description: The generated answer.
                    type: string
              ground_truth_answer:
                allOf:
                  - example: Madrid.
                    title: Ground Truth Answer
                    description: The ground truth answer to the question.
                    type: string
            required: true
            title: AlignmentRequest
            description: The request for the alignment evaluation.
            refIdentifier: '#/components/schemas/AlignmentRequest'
            requiredProperties:
              - question
              - answer
              - ground_truth_answer
            additionalProperties: false
        examples:
          example:
            value:
              question: What is the capital city of Spain?
              answer: Barcelona.
              ground_truth_answer: Madrid.
        description: The request body for the alignment evaluation.
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              metrics:
                allOf:
                  - $ref: '#/components/schemas/Metrics'
              reasoning:
                allOf:
                  - $ref: '#/components/schemas/Reasoning'
              usage:
                allOf:
                  - $ref: '#/components/schemas/TokenCounts'
            title: AlignmentResponse
            description: The response for the alignment evaluation.
            refIdentifier: '#/components/schemas/AlignmentResponse'
            requiredProperties:
              - metrics
              - reasoning
              - usage
            additionalProperties: false
        examples:
          example:
            value:
              metrics:
                correctness: 123
                completeness: 123
                alignment: 123
              reasoning:
                evaluated_facts:
                  - fact:
                      content: <string>
                    entailment: entailed
              usage:
                prompt_tokens: 123
                completion_tokens: 123
                total_tokens: 123
        description: The evaluation metrics and reasoning for the generated answer.
    '422':
      application/json:
        schemaArray:
          - type: object
            properties:
              message:
                allOf:
                  - &ref_0
                    title: Message
                    type: string
            title: BasicErrorResponse
            description: A basic error response that contains a message.
            refIdentifier: '#/components/schemas/BasicErrorResponse'
            requiredProperties: &ref_1
              - message
        examples:
          example:
            value:
              message: <string>
        description: Validation error.
    '500':
      application/json:
        schemaArray:
          - type: object
            properties:
              message:
                allOf:
                  - *ref_0
            title: BasicErrorResponse
            description: A basic error response that contains a message.
            refIdentifier: '#/components/schemas/BasicErrorResponse'
            requiredProperties: *ref_1
        examples:
          example:
            value:
              message: <string>
        description: Internal server error.
  deprecated: false
  type: path
components:
  schemas:
    Entailment:
      title: Entailment
      description: The entailment of a fact.
      type: string
      enum:
        - entailed
        - contradicted
        - neutral
    EvaluatedFact:
      title: EvaluatedFact
      description: A fact that was evaluated.
      type: object
      properties:
        fact:
          $ref: '#/components/schemas/Fact'
        entailment:
          $ref: '#/components/schemas/Entailment'
      required:
        - fact
        - entailment
      additionalProperties: false
    Fact:
      title: Fact
      description: A fact
      type: object
      properties:
        content:
          title: Content
          description: The content of the fact.
          type: string
      required:
        - content
      additionalProperties: false
    Metrics:
      title: Metrics
      description: The metrics returned for the alignment evaluation.
      type: object
      properties:
        correctness:
          title: Correctness
          description: The precision of the generated answer.
          type: number
        completeness:
          title: Completeness
          description: The recall of the generated answer.
          type: number
        alignment:
          title: Alignment
          description: The harmonic mean of correctness and completeness.
          type: number
      required:
        - correctness
        - completeness
        - alignment
      additionalProperties: false
    Reasoning:
      title: Reasoning
      description: The reasoning behind the alignment evaluation.
      type: object
      properties:
        evaluated_facts:
          title: Evaluated Facts
          description: The facts that were evaluated.
          type: array
          items:
            $ref: '#/components/schemas/EvaluatedFact'
      required:
        - evaluated_facts
      additionalProperties: false
    TokenCounts:
      title: TokenCounts
      description: Token counts for the input prompt and completion.
      type: object
      properties:
        prompt_tokens:
          title: Prompt Tokens
          type: integer
        completion_tokens:
          title: Completion Tokens
          type: integer
        total_tokens:
          title: Total Tokens
          type: integer
      required:
        - prompt_tokens
        - completion_tokens
        - total_tokens

````