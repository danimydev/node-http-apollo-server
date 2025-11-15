import http from "node:http";

export type RequestHandler<ReturnType = void> = (
  incommingMessage: http.IncomingMessage,
  serverResponse: http.ServerResponse,
) => ReturnType;
