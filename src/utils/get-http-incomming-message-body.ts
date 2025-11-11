import http from "node:http";

export default async function getHttpIncommingMessageBody(
  incommingMessage: http.IncomingMessage,
) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of incommingMessage) chunks.push(chunk);
  return Buffer.concat(chunks).toString();
}
