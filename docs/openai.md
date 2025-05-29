# OpenAI

> Using OpenAI and Pinecone to combine deep learning capabilities for embedding generation with efficient vector storage and retrieval

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

OpenAI's large language models (LLMs) enhance semantic search or “long-term memory” for LLMs. This combo utilizes LLMs' embedding and completion (or generation) endpoints alongside Pinecone's vector search capabilities for nuanced information retrieval.

By integrating OpenAI's LLMs with Pinecone, you can combine deep learning capabilities for embedding generation with efficient vector storage and retrieval. This approach surpasses traditional keyword-based search, offering contextually-aware, precise results.

<PrimarySecondaryCTA secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## Setup guide

[View source](https://github.com/pinecone-io/examples/blob/master/integrations/openai/)

[Open in Colab](https://colab.research.google.com/github/pinecone-io/examples/blob/master/integrations/openai/semantic_search_openai.ipynb)

This guide covers the integration of OpenAI's Large Language Models (LLMs) with Pinecone (referred to as the **OP stack**), enhancing semantic search or 'long-term memory' for LLMs. This combo utilizes LLMs' embedding and completion (or generation) endpoints alongside Pinecone's vector search capabilities for nuanced information retrieval.

LLMs like OpenAI's `text-embedding-ada-002` generate vector embeddings, i.e., numerical representations of text semantics. These embeddings facilitate semantic-based rather than literal textual matches. Additionally, LLMs like `gpt-4` or `gpt-3.5-turbo` can predict text completions based on information provided from these contexts.

Pinecone is a vector database designed for storing and querying high-dimensional vectors. It provides fast, efficient semantic search over these vector embeddings.

By integrating OpenAI's LLMs with Pinecone, we combine deep learning capabilities for embedding generation with efficient vector storage and retrieval. This approach surpasses traditional keyword-based search, offering contextually-aware, precise results.

There are many ways of integrating these two tools and we have several guides focusing on specific use-cases. If you already know what you'd like to do you can jump to these specific materials:

* [ChatGPT Plugins Walkthrough](https://youtu.be/hpePPqKxNq8)
* [Ask Lex ChatGPT Plugin](https://github.com/pinecone-io/examples/tree/master/learn/generation/openai/chatgpt/plugins/ask-lex)
* [Generative Question-Answering](https://github.com/pinecone-io/examples/blob/master/docs/gen-qa-openai.ipynb)
* [Retrieval Augmentation using LangChain](https://github.com/pinecone-io/examples/blob/master/learn/generation/langchain/handbook/05-langchain-retrieval-augmentation.ipynb)

### Introduction to Embeddings

At the core of the OP stack we have embeddings which are supported via the [OpenAI Embedding API](https://beta.openai.com/docs/guides/embeddings). We index those embeddings in the [Pinecone vector database](https://www.pinecone.io) for fast and scalable retrieval augmentation of our LLMs or other information retrieval use-cases.

*This example demonstrates the core OP stack. It is the simplest workflow and is present in each of the other workflows, but is not the only way to use the stack. Please see the links above for more advanced usage.*

The OP stack is built for semantic search, question-answering, threat-detection, and other applications that rely on language models and a large corpus of text data.

The basic workflow looks like this:

* Embed and index
  * Use the OpenAI Embedding API to generate vector embeddings of your documents (or any text data).
  * Upload those vector embeddings into Pinecone, which can store and index millions/billions of these vector embeddings, and search through them at ultra-low latencies.
* Search
  * Pass your query text or document through the OpenAI Embedding API again.
  * Take the resulting vector embedding and send it as a [query](/guides/search/search-overview) to Pinecone.
  * Get back semantically similar documents, even if they don't share any keywords with the query.

![Basic workflow of OpenAI and Pinecone](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/6a3ea5a-pinecone-openai-overview.png)

Let's get started...

### Environment Setup

We start by installing the OpenAI and Pinecone clients, we will also need HuggingFace *Datasets* for downloading the TREC dataset that we will use in this guide.

```Bash Bash
!pip install -qU \
    pinecone-client[grpc]==3.0.2 \
    openai==1.10.0 \
    datasets==2.16.1
```

#### Creating Embeddings

To create embeddings we must first initialize our connection to OpenAI Embeddings, we sign up for an API key at [OpenAI](https://beta.openai.com/signup).

```Python Python
from openai import OpenAI

client = OpenAI(
    api_key="OPENAI_API_KEY"
)  # get API key from platform.openai.com
```

We can now create embeddings with the OpenAI v3 small embedding model like so:

```Python Python
MODEL = "text-embedding-3-small"

res = client.embeddings.create(
    input=[
        "Sample document text goes here",
        "there will be several phrases in each batch"
    ], model=MODEL
)
```

In `res` we should find a JSON-like object containing two 1536-dimensional embeddings, these are the vector representations of the two inputs provided above. To access the embeddings directly we can write:

```Python Python
# we can extract embeddings to a list
embeds = [record.embedding for record in res.data]
len(embeds)
```

We will use this logic when creating our embeddings for the **T**ext **RE**trieval **C**onference (TREC) question classification dataset later.

#### Initializing a Pinecone Index

Next, we initialize an index to store the vector embeddings. For this we need a Pinecone API key, [sign up for one here](https://app.pinecone.io).

```Python Python
import time
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec

pc = Pinecone(api_key="...")

spec = ServerlessSpec(cloud="aws", region="us-east-1")

index_name = 'semantic-search-openai'

# check if index already exists (it shouldn't if this is your first run)
if index_name not in pc.list_indexes().names():
    # if does not exist, create index
    pc.create_index(
        index_name,
        dimension=len(embeds[0]),  # dimensionality of text-embed-3-small
        metric='dotproduct',
        spec=spec
    )

# connect to index
index = pc.Index(index_name)
time.sleep(1)
# view index stats
index.describe_index_stats()
```

#### Populating the Index

With both OpenAI and Pinecone connections initialized, we can move onto populating the index. For this, we need the TREC dataset.

```Python Python
from datasets import load_dataset

# load the first 1K rows of the TREC dataset
trec = load_dataset('trec', split='train[:1000]')
```

Then we create a vector embedding for each question using OpenAI (as demonstrated earlier), and `upsert` the ID, vector embedding, and original text for each phrase to Pinecone.

<Warning>
  High-cardinality metadata values (like the unique text values we use here)\
  can reduce the number of vectors that fit on a single pod. See\
  [Known limitations](/reference/api/known-limitations) for more.
</Warning>

```Python Python
from tqdm.auto import tqdm

count = 0  # we'll use the count to create unique IDs
batch_size = 32  # process everything in batches of 32
for i in tqdm(range(0, len(trec['text']), batch_size)):
    # set end position of batch
    i_end = min(i+batch_size, len(trec['text']))
    # get batch of lines and IDs
    lines_batch = trec['text'][i: i+batch_size]
    ids_batch = [str(n) for n in range(i, i_end)]
    # create embeddings
    res = client.embeddings.create(input=lines_batch, model=MODEL)
    embeds = [record.embedding for record in res.data]
    # prep metadata and upsert batch
    meta = [{'text': line} for line in lines_batch]
    to_upsert = zip(ids_batch, embeds, meta)
    # upsert to Pinecone
    index.upsert(vectors=list(to_upsert))
```

#### Querying

With our data indexed, we're now ready to move onto performing searches. This follows a similar process to indexing. We start with a text `query`, that we would like to use to find similar sentences. As before we encode this with OpenAI's text similarity Babbage model to create a *query vector* `xq`. We then use `xq` to query the Pinecone index.

```Python Python
query = "What caused the 1929 Great Depression?"

xq = client.embeddings.create(input=query, model=MODEL).data[0].embedding
```

Now we query.

```Python Python
res = index.query([xq], top_k=5, include_metadata=True)
```

The response from Pinecone includes our original text in the `metadata` field, let's print out the `top_k` most similar questions and their respective similarity scores.

```Python Python
for match in res['matches']:
    print(f"{match['score']:.2f}: {match['metadata']['text']}")
```

```[Out]:
0.75: Why did the world enter a global depression in 1929 ?
0.60: When was `` the Great Depression '' ?
0.37: What crop failure caused the Irish Famine ?
0.32: What were popular songs and types of songs in the 1920s ?
0.32: When did World War I start ?
```

Looks good, let's make it harder and replace *"depression"* with the incorrect term *"recession"*.

```Python Python
query = "What was the cause of the major recession in the early 20th century?"

# create the query embedding
xq = client.embeddings.create(input=query, model=MODEL).data[0].embedding

# query, returning the top 5 most similar results
res = index.query(vector=[xq], top_k=5, include_metadata=True)

for match in res['matches']:
    print(f"{match['score']:.2f}: {match['metadata']['text']}")
```

```[Out]:
0.63: Why did the world enter a global depression in 1929 ?
0.55: When was `` the Great Depression '' ?
0.34: What were popular songs and types of songs in the 1920s ?
0.33: What crop failure caused the Irish Famine ?
0.29: What is considered the costliest disaster the insurance industry has ever faced ?
```

Let's perform one final search using the definition of depression rather than the word or related words.

```Python Python
query = "Why was there a long-term economic downturn in the early 20th century?"

# create the query embedding
xq = client.embeddings.create(input=query, model=MODEL).data[0].embedding

# query, returning the top 5 most similar results
res = index.query(vector=[xq], top_k=5, include_metadata=True)

for match in res['matches']:
    print(f"{match['score']:.2f}: {match['metadata']['text']}")
```

```[Out]:
0.62: Why did the world enter a global depression in 1929 ?
0.54: When was `` the Great Depression '' ?
0.34: What were popular songs and types of songs in the 1920s ?
0.33: What crop failure caused the Irish Famine ?
0.32: What do economists do ?
```

It's clear from this example that the semantic search pipeline is clearly able to identify the meaning between each of our queries. Using these embeddings with Pinecone allows us to return the most semantically similar questions from the already indexed TREC dataset.

Once we're finished with the index we delete it to save resources.

```Python Python
pc.delete_index(name=index_name)
```

## Related articles

* [Generative Question-Answering with Long-Term Memory](https://www.pinecone.io/learn/openai-gen-qa)
* [OpenAI's Text Embeddings v3](https://www.pinecone.io/learn/openai-embeddings-v3/)
