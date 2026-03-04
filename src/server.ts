import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetStartupTool } from "./tools/getStartup.js";
import { registerListStartupsTool } from "./tools/listStartups.js";
import type { ClientResolver } from "./types.js";

export function createServer(resolveClient: ClientResolver): McpServer {
  const server = new McpServer({
    name: "trustmrr-mcp",
    version: "0.1.0",
  });

  registerListStartupsTool(server, resolveClient);
  registerGetStartupTool(server, resolveClient);

  return server;
}
