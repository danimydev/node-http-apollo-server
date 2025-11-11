import http from "node:http";

export type NodeHttpCorsConfig = {
  origins:
    | string[]
    | ((origin: string | undefined, req: http.IncomingMessage) => boolean);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
};

export default function httpCors(config: NodeHttpCorsConfig) {
  if (!config || !config.origins) {
    throw new Error(
      'httpCors: "origins" is required and must be explicitly configured.',
    );
  }

  const {
    origins,
    methods = ["GET", "HEAD", "POST"],
    allowedHeaders = ["Content-Type", "Authorization"],
    exposedHeaders = [],
    credentials = false,
    maxAge = 600,
    preflightContinue = false,
  } = config;

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const origin = req.headers.origin;
    let allowOrigin: string | null = null;

    if (Array.isArray(origins)) {
      if (origin && origins.includes(origin)) {
        allowOrigin = origin;
      }
    } else if (typeof origins === "function") {
      if (origins(origin, req)) {
        allowOrigin = origin || null;
      }
    }

    if (!allowOrigin) {
      if (req.method === "OPTIONS") {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("CORS origin not allowed");
        return true;
      }
      return false;
    }

    res.setHeader("Access-Control-Allow-Origin", allowOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", methods.join(", "));
    res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    res.setHeader("Access-Control-Max-Age", String(maxAge));

    if (exposedHeaders.length > 0) {
      res.setHeader("Access-Control-Expose-Headers", exposedHeaders.join(", "));
    }

    if (credentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
      if (preflightContinue) return false;
      res.writeHead(204);
      res.end();
      return true;
    }

    return false;
  };
}
