import type { QueryResolvers } from "../generated";

const resolvers: QueryResolvers = {
  posts: () => [{ id: "post_1", title: "post_1_title" }],
};

export default resolvers;
