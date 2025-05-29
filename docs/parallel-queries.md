# Parallel queries

There are many approaches to perform parallel queries in your application, from using the Python SDK to making REST calls. Below is one example of an approach using multi-threaded, asynchronous requests in Python. For guidance on using `asyncio` for single-threaded, asynchronous requests in Python, see [Asyncio support](/reference/python-sdk#asyncio-support).

This example assumes the following:

* You have a 1536-dimension serverless index called `docs-example`.
* You have the [Pinecone Python SDK](/reference/python-sdk) and [`concurrent.futures`](https://docs.python.org/3/library/concurrent.futures.html#module-concurrent.futures) and [`numpy`](https://numpy.org/) packages installed.

```python
import os
from pinecone import Pinecone
from concurrent.futures import ThreadPoolExecutor

# Get the API key from the environment variable and initialize Pinecone
api_key = os.environ.get("PINECONE_API_KEY")
pc = Pinecone(api_key=api_key)

# Define the index name
index_name = "docs-example"

# Define the index
index = pc.Index(index_name)

# Define the function to run parallel queries
def run_parallel_queries(vectors):
    """
    Run a list of vectors in parallel using ThreadPoolExecutor.
    
    Parameters:
    vectors (list): A list of vectors.
    
    Returns:
    list: A list of query results.
    """
    
    # Define the maximum number of concurrent queries
    MAX_CONCURRENT_QUERIES = 4

    def run_query(vector):
        """
        Run a single query.
        """
        return index.query(
            namespace="",
            vector=vector,
            top_k=3,
            include_values=True
        )
    
    # Run the queries in parallel
    with ThreadPoolExecutor(max_workers=MAX_CONCURRENT_QUERIES) as executor:
        """
        Run the queries in parallel.
        """
        results = list(executor.map(run_query, vectors))
    
    return results

def test_parallel_queries():
    """
    Test the run_parallel_queries function with 20 random vectors.
    """
    import numpy as np

    # Generate 20 random vectors of size 1536 and convert them to lists
    vectors = [np.random.rand(1536).tolist() for _ in range(20)]

    # Define the batch size
    QUERY_BATCH_SIZE = 20
    
    # Run the parallel queries
    results = run_parallel_queries(vectors)

    # Print the results
    for i, result in enumerate(results):
        print(f"Query {i+1} results: {result}")

if __name__ == "__main__":
    test_parallel_queries()
```
