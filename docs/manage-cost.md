# Manage cost

This page provides guidance on managing the cost of Pinecone. For the latest pricing details, see our [pricing page](https://www.pinecone.io/pricing/). For help estimating total cost, see [Understanding total cost](/guides/manage-cost/understanding-cost). To see a calculation of your current usage and costs, see the [usage dashboard](/guides/manage-cost/monitor-your-usage) in the Pinecone console.

## Set a monthly spend alert

To receive an email notification when your organization's spending reaches a specified limit, set a monthly spend alert:

1. Go to [**Settings > Usage**](https://app.pinecone.io/organizations/-/settings/usage) in the Pinecone console.
2. In the **Monthly spend alert** section, click **Create spend alert**.
3. Enter the dollar amount at which you want to receive an alert.
4. Click **Update alert**.

## Choose the right index

* **Serverless:** With serverless indexes, you don't configure or manage any compute or storage resources. Instead, based on a [breakthrough architecture](/reference/architecture/serverless-architecture), serverless indexes scale automatically based on usage, and you pay only for the amount of data stored and operations performed, with no minimums. This means that there's no extra cost for having additional indexes.
* **Pod-based:** Pod sizes are designed for different applications, and some are more expensive than others. [Choose the appropriate pod type and size](/guides/indexes/pods/choose-a-pod-type-and-size), so you pay for the resources you need. For example, the `s1` pod type provides large storage capacity and lower overall costs with slightly higher query latencies than `p1` pods. By switching to a different pod type, you may be able to reduce costs while still getting the performance your application needs.

  <Note>
    For pod-based indexes, project owners can [set limits for the total number of pods](/reference/api/database-limits#pods-per-project) across all indexes in the project. The default pod limit is 5.
  </Note>

## List by ID prefix

<Note>
  `list` is supported only for serverless indexes.
</Note>

By using a hierarchical ID schema, you can retrieve records without performing a query. To do so, you can use [`list`](/reference/api/2024-10/data-plane/list) to retrieve records by ID prefix, then use `fetch` to retrieve the records you need. This can reduce costs, because [`query` consumes more RUs when scanning a larger namespace](/guides/manage-cost/understanding-cost#query), while [`fetch` consumes a fixed ratio of RUs to records retrieved](/guides/manage-cost/understanding-cost#fetch). Similarly, you can use `list` and then [delete by ID prefix](/guides/manage-data/manage-document-chunks#delete-all-records-for-a-parent-document). To learn more, see [Manage document chunks](/guides/manage-data/manage-document-chunks).

## Back up inactive indexes

<Note>
  Serverless indexes do not support collections at this time.
</Note>

When a specific index is not in use, [back it up using collections](/guides/manage-data/back-up-an-index) and delete the inactive index. When you're ready to use these vectors again, you can [create a new index from the collection](/guides/indexes/pods/create-a-pod-based-index#create-a-pod-index-from-a-collection). This new index can also use a different index type or size. Because it's relatively cheap to store collections, you can reduce costs by only running an index when it's in use.

## Use namespaces for multitenancy

If your application requires you to isolate the data of each customer/user, consider [implementing multitenancy with serverless indexes and namespaces](/guides/index-data/implement-multitenancy). With serverless indexes, you pay only for the amount of data stored and operations performed. For queries in particular, the cost is partly based on the total number of records that must be scanned, so using namespaces can significantly reduce query costs.

## Commit to annual spend

Users who commit to an annual contract may qualify for discounted rates. To learn more, [contact Pinecone sales](https://www.pinecone.io/contact/).

## Talk to support

Users on the Standard and Enterprise plans can [contact Support](https://app.pinecone.io/organizations/-/settings/support/ticket) for help in optimizing costs.

## See also

* [Understanding cost](/guides/manage-cost/understanding-cost)
* [Monitoring usage](/guides/manage-cost/monitor-your-usage)
