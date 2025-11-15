import http from "node:http";
import url from "node:url";

import {
  HeaderMap,
  type ApolloServer,
  type BaseContext,
  type ContextFunction,
} from "@apollo/server";

import type { RequestHandler } from "../request-handler";
import * as Utils from "../utils";

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type ContextFunctionArgument = {
  incommingMessage: http.IncomingMessage;
  serverResponse: http.ServerResponse;
};

type ApolloServerHandlerOptions<TContext extends BaseContext> = {
  context?: ContextFunction<[ContextFunctionArgument], TContext>;
};

export default function createApolloServerHandler(
  server: ApolloServer<BaseContext>,
  options?: ApolloServerHandlerOptions<BaseContext>,
): RequestHandler<Promise<void>>;
export default function createApolloServerHandler<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  options: WithRequired<ApolloServerHandlerOptions<TContext>, "context">,
): RequestHandler<Promise<void>>;
export default function createApolloServerHandler<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  options?: ApolloServerHandlerOptions<TContext>,
): RequestHandler<Promise<void>> {
  server.assertStarted("httpMiddleware()");

  const defaultContext: ContextFunction<
    [ContextFunctionArgument],
    any
  > = async () => ({});

  const context: ContextFunction<[ContextFunctionArgument], TContext> =
    options?.context ?? defaultContext;

  return async (incommingMessage, serverResponse) => {
    if (!incommingMessage.url || !incommingMessage.method) {
      return;
    }

    const headerMap = new HeaderMap();

    for (const [key, value] of Object.entries(incommingMessage.headers)) {
      if (value !== undefined) {
        headerMap.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    const body = await Utils.getIncommingMessageBody(incommingMessage);

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
      return;
    }

    if (httpGraphQLResponse.body.kind === "chunked") {
      for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
        serverResponse.write(chunk);
      }
    }

    serverResponse.end();
    return;
  };
}
