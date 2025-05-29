# Metadata re-configuration

<Note>
  This guidance applies to [pod-based indexes](/guides/index-data/indexing-overview#pod-based-indexes) only. With [serverless indexes](/guides/index-data/indexing-overview#serverless-indexes), you don't configure any compute or storage resources, and you don't manually manage those resources to meet demand, save on cost, or ensure high availability. Instead, serverless indexes scale automatically based on usage.
</Note>

In this article, we will concentrate on two specific scenarios that customers frequently encounter. The first scenario involves customers loading an index replete with high cardinality metadata. This can trigger a series of unforeseen challenges, and hence, it's vital to comprehend how to manage this situation effectively. This methodology can be applied whenever you need to change your metadata configuration.

The second scenario that we will address involves customers who have over-provisioned the number of pods they need. More specifically, we will discuss the process of re-scaling an index in instances where the customer has previously scaled vertically and now desires to scale the index back down.

These insights will provide you with a comprehensive understanding of how to better manage your index configurations.

Here is the [Loom video walkthrough](https://www.loom.com/share/ce6f5dd0c3e14ba0b988fe32d96b703a?sid=48646dfe-c10c-4143-82c6-031fefe05a68)
