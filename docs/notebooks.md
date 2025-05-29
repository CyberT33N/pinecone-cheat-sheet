# Notebooks

export const UtilityExampleCard = ({title, text, link}) => {
  return <a href={link} className="example-card group">
            <h2 className="font-bold" style={{
    fontSize: "0.875rem"
  }}>{title}</h2>
            <p style={{
    fontSize: "0.875rem",
    marginTop: "0"
  }}>{text}</p>
        </a>;
};

export const ExampleCard = ({title, text, link, children, arrow, vectors, namespaces}) => {
  return <a href={link} className="example-card group">
            <h2 className="font-semibold text-base">{title}</h2>
            <p>{text}</p>

            {children && <div className="tags">{children}</div>}

            {arrow && <svg xmlns="http://www.w3.org/2000/svg" className="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5.30739 20L4 18.6926L16.8249 5.8677H5.05837V4H20V18.9416H18.1323V7.1751L5.30739 20Z" fill="var(--text-secondary)" />
            </svg>}

            {(vectors || namespaces) && <div className="vectors">
                {vectors && <span>{vectors} vectors</span>}
                {namespaces && <span>{namespaces} namespaces</span>}
            </div>}
        </a>;
};

export const Tag = ({text, icon}) => {
  return <span className="card-tag">
            {icon && <img src={icon} className={`w-4 h-4 object-contain ${icon.includes("openai") ? "dark-inverted" : ""}`} />}
            {text}
        </span>;
};

<div className="card-grid not-prose">
  <ExampleCard title="Semantic Search" text="Implement semantic search with Pinecone in minutes over a simple translation dataset" link="https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/semantic-search.ipynb" arrow>
    <Tag text="Pinecone Integrated Inference" />

    <Tag text="Python" />

    <Tag text="Hugging Face Datasets" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/huggingface-icon.svg" />

    <Tag text="llama-text-embed-v2" />
  </ExampleCard>

  <ExampleCard title="Retrieval Enhanced Generative Question Answering" text="Learn how to query relevant contexts to your queries from Pinecone." link="https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/gen-qa-openai.ipynb" arrow>
    <Tag text="text-davinci-003" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/openai-icon.svg" />

    <Tag text="text-embedding-ada-002" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/openai-icon.svg" />

    <Tag text="Python" />

    <Tag text="OpenAI" />

    <Tag text="Langchain" />
  </ExampleCard>

  <ExampleCard title="Chatbot Agents with LangChain" text="Create conversational agents with LangChain and Pinecone." link="https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/langchain-retrieval-agent.ipynb" arrow>
    <Tag text="gpt-3.5-turbo" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/openai-icon.svg" />

    <Tag text="text-embedding-ada-002" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/openai-icon.svg" />

    <Tag text="Python" />

    <Tag text="OpenAI" />

    <Tag text="Langchain" />
  </ExampleCard>

  <ExampleCard title="Langchain Retrieval Augmentation" text="Give knowledge base information to an LLM using LangChain." link="https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/langchain-retrieval-augmentation.ipynb" arrow>
    <Tag text="gpt-3.5-turbo" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/openai-icon.svg" />

    <Tag text="text-embedding-ada-002" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/openai-icon.svg" />

    <Tag text="Python" />

    <Tag text="OpenAI" />

    <Tag text="Langchain" />
  </ExampleCard>

  <ExampleCard title="Reranking Search Results" text="Use Pinecone's reranking feature to enhance the accuracy of search results." link="https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/pinecone-reranker.ipynb" arrow>
    <Tag text="Python" />

    <Tag text="Pinecone Inference" />

    <Tag text="bge-reranker-v2-m3" icon="https://cdn.sanity.io/images/vr8gru94/production/40b1d05ee1325e6d9e4886af4e76ff06d844faff-188x188.jpg" />
  </ExampleCard>

  <ExampleCard title="Import from object storage" text="Import records from Parquet files in Amazon S3 bucket into a serverless index." link="https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/pinecone-import.ipynb" arrow>
    <Tag text="Python" />

    <Tag text="Amazon S3" />
  </ExampleCard>
</div>

{/* ## Utility Notebooks

  <div className="card-grid not-prose">
    <UtilityExampleCard title="Chunking Examples" text="Notebooks demonstrating text chunking techniques" link="/" />
    <UtilityExampleCard title="Topic Analysis" text="Tools for analyzing the main topics in a text" link="/" />
    <UtilityExampleCard title="Sentiment Scorer" text="Assess the sentiment of given text snippets" link="/" />
    <UtilityExampleCard title="Named Entity Finder" text="Identify and classify named entities in text" link="/" />
    <UtilityExampleCard title="Language Translation" text="Convert text from one language to another" link="/" />
  </div> */}
