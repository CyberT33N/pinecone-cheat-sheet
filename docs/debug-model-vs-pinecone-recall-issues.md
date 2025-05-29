# Debug model vs. Pinecone recall issues

## **Step 1: Establish the evaluation framework**

Before starting, establish an evaluation framework for your model and Pinecone recall issues. You will need to query a dataset of at least 10 samples and a source dataset of 100k samples, and choose an evaluation metric that is appropriate for your use case. Pinecone recommends [Evaluation Measures in Information Retrieval](https://www.pinecone.io/learn/offline-evaluation/) as a guide for choosing an evaluation metric. Label the "right answers" in the source dataset for each query.

## **Step 2: Generate embeddings for queries + source dataset with the model**

Use your model to generate embeddings for your queries and the source dataset. Run the model on the source dataset to create the vector dataset and query vectors.

## **Step 3: Calculate brute force vector distance to evaluate model quality**

Run a brute force search using query vectors over the vector dataset via FAISS or numpy and record the record IDs for each query. Evaluate the returned list using your evaluation metric and the set of "right answers" labeled in step 1. If this metric is unacceptable, it indicates a model issue.

## **Step 4: Upload vector dataset to Pinecone + query**

Upload the vector dataset to Pinecone and query it using your queries. Record the vector IDs returned for each query.

## **Step 5: Calculate Pinecone recall**

For each query, compare the % of vector IDs that Pinecone recalled compared to the brute force search. This will be the % recall for each query. You can then average across all queries to get average recall. Typically, average recall should be close to 0.99 for s1/p1 indexes.

## **Step 6: If recall is too low, reach out to Pinecone Support (reproducible dataset and queries)**

If the recall metric is too low for your use case, reach out to Pinecone product and engineering with the query and vector dataset that reproduces the issue for further investigation. Pinecone's team will investigate.
