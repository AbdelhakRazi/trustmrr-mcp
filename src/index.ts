#!/usr/bin/env node

import { createServer as createHttpServer, type IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { createServer } from "./server.js";
import { TrustMrrClient } from "./trustmrr/client.js";

const PORT = Number(process.env.PORT) || 3000;

interface Session {
  transport: StreamableHTTPServerTransport;
  token: string;
}

const sessions = new Map<string, Session>();

function extractBearerToken(req: IncomingMessage): string | undefined {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice(7);
}

function attachAuth(req: IncomingMessage, token: string) {
  (req as IncomingMessage & { auth?: AuthInfo }).auth = {
    token,
    clientId: "http-client",
    scopes: [],
  };
}

async function handleMcp(req: IncomingMessage, res: import("node:http").ServerResponse) {
  // Reject unauthenticated requests at the boundary
  const token = extractBearerToken(req);
  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing Authorization header. Send: Authorization: Bearer <TRUSTMRR_API_KEY>" }));
    return;
  }

  // Check for existing session
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const existing = sessionId ? sessions.get(sessionId) : undefined;

  if (existing) {
    // Validate token matches the one used to create the session
    if (existing.token !== token) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Token does not match the session" }));
      return;
    }
    attachAuth(req, token);
    await existing.transport.handleRequest(req, res);
    return;
  }

  // For non-init requests without a valid session, reject
  if (sessionId && !existing) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Session not found" }));
    return;
  }

  // New session — create transport + server
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (id) => {
      sessions.set(id, { transport, token });
    },
  });

  transport.onclose = () => {
    if (transport.sessionId) {
      sessions.delete(transport.sessionId);
    }
  };

  const server = createServer((extra) => {
    const authToken = extra.authInfo?.token;
    if (!authToken) {
      throw new Error("Missing API key in auth context");
    }
    return new TrustMrrClient(authToken);
  });

  await server.connect(transport);
  attachAuth(req, token);
  await transport.handleRequest(req, res);
}

async function main() {
  const httpServer = createHttpServer(async (req, res) => {
    const url = req.url ?? "/";

    if ((url === "/" || url === "/health") && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    if (url === "/mcp") {
      try {
        await handleMcp(req, res);
      } catch (error) {
        console.error("MCP error:", error);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      }
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  });

  httpServer.listen(PORT, () => {
    console.log(`TrustMRR MCP server listening on http://0.0.0.0:${PORT}/mcp`);
  });

  const shutdown = async () => {
    for (const { transport } of sessions.values()) {
      await transport.close();
    }
    sessions.clear();
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
