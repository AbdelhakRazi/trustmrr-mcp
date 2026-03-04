import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listStartupsInput } from "../schemas.js";
import type { ClientResolver } from "../types.js";
import { errorTextResult, okTextResult } from "../utils/response.js";

export function registerListStartupsTool(server: McpServer, resolveClient: ClientResolver) {
  server.registerTool(
    "list_startups",
    {
      title: "List Startups",
      description:
        "Search and filter startups listed on TrustMRR. Supports pagination, sorting (by revenue, price, growth, listing date, or best-deal), filtering by category, revenue range, MRR range, growth range, price range, and on-sale status.",
      inputSchema: listStartupsInput,
      annotations: {
        readOnlyHint: true,
        openWorldHint: true,
      },
    },
    async (params, extra) => {
      try {
        const client = resolveClient(extra);
        const result = await client.listStartups(params);
        return okTextResult(result);
      } catch (error) {
        return errorTextResult(error, "Unknown error while listing startups.");
      }
    },
  );
}
