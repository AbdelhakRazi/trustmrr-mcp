import { TRUSTMRR_BASE_URL } from "../config.js";
import { TrustMrrApiError } from "../errors.js";
import type { ListStartupsParams } from "../types.js";

export class TrustMrrClient {
  constructor(private readonly apiKey: string) {}

  async listStartups(params: ListStartupsParams): Promise<unknown> {
    return this.request("/startups", params);
  }

  async getStartup(slug: string): Promise<unknown> {
    return this.request(`/startups/${encodeURIComponent(slug)}`);
  }

  private async request(path: string, query?: Record<string, unknown>) {
    const url = new URL(`${TRUSTMRR_BASE_URL}${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) {
          continue;
        }
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
      },
    });

    const text = await response.text();
    let body: unknown = text;

    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (!response.ok) {
      throw new TrustMrrApiError(
        `TrustMRR API error (${response.status})`,
        response.status,
        body,
      );
    }

    return body;
  }
}
