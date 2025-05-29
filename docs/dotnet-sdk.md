# .NET SDK

<Tip>
  See the [.NET SDK documentation](https://github.com/pinecone-io/pinecone-dotnet-client/blob/main/README.md) for full installation instructions and usage examples.

  To make a feature request or report an issue, please [file an issue](https://github.com/pinecone-io/pinecone-dotnet-client/issues).
</Tip>

## Requirements

To use this Python .NET SDK, ensure that your project is targeting one of the following:

* .NET Standard 2.0+
* .NET Core 3.0+
* .NET Framework 4.6.2+
* .NET 6.0+

## SDK versions

SDK versions are pinned to specific [API versions](/reference/api/versioning). When a new API version is released, a new version of the SDK is also released.

The mappings between API versions and .NET SDK versions are as follows:

| API version        | SDK version |
| :----------------- | :---------- |
| `2025-04` (latest) | v4.x        |
| `2025-01`          | v3.x        |
| `2024-10`          | v2.x        |
| `2024-07`          | v1.x        |
| `2024-04`          | v0.x        |

When a new stable API version is released, you should upgrade your SDK to the latest version to ensure compatibility with the latest API changes.

## Install

To add the latest version of the [.NET SDK](https://github.com/pinecone-io/pinecone-dotnet-client) to your project, run the following command:

<CodeGroup>
  ```shell .NET Core CLI
  dotnet add package Pinecone.Client 
  ```

  ```shell NuGet CLI
  nuget install Pinecone.Client
  ```
</CodeGroup>

To add a specific version of the [.NET SDK](https://github.com/pinecone-io/pinecone-dotnet-client) to your project, run the following command:

<CodeGroup>
  ```shell .NET Core CLI
  dotnet add package Pinecone.Client --version <version>
  ```

  ```shell NuGet CLI
  nuget install Pinecone.Client -Version <version>
  ```
</CodeGroup>

To check your SDK version, run the following command:

<CodeGroup>
  ```shell .NET Core CLI
  dotnet list package
  ```

  ```shell NuGet CLI
  nuget list 
  ```
</CodeGroup>

## Upgrade

<Warning>
  Before upgrading to `v4.0.0`, update all relevant code to account for the breaking changes explained [here](/release-notes/2025#2025-05-14-2).
</Warning>

If you are already using `Pinecone.Client` in your project, upgrade to the latest version as follows:

<CodeGroup>
  ```shell .NET Core CLI
  dotnet add package Pinecone.Client 
  ```

  ```shell NuGet CLI
  nuget install Pinecone.Client
  ```
</CodeGroup>

## Initialize

Once installed, you can import the SDK and then use an [API key](/guides/production/security-overview#api-keys) to initialize a client instance:

```csharp C#
using Pinecone;

var pinecone = new PineconeClient("YOUR_API_KEY");
```

## Proxy configuration

If your network setup requires you to interact with Pinecone through a proxy, configure the HTTP client as follows:

```csharp
using System.Net;
using Pinecone;

var pinecone = new PineconeClient("PINECONE_API_KEY", new ClientOptions
{
    HttpClient = new HttpClient(new HttpClientHandler
    {
        Proxy = new WebProxy("PROXY_HOST:PROXY_PORT")
    })
});
```

If you're building your HTTP client using the [HTTP client factory](https://learn.microsoft.com/en-us/dotnet/core/extensions/httpclient-factory#configure-the-httpmessagehandler), use the `ConfigurePrimaryHttpMessageHandler` method to configure the proxy:

```csharp
   .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
       {
           Proxy = new WebProxy("PROXY_HOST:PROXY_PORT")
       });
```
