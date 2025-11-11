import type { Logger } from "../logger";

export type Context = {
  requestLogger: Logger;
};

export const DEFAULT_CONTEXT: Context = {
  requestLogger: console,
};
