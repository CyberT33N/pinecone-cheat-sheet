# Monitor performance

Pinecone generates time-series performance metrics for each Pinecone index. You can monitor these metrics directly in the Pinecone console or with tools like Prometheus or Datadog.

## Monitor in the Pinecone Console

To view performance metrics in the Pinecone console:

1. Open the [Pinecone console](https://app.pinecone.io/organizations/-/projects).
2. Select the project containing the index you want to monitor.
3. Go to **Database > Indexes**.
4. Select the index.
5. Go to the **Metrics** tab.

## Monitor with Datadog

To monitor Pinecone with Datadog, use Datadog's [Pinecone integration](/integrations/datadog).

<Note>
  This feature is available on the [Standard, Enterprise, and Dedicated plans](https://www.pinecone.io/pricing/).
</Note>

## Monitor with Prometheus

<Note>
  This feature is available on the [Standard, Enterprise, and Dedicated plans](https://www.pinecone.io/pricing/). On the Dedicated plan (i.e., [Bring Your Own Cloud](/guides/production/bring-your-own-cloud)), you must configure Prometheus monitoring within your VPC.
</Note>

### Configuration

<Tabs>
  <Tab title="Serverless indexes">
    To monitor all serverless indexes in a project, insert the following snippet into the [`scrape_configs`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) section of your `prometheus.yml` file and update it with values for your Prometheus integration:

    <Note>
      This method uses [HTTP service discovery](https://prometheus.io/docs/prometheus/latest/http_sd/) to automatically discover and target all serverless indexes across all regions in a project.
    </Note>

    ```YAML
    global:
      scrape_interval: 15s

    scrape_configs:
      - job_name: 'pinecone-serverless-metrics'
        http_sd_configs:
          - url: https://api.pinecone.io/prometheus/projects/PROJECT_ID/metrics/discovery
            refresh_interval: 1m
            authorization:
              type: Bearer
              credentials: API_KEY
        authorization:
          type: Bearer
          credentials: API_KEY
    ```

    * Replace `PROJECT_ID` with the unique ID of the project you want to monitor. You can [find the project ID](/guides/projects/understanding-projects#project-ids) in the Pinecone console.

    * Replace both instances of `API_KEY` with an API key for the project you want to monitor. The first instance is for service discovery, and the second instance is for the discovered targets. If necessary, you can [create an new API key](/guides/projects/manage-api-keys) in the Pinecone console.
  </Tab>

  <Tab title="Pod-based indexes">
    To monitor all pod-based indexes in a specific region of a project, insert the following snippet into the [`scrape_configs`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) section of your `prometheus.yml` file and update it with values for your Prometheus integration:

    ```YAML
    scrape_configs:
      - job_name: "pinecone-pod-metrics"
        scheme: https
        metrics_path: '/metrics'
        authorization:
          credentials: API_KEY
        static_configs:
          - targets: ["metrics.ENVIRONMENT.pinecone.io" ]
    ```

    * Replace `API_KEY` with an API key for the project you want to monitor. If necessary, you can [create an new API key](/reference/api/authentication) in the Pinecone console.

    * Replace `ENVIRONMENT` with the [environment](/guides/indexes/pods/understanding-pod-based-indexes#pod-environments) of the pod-based indexes you want to monitor.
  </Tab>
</Tabs>

For more configuration details, see the [Prometheus docs](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).

### Available metrics

The following metrics are available when you integrate Pinecone with Prometheus:

<Tabs>
  <Tab title="Serverless indexes">
    | Name                                   | Type    | Description                                                                                                    |
    | :------------------------------------- | :------ | :------------------------------------------------------------------------------------------------------------- |
    | `pinecone_db_record_total`             | gauge   | The total number of records in the index.                                                                      |
    | `pinecone_db_op_upsert_total`          | counter | The number of [upsert](/guides/index-data/upsert-data) requests made to an index.                              |
    | `pinecone_db_op_upsert_duration_total` | counter | The total time taken processing upsert requests for an index in milliseconds.                                  |
    | `pinecone_db_op_query_total`           | counter | The number of [query](/guides/search/search-overview) requests made to an index.                               |
    | `pinecone_db_op_query_duration_total`  | counter | The total time taken processing [query](/guides/search/search-overview) requests for an index in milliseconds. |
    | `pinecone_db_op_fetch_total`           | counter | The number of [fetch](/guides/manage-data/fetch-data) requests made to an index.                               |
    | `pinecone_db_op_fetch_duration_total`  | counter | The total time taken processing fetch requests for an index in milliseconds.                                   |
    | `pinecone_db_op_update_total`          | counter | The number of [update](/guides/manage-data/update-data) requests made to an index.                             |
    | `pinecone_db_op_update_duration_total` | counter | The total time taken processing update requests for an index in milliseconds.                                  |
    | `pinecone_db_op_delete_total`          | counter | The number of [delete](/guides/manage-data/delete-data) requests made to an index.                             |
    | `pinecone_db_op_delete_duration_total` | counter | The total time taken processing delete requests for an index in milliseconds.                                  |
    | `pinecone_db_write_unit_total`         | counter | The total number of [write units](/guides/manage-cost/understanding-cost#write-units) consumed by an index.    |
    | `pinecone_db_read_unit_total`          | counter | The total number of [read units](/guides/manage-cost/understanding-cost#read-units) consumed by an index.      |
    | `pinecone_db_storage_size_bytes`       | gauge   | The total size of the index in bytes.                                                                          |
  </Tab>

  <Tab title="Pod-based indexes">
    | Name                                 | Type      | Description                                                                       |
    | :----------------------------------- | :-------- | :-------------------------------------------------------------------------------- |
    | `pinecone_vector_count`              | gauge     | The number of records per pod in the index.                                       |
    | `pinecone_request_count_total`       | counter   | The number of data plane calls made by clients.                                   |
    | `pinecone_request_error_count_total` | counter   | The number of data plane calls made by clients that resulted in errors.           |
    | `pinecone_request_latency_seconds`   | histogram | The distribution of server-side processing latency for pinecone data plane calls. |
    | `pinecone_index_fullness`            | gauge     | The fullness of the index on a scale of 0 to 1.                                   |
  </Tab>
</Tabs>

### Metric labels

Each metric contains the following labels:

<Tabs>
  <Tab title="Serverless indexes">
    | Label           | Description                                                  |
    | :-------------- | :----------------------------------------------------------- |
    | `index_name`    | Name of the index to which the metric applies.               |
    | `cloud`         | Cloud where the index is deployed: `aws`, `gcp`, or `azure`. |
    | `region`        | Region where the index is deployed.                          |
    | `capacity_mode` | Type of index: `serverless` or `byoc`.                       |
  </Tab>

  <Tab title="Pod-based indexes">
    | Label          | Description                                                                                                                                    |
    | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
    | `pid`          | Process identifier.                                                                                                                            |
    | `index_name`   | Name of the index to which the metric applies.                                                                                                 |
    | `project_name` | Name of the project containing the index.                                                                                                      |
    | `request_type` | Type of request: `upsert`, `delete`, `fetch`, `query`, or `describe_index_stats`. This label is included only in `pinecone_request_*` metrics. |
  </Tab>
</Tabs>

### Example queries

<Tabs>
  <Tab title="Serverless indexes">
    Return the total number of records per index:

    ```shell
    sum by (index_name) (pinecone_db_record_total)
    ```

    Return the total number of records in Pinecone index `docs-example`:

    ```shell
    pinecone_db_record_total{index_name="docs-example"}
    ```

    Return the total number of upsert requests per index:

    ```shell
    sum by (index_name) (pinecone_db_op_upsert_total)
    ```

    Return the average processing time in millisconds for upsert requests per index:

    ```shell
    sum by (index_name) (pinecone_db_op_upsert_duration_total/pinecone_db_op_upsert_total) 
    ```

    Return the total read units consumed per index:

    ```shell
    sum by (index_name) (pinecone_db_read_unit_total)
    ```

    Return the total write units consumed for the Pinecone index `docs-example`:

    ```shell
    pinecone_db_write_unit_total{index_name="docs-example"}
    ```
  </Tab>

  <Tab title="Pod-based indexes">
    Return the average latency in seconds for all requests against the Pinecone index `docs-example`:

    ```shell
    avg by (request_type) (pinecone_request_latency_seconds{index_name="docs-example"})
    ```

    Return the vector count for the Pinecone index `docs-example`:

    ```shell
    sum ((avg by (app) (pinecone_vector_count{index_name="docs-example"})))
    ```

    Return the total number of requests against the Pinecone index `docs-example` over one minute:

    ```shell
    sum by (request_type)(increase(pinecone_request_count_total{index_name="docs-example"}[60s]))
    ```

    Return the total number of upsert requests against the Pinecone index `docs-example` over one minute:

    ```shell
    sum by (request_type)(increase(pinecone_request_count_total{index_name="docs-example", request_type="upsert"}[60s]))
    ```

    Return the total errors returned by the Pinecone index `docs-example` over one minute:

    ```shell
    sum by (request_type) (increase(pinecone_request_error_count{
          index_name="docs-example"}[60s]))
    ```

    Return the index fullness metric for the Pinecone index `docs-example`:

    ```
    round(max (pinecone_index_fullness{index_name="docs-example"} * 100))
    ```
  </Tab>
</Tabs>
