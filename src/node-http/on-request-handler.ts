import http from "node:http";

export type OnRequestHandler = (
  incommingMessage: http.IncomingMessage,
  serverResponse: http.ServerResponse,
) => Promise<boolean> | boolean;
