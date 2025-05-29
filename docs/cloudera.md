# Cloudera AI

> Vector embedding, RAG, and semantic search at scale

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

[Cloudera AI](https://www.cloudera.com/) is an enterprise data cloud experience that provides scalable, secure, and agile machine learning and AI workflows. It leverages the power of Python, Apache Spark, R, and a host of other runtimes for distributed data processing, enabling the efficient creation, ingestion, and updating of vector embeddings at scale.

The primary advantage of Cloudera AI lies in its integration with the Cloudera ecosystem, which facilitates seamless data flow and processing across various stages of machine learning and AI pipelines. Cloudera AI offers interactive sessions, collaborative projects, model hosting capabilities, and application hosting features, all within a Python-centric development environment. This multifaceted approach enables users to efficiently develop, train, and deploy machine learning and AI models at scale.

Integrating Pinecone with Cloudera AI elevates the potential of Retrieval-Augmented Generation (RAG) models by providing a robust, scalable vector search platform. Pinecone's strength in handling vector embeddings—characterized by its ultra-low query latency, dynamic index updates, and scalability to billions of vector embeddings—make it the perfect match for the nuanced needs of RAG applications built on Cloudera AI.

Within the Cloudera AI ecosystem, Pinecone acts as a first-class citizen for RAG by efficiently retrieving relevant context from massive datasets, enhancing the generation capabilities of models with relevant, real-time data. This integration enables the development of sophisticated machine learning and AI applications that combine the predictive power of Cloudera AI's hosted models with the dynamic retrieval capabilities of Pinecone, offering unparalleled accuracy and relevance for generated outputs. By leveraging Cloudera AI's project and session management features, developers can prototype, develop, and deploy these complex systems more effectively, making advanced machine learning and AI applications more accessible and practical for enterprise use.

Cloudera's Accelerators for Machine Learning Projects (AMPs) drive efficient deployment of RAG architectures by doing the development work for you. This AMP serves as a prototype for fully integrating Pinecone into a RAG use case and illustrates semantic search with RAG at scale.

<PrimarySecondaryCTA primaryLabel="Get started" primaryHref="https://github.com/cloudera/CML_AMP_Intelligent-QA-Chatbot-with-NiFi-Pinecone-and-Llama2" />

## Additional resources

* [Python script](https://github.com/cloudera/CML_llm-hol/blob/main/2_populate_vector_db/pinecone_vectordb_insert.py) - Example of creating vectors in Pinecone
* [Jupyter notebook](https://github.com/cloudera/CML_llm-hol/blob/main/3_query_vector_db/pinecone_vectordb_query.ipynb) - Example of querying Pinecone collections
