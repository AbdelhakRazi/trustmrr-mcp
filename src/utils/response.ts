import { TrustMrrApiError } from "../errors.js";

function formatOutput(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function okTextResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: formatOutput(data),
      },
    ],
  };
}

export function errorTextResult(error: unknown, fallbackMessage: string) {
  if (error instanceof TrustMrrApiError) {
    return {
      content: [
        {
          type: "text" as const,
          text: formatOutput({
            error: error.message,
            status: error.status,
            details: error.details,
          }),
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: error instanceof Error ? error.message : fallbackMessage,
      },
    ],
    isError: true,
  };
}
