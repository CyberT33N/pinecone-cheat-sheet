# Langtrace

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

Scale3 Labs recently launched Langtrace AI, an open-source monitoring and evaluation platform for LLM-powered applications. Langtrace is built based on Open Telemetry(OTEL) standards and supports native tracing for the most popular LLM vendors, VectorDBs, and frameworks(like Langchain and LlamaIndex).

Langtrace AI supports tracing Pinecone natively, which means the Langtrace SDK can generate OTEL standard traces with automatic instrumentation in just 2 lines of code. These traces can be ingested by an observability tool that supports OTEL, such as Datadog, Grafana/Prometheus, SigNoz, Sentry, etc. Langtrace also has a visualization client that is optimized for visualizing the traces generated in an LLM stack.

By having a Pinecone integration, Pinecone users can get access to rich and high cardinal tracing for the Pinecone API calls using Langtrace, which they can ingest into their observability tool of choice. This helps customers gain insights into the DB calls and help with debugging and troubleshooting applications in case of incidents.

<PrimarySecondaryCTA primaryHref={"https://langtrace.ai/blog/tracing-pinecone-using-langtrace"} primaryLabel={"Get started"} secondaryHref={"https://www.youtube.com/watch?v=9BM0M8lwTBg"} secondaryLabel={"View video tutorial"} />
