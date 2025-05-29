# TruLens

> Using TruLens and Pinecone to evaluate grounded LLM applications

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

TruLens is a powerful open source library for evaluating and tracking large language model-based applications. TruLens provides a set of tools for developing and monitoring neural nets, including large language models (LLMs). This includes both tools for evaluation of LLMs and LLM-based applications with TruLens-Eval and deep learning explainability with TruLens-Explain.

To build an effective RAG-style LLM application, it is important to experiment with various configuration choices while setting up your Pinecone vector database, and study their impact on performance metrics. Tracking and evaluation with TruLens enables fast iteration of your application.

<PrimarySecondaryCTA secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## Setup guide

[TruLens](https://github.com/truera/trulens) is a powerful open source library for evaluating and tracking large language model-based applications. In this guide, we will show you how to use TruLens to evaluate applications built on top of a high performance Pinecone vector database.

### Why TruLens?

Systematic evaluation is needed to support reliable, non-hallucinatory LLM-based applications. TruLens contains instrumentation and evaluation tools for large language model (LLM)-based applications. For evaluation, TruLens provides a set of feedback functions, analogous to labeling functions, to programmatically score the input, output and intermediate text of an LLM app. Each LLM application request can be scored on its question-answer relevance, context relevance and groundedness. These feedback functions provide evidence that your LLM-application is non-hallucinatory.

![diagram-1](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/1.png)

In addition to the above, feedback functions also support the evaluation of ground truth agreement, sentiment, model agreement, language match, toxicity, and a full suite of moderation evaluations, including hate, violence and more. TruLens implements feedback functions as an extensible framework that can evaluate your custom needs as well.

During the development cycle, TruLens supports the iterative development of a wide range of LLM applications by wrapping your application to log cost, latency, key metadata and evaluations of each application run. This allows you to track and identify failure modes, pinpoint their root cause, and measure improvement across experiments.

![application-screenshot](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/2.png)

### Why Pinecone?

Large language models alone have a hallucination problem. Several decades of machine learning research have optimized models, including modern LLMs, for generalization, while actively penalizing memorization. However, many of today's applications require factual, grounded answers. LLMs are also expensive to train, and provided by third party APIs. This means the knowledge of an LLM is fixed. Retrieval-augmented generation (RAG) is a way to reliably ensure models are grounded, with Pinecone as the curated source of real world information, long term memory, application domain knowledge, or whitelisted data.

In the RAG paradigm, rather than just passing a user question directly to a language model, the system retrieves any documents that could be relevant in answering the question from the knowledge base, and then passes those documents (along with the original question) to the language model to generate the final response. The most popular method for RAG involves chaining together LLMs with vector databases, such as the widely used Pinecone vector DB.

In this process, a numerical vector (an embedding) is calculated for all documents, and those vectors are then stored in a database optimized for storing and querying vectors. Incoming queries are vectorized as well, typically using an encoder LLM to convert the query into an embedding. The query embedding is then matched via embedding similarity against the document embeddings in the vector database to retrieve the documents that are relevant to the query.

![diagram-2](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/3.png)

Pinecone makes it easy to build high-performance vector search applications, including retrieval-augmented question answering. Pinecone can easily handle very large scales of hundreds of millions and even billions of vector embeddings. Pinecone's large scale allows it to handle long term memory or a large corpus of rich external and domain-appropriate data so that the LLM component of RAG application can focus on tasks like summarization, inference and planning. This setup is optimal for developing a non-hallucinatory application.\
In addition, Pinecone is fully managed, so it is easy to change configurations and components. Combined with the tracking and evaluation with TruLens, this is a powerful combination that enables fast iteration of your application.

### Using Pinecone and TruLens to improve LLM performance and reduce hallucination

To build an effective RAG-style LLM application, it is important to experiment with various configuration choices while setting up the vector database, and study their impact on performance metrics.

In this example, we explore the downstream impact of some of these configuration choices on response quality, cost and latency with a sample LLM application built with Pinecone as the vector DB. The evaluation and experiment tracking is done with the [TruLens](https://www.trulens.org/) open source library. TruLens offers an extensible set of [feedback functions](https://truera.com/ai-quality-education/generative-ai-and-llms/whats-missing-to-evaluate-foundation-models-at-scale/) to evaluate LLM apps and enables developers to easily track their LLM app experiments.

In each component of this application, different configuration choices can be made that can impact downstream performance. Some of these choices include the following:

**Constructing the Vector DB**

* Data preprocessing and selection
* Chunk Size and Chunk Overlap
* Index distance metric
* Selection of embeddings

**Retrieval**

* Amount of context retrieved (top k)
* Query planning

**LLM**

* Prompting
* Model choice
* Model parameters (size, temperature, frequency penalty, model retries, etc.)

These configuration choices are useful to keep in mind when constructing your app. In general, there is no optimal choice for all use cases. Rather, we recommend that you experiment with and evaluate a variety of configurations to find the optimal selection as you are building your application.

#### Creating the index in Pinecone

Here we'll download a pre-embedded dataset from the `pinecone-datasets` library allowing us to skip the embedding and preprocessing steps.

```Python Python
import pinecone_datasets

dataset = pinecone_datasets.load_dataset('wikipedia-simple-text-embedding-ada-002-100K')
dataset.head()
```

After downloading the data, we can initialize our pinecone environment and create our first index. Here, we have our first potentially important choice, by selecting the **distance metric** used for our index.

<Note>
  Since all fields are currently indexed by default, we'll also pass in an additional empty metadata\_config parameter to avoid duplicative (and costly) indexing.
</Note>

```Python Python
pinecone.create_index(
        name=index_name_v1,
        metric='cosine', # We'll try each distance metric here.
        dimension=1536,  # 1536 dim of text-embedding-ada-002,
        metadata_config={“indexed”:[]} # pass an empty list for names of indexed metadata fields 
)
```

Then, we can upsert our documents into the index in batches.

```Python Python
for batch in dataset.iter_documents(batch_size=100):
    index.upsert(batch)
```

#### Build the vector store

Now that we've built our index, we can start using LangChain to initialize our vector store.

```Python Python
embed = OpenAIEmbeddings(
    model='text-embedding-ada-002',
    openai_api_key=OPENAI_API_KEY
)

from langchain.vectorstores import Pinecone

text_field = "text"

# Switch back to a normal index for LangChain.
index = pinecone.Index(index_name_v1)

vectorstore = Pinecone(
    index, embed.embed_query, text_field
)
```

In RAG, we take the query as a question that is to be answered by an LLM, but the LLM must answer the question based on the information it receives from the `vectorstore`.

#### Initialize our RAG application

To do this, we initialize a `RetrievalQA` as our app:

```Python Python
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

# completion llm
llm = ChatOpenAI(
    model_name='gpt-3.5-turbo',
    temperature=0.0
)

qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)
```

#### TruLens for evaluation and tracking of LLM experiments

Once we've set up our app, we should put together our [feedback functions](https://truera.com/ai-quality-education/generative-ai-and-llms/whats-missing-to-evaluate-foundation-models-at-scale/). As a reminder, feedback functions are an extensible method for evaluating LLMs. Here we'll set up two feedback functions: `qs_relevance` and `qa_relevance`. They're defined as follows:

*QS Relevance: query-statement relevance is the average of relevance (0 to 1) for each context chunk returned by the semantic search.*
*QA Relevance: question-answer relevance is the relevance (again, 0 to 1) of the final answer to the original question.*

```Python Python
# Imports main tools for eval
from trulens_eval import TruChain, Feedback, Tru, feedback, Select
import numpy as np
tru = Tru()

# OpenAI as feedback provider
openai = feedback.OpenAI()

# Question/answer relevance between overall question and answer.
qa_relevance = Feedback(openai.relevance).on_input_output()

# Question/statement relevance between question and each context chunk.
qs_relevance = 
Feedback(openai.qs_relevance).
on_input()
# See explanation below 
.on(Select.Record.app.combine_documents_chain._call.args.inputs.input_documents[:].page_content)
.aggregate(np.mean)

```

Our use of selectors here also requires an explanation.

QA Relevance is the simpler of the two. Here, we are using `.on_input_output()` to specify that the feedback function should be applied on both the input and output of the application.

For QS Relevance, we use TruLens selectors to locate the context chunks retrieved by our application. Let's break it down into simple parts:

1. Argument Specification – The `on_input` which appears first is a convenient shorthand and states that the first argument to `qs_relevance` (the question) is to be the main input of the app.

2. Argument Specification – The `on(Select...)` line specifies where the statement argument to the implementation comes from. We want to evaluate the context chunks, which are an intermediate step of the LLM app. This form references the langchain app object call chain, which can be viewed from `tru.run_dashboard()`. This flexibility allows you to apply a feedback function to any intermediate step of your LLM app. Below is an example where TruLens displays how to select each piece of the context.

   ![subcomponents](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/4.png)

3. Aggregation specification -- The last line aggregate (`np.mean`) specifies how feedback outputs are to be aggregated. This only applies to cases where the argument specification names more than one value for an input or output.

The result of these lines is that `f_qs_relevance` can be now be run on apps/records and will automatically select the specified components of those apps/records

To finish up, we just wrap our Retrieval QA app with TruLens along with a list of the feedback functions we will use for eval.

```Python Python
# wrap with TruLens
truchain = TruChain(qa,
    app_id='Chain1_WikipediaQA',
    feedbacks=[qa_relevance, qs_relevance])

truchain(“Which state is Washington D.C. in?”)
```

After submitting a number of queries to our application, we can track our experiment and evaluations with the TruLens dashboard.

```Python Python
tru.run_dashboard()
```

Here is a view of our first experiment:

![trulens-dashboard-1](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/5.png)

#### Experiment with distance metrics

Now that we've walked through the process of building our tracked RAG application using cosine as the distance metric, all we have to do for the next two experiments is to rebuild the index with `euclidean` or `dotproduct` as the metric and follow the rest of the steps above as is.

Because we are using OpenAI embeddings, which are normalized to length 1, dot product and cosine distance are equivalent - and Euclidean will also yield the same ranking. See the OpenAI docs for more information. With the same document ranking, we should not expect a difference in response quality, but computation latency may vary across the metrics. Indeed, OpenAI advises that dot product computation may be a bit faster than cosine. We will be able to confirm this expected latency difference with TruLens.

```Python Python
index_name_v2 = 'langchain-rag-euclidean'
pinecone.create_index(
        name=index_name_v2,
        metric='euclidean', # metric='dotproduct',
        dimension=1536,  # 1536 dim of text-embedding-ada-002
    )
```

After doing so, we can view our evaluations for all three LLM apps sitting on top of the different indexes. All three apps are struggling with query-statement relevance. In other words, the context retrieved is only somewhat relevant to the original query.

**We can also see that both the Euclidean and dot-product metrics performed at a lower latency than cosine at roughly the same evaluation quality.**

![trulens-dashboard-2](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/6.png)

### Problem: hallucination

Digging deeper into the Query Statement Relevance, we notice one problem in particular with a question about famous dental floss brands. The app responds correctly, but is not backed up by the context retrieved, which does not mention any specific brands.

![trulens-dashboard-feedback-1](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/7.png)

#### Quickly evaluate app components with LangChain and TruLens

Using a less powerful model is a common way to reduce hallucination for some applications. We'll evaluate ada-001 in our next experiment for this purpose.

![trulens-dashboard-3](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/8.png)

Changing different components of apps built with frameworks like LangChain is really easy. In this case we just need to call `text-ada-001` from the LangChain LLM store. Adding in easy evaluation with TruLens allows us to quickly iterate through different components to find our optimal app configuration.

```Python Python
# completion llm
from langchain.llms import OpenAI

llm = OpenAI(
    model_name='text-ada-001',
    temperature=0
)

from langchain.chains import RetrievalQAWithSourcesChain
qa_with_sources = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# wrap with TruLens
truchain = TruChain(qa_with_sources,
    app_id='Chain4_WikipediaQA',
    feedbacks=[qa_relevance, qs_relevance])
```

**However, this configuration with a less powerful model struggles to return a relevant answer given the context provided.**

![trulens-dashboard-4](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/9.png)

For example, when asked “Which year was Hawaii's state song written?”, the app retrieves context that contains the correct answer but fails to respond with that answer, instead simply responding with the name of the song.

![trulens-dashboard-feedback-2](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/10.png)

While our relevance function is not doing a great job here in differentiating which context chunks are relevant, we can manually see that only the one (the 4th chunk) mentions the year the song was written. Narrowing our `top_k`, or the number of context chunks retrieved by the semantic search, may help.

We can do so as follows:

```Python Python
qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(top_k = 1)
)
```

The way the `top_k` is implemented in LangChain's RetrievalQA is that the documents are still retrieved by semantic search and only the `top_k` are passed to the LLM. Therefore, TruLens also captures all of the context chunks that are being retrieved. In order to calculate an accurate QS Relevance metric that matches what's being passed to the LLM, we only calculate the relevance of the top context chunk retrieved by slicing the `input_documents` passed into the TruLens Select function:

```Python Python
qs_relevance = Feedback(openai.qs_relevance).on_input().on(
    Select.Record.app.combine_documents_chain._call.args.inputs.input_documents[:1].page_content
).aggregate(np.mean)
```

Once we've done so, our final application has much improved `qs_relevance`, `qa_relevance` and latency!

![trulens-dashboard-5](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/11.png)

With that change, our application is successfully retrieving the one piece of context it needs, and successfully forming an answer from that context.

![trulens-dashboard-feedback-3](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/12.png)

Even better, the application now knows what it doesn't know:

![trulens-dashboard-feedback-4](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/13.png)

### Summary

In conclusion, we note that exploring the downstream impact of some Pinecone configuration choices on response quality, cost and latency is an important part of the LLM app development process, ensuring that we make the choices that lead to the app performing the best. Overall, TruLens and Pinecone are the perfect combination for building reliable RAG-style applications. Pinecone provides a way to efficiently store and retrieve context used by LLM apps, and TruLens provides a way to track and evaluate each iteration of your application.
