import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";

import apolloServer from "./apollo-server/server";
import ApolloServerPlugins from "./apollo-server/plugins";
import { httpMiddleware } from "./apollo-server/http-middleware";
import env from "./env";
import logger from "./logger";

async function main() {
  const httpServer = http.createServer();

  apolloServer.addPlugin(ApolloServerPlugins.landingPage);
  apolloServer.addPlugin(ApolloServerPlugins.logging);

  await apolloServer.start();

  httpServer.on("request", (incommingMessage, serverResponse) => {
    if (incommingMessage.url === "/graphql") {
      const handler = httpMiddleware(apolloServer, {
        context: async () => ({
          requestLogger: logger.child({
            module: "context",
            requestId: crypto.randomUUID(),
          }),
        }),
      });
      return handler(incommingMessage, serverResponse);
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
