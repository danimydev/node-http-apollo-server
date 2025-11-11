import landingPage from "./landing-page";
import logging from "./logging";
import drainHttpServer from "./drain-http-server";

const ApolloServerPlugins = {
  landingPage,
  logging,
  drainHttpServer,
};

export default ApolloServerPlugins;
