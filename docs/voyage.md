# Voyage AI

> Using Voyage AI and Pinecone to generate and index high-quality vector embeddings

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

[Voyage AI](https://www.voyageai.com) provides cutting-edge embedding and rerankers. Voyage AI's generalist [embedding models](https://docs.voyageai.com/docs/embeddings) continually top the [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard), and the [domain-specific embeddings](https://blog.voyageai.com/2024/01/23/voyage-code-2-elevate-your-code-retrieval/) enhance the retrieval quality for enterprise use cases significantly.

<PrimarySecondaryCTA secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## Setup guide

In this guide, we use the [Voyage Embedding API endpoint](https://docs.voyageai.com/docs/embeddings) to generate text embeddings for terms of service and consumer contract documents, and then index those embeddings in the Pinecone vector database.

This is a powerful and common combination for building retrieval-augmented generation (RAG), semantic search, question-answering, code assistants, and other applications that rely on NLP and search over a large corpus of text data.

### 1. Set up the environment

Start by installing the Voyage and Pinecone clients and HuggingFace *Datasets* for downloading the *LegalBench: Consumer Contracts QA* ([`mteb/legalbench_consumer_contracts_qa`](https://huggingface.co/datasets/mteb/legalbench_consumer_contracts_qa)) dataset used in this guide:

```shell Shell
pip install -U voyageai pinecone[grpc] datasets
```

### 2. Create embeddings

Sign up for an API key at [Voyage AI](https://dash.voyageai.com) and then use it to initialize your connection.

```Python Python
import voyageai

vc = voyageai.Client(api_key="<YOUR_VOYAGE_API_KEY>")
```

Load the *LegalBench: Consumer Contracts QA*  dataset, which contains 154 consumer contract documents and 396 labeled queries about these documents.

```Python Python
from datasets import load_dataset

# load the documents and queries of legalbench consumer contracts qa dataset
documents = load_dataset('mteb/legalbench_consumer_contracts_qa', 'corpus', cache_dir = './', split='corpus')
queries = load_dataset('mteb/legalbench_consumer_contracts_qa', 'queries', cache_dir = './', split='queries')

```

Each document in `mteb/legalbench_consumer_contracts_qa` contains a `text` field by which we will embed using the Voyage AI client.

```Python Python
num_documents = len(documents['text'])
voyageai_batch_size = 128  # Please check the restrictions of number of examples and number of tokens per request here https://docs.voyageai.com/docs/embeddings
embeds = []
while len(embeds) < num_documents:
    embeds.extend(vc.embed(
        texts=documents['text'][len(embeds):len(embeds)+voyageai_batch_size],
        model='voyage-law-2',  # Please check the available models here https://docs.voyageai.com/docs/embeddings
        input_type='document',
        truncation=True
    ).embeddings)
```

Check the dimensionality of the returned vectors. You will need to save the embedding dimensionality from this to be used when initializing your Pinecone index later.

```Python Python
import numpy as np

shape = np.array(embeds).shape
print(shape)
```

```
[Out]:
(154, 1024)
```

In this example, you can see that for each of the `154` documents, we created a `1024`-dimensional embedding with the Voyage AI `voyage-law-2` model.

### 3. Store the Embeddings

Now that you have your embeddings, you can move on to indexing them in the Pinecone vector database. For this, you need a Pinecone API key. [Sign up for one here](https://app.pinecone.io).

You first initialize our connection to Pinecone and then create a new index called `voyageai-pinecone-legalbench` for storing the embeddings. When creating the index, you specify that you would like to use the cosine similarity metric to align with Voyage AI's embeddings, and also pass the embedding dimensionality of `1024`.

```Python Python
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec

# initialize connection to pinecone (get API key at app.pinecone.io)
pc = Pinecone(api_key="<YOUR_PINECONE_API_KEY>")

index_name = 'voyageai-pinecone-legalbench'

# if the index does not exist, we create it
if not pc.has_index(index_name):
    pc.create_index(
        index_name,
        dimension=shape[1],
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        ),
        metric='cosine'
    )

# connect to index
index = pc.Index(index_name)
```

Now you can begin populating the index with your embeddings. Pinecone expects you to provide a list of tuples in the format (`id`, `vector`, `metadata`), where the `metadata` field is an optional extra field where you can store anything you want in a dictionary format. For this example, you will store the original text of the embeddings.

While uploading your data, you will batch everything to avoid pushing too much data in one go.

```Python Python
batch_size = 128

ids = [str(i) for i in range(shape[0])]
# create list of metadata dictionaries
meta = [{'text': text} for text in documents['text']]

# create list of (id, vector, metadata) tuples to be upserted
to_upsert = list(zip(ids, embeds, meta))

for i in range(0, shape[0], batch_size):
    i_end = min(i+batch_size, shape[0])
    index.upsert(vectors=to_upsert[i:i_end])

# let's view the index statistics
print(index.describe_index_stats())
`

`[Out]:
{'dimension': 1024,
 'index_fullness': 0.0,
 'namespaces': {'': {'vector_count': 154}},
 'total_vector_count': 154}
```

You can see from `index.describe_index_stats` that you have a *1024-dimensionality* index populated with *154* embeddings. The `indexFullness` metric tells you how full your index is. At the moment, it is empty. Using the default value of one *p1* pod, you can fit around 750K embeddings before the `indexFullness` reaches capacity. The [Usage Estimator](https://www.pinecone.io/pricing/) can be used to identify the number of pods required for a given number of *n*-dimensional embeddings.

### 4. Semantic search

Now that you have your indexed vectors, you can perform a few search queries. When searching, you will first embed your query using `voyage-law-2`, and then search using the returned vector in Pinecone.

```Python Python
# get a sample query from the dataset, "Will Google help me if I think someone has taken and used content Ive created without my permission?" 
query = queries['text'][0]
print(f"Query: {query}")

# create the query embedding
xq = vc.embed(
    texts=[query],
    model='voyage-law-2',
    input_type="query",
    truncation=True
).embeddings

# query, returning the top 3 most similar results
res = index.query(vector=xq, top_k=3, include_metadata=True)
```

The response from Pinecone includes your original text in the `metadata` field. Let's print out the `top_k` most similar questions and their respective similarity scores.

```Python Python
for match in res['matches']:
    print(f"{match['score']:.2f}: {match['metadata']['text']}")
```

```[Out]:
0.59: Your content
Some of our services give you the opportunity to make your content publicly available  for example, you might post a product or restaurant review that you wrote, or you might upload a blog post that you created.
See the Permission to use your content section for more about your rights in your content, and how your content is used in our services
See the Removing your content section to learn why and how we might remove user-generated content from our services
If you think that someone is infringing your intellectual property rights, you can send us notice of the infringement and well take appropriate action. For example, we suspend or close the Google Accounts of repeat copyright infringers as described in our Copyright Help Centre.


0.47: Google content
Some of our services include content that belongs to Google  for example, many of the visual illustrations that you see in Google Maps. You may use Googles content as allowed by these terms and any service-specific additional terms, but we retain any intellectual property rights that we have in our content. Dont remove, obscure or alter any of our branding, logos or legal notices. If you want to use our branding or logos, please see the Google Brand Permissions page.

Other content
Finally, some of our services gives you access to content that belongs to other people or organisations  for example, a store owners description of their own business, or a newspaper article displayed in Google News. You may not use this content without that person or organisations permission, or as otherwise allowed by law. The views expressed in the content of other people or organisations are their own, and dont necessarily reflect Googles views.


0.45: Taking action in case of problems
Before taking action as described below, well provide you with advance notice when reasonably possible, describe the reason for our action and give you an opportunity to fix the problem, unless we reasonably believe that doing so would:
cause harm or liability to a user, third party or Google
violate the law or a legal enforcement authoritys order
compromise an investigation
compromise the operation, integrity or security of our services

Removing your content
If we reasonably believe that any of your content (1) breaches these terms, service-specific additional terms or policies, (2) violates applicable law, or (3) could harm our users, third parties or Google, then we reserve the right to take down some or all of that content in accordance with applicable law. Examples include child pornography, content that facilitates human trafficking or harassment, and content that infringes someone elses intellectual property rights.

Suspending or terminating your access to Google services
Google reserves the right to suspend or terminate your access to the services or delete your Google Account if any of these things happen:
you materially or repeatedly breach these terms, service-specific additional terms or policies
were required to do so to comply with a legal requirement or a court order
we reasonably believe that your conduct causes harm or liability to a user, third party or Google  for example, by hacking, phishing, harassing, spamming, misleading others or scraping content that doesnt belong to you
If you believe that your Google Account has been suspended or terminated in error, you can appeal.
Of course, youre always free to stop using our services at any time. If you do stop using a service, wed appreciate knowing why so that we can continue improving our services.

```

The semantic search pipeline with Voyage AI and Pinecone is able to identify the relevant consumer contract documents to answer the user query.
