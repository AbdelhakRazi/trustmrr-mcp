import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { ServerRequest, ServerNotification } from "@modelcontextprotocol/sdk/types.js";
import type { TrustMrrClient } from "./trustmrr/client.js";

export type ClientResolver = (
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => TrustMrrClient;

export const sortValues = [
  "revenue-desc",
  "revenue-asc",
  "price-desc",
  "price-asc",
  "multiple-asc",
  "multiple-desc",
  "growth-desc",
  "growth-asc",
  "listed-desc",
  "listed-asc",
  "best-deal",
] as const;

export type ListStartupsParams = {
  page?: number;
  limit?: number;
  sort?: (typeof sortValues)[number];
  onSale?: boolean;
  category?: string;
  xHandle?: string;
  minRevenue?: number;
  maxRevenue?: number;
  minMrr?: number;
  maxMrr?: number;
  minGrowth?: number;
  maxGrowth?: number;
  minPrice?: number;
  maxPrice?: number;
};
