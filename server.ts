import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { setupSocketServer } from "./socket";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = setupSocketServer(server);

  // Add CORS configuration
  io.engine.on("headers", (headers: any, req: any) => {
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "GET,POST";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
