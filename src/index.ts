import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";

import apolloServer from "./apollo-server/server";
import ApolloServerPlugins from "./apollo-server/plugins";
import nodeHttpMiddleware from "./apollo-server/node-http-middleware";
import env from "./env";
import logger from "./logger";
import nodeHttpCors from "./node-http-cors";

async function main() {
  const httpServer = http.createServer();

  apolloServer.addPlugin(ApolloServerPlugins.landingPage);
  apolloServer.addPlugin(ApolloServerPlugins.logging);
  apolloServer.addPlugin(ApolloServerPlugins.drainHttpServer(httpServer));

  await apolloServer.start();

  const corsHandler = nodeHttpCors({ origins: ["*"] });

  const graphqlHandler = nodeHttpMiddleware(apolloServer, {
    context: async () => ({
      requestLogger: logger.child({
        module: "context",
        requestId: crypto.randomUUID(),
      }),
    }),
  });

  httpServer.on("request", async (incommingMessage, serverResponse) => {
    if (corsHandler(incommingMessage, serverResponse)) {
      return;
    }

    if (incommingMessage.url === "/graphql") {
      const serverResponseEnded = await graphqlHandler(
        incommingMessage,
        serverResponse,
      );

      if (serverResponseEnded) return;
    }

    if (incommingMessage.url === "/graphql/schema") {
      serverResponse.end(fs.readFileSync("schema.json"));
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
