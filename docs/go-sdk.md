# Go SDK

<Tip>
  See the [Go SDK documentation](https://github.com/pinecone-io/go-pinecone/blob/main/README.md) for full installation instructions and usage examples.

  To make a feature request or report an issue, please [file an issue](https://github.com/pinecone-io/go-pinecone/issues).
</Tip>

## Requirements

The Pinecone Go SDK requires a Go version with [modules](https://go.dev/wiki/Modules) support.

## SDK versions

SDK versions are pinned to specific [API versions](/reference/api/versioning). When a new API version is released, a new version of the SDK is also released.

The mappings between API versions and Go SDK versions are as follows:

| API version        | SDK version |
| :----------------- | :---------- |
| `2025-04` (latest) | Coming soon |
| `2025-01`          | v3.x        |
| `2024-10`          | v2.x        |
| `2024-07`          | v1.x        |
| `2024-04`          | v0.x        |

When a new stable API version is released, you should upgrade your SDK to the latest version to ensure compatibility with the latest API changes.

## Install

To install the latest version of the [Go SDK](https://github.com/pinecone-io/go-pinecone), add a dependency to the current module:

```shell
go get github.com/pinecone-io/go-pinecone/v3/pinecone
```

To install a specific version of the Go SDK, run the following command:

```shell
go get github.com/pinecone-io/go-pinecone/v3/pinecone@<version>
```

To check your SDK version, run the following command:

```shell
go list -u -m all | grep go-pinecone
```

## Upgrade

<Warning>
  Before upgrading to `v3.0.0` or later, update all relevant code to account for the breaking changes explained [here](/release-notes/2025#2025-02-07-4).
</Warning>

If you already have the Go SDK, upgrade to the latest version as follows:

```shell
go get -u github.com/pinecone-io/go-pinecone/v3/pinecone@latest
```

## Initialize

Once installed, you can import the SDK and then use an [API key](/guides/production/security-overview#api-keys) to initialize a client instance:

```Go
package main

import (
    "context"
    "log"

    "github.com/pinecone-io/go-pinecone/v3/pinecone"
)

func main() {
    ctx := context.Background()

    pc, err := pinecone.NewClient(pinecone.NewClientParams{
        ApiKey: "YOUR_API_KEY",
    })
    if err != nil {
        log.Fatalf("Failed to create Client: %v", err)
    }
} 
```
