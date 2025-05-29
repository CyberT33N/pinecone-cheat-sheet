# Matillion

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

[Matillion Data Productivity Cloud](https://www.matillion.com/) is a unified platform that helps your team move faster with one central place to build and manage graphical, low-code data pipelines. It allows data teams to use structured, semi-structured, and unstructured data in analytics; build AI pipelines for new use cases; and be more productive.

Matillion Data Productivity Cloud and Pinecone can be used together for retrieval augmented generation (RAG) use cases, helping to contextualize business insights without code.

Matillion supports 150+ pre-built data source connectors, as well as the ability to build custom connectors to any REST API source system, making it easy to chunk unstructured datasets, create embeddings, and upsert to Pinecone.
Matillion's graphical AI Prompt Components integrate with large language models (LLM) running in OpenAI, Amazon Bedrock, Azure OpenAI, and Snowpark Container Services. They enable no-code lookup of external knowledge stored in Pinecone, enabling data engineers to enrich GenAI answers with contextualized and proprietary data.

<PrimarySecondaryCTA primaryLabel={"Get started"} primaryHref={"https://docs.matillion.com/data-productivity-cloud/designer/docs/pinecone-vector-upsert/"} />

## Additional resources

* Video: [Use RAG with a Pinecone Vector database on the Data Productivity Cloud](https://www.youtube.com/watch?v=BsH7WlJdoFs)
* Video: [How to upsert to your Pinecone Vector database](https://www.youtube.com/watch?v=l9qt-EzLkgY)
* [Unlock the power of AI in Data Engineering](https://www.matillion.com/blog/matillion-new-ai-capabilities-for-data-engineering)
