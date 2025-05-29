# Attribute usage to your integration

Once you have created your integration with Pinecone, specify a **source tag** when instantiating clients with Pinecone SDKs, or pass a source tag as part of the `User-Agent` header when using the API directly.

<Note>
  Anyone can create an integration, but [becoming an official Pinecone partner](/integrations/build-integration/become-a-partner) can help accelerate your go-to-market and add value to your customers.
</Note>

### Source tag naming conventions

Your source tag must follow these conventions:

* Clearly identify your integration.
* Use only lowercase letters, numbers, underscores, and colons.

For example, for an integration called "New Framework", `"new_framework"` is valid, but `"new framework"` and `"New_framework"` are not valid.

### Specify a source tag

| Pinecone SDK                    | Required version |
| ------------------------------- | ---------------- |
| [Python](/reference/python-sdk) | v3.2.1+          |
| [Node.js](/reference/node-sdk)  | v2.2.0+          |
| [Java](/reference/java-sdk)     | v1.0.0+          |
| [Go](/reference/go-sdk)         | v0.4.1+          |
| [.NET](/reference/dotnet-sdk)   | v1.0.0+          |

<CodeGroup>
  ```python Python
  # REST client
  from pinecone import Pinecone

  pc = Pinecone(
      api_key="YOUR_API_KEY", 
      source_tag="YOUR_SOURCE_TAG"
  )

  # gRPC client
  from pinecone.grpc import PineconeGRPC

  pc = PineconeGRPC(
      api_key="YOUR_API_KEY", 
      source_tag="YOUR_SOURCE_TAG"
  )
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  const pc = new Pinecone({ 
      apiKey: 'YOUR_API_KEY', 
      sourceTag: 'YOUR_SOURCE_TAG' 
  });
  ```

  ```java Java
  import io.pinecone.clients.Pinecone;

  public class IntegrationExample {
      public static void main(String[] args) {
          Pinecone pc = new Pinecone.Builder("YOUR_API_KEY")
                  .withSourceTag("YOUR_SOURCE_TAG")
                  .build();
      }
  }
  ```

  ```go Go
  import "github.com/pinecone-io/go-pinecone/v2/pinecone"

  client, err := pinecone.NewClient(pinecone.NewClientParams{
  	ApiKey: "YOUR_API_KEY",
  	SourceTag: "YOUR_SOURCE_TAG",
  })
  ```

  ```csharp C#
  using Pinecone;

  var pinecone = new PineconeClient("YOUR_API_KEY", new ClientOptions
  {
      SourceTag = "YOUR_SOURCE_TAG",
  });
  ```

  ```shell curl
  curl -i -X GET "https://api.pinecone.io/indexes" \
    -H "Accept: application/json" \
    -H "Api-Key: YOUR_API_KEY" \
    -H "User-Agent: source_tag=YOUR_SOURCE_TAG" \
    -H "X-Pinecone-API-Version: 2025-04"
  ```
</CodeGroup>
