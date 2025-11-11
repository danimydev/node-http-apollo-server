import type { QueryResolvers } from "../generated";

const resolvers: QueryResolvers = {
  posts: (_parent, _input, context) => {
    context.requestLogger.info("QueryResolvers posts");
    return [{ id: 1, title: "post_1" }];
  },
};

export default resolvers;
