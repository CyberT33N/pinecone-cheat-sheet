# Assistant examples

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

<div className="card-grid not-prose">
  <ExampleCard title="Quickstart" text="Get started with Pinecone Assistant" link="https://colab.research.google.com/github/pinecone-io/examples/blob/master/docs/assistant-quickstart.ipynb" arrow>
    <Tag text="Python" />
  </ExampleCard>

  <ExampleCard title="Retrieve context snippets" text="Retrieve relevant information snippets for your queries" link="https://colab.research.google.com/drive/1AD4QWsXBG1FQRwq-ModlaggR7Cx7NJCz" arrow>
    <Tag text="Python" />
  </ExampleCard>

  <ExampleCard title="Pinecone Assistant" text="Connect your existing Pinecone Assistant to a chat interface with citations and file references." link="/examples/sample-apps/pinecone-assistant">
    <Tag text="NextJS" icon="https://mintlify.s3-us-west-1.amazonaws.com/pinecone-2-sample-apps/images/examples/nextjs.svg" />
  </ExampleCard>
</div>
