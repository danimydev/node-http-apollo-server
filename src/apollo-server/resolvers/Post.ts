import type { PostResolvers } from "../generated";

const resolvers: PostResolvers = {
  id: () => 1,
  title: () => "Title",
  author: () => ({
    id: 1,
    firstName: "FirstName",
    lastName: "LastName",
  }),
};

export default resolvers;
