import fs from "node:fs";
import { ApolloServer } from "@apollo/server";

import type { Context } from "./context";
import resolvers from "./resolvers";

const apolloServer = new ApolloServer<Context>({
  typeDefs: fs.readFileSync("schema.graphql").toString(),
  resolvers,
});

export default apolloServer;
