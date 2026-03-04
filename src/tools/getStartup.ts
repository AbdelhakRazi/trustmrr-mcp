import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getStartupInput } from "../schemas.js";
import type { ClientResolver } from "../types.js";
import { errorTextResult, okTextResult } from "../utils/response.js";

export function registerGetStartupTool(server: McpServer, resolveClient: ClientResolver) {
  server.registerTool(
    "get_startup",
    {
      title: "Get Startup Details",
      description:
        "Retrieve the full details for a specific startup listed on TrustMRR, including MRR, revenue, growth, pricing, and metadata. Requires the startup slug (URL identifier).",
      inputSchema: getStartupInput,
      annotations: {
        readOnlyHint: true,
        openWorldHint: true,
      },
    },
    async ({ slug }, extra) => {
      try {
        const client = resolveClient(extra);
        const result = await client.getStartup(slug);
        return okTextResult(result);
      } catch (error) {
        return errorTextResult(error, "Unknown error while getting startup details.");
      }
    },
  );
}
