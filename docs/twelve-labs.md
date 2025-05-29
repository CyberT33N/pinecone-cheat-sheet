# Twelve Labs

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

[Twelve Labs](https://twelvelabs.io) is an AI company that provides state-of-the-art video understanding capabilities through its easy-to-use APIs. Our newly released product is the Embed API, which enables developers to create high-quality multimodal embeddings that capture the rich context and interactions between different modalities in videos, such as visual expressions, body language, spoken words, and overall context.

By integrating Twelve Labs' Embed API with Pinecone's vector database, developers can efficiently store, index, and retrieve these multimodal embeddings at scale. This integration empowers developers to build cutting-edge AI applications that leverage video data, such as video search, recommendation systems, content moderation, and more. Developers can seamlessly generate embeddings using Twelve Labs' API and store them in Pinecone for fast and accurate similarity search and retrieval.

The integration of Twelve Labs and Pinecone offers developers a powerful toolkit to process and understand video content in a more human-like manner. By combining Twelve Labs' video-native approach with Pinecone's purpose-built vector search capabilities, developers can unlock new possibilities and build innovative applications across various industries, including media and entertainment, e-commerce, education, and beyond.

<PrimarySecondaryCTA secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## Setup guide

To integrate Twelve Labs' Embed API with Pinecone:

1. Sign up for a [Twelve Labs](https://twelvelabs.io) and obtain your API key.
2. Install the [Twelve Labs Python client library](https://github.com/twelvelabs-io/twelvelabs-python).
3. Sign up for a [Pinecone account](https://app.pinecone.io/) and [create an index](/guides/index-data/create-an-index).
4. Install the [Pinecone client library](/reference/pinecone-sdks).
5. Use the [Twelve Labs Embed API](https://docs.twelvelabs.io/docs/create-embeddings) to generate multimodal embeddings for your videos.
6. Connect to your Pinecone index and [upsert the embeddings](/guides/index-data/upsert-data).
7. [Query the Pinecone index](/guides/search/search-overview) to retrieve similar videos based on embeddings.

For more detailed information and code examples, please see the [Twelve Labs documentation](https://docs.twelvelabs.io).
