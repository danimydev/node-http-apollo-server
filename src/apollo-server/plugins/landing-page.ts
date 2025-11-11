import type { ApolloServerPlugin } from "@apollo/server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";

import env from "../../env";
import type { Context } from "../context";

const landingPage: ApolloServerPlugin<Context> =
  env.NODE_ENV === "production"
    ? ApolloServerPluginLandingPageProductionDefault()
    : ApolloServerPluginLandingPageLocalDefault({
        embed: true,
      });

export default landingPage;
