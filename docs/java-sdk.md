# Java SDK

<Tip>
  See the [Pinecone Java SDK
  documentation](https://github.com/pinecone-io/pinecone-java-client/blob/main/README.md) for full installation
  instructions and usage examples.

  To make a feature request or report an issue, please [file an issue](https://github.com/pinecone-io/pinecone-java-client/issues).
</Tip>

## Requirements

The Pinecone Java SDK Java 1.8 or later.

## SDK versions

SDK versions are pinned to specific [API versions](/reference/api/versioning). When a new API version is released, a new version of the SDK is also released.

The mappings between API versions and Java SDK versions are as follows:

| API version        | SDK version |
| :----------------- | :---------- |
| `2025-04` (latest) | v5.x        |
| `2025-01`          | v4.x        |
| `2024-10`          | v3.x        |
| `2024-07`          | v2.x        |
| `2024-04`          | v1.x        |

When a new stable API version is released, you should upgrade your SDK to the latest version to ensure compatibility with the latest API changes.

## Install

To install the latest version of the [Java SDK](https://github.com/pinecone-io/pinecone-java-client), add a dependency to the current module:

```shell Java
# Maven
<dependency>
  <groupId>io.pinecone</groupId>
  <artifactId>pinecone-client</artifactId>
  <version>5.0.0</version>
</dependency>

# Gradle
implementation "io.pinecone:pinecone-client:5.0.0"
```

Alternatively, you can download the standalone uberjar [pinecone-client-4.0.0-all.jar](https://repo1.maven.org/maven2/io/pinecone/pinecone-client/4.0.0/pinecone-client-4.0.0-all.jar), which bundles the Pinecone SDK and all dependencies together. You can include this in your classpath like you do with any third-party JAR without having to obtain the `pinecone-client` dependencies separately.

## Upgrade

<Warning>
  Before upgrading to `v4.0.0`, update all relevant code to account for the breaking changes explained [here](/release-notes/2025#2025-02-07-3).
</Warning>

If you are already using the Java SDK, upgrade the dependency in the current module to the latest version:

```shell Java
# Maven
<dependency>
  <groupId>io.pinecone</groupId>
  <artifactId>pinecone-client</artifactId>
  <version>5.0.0</version>
</dependency>

# Gradle
implementation "io.pinecone:pinecone-client:5.0.0"
```

## Initialize

Once installed, you can import the SDK and then use an [API key](/guides/production/security-overview#api-keys) to initialize a client instance:

```Java
import io.pinecone.clients.Pinecone;
import org.openapitools.db_control.client.model.*;

public class InitializeClientExample {
    public static void main(String[] args) {
        Pinecone pc = new Pinecone.Builder("YOUR_API_KEY").build();
    }
}
```
