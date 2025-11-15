import type { BaseContext } from "@apollo/server";

import type { Logger } from "./logger";

export type Context = BaseContext & {
  logger: Logger;
};

export const DEFAULT_CONTEXT: Context = {
  logger: console,
};
