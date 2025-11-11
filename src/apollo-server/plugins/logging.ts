import type { ApolloServerPlugin } from "@apollo/server";

import type { Context } from "../context";

const logging: ApolloServerPlugin<Context> = {
  async requestDidStart(context) {
    const logger = context.contextValue.requestLogger;

    return {
      async didResolveOperation(context) {
        if (context.operationName === "IntrospectionQuery") {
          return;
        }
        logger.info("🚀 Request started:", context.request);
      },
      async didEncounterErrors(context) {
        logger.error("❌ Errors:", context.errors);
      },
      async willSendResponse(context) {
        if (context.operationName === "IntrospectionQuery") {
          return;
        }
        logger.info("✅ Response sent:", context.response);
      },
    };
  },
};

export default logging;
