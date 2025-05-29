# Amazon Bedrock

> Pinecone as a Knowledge Base for Amazon Bedrock

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

Users can now select Pinecone as a Knowledge Base for [Amazon Bedrock](https://aws.amazon.com/bedrock/), a fully managed service from Amazon Web Services (AWS) for building GenAI applications.

The Pinecone vector database is a key component of the AI tech stack, helping companies solve one of the biggest challenges in deploying GenAI solutions — hallucinations — by allowing them to store, search, and find the most relevant and up-to-date information from company data and send that context to Large Language Models (LLMs) with every query. This workflow is called Retrieval Augmented Generation (RAG), and with Pinecone, it aids in providing relevant, accurate, and fast responses from search or GenAI applications to end users.

With the release of Knowledge Bases for Amazon Bedrock, developers can integrate their enterprise data into Amazon Bedrock using Pinecone as the fully-managed vector database to build GenAI applications that are:

* **Highly performant:** Speed through data in milliseconds. Leverage metadata filters and sparse-dense index support for top-notch relevance, ensuring quick, accurate, and grounded results across diverse search tasks.
* **Cost effective at scale:** Start for free on the starter plan and seamlessly scale usage with transparent usage-based pricing. Add or remove resources to meet your desired capacity and performance, upwards of billions of embeddings.
* **Enterprise ready:** Launch, use, and scale your AI solution without needing to maintain infrastructure, monitor services, or troubleshoot algorithms. Pinecone meets the security and operational requirements of enterprises.

<PrimarySecondaryCTA secondaryHref={"#setup-guide"} secondaryLabel={"View setup guide"} />

## What are Agents for Amazon Bedrock?

In Bedrock, users interact with **Agents** that are capable of combining the natural language interface of the supported LLMs with those of a **Knowledge Base.** Bedrock's Knowledge Base feature uses the supported LLMs to generate **embeddings** from the original data source. These embeddings are stored in Pinecone, and the Pinecone index is used to retrieve semantically relevant content upon the user's query to the agent.

**Note:** the LLM used for embeddings may be different than the one used for the natural language generation. For example, you may choose to use Amazon Titan to generate embeddings and use Anthropic's Claude to generate natural language responses.

Additionally, Agents for Amazon Bedrock may be configured to execute various actions in the context of responding to a user's query - but we won't get into this functionality in this post.

## What is a Knowledge Base for Amazon Bedrock?

A Bedrock Knowledge base ingests raw text data or documents found in Amazon S3, embeds the content and upserts the embeddings into Pinecone. Then, a Bedrock agent can interact with the knowledge base to retrieve the most semantically relevant content given a user's query.

Overall, the Knowledge Base feature is a valuable tool for users who want to improve their AI models' performance. With Bedrock's LLMs and Pinecone, users can easily integrate their data from AWS storage solutions and enhance the accuracy and relevance of their AI models.

In this post, we'll go through the steps required for creating a Knowledge Base for Amazon Bedrock as well as an agent that will retrieve information from the knowledge base.

![](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/AWS_Bedrock_Specific.png)

## Setup guide

The process of using a Bedrock knowledge base with Pinecone works as follows:

<Steps>
  <Step title="Create a Pinecone index.">
    Create a Pinecone index with an embedding model in mind.
  </Step>

  <Step title="Set up a data source.">
    Upload sample data to Amazon S3.
  </Step>

  <Step title="Create a Bedrock knowledge base.">
    Sync data with Bedrock to create embeddings saved in Pinecone.
  </Step>

  <Step title="Connect Pinecone to Bedrock.">
    Use the knowledge base to reference the data saved in Pinecone.
  </Step>

  <Step title="Create and link agents to Bedrock.">
    Agents can interact directly with the Bedrock knowledge base, which will retrieve the semantically relevant content.
  </Step>
</Steps>

### 1. Create a Pinecone index

The knowledge base stores data in a Pinecone index. Decide which [supported embedding model](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html) to use with Bedrock before you create the index, as your index's dimensions will need to match the model's. For example, the AWS Titan Text Embeddings V2 model can use dimension sizes 1024, 384, and 256.

After signing up to Pinecone, follow the [quickstart guide](/guides/get-started/quickstart) to create your Pinecone index and retrieve your `apiKey` and index host from the [Pinecone console](https://app.pinecone.io).

<Note>
  Ensure that you create your index with the same dimensions as the model you will later select for creating your embeddings.
</Note>

### 2. Set up your data source

#### Set up secrets

After setting up your Pinecone index, you'll have to create a secret in [AWS Secrets Manager](https://console.aws.amazon.com/secretsmanager/newsecret):

1. In the **Secret type** section, select **Other type of secret**.
2. In the **Key/value pairs** section, enter a key value pair for the Pinecone API key name and its respective value. For example, use `apiKey` and the API key value.
   ![](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/bedrock/kv.png)
3. Click **Next**.
4. Enter a **Secret name** and **Description**.
5. Click **Next** to save your key.
6. On the **Configure rotation** page, select all the default options in the next screen, and click **Next**.
7. Click **Store**.
8. Click on the new secret you created and save the secret ARN for a later step.

#### Set up S3

The knowledge base is going to draw on data saved in S3. For this example, we use a [sample of research papers](https://huggingface.co/datasets/jamescalam/ai-arxiv2-semantic-chunks) obtained from a dataset. This data will be embedded and then saved in Pinecone.

1. Create a new general purpose bucket in [Amazon S3](https://console.aws.amazon.com/s3/home).

2. Once the bucket is created, upload a CSV file.

   <Note>
     The CSV file must have a field for text that will be embedded, and a field for metadata to upload with each embedded text.
   </Note>

3. Save your bucket's address (`s3://…`) for the following configuration steps.

### 3. Create a Bedrock knowledge base

To [create a Bedrock knowledge base](https://console.aws.amazon.com/bedrock/home?#/knowledge-bases/create-knowledge-base), use the following steps:

1. Enter a **Knowledge Base name**.
2. In the **Choose data source** section, select **Amazon S3**.
3. Click **Next**.
4. On the **Configure data source** page, enter the **S3 URI** for the bucket you created.
5. If you do not want to use the default chunking strategy, select a chunking strategy.
6. Click **Next**.

### 4. Connect Pinecone to the knowledge base

Now you will need to select an embedding model to configure with Bedrock and configure the data sources.

1. Select the embedding model you decided on earlier.
2. For the **Vector database**, select **Choose a vector store you have created** and select **Pinecone**.
3. Mark the check box for authorizing AWS to access your Pinecone index.
4. For the **Endpoint URL**, enter the the Pinecone index host retrieved from the Pinecone console.
5. For the **Credentials secret ARN**, enter the secret ARN you created earlier.
6. In the **Metadata field mapping** section, enter the **Text field name** you want to embed and the **Bedrock-managed metadata field name** that will be used for metadata managed by Bedrock (e.g., `metadata`).
7. Click **Next**.
8. Review your selections and complete the creation of the knowledge base.
9. On the [Knowledge Bases](https://console.aws.amazon.com/bedrock/home?#/knowledge-bases) page select the knowledge base you just created to view its details.
10. Click **Sync** for the newly created data source.
    <Note>
      Sync the data source whenever you add new data to the data source to start the ingestion workflow of converting your Amazon S3 data into vector embeddings and upserting the embeddings into the vector database. Depending on the amount of data, this whole workflow can take some time.
    </Note>

### 5. Create and link an agent to Bedrock

Lastly, [create an agent](https://console.aws.amazon.com/bedrock/home?#/agents) that will use the knowledge base for retrieval:

1. Click **Create Agent**.
2. Enter an **Name** and **Description**.
3. Click **Create**.
4. Select the LLM provider and model you'd like to use.
5. Provide instructions for the agent. These will define what the agent is trying to accomplish.
6. In the **Knowledge Bases** section, select the knowledge base you created.
7. Prepare the agent by clicking **Prepare** near the top of the builder page.
8. Test the agent after preparing it to verify it is using the knowledge base.
9. Click **Save and exit**.

Your agent is now set up and ready to go! In the next section, we'll show how to interact with the newly created agent.

#### Create an alias for your agent

In order to deploy the agent, create an alias for it that points to a specific version of the agent. Once the alias is created, it will display in the agent view.

1. On the [Agents](https://console.aws.amazon.com/bedrock/home?#/agents) page, select the agent you created.
2. Click **Create Alias**.
3. Enter an **Alias name** and **Description**.
4. Click **Create alias**.

#### Test the Bedrock agent

To test the newly created agent, use the playground on the right of the screen when we open the agent.

In this example, we used a dataset of research papers for our source data. We can ask a question about those papers and retrieve a detailed response, this time with the deployed version.

![](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/bedrock/alias-testing-query.png)

By inspecting the trace, we can see what chunks were used by the Agent and diagnose issues with responses.

![](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/bedrock/alias-testing-trace.png)

## Related articles

* [Pinecone as a Knowledge Base for Amazon Bedrock](https://www.pinecone.io/blog/amazon-bedrock-integration/)
