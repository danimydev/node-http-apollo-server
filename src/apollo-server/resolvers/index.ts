import type { Resolvers } from "../generated";
import type { Context } from "../context";
import Query from "./Query";
import Author from "./Author";

const resolvers: Resolvers<Context> | Resolvers<Context>[] = {
  Query,
  Author,
};

export default resolvers;
