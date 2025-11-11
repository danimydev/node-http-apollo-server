import pino, { type ChildLoggerOptions } from "pino";
import env from "./env";

declare global {
  interface Console {
    child(options: ChildLoggerOptions): Console;
  }
}

console.child = () => console;

const logger = env.NODE_ENV === "production" ? pino() : console;

export type Logger = typeof logger;

export default logger;
