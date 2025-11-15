import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "schema.graphql",
  generates: {
    "src/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
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
