import type { Resolvers } from "../generated";

import Query from "./Query";
import Author from "./Author";
import Post from "./Post";

const resolvers: Resolvers = {
  Query,
  Author,
  Post,
};

export default resolvers;
