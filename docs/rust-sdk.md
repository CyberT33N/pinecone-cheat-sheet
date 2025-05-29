# Rust SDK

<Warning>
  The Rust SDK is in "alpha" and is under active development. The SDK should be considered unstable and should not be used in production. Before a 1.0 release, there are no guarantees of backward compatibility between minor versions. See the [Rust SDK README](https://github.com/pinecone-io/pinecone-rust-client/blob/main/README.md) for full installation instructions and usage examples.

  To make a feature request or report an issue, please [file an issue](https://github.com/pinecone-io/pinecone-rust-client/issues).
</Warning>

## Install

To install the latest version of the [Rust SDK](https://github.com/pinecone-io/pinecone-rust-client), add a dependency to the current project:

```shell
cargo add pinecone-sdk
```

## Initialize

Once installed, you can import the SDK and then use an [API key](/guides/production/security-overview#api-keys) to initialize a client instance:

```rust Rust
use pinecone_sdk::pinecone::PineconeClientConfig;   
use pinecone_sdk::utils::errors::PineconeError;
	
#[tokio::main]
async fn main() -> Result<(), PineconeError> {
    let config = PineconeClientConfig {
        api_key: Some("YOUR_API_KEY".to_string()),
        ..Default::default()
    };

    let pinecone = config.client()?;
    let indexes = pinecone.list_indexes().await?;

    println!("Indexes: {:?}", indexes);

    Ok(())
}
```
