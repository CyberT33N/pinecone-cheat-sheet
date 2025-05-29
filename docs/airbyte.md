# Airbyte

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

Airbyte offers a platform for creating ETL pipelines without writing integration code. It supports integrations with hundreds of systems, including databases, data warehouses, and SaaS products.

The Pinecone connector for Airbyte allows users to connect these systems directly into Pinecone. The connector fetches data from the connected source, embeds the data using an large language model (LLM), and then upserts it into Pinecone. From enhancing semantic search capabilities to building intelligent recommendation systems, the Pinecone Airbyte connector offers a versatile solution. By tapping into Airbyte's extensive array of source connectors, you can explore new ways to enrich your data-driven projects and achieve your specific goals.

<PrimarySecondaryCTA primaryHref={"https://docs.airbyte.com/integrations/destinations/pinecone"} primaryLabel={"Get started"} secondaryHref={"https://www.pinecone.io/learn/series/airbyte/"} secondaryLabel={"View setup guide"} />

## Related articles

* [Data Sync and Search: Pinecone and Airbyte](https://www.pinecone.io/learn/series/airbyte/)
* [Introduction to Airbyte and the Pinecone connector](https://www.pinecone.io/learn/series/airbyte/airbyte-and-pinecone-intro/)
* [Postgres to Pinecone Syncing](https://www.pinecone.io/learn/series/airbyte/airbyte-postgres-to-pinecone/)
