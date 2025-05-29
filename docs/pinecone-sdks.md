# Introduction

## Pinecone SDKs

Official Pinecone SDKs provide convenient access to the [Pinecone APIs](/reference/api/introduction).

<CardGroup cols={3}>
  <Card title="Python SDK" icon="python" href="/reference/python-sdk" />

  <Card title="Node.js SDK" icon="node-js" href="/reference/node-sdk" />

  <Card title="Java SDK" icon="java" href="/reference/java-sdk" />

  <Card title="Go SDK" icon="golang" href="/reference/go-sdk" />

  <Card title=".NET SDK" icon="microsoft" href="/reference/dotnet-sdk" />

  <Card title="Rust SDK" icon="rust" href="/reference/rust-sdk" />
</CardGroup>

## SDK versions

SDK versions are pinned to specific [API versions](/reference/api/versioning). When a new API version is released, a new version of the SDK is also released.

The mappings between API versions and SDK versions are as follows:

|                                     | `2025-04`   | `2025-01` | `2024-10` | `2024-07`     | `2024-04` |
| ----------------------------------- | :---------- | :-------- | :-------- | :------------ | :-------- |
| [Python SDK](/reference/python-sdk) | v7.x        | v6.x      | v5.3.x    | v5.0.x-v5.2.x | v4.x      |
| [Node.js SDK](/reference/node-sdk)  | v6.x        | v5.x      | v4.x      | v3.x          | v2.x      |
| [Java SDK](/reference/java-sdk)     | v5.x        | v4.x      | v3.x      | v2.x          | v1.x      |
| [Go SDK](/reference/go-sdk)         | Coming soon | v3.x      | v2.x      | v1.x          | v0.x      |
| [.NET SDK](/reference/dotnet-sdk)   | v4.x        | v3.x      | v2.x      | v1.x          | v0.x      |

When a new stable API version is released, you should upgrade your SDK to the latest version to ensure compatibility with the latest API changes.

## Community SDKs

Find community-contributed SDKs for Pinecone. These libraries are not supported by Pinecone.

* [Ruby SDK](https://github.com/ScotterC/pinecone) (contributed by [ScotterC](https://github.com/ScotterC))

* [Scala SDK](https://github.com/cequence-io/pinecone-scala) (contributed by [cequence-io](https://github.com/cequence-io))

* [PHP SDK](https://github.com/probots-io/pinecone-php) (contributed by [protobots-io](https://github.com/probots-io))
