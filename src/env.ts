import { loadEnvFile } from "node:process";
import * as v from "valibot";

loadEnvFile(".env");

const envSchema = v.object({
  NODE_ENV: v.enum({
    Production: "production",
    Development: "development",
    Test: "test",
  } as const),
  PORT: v.string(),
});

const env = v.parse(envSchema, process.env);

export default env;
