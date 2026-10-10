import { join, resolve } from "node:path";
import { stat } from "node:fs/promises";

// Static file server for ./public using Bun's built-in server.
// Replaces the http-server npm package: serves the site on port 8080.
const PORT = Number(process.env.PORT) || 8080;
const ROOT = resolve("./public");

Bun.serve({
  port: PORT,
  fetch: async (request) => {
    const url = new URL(request.url);
    let requestPath;
    try {
      requestPath = decodeURIComponent(url.pathname);
    } catch {
      return new Response("Not Found", { status: 404 });
    }

    // Candidates: the requested file, or a directory's index.html.
    const candidates = [
      join(ROOT, requestPath),
      join(ROOT, requestPath, "index.html"),
    ];

    for (const candidate of candidates) {
      // Reject anything that would escape the root directory.
      if (candidate !== ROOT && !candidate.startsWith(ROOT + "/")) continue;
      try {
        const s = await stat(candidate);
        if (s.isFile()) {
          const file = Bun.file(candidate);
          return new Response(file, {
            headers: { "content-type": file.type },
          });
        }
      } catch {
        // Not found, keep looking.
      }
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Serving ${ROOT} on http://localhost:${PORT}`);
