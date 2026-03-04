#!/usr/bin/env node

import { createServer as createHttpServer, type IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { createServer } from "./server.js";
import { TrustMrrClient } from "./trustmrr/client.js";

const PORT = Number(process.env.PORT) || 3000;

function extractBearerToken(req: IncomingMessage): string | undefined {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice(7);
}

async function main() {
  const server = createServer((extra) => {
    const token = extra.authInfo?.token;
    if (!token) {
      throw new Error(
        "Missing Authorization header. Send: Authorization: Bearer <TRUSTMRR_API_KEY>",
      );
    }
    return new TrustMrrClient(token);
  });

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });

  await server.connect(transport);

  const httpServer = createHttpServer(async (req, res) => {
    const url = req.url ?? "/";

    if (url === "/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    if (url === "/mcp") {
      const token = extractBearerToken(req);
      if (token) {
        (req as IncomingMessage & { auth?: AuthInfo }).auth = {
          token,
          clientId: "http-client",
          scopes: [],
        };
      }
      await transport.handleRequest(req, res);
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  });

  httpServer.listen(PORT, () => {
    console.error(`TrustMRR MCP server listening on http://0.0.0.0:${PORT}/mcp`);
  });

  const shutdown = async () => {
    await server.close();
    httpServer.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error("Failed to start TrustMRR MCP server:", error);
  process.exit(1);
});
