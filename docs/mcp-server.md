# Use an Assistant MCP server

<Note>
  This feature is in [early access](/release-notes/feature-availability) and is not intended for production usage.
</Note>

Every Pinecone Assistant has a dedicated MCP server that gives AI agents direct access to the assistant's knowledge through the standardized [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). This page shows you how to connect an assistant's MCP server with Cursor, Claude Desktop, and LangChain.

There are two ways to connect to an assistant MCP server:

* [Remote MCP server](#remote-mcp-server) - Use a dedicated MCP endpoint to connect directly to an assistant.
* [Local MCP server](#local-mcp-server) - Run a Docker container locally that connects to an assistant

Both options support a context tool that allows agents to retrieve relevant context snippets from your assistant's knowledge. This is similar to the [context API](/guides/assistant/retrieve-context-snippets) but fine-tuned for MCP clients. Additional capabilities, such as file access, will be added in future releases.

## Remote MCP server

Every Pinecone Assistant has a dedicated MCP endpoint that you can connect directly to your AI applications. This option doesn't require running any infrastructure and is managed by Pinecone.

The MCP endpoint for an assistant is:

```
https://<YOUR_PINECONE_ASSISTANT_HOST>/mcp/assistants/<YOUR_ASSISTANT_NAME>/sse
```

### Prerequisites

* A Pinecone API key. You can create a new key in the [Pinecone console](https://app.pinecone.io/organizations/-/keys).
* Your assistant's MCP endpoint. To find it, go to your assistant in the [Pinecone console](https://app.pinecone.io/organizations/-/assistants). You'll see the assistant **MCP** endpoint in the sidebar.

### Use with LangChain

You can use the [LangChain MCP client](https://github.com/langchain-ai/langchain-mcp-adapters) to integrate with LangChain to create a powerful multi-agent workflow.

For example, the following code integrates Langchain with two assistants, one called `ai-news` and the other called `industry-reports`:

```python Python
# Example code for integrating with LangChain
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent

from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model_name="claude-3-7-sonnet-latest", api_key=<YOUR_ANTHROPIC_API_KEY_HERE>)
pinecone_api_key = "<YOUR_PINECONE_API_KEY>"

async with MultiServerMCPClient(
    {
        "assistant_ai_news": {
            "url": "https://prod-1-data.ke.pinecone.io/mcp/assistants/ai-news/sse",
            "transport": "sse",
            "headers": {
                "Authorization": f"Bearer {pinecone_api_key}"
            }
        },
        "assistant_industry_reports": {
            "url": "https://prod-1-data.ke.pinecone.io/mcp/assistants/industry-reports/sse",
            "transport": "sse",
            "headers": {
                "Authorization": f"Bearer {pinecone_api_key}"
            }
        }
    }
) as client:
    agent = create_react_agent(model, client.get_tools())

    response = await agent.ainvoke({"messages": "Your task is research the next trends in AI, and form a report with the most undervalued companies in the space.
    You have access to two assistants, one that can help you find the latest trends in AI, and one that can help you find reports on companies."})
    print(response["messages"][-1].content)
```

### Use with Claude Desktop

You can configure Claude Desktop to use your assistant's remote MCP server. However, at this early stage of **remote** MCP server adoption, the Claude Desktop application does not support remote server URLs. In the example below, we work around this by using a local proxy server, [supergateway](https://github.com/supercorp-ai/supergateway), to forward requests to the remote MCP server with your API key.

<Warning>
  [supergateway](https://github.com/supercorp-ai/supergateway) is an open-source third-party tool. Use at your own risk.
</Warning>

1. Open [Claude Desktop](https://claude.ai/download) and go to **Settings**.

2. On the **Developer** tab, click **Edit Config** to open the configuration file.

3. Add the following configuration:

   ```json
   {
     "mcpServers": {
       "Assistant over supergateway": {
         "command": "npx",
         "args": [
           "-y",
           "supergateway",
           "--sse",
           "https://<YOUR_PINECONE_ASSISTANT_HOST>/mcp/assistants/<YOUR_ASSISTANT_ID>/sse",
           "--header",
           "Authorization: Bearer <YOUR_PINECONE_API_KEY>"
         ]
       }
     }
   }
   ```

   Replace `<YOUR_PINECONE_API_KEY>` with your Pinecone API key and `<YOUR_PINECONE_ASSISTANT_HOST>` with your Pinecone Assistant host.

4. Save the configuration file and restart Claude Desktop.

5. From the new chat screen, you should see a hammer (MCP) icon appear with the new MCP server available.

## Local MCP server

Pinecone provides an open-source Pinecone Assistant MCP server that you can run locally with Docker. This option is useful for development, testing, or when you want to run the MCP server within your own infrastructure or expand the MCP server to include additional capabilities.

For the most up-to-date information on the local MCP server, see the [Pinecone Assistant MCP server repository](https://github.com/pinecone-io/assistant-mcp).

### Prerequisites

* Docker is installed and running on your system.
* A Pinecone API key. You can create a new key in the [Pinecone console](https://app.pinecone.io/organizations/-/keys).
* Your Pinecone Assistant host. To find it, go to your assistant in the [Pinecone console](https://app.pinecone.io/organizations/-/assistants). You'll see the assistant **Host** in the sidebar.

### Start the MCP server

Download the `assistant-mcp` Docker image:

```bash
docker pull ghcr.io/pinecone-io/assistant-mcp
```

Start the MCP server, providing your Pinecone API key and Pinecone Assistant host:

```bash
docker run -i --rm \
  -e PINECONE_API_KEY=<PINECONE_API_KEY> \
  -e PINECONE_ASSISTANT_HOST=<PINECONE_ASSISTANT_HOST> \
  pinecone/assistant-mcp
```

### Use with Claude Desktop

1. Open [Claude Desktop](https://claude.ai/download) and go to **Settings**.

2. On the **Developer** tab, click **Edit Config** to open the configuration file.

3. Add the following configuration:

   ```json
   {
     "mcpServers": {
       "pinecone-assistant": {
         "command": "docker",
         "args": [
           "run", 
           "-i", 
           "--rm", 
           "-e", 
           "PINECONE_API_KEY", 
           "-e", 
           "PINECONE_ASSISTANT_HOST", 
           "pinecone/assistant-mcp"
         ],
         "env": {
           "PINECONE_API_KEY": "<YOUR_PINECONE_API_KEY>",
           "PINECONE_ASSISTANT_HOST": "<YOUR_PINECONE_ASSISTANT_HOST>"
         }
       }
     }
   }
   ```

   Replace `<YOUR_PINECONE_API_KEY>` with your Pinecone API key and `<YOUR_PINECONE_ASSISTANT_HOST>` with your Pinecone Assistant host.

4. Save the configuration file and restart Claude Desktop.

5. From the new chat screen, you should see a hammer (MCP) icon appear with the new MCP server available.

### Use with Cursor

1. Open [Cursor](https://www.cursor.com/) and create a `.cursor` directory in your project root if it doesn't exist.

2. Create a `.cursor/mcp.json` file if it doesn't exist and open it.

3. Add the following configuration:

   ```json
   {
     "mcpServers": {
       "pinecone-assistant": {
         "command": "docker",
         "args": [
           "run", 
           "-i", 
           "--rm", 
           "-e", 
           "PINECONE_API_KEY", 
           "-e", 
           "PINECONE_ASSISTANT_HOST", 
           "pinecone/assistant-mcp"
         ],
         "env": {
           "PINECONE_API_KEY": "<YOUR_PINECONE_API_KEY>",
           "PINECONE_ASSISTANT_HOST": "<YOUR_PINECONE_ASSISTANT_HOST>"
         }
       }
     }
   }
   ```

   Replace `<YOUR_PINECONE_API_KEY>` with your Pinecone API key and `<YOUR_PINECONE_ASSISTANT_HOST>` with your Pinecone Assistant host.

4. Save the configuration file.

## Next Steps

* Visit the [Pinecone Assistant MCP Server repository](https://github.com/pinecone-io/assistant-mcp) for detailed installation and usage instructions

* Learn about [Model Context Protocol](https://modelcontextprotocol.io/) and how it enables AI agents to interact with tools and data

* Explore [retrieve context snippets](/guides/assistant/retrieve-context-snippets) to understand the underlying API functionality
