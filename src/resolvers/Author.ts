import type { AuthorResolvers } from "../generated";

const resolvers: AuthorResolvers = {
  id: () => "author_1",
  firstName: () => "FirstName",
  lastName: () => "LastName",
  posts: () => [],
};

export default resolvers;
