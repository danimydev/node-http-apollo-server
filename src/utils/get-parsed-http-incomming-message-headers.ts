import http from "node:http";
import * as v from "valibot";

const httpHeadersSchema = v.object({});

export default function getParsedHttpHeaders(
  incommingHttpHeaders: http.IncomingHttpHeaders,
) {
  return Object.assign(
    incommingHttpHeaders,
    v.parse(httpHeadersSchema, incommingHttpHeaders),
  );
}
