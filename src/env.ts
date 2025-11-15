import env, { string, number } from "@danimydev/env";

export default env({
  NODE_ENV: string(),
  PORT: number(),
});
