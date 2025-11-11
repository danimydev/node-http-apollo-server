import http from "node:http";
import * as v from "valibot";

const httpHeadersSchema = v.object({
  "x-vix-user-id": v.string(),
  "x-vix-country-code": v.string(),
  "x-vix-platform": v.string(),
});

export default function getParsedHttpHeaders(
  incommingHttpHeaders: http.IncomingHttpHeaders,
) {
  return Object.assign(
    incommingHttpHeaders,
    v.parse(httpHeadersSchema, incommingHttpHeaders),
  );
}
