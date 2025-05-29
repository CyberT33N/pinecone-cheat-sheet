# Pricing and limits

This page describes the pricing and limits of Pinecone Assistant.

## Platform fee

{/* <Tabs>

  <Tab title="Current"> */}

The Standard and Enterprise [pricing plans](https://www.pinecone.io/pricing/) include a monthly platform fee and usage credits:

| Plan       | Platform fee | Usage credits |
| ---------- | ------------ | ------------- |
| Standard   | \$25/month   | \$15/month    |
| Enterprise | \$500/month  | \$150/month   |

Usage credits do not roll over from month to month. Platform fees do not apply to organizations on the Starter plan or with annual commits.

**Examples**

<AccordionGroup>
  <Accordion title="Usage covered by monthly credits">
    * You are on the Standard plan.
    * Your usage for the month of August amounts to \$10.
    * Minus your \$15 monthly usage credit, the actual cost of usage is \$0.
    * Including the \$25 monthly platform fee, your total for the month of August is \$25.
  </Accordion>

  <Accordion title="Usage exceeds monthly credits">
    * You are on the Standard plan.
    * Your usage for the month of August amounts to \$100.
    * Minus your \$15 monthly usage credit, the actual cost of usage is \$75.
    * Including the \$25 monthly platform fee, your total for the month of August is \$100.
  </Accordion>
</AccordionGroup>

{/* </Tab>

  <Tab title="July 1, 2025">

  Customers who sign up for the Standard or Enterprise plan on or after July 1, 2025 will have a monthly minimum usage commitment instead of a monthly platform fee:

  | Plan       | Minimum usage |
  | ---------  | ------------ |
  | Standard   | $50/month    |
  | Enterprise | $500/month   |

  Beyond the monthly minimum, customers will be charged for what they use each month. 

  <Note>
  Customers who signed up for the Standard or Enteprise plan before July 1, 2025 will continue to pay a monthly platform fee until September 1, 2025. After that date, the minimum usage commitment explained above will replace the platform fee.
  </Note> 

  **Examples**

  <AccordionGroup>

  <Accordion title="Usage below monthly minimum">

  - You are on the Standard plan.
  - Your usage for the month of August amounts to &#36;20.
  - Your usage is below the &#36;50 monthly minimum, so your total for the month is &#36;50.

  </Accordion>

  <Accordion title="Usage exceeds monthly minimum">

  - You are on the Standard plan.
  - Your usage for the month of August amounts to &#36;100.
  - Your usage exceeds the &#36;50 monthly minimum, so your total for the month is &#36;100.

  </Accordion>

  </AccordionGroup>

  </Tab>

  </Tabs> */}

## Usage cost

The cost of using Pinecone Assistant is determined by the following factors:

| Invoice line item                      | Description                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Assistants Context Tokens Processed    | Number of tokens processed for [context retrieval](/guides/assistant/context-snippets-overview). |
| Assistants Evaluation Tokens Out       | Number of tokens used to calculate [evaluation metrics](/guides/assistant/evaluation-overview).  |
| Assistants Evaluation Tokens Processed | Number of tokens used to prompt [evaluation metrics](/guides/assistant/evaluation-overview).     |
| Assistants Hourly Count                | Number of hours the assistant is available.                                                      |
| Assistants Input Tokens                | Number of [tokens processed](/guides/assistant/pricing-and-limits#token-usage) by the assistant. |
| Assistants Output Tokens               | Number of [tokens output](/guides/assistant/pricing-and-limits#token-usage) by the assistant.    |
| Assistants Total Storage GB/Hours      | Total size of [files stored in the assistant](/guides/assistant/files-overview) per month.       |

See [Pricing](https://www.pinecone.io/pricing/) for up-to-date pricing information.

### Token usage

Pinecone Assistant usage is measured in tokens, with different counts and cost for input and output tokens.

Pinecone Assistant consumes input tokens for both planning and retrieval. Input token usage is calculated based on the chat history, the document structure and data density (e.g., how many words are in a page), and the number of documents that meet the filter criteria. This means that, in general, the total number of input tokens used is the sum of the chat history token count plus in the order of 10,000 tokens used for document retrieval. The maximum input tokens per query is 64,000.

Output tokens are the number of tokens generated as part of the answer generation. The total number depends on the complexity of the question and the number of documents that were retrieved and are relevant for the question. The output typically ranges from a few dozen to several hundred tokens.

## Limits

The following [Pinecone Assistant](/guides/assistant/overview) limits apply to each organization and vary based on [pricing plan](https://www.pinecone.io/pricing/):

| Metric                                   | Starter plan  | Standard plan | Enterprise plan |
| :--------------------------------------- | :------------ | :------------ | :-------------- |
| Max number of assistants                 | 3             | Unlimited     | Unlimited       |
| Max tokens per minute (TPM) input        | 30,000        | 150,000       | 150,000         |
| Max number of total LLM processed tokens | 1,500,000     | Unlimited     | Unlimited       |
| Max input tokens per query               | 64,000        | 64,000        | 64,000          |
| Max total output tokens                  | 200,000       | Unlimited     | Unlimited       |
| Region                                   | United States | Any           | Any             |

The following file limits apply to each assistant and vary based on [pricing plan](https://www.pinecone.io/pricing/):

|                            | Starter plan | Standard plan | Enterprise plan |
| -------------------------- | ------------ | ------------- | --------------- |
| Max file size              | 10MB         | 10MB          | 10MB            |
| Max PDF file size          | 10MB         | 100MB         | 100MB           |
| Max metadata size per file | 1KB          | 1KB           | 1KB             |
| Max file storage           | 1GB          | 10GB          | 10GB            |
| Max files uploaded         | 10           | 10,000        | 10,000          |
