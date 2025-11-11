import type { AuthorResolvers } from "../generated";

const resolvers: AuthorResolvers = {
  id: () => 1,
  firstName: () => "FirstName",
  lastName: () => "LastName",
  posts: () => [],
};

export default resolvers;
