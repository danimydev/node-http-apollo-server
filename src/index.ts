import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";

import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import logger from "./logger";

import env from "./env";

import { ApolloServerPluginLogging } from "./apollo-server/plugin/logging";

import createCorsMiddleware from "./node-http-server/handler/cors";
import createApolloServerHandler from "./node-http-server/handler/apollo-server";

import type { Context } from "./context";
import resolvers from "./resolvers";

import { ApolloServer } from "@apollo/server";

async function main() {
  const httpServer = http.createServer();

  const apolloServer = new ApolloServer<Context>({
    typeDefs: fs.readFileSync("schema.graphql").toString(),
    resolvers,
    logger: logger,
  });

  apolloServer.addPlugin(ApolloServerPluginLogging<Context>());
  apolloServer.addPlugin(ApolloServerPluginDrainHttpServer({ httpServer }));
  apolloServer.addPlugin(
    env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault(),
  );

  await apolloServer.start();

  const corsMiddleware = createCorsMiddleware({ origins: ["*"] });

  const apolloServerHandler = createApolloServerHandler(apolloServer, {
    context: async () => ({
      logger: logger.child({
        module: "context",
        requestId: crypto.randomUUID(),
      }),
    }),
  });

  httpServer.on("request", async (incommingMessage, serverResponse) => {
    void corsMiddleware(incommingMessage, serverResponse);

    if (serverResponse.writableEnded) {
      return;
    }

    if (incommingMessage.url === "/graphql/schema") {
      serverResponse.end(fs.readFileSync("schema.json"));
      return;
    }

    if (incommingMessage.url === "/graphql") {
      void (await apolloServerHandler(incommingMessage, serverResponse));
    }

    if (serverResponse.writableEnded) {
      return;
    }

    serverResponse.statusCode = 404;
    serverResponse.end("Not Found");
    return;
  });

  httpServer.listen(env.PORT, () => {
    console.log(`http server listening on port ${env.PORT}`);
  });
}

main();
