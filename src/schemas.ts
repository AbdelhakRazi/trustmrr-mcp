import { z } from "zod";
import { sortValues } from "./types.js";

export const listStartupsInput = {
  page: z.number().int().min(1).optional().describe("Page number for pagination (starts at 1)"),
  limit: z.number().int().min(1).max(50).optional().describe("Number of results per page (1-50)"),
  sort: z.enum(sortValues).optional().describe("Sort order for results"),
  onSale: z.boolean().optional().describe("Filter to only startups currently on sale"),
  category: z.string().min(1).optional().describe("Filter by startup category"),
  xHandle: z.string().min(1).optional().describe("Filter by X/Twitter handle"),
  minRevenue: z.number().nonnegative().optional().describe("Minimum revenue filter (USD)"),
  maxRevenue: z.number().nonnegative().optional().describe("Maximum revenue filter (USD)"),
  minMrr: z.number().nonnegative().optional().describe("Minimum MRR filter (USD)"),
  maxMrr: z.number().nonnegative().optional().describe("Maximum MRR filter (USD)"),
  minGrowth: z.number().optional().describe("Minimum growth percentage filter"),
  maxGrowth: z.number().optional().describe("Maximum growth percentage filter"),
  minPrice: z.number().nonnegative().optional().describe("Minimum price filter (USD)"),
  maxPrice: z.number().nonnegative().optional().describe("Maximum price filter (USD)"),
};

export const getStartupInput = {
  slug: z.string().min(1).describe("The URL slug identifier for the startup (e.g. 'my-saas-app')"),
};
