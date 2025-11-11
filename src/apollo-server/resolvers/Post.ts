import type { PostResolvers } from "../generated";

const resolvers: PostResolvers = {
  id: () => "post_1",
  title: () => "Title",
  author: () => ({
    id: "author_1",
    firstName: "FirstName",
    lastName: "LastName",
  }),
};

export default resolvers;
