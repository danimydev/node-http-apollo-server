import type { ApolloServerPlugin, BaseContext } from "@apollo/server";

export function ApolloServerPluginLogging<
  TContext extends BaseContext,
>(): ApolloServerPlugin<TContext> {
  return {
    async requestDidStart() {
      return {
        async didResolveOperation(context) {
          if (context.operationName === "IntrospectionQuery") {
            return;
          }
          context.logger.info(context.request);
        },
        async didEncounterErrors(context) {
          context.logger.error(context.errors);
        },
        async willSendResponse(context) {
          if (context.operationName === "IntrospectionQuery") {
            return;
          }
          context.logger.info(context.response);
        },
      };
    },
  };
}
