# Gathr

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

[Gathr](https://www.gathr.one/) is the world's first and only "data to outcome" platform. Leading enterprises use Gathr to build and operationalize data and AI-driven solutions at scale.

Gathr unifies data engineering, machine learning, generative AI, actionable analytics, and process automation on a single platform. With Gen AI capabilities and no-code rapid application development, Gathr significantly boosts productivity for all. The unified experience fosters seamless handoff and collaboration between teams, accelerating the journey from prototype to production.

Users have achieved success with Gathr, from ingesting petabyte-scale data in real time to orchestrating thousands of complex data processing pipelines in months and delivering actionable insights and xOps solutions to multiply business impact. Additionally, Gathr helps enterprises architect Gen AI solutions for use cases like document summarization, sentiment analysis, next best action, insider threat detection, predictive maintenance, custom chatbots, and more.

Gathr Gen AI Fabric is designed to build enterprise-grade Gen AI solutions end-to-end on a unified platform. It offers production-ready building blocks for creating Gen AI solutions, out-of-the-box Gen AI solution templates, and GathrIQ, a data-to-outcome copilot.

One of the building blocks is integration with Vector DB and Knowledge Graphs. Gathr supports reading and writing from Pinecone using a built-in, ready-to-use connector to support use cases requiring knowledge graphs.

<PrimarySecondaryCTA primaryHref={"https://docs.gathr.one/gathr-saas/docs/components/pinecone/"} primaryLabel={"Get started"} />
