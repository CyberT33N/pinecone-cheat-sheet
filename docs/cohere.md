# Cohere

> Using Cohere and Pinecone to generate and index high-quality vector embeddings

export const PrimarySecondaryCTA = ({primaryLabel, primaryHref, primaryTarget, secondaryLabel, secondaryHref, secondaryTarget}) => <div style={{
  display: 'flex',
  alignItems: 'center',
  gap: 16
}}>
   {primaryLabel && primaryHref && <div style={{
  width: 'fit-content',
  height: 42,
  background: 'var(--brand-blue)',
  borderRadius: 4,
  overflow: 'hidden',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'inline-flex'
}}>
      <a href={primaryHref} target={primaryTarget} style={{
  paddingLeft: 22,
  paddingRight: 22,
  paddingTop: 8,
  paddingBottom: 8,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  display: 'inline-flex',
  textDecoration: 'none',
  borderBottom: 'none'
}}>
        <div style={{
  textAlign: 'justify',
  color: 'var(--text-contrast)',
  fontSize: 15,
  fontWeight: '600',
  letterSpacing: 0.46,
  wordWrap: 'break-word'
}}>
          {primaryLabel}
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
  marginLeft: 2
}}>
          <path d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z" fill="white" style={{
  fille: "var(--text-contrast)"
}} />
        </svg>
      </a>
    </div>}

    {secondaryLabel && secondaryHref && <div style={{
  width: 'fit-content',
  height: 42,
  borderRadius: 4,
  overflow: 'hidden',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'inline-flex',
  textDecoration: 'none'
}}>
        <a href={secondaryHref} target={secondaryTarget} style={{
  paddingLeft: 11,
  paddingRight: 11,
  paddingTop: 8,
  paddingBottom: 8,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
  display: 'inline-flex',
  textDecoration: 'none',
  borderBottom: 'none'
}}>
          <div style={{
  textAlign: 'justify',
  color: 'var(--brand-blue)',
  fontSize: 15,
  fontWeight: '600',
  letterSpacing: 0.46,
  wordWrap: 'break-word'
}}>
            {secondaryLabel}
          </div>
        </a>
      </div>}

  </div>;

The Cohere platform builds natural language processing and generation into your product with a few lines of code. Cohere's large language models (LLMs) can solve a broad spectrum of natural language use cases, including classification, semantic search, paraphrasing, summarization, and content generation.

Use the Cohere Embed API endpoint to generate language embeddings, and then index those embeddings in the Pinecone vector database for fast and scalable vector search.

<PrimarySecondaryCTA secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## Setup guide

[View source](https://github.com/pinecone-io/examples/blob/master/integrations/cohere/)

[Open in Colab](https://colab.research.google.com/github/pinecone-io/examples/blob/master/integrations/cohere/semantic%5Fsearch%5Ftrec.ipynb)

In this guide, you will learn how to use the [Cohere Embed API endpoint](https://docs.cohere.ai/reference/embed) to generate language embeddings, and then index those embeddings in the [Pinecone vector database](https://www.pinecone.io) for fast and scalable vector search.

This is a powerful and common combination for building semantic search, question-answering, threat-detection, and other applications that rely on NLP and search over a large corpus of text data.

The basic workflow looks like this:

* Embed and index
  * Use the Cohere Embed API endpoint to generate vector embeddings of your documents (or any text data).
  * Upload those vector embeddings into Pinecone, which can store and index millions/billions of these vector embeddings, and search through them at ultra-low latencies.
* Search
  * Pass your query text or document through the Cohere Embed API endpoint again.
  * Take the resulting vector embedding and send it as a [query](/guides/search/search-overview) to Pinecone.
  * Get back semantically similar documents, even if they don't share any keywords with the query.

![Basic workflow of Cohere with Pinecone](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/fd0ba7b-pinecone-cohere-overview.png)

### Set up the environment

Start by installing the Cohere and Pinecone clients and HuggingFace *Datasets* for downloading the TREC dataset used in this guide:

```shell Shell
pip install -U cohere pinecone datasets
```

### Create embeddings

Sign up for an API key at [Cohere](https://dashboard.cohere.com/api-keys) and then use it to initialize your connection.

```Python Python
import cohere

co = cohere.Client("<YOUR_API_KEY>")
```

Load the **T**ext **RE**trieval **C**onference (TREC) question classification dataset, which contains 5.5K labeled questions. You will take only the first 1K samples for this walkthrough, but this can be scaled to millions or even billions of samples.

```Python Python
from datasets import load_dataset

# load the first 1K rows of the TREC dataset
trec = load_dataset('trec', split='train[:1000]')
```

Each sample in `trec` contains two label features and the *text* feature. Pass the questions from the *text* feature to Cohere to create embeddings.

```Python Python
embeds = co.embed(
    texts=trec['text'],
    model='embed-english-v3.0',
    input_type='search_document',
    truncate='END'
).embeddings
```

Check the dimensionality of the returned vectors. You will need to save the embedding dimensionality from this to be used when initializing your Pinecone index later

```Python Python
import numpy as np

shape = np.array(embeds).shape
print(shape)

# [Out]:
# (1000, 1024)
```

You can see the `1024` embedding dimensionality produced by Cohere's `embed-english-v3.0` model, and the `1000` samples you built embeddings for.

### Store the Embeddings

Now that you have your embeddings, you can move on to indexing them in the Pinecone vector database. For this, you need a [Pinecone API key](/guides/projects/manage-api-keys).

You first initialize our connection to Pinecone and then create a new index called `cohere-pinecone-trec` for storing the embeddings. When creating the index, you specify that you would like to use the cosine similarity metric to align with Cohere's embeddings, and also pass the embedding dimensionality of `1024`.

```Python Python
from pinecone import Pinecone

# initialize connection to pinecone (get API key at app.pinecone.io)
pc = Pinecone(api_key='YOUR_API_KEY')

index_name = 'cohere-pinecone-trec'

# if the index does not exist, we create it
if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=shape[1],
        metric="cosine",
        spec=ServerlessSpec(
            cloud='aws', 
            region='us-east-1'
        ) 
    )

# connect to index
index = pc.Index(index_name)
```

Now you can begin populating the index with your embeddings. Pinecone expects you to provide a list of tuples in the format *(id, vector, metadata)*, where the *metadata* field is an optional extra field where you can store anything you want in a dictionary format. For this example, you will store the original text of the embeddings.

While uploading your data, you will batch everything to avoid pushing too much data in one go.

```Python Python
batch_size = 128

ids = [str(i) for i in range(shape[0])]
# create list of metadata dictionaries
meta = [{'text': text} for text in trec['text']]

# create list of (id, vector, metadata) tuples to be upserted
to_upsert = list(zip(ids, embeds, meta))

for i in range(0, shape[0], batch_size):
    i_end = min(i+batch_size, shape[0])
    index.upsert(vectors=to_upsert[i:i_end])

# let's view the index statistics
print(index.describe_index_stats())

# [Out]:
# {'dimension': 1024,
#  'index_fullness': 0.0,
#  'namespaces': {'': {'vector_count': 1000}},
#  'total_vector_count': 1000}
```

You can see from `index.describe_index_stats` that you have a *1024-dimensionality* index populated with *1000* embeddings. Note that serverless indexes scale automatically as needed, so the `index_fullness` metric is relevant only for pod-based indexes.

### Semantic search

Now that you have your indexed vectors, you can perform a few search queries. When searching, you will first embed your query using Cohere, and then search using the returned vector in Pinecone.

```Python Python
query = "What caused the 1929 Great Depression?"

# create the query embedding
xq = co.embed(
    texts=[query],
    model='embed-english-v3.0',
    input_type='search_query',
    truncate='END'
).embeddings

print(np.array(xq).shape)

# query, returning the top 5 most similar results
res = index.query(vector=xq, top_k=5, include_metadata=True)
```

The response from Pinecone includes your original text in the `metadata` field. Let's print out the `top_k` most similar questions and their respective similarity scores.

```Python Python
for match in res['matches']:
    print(f"{match['score']:.2f}: {match['metadata']['text']}")

# [Out]:
# 0.62: Why did the world enter a global depression in 1929 ?
# 0.49: When was `` the Great Depression '' ?
# 0.38: What crop failure caused the Irish Famine ?
# 0.32: What caused Harry Houdini 's death ?
# 0.31: What causes pneumonia ?
```

Looks good! Let's make it harder and replace *"depression"* with the incorrect term *"recession"*.

```Python Python
query = "What was the cause of the major recession in the early 20th century?"

# create the query embedding
xq = co.embed(
    texts=[query],
    model='embed-english-v3.0',
    input_type='search_query',
    truncate='END'
).embeddings

# query, returning the top 5 most similar results
res = index.query(vector=xq, top_k=5, include_metadata=True)

for match in res['matches']:
    print(f"{match['score']:.2f}: {match['metadata']['text']}")

# [Out]:
# 0.43: When was `` the Great Depression '' ?
# 0.40: Why did the world enter a global depression in 1929 ?
# 0.39: When did World War I start ?
# 0.35: What are some of the significant historical events of the 1990s ?
# 0.32: What crop failure caused the Irish Famine ?
```

Let's perform one final search using the definition of depression rather than the word or related words.

```Python Python
query = "Why was there a long-term economic downturn in the early 20th century?"

# create the query embedding
xq = co.embed(
    texts=[query],
    model='embed-english-v3.0',
    input_type='search_query',
    truncate='END'
).embeddings

# query, returning the top 10 most similar results
res = index.query(vector=xq, top_k=10, include_metadata=True)

for match in res['matches']:
    print(f"{match['score']:.2f}: {match['metadata']['text']}")

# [Out]:
# 0.40: When was `` the Great Depression '' ?
# 0.39: Why did the world enter a global depression in 1929 ?
# 0.35: When did World War I start ?
# 0.32: What are some of the significant historical events of the 1990s ?
# 0.31: What war did the Wanna-Go-Home Riots occur after ?
# 0.31: What do economists do ?
# 0.29: What historical event happened in Dogtown in 1899 ?
# 0.28: When did the Dow first reach ?
# 0.28: Who earns their money the hard way ?
# 0.28: What were popular songs and types of songs in the 1920s ?
```

It's clear from this example that the semantic search pipeline is clearly able to identify the meaning between each of your queries. Using these embeddings with Pinecone allows you to return the most semantically similar questions from the already indexed TREC dataset.
