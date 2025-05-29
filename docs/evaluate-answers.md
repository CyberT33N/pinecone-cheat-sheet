# Evaluate answers

This page shows you how to [evaluate responses](/guides/assistant/evaluation-overview) from an assistant or other RAG systems using the `metrics_alignment` operation.

You can [evaluate a response](/reference/api/2025-01/assistant/metrics_alignment) from an assistant, as in the following example:

<CodeGroup>
  ```python Python
  # To use the Python SDK, install the plugin:
  # pip install --upgrade pinecone pinecone-plugin-assistant
  # pip install requests

  import requests
  from pinecone_plugins.assistant.models.chat import Message

  payload = {
      "question": "What are the capital cities of France, England and Spain?", # Question to ask the assistant.
      "answer": "Paris is the capital city of France and Barcelona of Spain", # Answer from the assistant.
      "ground_truth_answer": "Paris is the capital city of France, London of England and Madrid of Spain." # Expected answer to evaluate the assistant's response.
  }

  headers = {
      "Api-Key": "YOUR_API_KEY",
      "Content-Type": "application/json"
  }

  url = "https://prod-1-data.ke.pinecone.io/assistant/evaluation/metrics/alignment"

  response = requests.request("POST", url, json=payload, headers=headers)

  print(response.text)
  ```

  ```bash curl
  PINECONE_API_KEY="YOUR_API_KEY"

  curl "https://prod-1-data.ke.pinecone.io/assistant/evaluation/metrics/alignment" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
    "question": "What are the capital cities of France, England and Spain?",
    "answer": "Paris is the capital city of France and Barcelona of Spain",
    "ground_truth_answer": "Paris is the capital city of France, London of England and Madrid of Spain"
  }'
  ```
</CodeGroup>

```json Response
{
  "metrics": {
    "correctness": 0.5,
    "completeness": 0.3333,
    "alignment": 0.4
  },
  "reasoning": {
    "evaluated_facts": [
      {
        "fact": {
          "content": "Paris is the capital city of France."
        },
        "entailment": "entailed"
      },
      {
        "fact": {
          "content": "London is the capital city of England."
        },
        "entailment": "neutral"
      },
      {
        "fact": {
          "content": "Madrid is the capital city of Spain."
        },
        "entailment": "contradicted"
      }
    ]
  },
  "usage": {
    "prompt_tokens": 1223,
    "completion_tokens": 51,
    "total_tokens": 1274
  }
}
```
