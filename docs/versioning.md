# API versioning

Pinecone's APIs are versioned to ensure that your applications continue to work as expected as the platform evolves. Versions are named by release date in the format `YYYY-MM`, for example, `2025-04`.

## Release schedule

On a quarterly basis, Pinecone releases a new **stable** API version as well as a **release candidate** of the next stable version.

* **Stable:** Each stable version remains unchanged and supported for a minimum of 12 months. Since stable versions are released every 3 months, this means you have at least 9 months to test and migrate your app to the newest stable version before support for the previous version is removed.

* **Release candidate:** The release candidate gives you insight into the upcoming changes in the next stable version. It is available for approximately 3 months before the release of the stable version and can include new features, improvements, and [breaking changes](#breaking-changes).

Below is an example of Pinecone's release schedule:

<img className="block max-w-full dark:hidden" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/api-versioning.png" />

<img className="hidden max-w-full dark:block" noZoom src="https://mintlify.s3.us-west-1.amazonaws.com/pinecone/images/api-versioning-dark.png" />

## Specify an API version

<Warning>
  When using the API directly, it is important to specify an API version in your requests. If you don't, requests default to the oldest supported stable version. Once support for that version ends, your requests will default to the next oldest stable version, which could include breaking changes that require you to update your integration.
</Warning>

To specify an API version, set the `X-Pinecone-API-Version` header to the version name.

For example, based on the version support diagram above, if it is currently July 2024 and you want to use the latest stable version to describe an index, you would set `"X-Pinecone-API-Version: 2024-07"`:

```shell curl
PINECONE_API_KEY="YOUR_API_KEY"

curl -i -X GET "https://api.pinecone.io/indexes/movie-recommendations" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2024-07"
```

If you want to use the release candidate of the next stable version instead, you would set `"X-Pinecone-API-Version: 2024-10"`:

```shell curl
PINECONE_API_KEY="YOUR_API_KEY"

curl -i -X GET "https://api.pinecone.io/indexes/movie-recommendations" \
    -H "Api-Key: $PINECONE_API_KEY" \
    -H "X-Pinecone-API-Version: 2024-10"
```

## SDK versions

Official [Pinecone SDKs](/reference/pinecone-sdks) provide convenient access to Pinecone APIs. SDK versions are pinned to specific API versions. When a new API version is released, a new version of the SDK is also released.

For the mapping between SDK and API versions, see [SDK versions](/reference/pinecone-sdks#sdk-versions).

## Breaking changes

Breaking changes are changes that can potentially break your integration with a Pinecone API. Breaking changes include:

* Removing an entire operation
* Removing or renaming a parameter
* Removing or renaming a response field
* Adding a new required parameter
* Making a previously optional parameter required
* Changing the type of a parameter or response field
* Removing enum values
* Adding a new validation rule to an existing parameter
* Changing authentication or authorization requirements

## Non-breaking changes

Non-breaking changes are additive and should not break your integration. Additive changes include:

* Adding an operation
* Adding an optional parameter
* Adding an optional request header
* Adding a response field
* Adding a response header
* Adding enum values

## Get updates

To ensure you always know about upcoming API changes, follow the [Release notes](/release-notes/).
