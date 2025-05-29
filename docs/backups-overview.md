# Backups overview

A backup is a static copy of a serverless [index](/guides/index-data/indexing-overview) that only consumes storage. It is a non-queryable representation of a set of records. You can [create a backup](/guides/manage-data/back-up-an-index) of a serverless index, and you can [create a new serverless index from a backup](/guides/manage-data/restore-an-index). This allows you to restore the index with the same or different configurations.

<Note>
  Once a backup is created, it cannot be moved to a different project.
</Note>

<Warning>
  Serverless index [backups](/guides/manage-data/backups-overview) are in [public preview](/release-notes/feature-availability) and available only on [Standard and Enterprise plans](https://www.pinecone.io/pricing/).
</Warning>

## Use cases

Creating a backup is useful when performing tasks like the following:

* Protecting an index from manual or system failures.
* Temporarily shutting down an index.
* Copying the data from one index into a different index.
* Making a backup of your index.
* Experimenting with different index configurations.

## Performance

Backup and restore times depend upon the size of the index and number of namespaces:

* For less than 1M vectors in a namespace, backups and restores take approximately 10 minutes.
* For 100,000,000 vectors, backups and restores can take up to 5 hours.

## Quotas

| Metric                | Starter plan | Standard plan | Enterprise plan |
| :-------------------- | :----------- | :------------ | :-------------- |
| Backups per project   | N/A          | 500           | 1000            |
| Namespaces per backup | N/A          | 2000          | 2000            |

## Limitations

Backup limitations are as follows:

* Backups are stored in the same region as the source index.
* You can only restore an index to the same region as the source index.
* Backups only include vectors that were in the index at least 15 minutes prior to the backup time. This means that if a vector was inserted into an index and a backup was immediately taken after, the recently inserted vector may not be backed up. More specifically, if a backup is created only a few minutes after the source index was created, the backup may have 0 vectors.
* You can only perform operations on backups in the current Pinecone project.

## Pricing

See [Pricing](https://www.pinecone.io/pricing/) for up-to-date pricing information.
