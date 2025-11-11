import type { Resolvers } from "../generated";
import type { Context } from "../context";
import Query from "./Query";
import Author from "./Author";
import Post from "./Post";

const resolvers: Resolvers<Context> | Resolvers<Context>[] = {
  Query,
  Author,
  Post,
};

export default resolvers;
