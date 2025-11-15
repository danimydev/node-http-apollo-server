import type { RequestHandler } from "../request-handler";

export type CorsConfig = {
  origins: string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
};

export default function cors(config: CorsConfig): RequestHandler {
  const {
    origins,
    methods = ["GET", "HEAD", "POST"],
    allowedHeaders = ["Content-Type", "Authorization"],
    exposedHeaders = [],
    credentials = false,
    maxAge = 600,
    preflightContinue = false,
  } = config;

  return (incommingMessage, serverResponse) => {
    const origin = incommingMessage.headers.origin;
    let allowedOrigin: string | null = null;

    if (origin && (origin === "*" || origins.includes(origin))) {
      allowedOrigin = origin;
    }

    if (!allowedOrigin) {
      if (incommingMessage.method === "OPTIONS") {
        serverResponse.writeHead(403, { "Content-Type": "text/plain" });
        serverResponse.end("CORS origin not allowed");
        return;
      }
      return;
    }

    serverResponse.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    serverResponse.setHeader("Vary", "Origin");
    serverResponse.setHeader(
      "Access-Control-Allow-Methods",
      methods.join(", "),
    );
    serverResponse.setHeader(
      "Access-Control-Allow-Headers",
      allowedHeaders.join(", "),
    );
    serverResponse.setHeader("Access-Control-Max-Age", String(maxAge));

    if (exposedHeaders.length > 0) {
      serverResponse.setHeader(
        "Access-Control-Expose-Headers",
        exposedHeaders.join(", "),
      );
    }

    if (credentials) {
      serverResponse.setHeader("Access-Control-Allow-Credentials", "true");
    }

    if (incommingMessage.method === "OPTIONS") {
      if (preflightContinue) return;
      serverResponse.writeHead(204);
      serverResponse.end();
      return;
    }

    return;
  };
}
