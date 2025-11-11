import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "schema.graphql",
  generates: {
    "src/apollo-server/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        // references src/apollo-server/generated.ts
        contextType: "./context#Context",
        useTypeImports: true,
      },
    },
    "schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
