import graphql from "graphql";

export default function isIntrospectionDocumentNode(
  documentNode: graphql.DocumentNode,
): boolean {
  let found = false;
  graphql.visit(documentNode, {
    Field(node) {
      console.log(node);
      if (node.name.value === "__schema" || node.name.value === "__type") {
        found = true;
      }
    },
  });
  return found;
}
