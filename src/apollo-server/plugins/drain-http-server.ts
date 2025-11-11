import http from "node:http";
import type { ApolloServerPlugin } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import type { Context } from "../context";

const drainHttpServer: (
  httpServer: http.Server,
) => ApolloServerPlugin<Context> = (httpServer) =>
  ApolloServerPluginDrainHttpServer({ httpServer });

export default drainHttpServer;
