# LangChain

> Using LangChain and Pinecone to add knowledge to LLMs

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

LangChain provides modules for managing and optimizing the use of large language models (LLMs) in applications. Its core philosophy is to facilitate data-aware applications where the language model interacts with other data sources and its environment. This framework consists of several parts that simplify the entire application lifecycle:

* Write your applications in LangChain/LangChain.js. Get started quickly by using Templates for reference.
* Use LangSmith to inspect, test, and monitor your chains to constantly improve and deploy with confidence.
* Turn any chain into an API with LangServe.

By integrating Pinecone with LangChain, you can add knowledge to LLMs via retrieval augmented generation (RAG), greatly enhancing LLM ability for autonomous agents, chatbots, question-answering, and multi-agent systems.

<PrimarySecondaryCTA primaryHref={"https://github.com/langchain-ai/pinecone-serverless"} primaryLabel={"Get started"} primaryTarget={"_blank"} secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## Setup guide

This guide shows you how to integrate Pinecone, a high-performance vector database, with [LangChain](https://www.langchain.com/), a framework for building applications powered by large language models (LLMs).

Pinecone enables developers to build scalable, real-time recommendation and search systems based on vector similarity search. LangChain, on the other hand, provides modules for managing and optimizing the use of language models in applications. Its core philosophy is to facilitate data-aware applications where the language model interacts with other data sources and its environment.

By integrating Pinecone with LangChain, you can add knowledge to LLMs via [Retrieval Augmented Generation (RAG)](https://www.pinecone.io/learn/series/rag/), greatly enhancing LLM ability for autonomous agents, chatbots, question-answering, and multi-agent systems.

<Note>
  This guide demonstrates only one way out of many that you can use LangChain and Pinecone together. For additional examples, see:

  * [LangChain AI Handbook](https://www.pinecone.io/learn/series/langchain/)
  * [Retrieval Augmentation for LLMs](https://github.com/pinecone-io/examples/blob/master/learn/generation/langchain/handbook/05-langchain-retrieval-augmentation.ipynb)
  * [Retrieval Augmented Conversational Agent](https://github.com/pinecone-io/examples/blob/master/learn/generation/langchain/handbook/08-langchain-retrieval-agent.ipynb)
</Note>

## Key concepts

The `PineconeVectorStore` class provided by LangChain can be used to interact with Pinecone indexes. It's important to remember that you must have an existing Pinecone index before you can create a `PineconeVectorStore` object.

### Initializing a vector store

To initialize a `PineconeVectorStore` object, you must provide the name of the Pinecone index and an `Embeddings` object initialized through LangChain. There are two general approaches to initializing a `PineconeVectorStore` object:

1. Initialize without adding records:

```Python Python
    import os
    from langchain_pinecone import PineconeVectorStore
    from langchain_openai import OpenAIEmbeddings

    os.environ['OPENAI_API_KEY'] = '<YOUR_OPENAI_API_KEY>'
    os.environ['PINECONE_API_KEY'] = '<YOUR_PINECONE_API_KEY>'

    index_name = "<YOUR_PINECONE_INDEX_NAME>"
    embeddings = OpenAIEmbeddings()

    vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)
```

You can also use the `from_existing_index` method of LangChain's `PineconeVectorStore` class to initialize a vector store.

2. Initialize while adding records:

The `from_documents` and `from_texts` methods of LangChain's `PineconeVectorStore` class add records to a Pinecone index and return a `PineconeVectorStore` object.

The `from_documents` method accepts a list of LangChain's `Document` class objects, which can be created using LangChain's `CharacterTextSplitter` class. The `from_texts` method accepts a list of strings. Similarly to above, you must provide the name of an existing Pinecone index and an `Embeddings` object.

Both of these methods handle the embedding of the provided text data and the creation of records in your Pinecone index.

```Python Python
    import os
    from langchain_pinecone import PineconeVectorStore
    from langchain_openai import OpenAIEmbeddings
    from langchain_community.document_loaders import TextLoader
    from langchain_text_splitters import CharacterTextSplitter

    os.environ['OPENAI_API_KEY'] = '<YOUR_OPENAI_API_KEY>'
    os.environ['PINECONE_API_KEY'] = '<YOUR_PINECONE_API_KEY>'

    index_name = "<YOUR_PINECONE_INDEX_NAME>"
    embeddings = OpenAIEmbeddings()

    # path to an example text file
    loader = TextLoader("../../modules/state_of_the_union.txt")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)

    vectorstore_from_docs = PineconeVectorStore.from_documents(
        docs,
        index_name=index_name,
        embedding=embeddings
    )

    texts = ["Tonight, I call on the Senate to: Pass the Freedom to Vote Act.", "ne of the most serious constitutional responsibilities a President has is nominating someone to serve on the United States Supreme Court.", "One of our nation’s top legal minds, who will continue Justice Breyer’s legacy of excellence."]

    vectorstore_from_texts = PineconeVectorStore.from_texts(
        texts,
        index_name=index_name,
        embedding=embeddings
    )
```

### Add more records

Once you have initialized a `PineconeVectorStore` object, you can add more records to the underlying Pinecone index (and thus also the linked LangChain object) using either the `add_documents` or `add_texts` methods.

Like their counterparts that also initialize a `PineconeVectorStore` object, both of these methods also handle the embedding of the provided text data and the creation of records in your Pinecone index.

```Python Python
    # path to an example text file
    loader = TextLoader("../../modules/inaugural_address.txt")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)

    vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)

    vectorstore.add_documents(docs)
```

```Python Python
    vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)

    vectorstore.add_texts(["More text to embed and add to the index!"])
```

### Perform a similarity search

A `similarity_search` on a `PineconeVectorStore` object returns a list of LangChain `Document` objects most similar to the query provided. While the `similarity_search` uses a Pinecone query to find the most similar results, this method includes additional steps and returns results of a different type.

The `similarity_search` method accepts raw text and automatically embeds it using the `Embedding` object provided when you initialized the `PineconeVectorStore`. You can also provide a `k` value to determine the number of LangChain `Document` objects to return. The default value is `k=4`.

```Python Python
    query = "Who is Ketanji Brown Jackson?"
    vectorstore.similarity_search(query)
    
    # Response:
    # [
    #    Document(page_content='Ketanji Onyika Brown Jackson is an American lawyer and jurist who is an associate justice of the Supreme Court of the United...', metadata={'chunk': 0.0, 'source': 'https://en.wikipedia.org/wiki/Ketanji_Brown_Jackson', 'title': 'Ketanji Brown Jackson', 'wiki-id': '6573'}),  
    #    Document(page_content='Jackson was nominated to the Supreme Court by President Joe Biden on February 25, 2022, and confirmed by the U.S. Senate...', metadata={'chunk': 1.0, 'source': 'https://en.wikipedia.org/wiki/Ketanji_Brown_Jackson', 'title': 'Ketanji Brown Jackson', 'wiki-id': '6573'}),  
    #    Document(page_content='Jackson grew up in Miami and attended Miami Palmetto Senior High School. She distinguished herself as a champion debater...', metadata={'chunk': 3.0, 'source': 'https://en.wikipedia.org/wiki/Ketanji_Brown_Jackson', 'title': 'Ketanji Brown Jackson', 'wiki-id': '6573'}),
    #    Document(page_content='After high school, Jackson matriculated at Harvard University to study government, having applied despite her guidance...', metadata={'chunk': 5.0, 'source': 'https://en.wikipedia.org/wiki/Ketanji_Brown_Jackson', 'title': 'Ketanji Brown Jackson', 'wiki-id': '6573'})
    # ]   
```

You can also optionally apply a metadata filter to your similarity search. The filtering query language is the same as for Pinecone queries, as detailed in [Filtering with metadata](https://docs.pinecone.io/guides/index-data/indexing-overview#metadata).

```Python Python
    query = "Tell me more about Ketanji Brown Jackson."
    vectorstore.similarity_search(query, filter={'source': 'https://en.wikipedia.org/wiki/Ketanji_Brown_Jackson'})
```

### Namespaces

Several methods of the `PineconeVectorStore` class support using [namespaces](https://docs.pinecone.io/guides/indexes/use-namespaces). You can also initialize your `PineconeVectorStore` object with a namespace to restrict all further operations to that space.

```Python Python
    index_name = "<YOUR_PINECONE_INDEX_NAME>"
    embeddings = OpenAIEmbeddings()

    vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings, namespace="example-namespace")
```

If you initialize your `PineconeVectorStore` object without a namespace, you can specify the target namespace within the operation.

```Python Python
    # path to an example text file
    loader = TextLoader("../../modules/congressional_address.txt")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)

    vectorstore_from_docs = PineconeVectorStore.from_documents(
        docs,
        index_name=index_name,
        embedding=embeddings,
        namespace="example-namespace"
    )

    vectorstore_from_texts = PineconeVectorStore.from_texts(
        texts,
        index_name=index_name,
        embedding=embeddings,
        namespace="example-namespace"
    )

    vectorstore_from_docs.add_documents(docs, namespace="example-namespace")

    vectorstore_from_texts.add_texts(["More text!"], namespace="example-namespace")
```

```Python Python
    query = "Who is Ketanji Brown Jackson?"
    vectorstore.similarity_search(query, namespace="example-namespace")
```

## Tutorial

### 1. Set up your environment

Before you begin, install some necessary libraries and set environment variables for your Pinecone and OpenAI API keys:

```Shell
pip install -qU \
  "pinecone[grpc]"==5.1.0 \
  pinecone-datasets==0.7.0 \
  langchain-pinecone==0.1.2 \
  langchain-openai==0.1.23 \
  langchain==0.2.15
```

```Shell
# Set environment variables for API keys
export PINECONE_API_KEY=<your Pinecone API key available at app.pinecone.io>
export OPENAI_API_KEY=<your OpenAI API key, available at platform.openai.com/api-keys>
```

```Python Python
import os
pinecone_api_key = os.environ.get('PINECONE_API_KEY')
openai_api_key = os.environ.get('OPENAI_API_KEY')
```

### 2. Build the knowledge base

1. Load a [sample Pinecone dataset](/guides/data/use-public-pinecone-datasets) into memory:

   ```Python Python
   import pinecone_datasets  
   dataset = pinecone_datasets.load_dataset('wikipedia-simple-text-embedding-ada-002-100K')  
   len(dataset)  

   # Response:
   # 100000
   ```

2. Reduce the dataset and format it for upserting into Pinecone:

   ```Python Python
   # we will use rows of the dataset up to index 30_000
   dataset.documents.drop(dataset.documents.index[30_000:], inplace=True)
   # we drop sparse_values as they are not needed for this example  
   dataset.documents.drop(['metadata'], axis=1, inplace=True)  
   dataset.documents.rename(columns={'blob': 'metadata'}, inplace=True)  
   ```

### 3. Index the data in Pinecone

1. Decide whether to use a [serverless](/guides/index-data/indexing-overview#serverless-indexes) or [pod-based](/guides/index-data/indexing-overview#pod-based-indexes) index.

   ```python Python
   use_serverless = True  
   ```

2. Initialize your client connection to Pinecone and create an index. This step uses the Pinecone API key you set as an environment variable [earlier](#1-set-up-your-environment).

   ```Python Python
   from pinecone.grpc import PineconeGRPC as Pinecone
   from pinecone import ServerlessSpec, PodSpec  
   import time  
   # configure client  
   pc = Pinecone(api_key=pinecone_api_key)  
   if use_serverless:  
       spec = ServerlessSpec(cloud='aws', region='us-east-1')  
   else:  
       # if not using a starter index, you should specify a pod_type too  
       spec = PodSpec()  
   # check for and delete index if already exists  
   index_name = 'langchain-retrieval-augmentation-fast'  
   if pc.has_index(index_name):  
       pc.delete_index(name=index_name)  
   # create a new index  
   pc.create_index(  
       index_name,  
       dimension=1536,  # dimensionality of text-embedding-ada-002  
       metric='dotproduct',  
       spec=spec  
   )  
   ```

3. Target the index and check its current stats:

   ```Python Python
   index = pc.Index(index_name)  
   index.describe_index_stats()  

   # Response:
   # {'dimension': 1536,  
   # 'index_fullness': 0.0,  
   # 'namespaces': {},  
   # 'total_vector_count': 0}  
   ```

   You'll see that the index has a `total_vector_count` of `0`, as you haven't added any vectors yet.

4. Now upsert the data to Pinecone:

   ```Python Python
   for batch in dataset.iter_documents(batch_size=100):  
       index.upsert(batch)  
   ```

5. Once the data is indexed, check the index stats once again:

   ```Python Python
   index.describe_index_stats()  

   # Response:
   # {'dimension': 1536,  
   # 'index_fullness': 0.0,  
   # 'namespaces': {},  
   # 'total_vector_count': 70000} 
   ```

### 4. Initialize a LangChain vector store

Now that you've built your Pinecone index, you need to initialize a LangChain vector store using the index. This step uses the OpenAI API key you set as an environment variable [earlier](#1-set-up-your-environment). Note that OpenAI is a paid service and so running the remainder of this tutorial may incur some small cost.

1. Initialize a LangChain embedding object:

   ```Python Python
   from langchain_openai import OpenAIEmbeddings  
   # get openai api key from platform.openai.com  
   model_name = 'text-embedding-ada-002'  
   embeddings = OpenAIEmbeddings(  
       model=model_name,  
       openai_api_key=openai_api_key  
   )  
   ```

2. Initialize the LangChain vector store:

   The `text_field` parameter sets the name of the metadata field that stores the raw text when you upsert records using a LangChain operation such as `vectorstore.from_documents` or `vectorstore.add_texts`.
   This metadata field is used as the `page_content` in the `Document` objects retrieved from query-like LangChain operations such as `vectorstore.similarity_search`.
   If you do not specify a value for `text_field`, it will default to `"text"`.

   ```Python Python
   from langchain_pinecone import PineconeVectorStore  
   text_field = "text"  
   vectorstore = PineconeVectorStore(  
       index, embeddings, text_field  
   )  
   ```

3. Now you can query the vector store directly using `vectorstore.similarity_search`:

   ```Python Python
   query = "who was Benito Mussolini?"  
   vectorstore.similarity_search(  
       query,  # our search query  
       k=3  # return 3 most relevant docs  
   )  

   # Response:
   # [Document(page_content='Benito Amilcare Andrea Mussolini KSMOM GCTE (29 July 1883 – 28 April 1945) was an Italian politician and journalist...', metadata={'chunk': 0.0, 'source': 'https://simple.wikipedia.org/wiki/Benito%20Mussolini', 'title': 'Benito Mussolini', 'wiki-id': '6754'}),  
   # Document(page_content='Fascism as practiced by Mussolini\nMussolini\'s form of Fascism, "Italian Fascism"- unlike Nazism, the racist ideology...', metadata={'chunk': 1.0, 'source': 'https://simple.wikipedia.org/wiki/Benito%20Mussolini', 'title': 'Benito Mussolini', 'wiki-id': '6754'}),  
   # Document(page_content='Veneto was made part of Italy in 1866 after a war with Austria. Italian soldiers won Latium in 1870. That was when...', metadata={'chunk': 5.0, 'source': 'https://simple.wikipedia.org/wiki/Italy', 'title': 'Italy', 'wiki-id': '363'})]
   ```

All of these sample results are good and relevant. But what else can you do with this? There are many tasks, one of the most interesting (and well supported by LangChain) is called "Generative Question-Answering" or GQA.

### 5. Use Pinecone and LangChain for RAG

In RAG, you take the query as a question that is to be answered by a LLM, but the LLM must answer the question based on the information it is seeing from the vectorstore.

1. To do this, initialize a `RetrievalQA` object like so:

   ```Python Python
   from langchain_openai import ChatOpenAI  
   from langchain.chains import RetrievalQA  
   # completion llm  
   llm = ChatOpenAI(  
       openai_api_key=OPENAI_API_KEY,  
       model_name='gpt-3.5-turbo',  
       temperature=0.0  
   )  
   qa = RetrievalQA.from_chain_type(  
       llm=llm,  
       chain_type="stuff",  
       retriever=vectorstore.as_retriever()  
   )  
   qa.invoke(query)  

   # Response:
   # Benito Mussolini was an Italian politician and journalist who served as the Prime Minister of Italy from 1922 until 1943. He was the leader of the National Fascist Party and played a significant role in the rise of fascism in Italy...
   ```

2. You can also include the sources of information that the LLM is using to answer your question using a slightly different version of `RetrievalQA` called `RetrievalQAWithSourcesChain`:

   ```Python Python
   from langchain.chains import RetrievalQAWithSourcesChain  
   qa_with_sources = RetrievalQAWithSourcesChain.from_chain_type(  
       llm=llm,  
       chain_type="stuff",  
       retriever=vectorstore.as_retriever()  
   )  
   qa_with_sources.invoke(query)

   # Response:
   # {'question': 'who was Benito Mussolini?',  
   # 'answer': "Benito Mussolini was an Italian politician and journalist who served as the Prime Minister of Italy from 1922 until 1943. He was the leader of the National Fascist Party and played a significant role in the rise of fascism in Italy...",  
   # 'sources': 'https://simple.wikipedia.org/wiki/Benito%20Mussolini'}  
   ```

### 6. Clean up

When you no longer need the index, use the `delete_index` operation to delete it:

```Python Python
pc.delete_index(name=index_name)
```

## Related articles

* [LangChain AI Handbook](https://www.pinecone.io/learn/series/langchain/)
