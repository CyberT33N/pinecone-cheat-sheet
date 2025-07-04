# Haystack

> Using Haystack and Pinecone to keep your NLP-driven apps up-to-date

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

Haystack is the open source Python framework by Deepset for building custom apps with large language models (LLMs). It lets you quickly try out the latest models in natural language processing (NLP) while being flexible and easy to use. Their community of users and builders has helped shape Haystack into what it is today: a complete framework for building production-ready NLP apps.

Haystack and Pinecone integration can be used to keep your NLP-driven apps up-to-date with Haystack's indexing pipelines that help you prepare and maintain your data.

<PrimarySecondaryCTA secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## Setup guide

In this guide we will see how to integrate Pinecone and the popular [Haystack library](https://github.com/deepset-ai/haystack) for *Question-Answering*.

### Install Haystack

We start by installing the latest version of Haystack with all dependencies required for the `PineconeDocumentStore`.

```Python Python
pip install -U farm-haystack>=1.3.0 pinecone[grpc] datasets
```

### Initialize the PineconeDocumentStore

We initialize a `PineconeDocumentStore` by providing an API key and environment name. [Create an account](https://app.pinecone.io) to get your free API key.

```Python Python
from haystack.document_stores import PineconeDocumentStore

document_store = PineconeDocumentStore(
    api_key='<YOUR_API_KEY>',
    index='haystack-extractive-qa',
    similarity="cosine",
    embedding_dim=384
)
```

```
INFO - haystack.document_stores.pinecone -  Index statistics: name: haystack-extractive-qa, embedding dimensions: 384, record count: 0
```

### Prepare data

Before adding data to the document store, we must download and convert data into the Document format that Haystack uses.

We will use the SQuAD dataset available from Hugging Face Datasets.

```Python Python
from datasets import load_dataset

# load the squad dataset
data = load_dataset("squad", split="train")
```

Next, we remove duplicates and unecessary columns.

```Python Python
# convert to a pandas dataframe
df = data.to_pandas()
# select only title and context column
df = df[["title", "context"]]
# drop rows containing duplicate context passages
df = df.drop_duplicates(subset="context")
df.head()
```

| title | context                     |                                                   |
| ----- | --------------------------- | ------------------------------------------------- |
| 0     | University\_of\_Notre\_Dame | Architecturally, the school has a Catholic cha... |
| 5     | University\_of\_Notre\_Dame | As at most other universities, Notre Dame's st... |
| 10    | University\_of\_Notre\_Dame | The university is the major seat of the Congre... |
| 15    | University\_of\_Notre\_Dame | The College of Engineering was established in ... |
| 20    | University\_of\_Notre\_Dame | All of Notre Dame's undergraduate students are... |

Then convert these records into the Document format.

```Python Python
from haystack import Document

docs = []
for d in df.iterrows():
    d = d[1]
    # create haystack document object with text content and doc metadata
    doc = Document(
        content=d["context"],
        meta={
            "title": d["title"],
            'context': d['context']
        }
    )
    docs.append(doc)
```

This `Document` format contains two fields; *'content'* for the text content or paragraphs, and *'meta'* where we can place any additional information that can later be used to apply metadata filtering in our search.

Now we upsert the documents to Pinecone.

```Python Python
# upsert the data document to pinecone index
document_store.write_documents(docs)
```

### Initialize retriever

The next step is to create embeddings from these documents. We will use Haystacks `EmbeddingRetriever` with a SentenceTransformer model (`multi-qa-MiniLM-L6-cos-v1`) which has been designed for question-answering.

```Python Python
from haystack.retriever.dense import EmbeddingRetriever

retriever = EmbeddingRetriever(
    document_store=document_store,
    embedding_model="multi-qa-MiniLM-L6-cos-v1",
    model_format="sentence_transformers"
)
```

Then we run the `PineconeDocumentStore.update_embeddings` method with the `retriever` provided as an argument. GPU acceleration can greatly reduce the time required for this step.

```Python Python
document_store.update_embeddings(
    retriever,
    batch_size=16
)
```

### Inspect documents and embeddings

We can get documents by their ID with the `PineconeDocumentStore.get_documents_by_id` method.

```Python Python
d = document_store.get_documents_by_id(ids=['49091c797d2236e73fab510b1e9c7f6b'], return_embedding=True)[0]
```

From here we return can view document content with `d.content` and the document embedding with `d.embedding`.

### Initialize an extractive QA pipeline

An `ExtractiveQAPipeline` contains three key components by default:

* a document store (`PineconeDocumentStore`)
* a retriever model
* a reader model

We use the `deepset/electra-base-squad2` model from the HuggingFace model hub as our reader model.

```Python Python
from haystack.nodes import FARMReader

reader = FARMReader(
    model_name_or_path='deepset/electra-base-squad2', 
    use_gpu=True
)
```

We are now ready to initialize the `ExtractiveQAPipeline`.

```Python Python
from haystack.pipelines import ExtractiveQAPipeline

pipe = ExtractiveQAPipeline(reader, retriever)
```

### Ask Questions

Using our QA pipeline we can begin querying with `pipe.run`.

```Python Python
from haystack.utils import print_answers

query = "What was Albert Einstein famous for?"
# get the answer
answer = pipe.run(
    query=query,
    params={
        "Retriever": {"top_k": 1},
    }
)
# print the answer(s)
print_answers(answer)
```

```
Inferencing Samples: 100%|██████████| 1/1 [00:00<00:00,  3.53 Batches/s]

Query: What was Albert Einstein famous for?
Answers:
[   <Answer {
    'answer': 'his theories of special relativity and general relativity', 'type': 'extractive', 'score': 0.993550717830658,
    'context': 'Albert Einstein is known for his theories of special relativity and general relativity. He also made important contributions to statistical mechanics,',
    'offsets_in_document': [{'start': 29, 'end': 86}],
    'offsets_in_context': [{'start': 29, 'end': 86}], 
    'document_id': '23357c05e3e46bacea556705de1ea6a5',
    'meta': {
        'context': 'Albert Einstein is known for his theories of special relativity and general relativity. He also made important contributions to statistical mechanics, especially his mathematical treatment of Brownian motion, his resolution of the paradox of specific heats, and his connection of fluctuations and dissipation. Despite his reservations about its interpretation, Einstein also made contributions to quantum mechanics and, indirectly, quantum field theory, primarily through his theoretical studies of the photon.', 'title': 'Modern_history'
    }
}>]
```

```Python Python
query = "How much oil is Egypt producing in a day?"
# get the answer
answer = pipe.run(
    query=query,
    params={
        "Retriever": {"top_k": 1},
    }
)
# print the answer(s)
print_answers(answer)
```

```
Inferencing Samples: 100%|██████████| 1/1 [00:00<00:00,  3.81 Batches/s]

Query: How much oil is Egypt producing in a day?
Answers:
[   <Answer {
    'answer': '691,000 bbl/d', 'type': 'extractive', 'score': 0.9999906420707703,
    'context': 'Egypt was producing 691,000 bbl/d of oil and 2,141.05 Tcf of natural gas (in 2013), which makes Egypt as the largest oil producer not member of the Or',
    'offsets_in_document': [{'start': 20, 'end': 33}],
    'offsets_in_context': [{'start': 20, 'end': 33}],
    'document_id': '57ed9720050a17237e323da5e3969a9b',
    'meta': {
        'context': 'Egypt was producing 691,000 bbl/d of oil and 2,141.05 Tcf of natural gas (in 2013), which makes Egypt as the largest oil producer not member of the Organization of the Petroleum Exporting Countries (OPEC) and the second-largest dry natural gas producer in Africa. In 2013, Egypt was the largest consumer of oil and natural gas in Africa, as more than 20% of total oil consumption and more than 40% of total dry natural gas consumption in Africa. Also, Egypt possesses the largest oil refinery capacity in Africa 726,000 bbl/d (in 2012). Egypt is currently planning to build its first nuclear power plant in El Dabaa city, northern Egypt.', 'title': 'Egypt'
    }
}>]
```

```Python Python
query = "What are the first names of the youtube founders?"
# get the answer
answer = pipe.run(
    query=query,
    params={
        "Retriever": {"top_k": 1},
    }
)
# print the answer(s)
print_answers(answer)
```

```
Inferencing Samples: 100%|██████████| 1/1 [00:00<00:00,  3.83 Batches/s]

Query: What are the first names of the youtube founders?
Answers:
[   <Answer {
    'answer': 'Hurley and Chen', 'type': 'extractive', 'score': 0.9998972713947296,
    'context': 'According to a story that has often been repeated in the media, Hurley and Chen developed the idea for YouTube during the early months of 2005, after ',
    'offsets_in_document': [{'start': 64, 'end': 79}],
    'offsets_in_context': [{'start': 64, 'end': 79}],
    'document_id': 'bd1cbd61ab617d840c5f295e21e80092',
    'meta': {
        'context': 'According to a story that has often been repeated in the media, Hurley and Chen developed the idea for YouTube during the early months of 2005, after they had experienced difficulty sharing videos that had been shot at a dinner party at Chen\'s apartment in San Francisco. Karim did not attend the party and denied that it had occurred, but Chen commented that the idea that YouTube was founded after a dinner party "was probably very strengthened by marketing ideas around creating a story that was very digestible".', 'title': 'YouTube'
    }
}>]
```

We can return multiple answers by setting the `top_k` parameter.

```Python Python
query = "Who was the first person to step foot on the moon?"
# get the answer
answer = pipe.run(
    query=query,
    params={
        "Retriever": {"top_k": 3},
    }
)
# print the answer(s)
print_answers(answer)
```

```
Inferencing Samples: 100%|██████████| 1/1 [00:00<00:00,  3.71 Batches/s]
Inferencing Samples: 100%|██████████| 1/1 [00:00<00:00,  3.78 Batches/s]
Inferencing Samples: 100%|██████████| 1/1 [00:00<00:00,  3.88 Batches/s]

Query: Who was the first person to step foot on the moon?
Answers:
[   <Answer {
    'answer': 'Armstrong', 'type': 'extractive', 'score': 0.9998227059841156, 
    'context': 'The trip to the Moon took just over three days. After achieving orbit, Armstrong and Aldrin transferred into the Lunar Module, named Eagle, and after ', 
    'offsets_in_document': [{'start': 71, 'end': 80}], 
    'offsets_in_context': [{'start': 71, 'end': 80}], 
    'document_id': 'f74e1bf667e68d72e45437a7895df921', 
    'meta': {
        'context': 'The trip to the Moon took just over three days. After achieving orbit, Armstrong and Aldrin transferred into the Lunar Module, named Eagle, and after a landing gear inspection by Collins remaining in the Command/Service Module Columbia, began their descent. After overcoming several computer overload alarms caused by an antenna switch left in the wrong position, and a slight downrange error, Armstrong took over manual flight control at about 180 meters (590 ft), and guided the Lunar Module to a safe landing spot at 20:18:04 UTC, July 20, 1969 (3:17:04 pm CDT). The first humans on the Moon would wait another six hours before they ventured out of their craft. At 02:56 UTC, July 21 (9:56 pm CDT July 20), Armstrong became the first human to set foot on the Moon.', 'title': 'Space_Race'
        }
    }>, <Answer {
    'answer': 'Frank Borman', 'type': 'extractive', 'score': 0.7770257890224457, 
    'context': 'On December 21, 1968, Frank Borman, James Lovell, and William Anders became the first humans to ride the Saturn V rocket into space on Apollo 8. They ', 
    'offsets_in_document': [{'start': 22, 'end': 34}], 
    'offsets_in_context': [{'start': 22, 'end': 34}], 
    'document_id': '2bc046ba90d94fe201ccde9d20552200', 
    'meta': {
        'context': "On December 21, 1968, Frank Borman, James Lovell, and William Anders became the first humans to ride the Saturn V rocket into space on Apollo 8. They also became the first to leave low-Earth orbit and go to another celestial body, and entered lunar orbit on December 24. They made ten orbits in twenty hours, and transmitted one of the most watched TV broadcasts in history, with their Christmas Eve program from lunar orbit, that concluded with a reading from the biblical Book of Genesis. Two and a half hours after the broadcast, they fired their engine to perform the first trans-Earth injection to leave lunar orbit and return to the Earth. Apollo 8 safely landed in the Pacific ocean on December 27, in NASA's first dawn splashdown and recovery.", 'title': 'Space_Race'
        }
    }>, <Answer {
    'answer': 'Aldrin', 'type': 'extractive', 'score': 0.6680101901292801, 
    'context': ' were, "That\'s one small step for [a] man, one giant leap for mankind." Aldrin joined him on the surface almost 20 minutes later. Altogether, they spe', 
    'offsets_in_document': [{'start': 240, 'end': 246}], 
    'offsets_in_context': [{'start': 72, 'end': 78}], 
    'document_id': 'ae1c366b1eaf5fc9d32a8d81f76bd795', 
    'meta': {
        'context': 'The first step was witnessed by at least one-fifth of the population of Earth, or about 723 million people. His first words when he stepped off the LM\'s landing footpad were, "That\'s one small step for [a] man, one giant leap for mankind." Aldrin joined him on the surface almost 20 minutes later. Altogether, they spent just under two and one-quarter hours outside their craft. The next day, they performed the first launch from another celestial body, and rendezvoused back with Columbia.', 'title': 'Space_Race'
        }
    }>
]
```
