# Datadog

> Monitoring Pinecone with Datadog

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

<Note>
  This feature is available on the [Standard, Enterprise, and Dedicated plans](https://www.pinecone.io/pricing/).
</Note>

Datadog is a monitoring and analytics tool that can be used to determine performance metrics as well as event monitoring for infrastructure and cloud services. Use Datadog to:

* Optimize performance and control usage: Observe and track specific actions (e.g., request count) within Pinecone to identify application requests with high latency or usage. Monitor trends and gain actionable insights to improve resource utilization and reduce spend.
* Automatically alert on metrics: Get alerted when index fullness reaches a certain threshold. You can also create your own customized monitors to alert on specific metrics and thresholds.
* Locate and triage unexpected spikes in usage or latency: Quickly visualize anomalies in usage or latency in Pinecone's Datadog dashboard. View metrics over time to better understand trends and determine the severity of a spike.

<PrimarySecondaryCTA secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## Setup guide

Follow these steps to monitor a Pinecone project with Datadog:

1. Go to the [Pinecone integration](https://app.datadoghq.com/integrations/pinecone) tile in Datadog.
2. Go to the **Configure** tab.
3. Click **+ Add New**.
4. Enter a project name to identify your project in Datadog.
5. Do not select an environment. This is a legacy setting.
6. Enter an [API key](/guides/projects/understanding-projects#api-keys) for the Pinecone project you want to monitor.
7. Enter the [project ID](/guides/projects/understanding-projects#project-ids) of the Pinecone project you want to monitor.
8. Save the configuration.

On the **Monitoring Resources** tab, you'll find dashboards for the pod-based and serverless indexes in your project and recommendations for [configuring monitors](https://docs.datadoghq.com/monitors/configuration/?tab=thresholdalert) using [Pinecone's metrics](/guides/production/monitoring#available-metrics).
