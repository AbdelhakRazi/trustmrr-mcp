# TrustMRR MCP Server

MCP server for the [TrustMRR](https://trustmrr.com) API. Connects any MCP-compatible AI client to TrustMRR, giving your AI assistant access to startup listings, metrics, and deal analysis.

## Key Features

- **Browse Startups** — search, filter, and sort startup listings by revenue, MRR, growth, price, category, and sale status
- **Startup Details** — get full details for any startup including financials, growth metrics, and pricing

## Getting Started

### Creating an API key

Sign in to [TrustMRR](https://trustmrr.com) and generate an API key from your account settings.

### MCP client configuration

<details>
<summary>VS Code / GitHub Copilot</summary>

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "trustmrr": {
      "type": "http",
      "url": "https://mcp.trustmrr.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```
</details>

<details>
<summary>Claude Code CLI</summary>

```bash
claude mcp add --transport http trustmrr https://mcp.trustmrr.com/mcp \
  --header "Authorization: Bearer YOUR_API_KEY"
```
</details>

<details>
<summary>Cursor</summary>

Add to your MCP settings:

```json
{
  "servers": {
    "trustmrr": {
      "type": "http",
      "url": "https://mcp.trustmrr.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```
</details>

### Other clients

TrustMRR MCP server follows the standard MCP protocol and works with any client that supports:

- Remote MCP servers
- Streamable HTTP transport

## Example prompts

- What startups are currently on sale with MRR above $5k?
- Show me the fastest growing SaaS startups listed right now
- Get me the details on the startup "example-saas"
- What's the best deal on a startup under $50k?

## License

MIT
