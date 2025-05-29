# Minimize latencies

There are many aspects to consider to minimize latencies:

## Slow uploads or high latencies

To minimize latency when accessing Pinecone:

* Switch to a cloud environment. For example: EC2, GCE, [Google Colab](https://colab.research.google.com), [GCP AI Platform Notebook](https://cloud.google.com/ai-platform-notebooks), or [SageMaker Notebook](https://docs.aws.amazon.com/sagemaker/dg/nbi.html). If you experience slow uploads or high query latencies, it might be because you are accessing Pinecone from your home network.
* Consider deploying your application in the same environment as your Pinecone service.
* See [Decrease latency](/guides/optimize/decrease-latency) for more tips.

## High query latencies with batching

If you're batching queries, try reducing the number of queries per call to 1 query vector. You can make these [calls in parallel](/troubleshooting/parallel-queries) and expect roughly the same performance as with batching.
