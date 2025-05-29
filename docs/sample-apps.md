# Sample apps

export const Tag = ({text, icon}) => {
  return <span className="card-tag">
            {icon && <img src={icon} className={`w-4 h-4 object-contain ${icon.includes("openai") ? "dark-inverted" : ""}`} />}
            {text}
        </span>;
};

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

<div>
  <div className="card-grid not-prose">
    <ExampleCard title="Semantic search" text="The Legal Semantic Search app shows you how to perform semantic search over PDF documents." link="/examples/sample-apps/legal-semantic-search">
      <Tag text="NextJS" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/nextjs.svg" />

      <Tag text="OpenAI" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/openai-icon.svg" />
    </ExampleCard>

    <ExampleCard title="Multi-tenant RAG" text="Namespace Notes is a simple multi-tenant RAG app. Upload documents that feed workspaces with context isolated by namespace." link="/examples/sample-apps/namespace-notes">
      <Tag text="NextJS" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/nextjs.svg" />

      <Tag text="OpenAI" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/openai-icon.svg" />
    </ExampleCard>

    <ExampleCard title="Multi-modal search" text="The Shop the Look app shows you how to build multi-modal search across text, images, and videos." link="/examples/sample-apps/shop-the-look">
      <Tag text="NextJS" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/nextjs.svg" />

      <Tag text="Google Vertex AI" icon="/images/google-cloud-vertex-ai.svg" />
    </ExampleCard>

    <ExampleCard title="Pinecone Assistant" text="The Pinecone Assistant app connects a chat interface to your Pinecone Assistant to answer complex questions on your data." link="/examples/sample-apps/pinecone-assistant">
      <Tag text="NextJS" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/nextjs.svg" />
    </ExampleCard>
  </div>

  <h2 className="examples-h2">More code examples</h2>

  <div className="card-grid not-prose">
    <UtilityExampleCard title="Use the Python SDK with FastAPI" text="A FastAPI app to demonstrate how to use the Pinecone Python SDK with asyncio support." link="https://github.com/pinecone-io/fastapi-pinecone-async-example" />

    <UtilityExampleCard title="Implement semantic search with TypeScript" text="A simple semantic search app written in TypeScript." link="https://github.com/pinecone-io/semantic-search-example" />

    <UtilityExampleCard title="Build an article recommender with TypeScript" text="A simple article recommender app written in TypeScript." link="https://github.com/pinecone-io/recommender-example-typescript" />

    <UtilityExampleCard title="Create a chatbot agent with LangChain" text="A conversational agent built with LangChain and TypeScript." link="https://github.com/pinecone-io/langchain-retrieval-agent-example" />

    <UtilityExampleCard title="Implement image search with TypeScript" text="An image search app written in TypeScript." link="https://github.com/pinecone-io/image-search-example" />
  </div>
</div>
