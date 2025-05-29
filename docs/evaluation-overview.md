# Evaluation overview

You can [evaluate the correctness and completeness of a response](/guides/assistant/evaluate-answers) from an assistant or RAG system.

## Use cases

Response evaluation is useful when performing tasks like the following:

* Understanding how well the Pinecone Assistant captures the facts of the ground truth answer.
* Comparing the Pinecone Assistant's answers to those of another RAG system.
* Comparing the answers of your own RAG system to those of the Pinecone Assistant or another RAG system.

## SDK support

You can [evaluate responses](/reference/api/2025-01/assistant/metrics_alignment) directly or through the [Pinecone Python SDK](/reference/python-sdk).

## Request

The request body requires the following fields:

| Field                 | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `question`            | The question asked to the RAG system.                 |
| `answer`              | The answer provided by the assistant being evaluated. |
| `ground_truth_answer` | The expected answer.                                  |

For example:

```json
{
  "question": "What are the capital cities of France, England and Spain?",
  "answer": "Paris is the capital city of France and Barcelona of Spain",
  "ground_truth_answer": "Paris is the capital city of France, London of England and Madrid of Spain."
}
```

## Response

### Metrics

Calculated scores between `0` to `1` are returned for the following metrics:

| Metric         | Description                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| `correctness`  | Correctness of the RAG system's answer compared to the ground truth answer.  |
| `completeness` | Completeness of the RAG system's answer compared to the ground truth answer. |
| `alignment`    | A combined score of the correctness and completeness scores.                 |

```json
{
  "metrics": {
    "correctness": 0.5,
    "completeness": 0.333,
    "alignment": 0.398,
  }
},

...
```

### Reasoning

The response includes explanations for the reasoning behind each metric's score. This includes a list of evaluated facts with their entailment status:

| Status         | Description                                                                |
| -------------- | -------------------------------------------------------------------------- |
| `entailed`     | The fact is supported by the ground truth answer.                          |
| `contradicted` | The fact contradicts the ground truth answer.                              |
| `neutral`      | The fact is neither supported nor contradicted by the ground truth answer. |

```json
...

  "reasoning":{
    "evaluated_facts": [
      {
        "fact": {"content": "Paris is the capital of France"},
        "entailment": "entailed",
      },
      {
        "fact": {"content": "London is the capital of England"},
        "entailment": "neutral"
      },
      {
        "fact": {"content": "Madrid is the capital of Spain"},
        "entailment": "contradicted",
      }
    ]
  },

...
```

### Usage

The response includes the number of tokens used to calculate the metrics. This includes the number of tokens used for the prompt and completion.

```json
...

  "usage": {
    "prompt_tokens": 22,
    "completion_tokens": 33,
    "total_tokens": 55
  }
}
```

## Pricing

Cost is calculated by [token usage](#usage). See [Pricing](https://www.pinecone.io/pricing/) for up-to-date pricing information.

Response evaluation is only available for [Standard and Enterprise plans](https://www.pinecone.io/pricing/).
