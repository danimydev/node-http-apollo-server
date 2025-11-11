import http from "node:http";
import url from "node:url";

import {
  HeaderMap,
  type ApolloServer,
  type BaseContext,
  type ContextFunction,
} from "@apollo/server";

import Utils from "../utils";

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type NodeHttpContextFunctionArgument = {
  incommingMessage: http.IncomingMessage;
  serverResponse: http.ServerResponse;
};

type NodeHttpMiddlewareOptions<TContext extends BaseContext> = {
  context?: ContextFunction<[NodeHttpContextFunctionArgument], TContext>;
};

export type NodeHttpServerOnRequestHandler = (
  incommingMessage: http.IncomingMessage,
  serverResponse: http.ServerResponse,
) => Promise<boolean>;

export default function nodeHttpMiddleware(
  server: ApolloServer<BaseContext>,
  options?: NodeHttpMiddlewareOptions<BaseContext>,
): NodeHttpServerOnRequestHandler;
export default function nodeHttpMiddleware<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  options: WithRequired<NodeHttpMiddlewareOptions<TContext>, "context">,
): NodeHttpServerOnRequestHandler;
export default function nodeHttpMiddleware<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  options?: NodeHttpMiddlewareOptions<TContext>,
): NodeHttpServerOnRequestHandler {
  server.assertStarted("httpMiddleware()");

  const defaultContext: ContextFunction<
    [NodeHttpContextFunctionArgument],
    any
  > = async () => ({});

  const context: ContextFunction<[NodeHttpContextFunctionArgument], TContext> =
    options?.context ?? defaultContext;

  return async (incommingMessage, serverResponse) => {
    if (!incommingMessage.url || !incommingMessage.method) {
      return false;
    }

    const headerMap = new HeaderMap();

    for (const [key, value] of Object.entries(incommingMessage.headers)) {
      if (value !== undefined) {
        headerMap.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    const body = await Utils.getHttpIncommingMessageBody(incommingMessage);

    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        method: incommingMessage.method.toUpperCase(),
        headers: headerMap,
        body: body.length ? JSON.parse(body) : {},
        search: new url.URL(
          `http://${process.env.HOST ?? "localhost"}${incommingMessage.url}`,
        ).search,
      },
      context: () => context({ incommingMessage, serverResponse }),
    });

    serverResponse.setHeaders(httpGraphQLResponse.headers);
    serverResponse.statusCode = httpGraphQLResponse.status || 200;

    if (httpGraphQLResponse.body.kind === "complete") {
      serverResponse.end(httpGraphQLResponse.body.string);
      return true;
    }

    if (httpGraphQLResponse.body.kind === "chunked") {
      for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
        serverResponse.write(chunk);
      }
    }

    serverResponse.end();
    return true;
  };
}
