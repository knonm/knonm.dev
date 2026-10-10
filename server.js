// Static file server for ./public using Bun's built-in server.
// Replaces the http-server npm package: serves the site on port 8080.
const PORT = Number(process.env.PORT) || 8080;
const ROOT = process.cwd() + "/public";

const notFound = () => new Response("Not Found", { status: 404 });

Bun.serve({
  port: PORT,
  fetch: async (request) => {
    const url = new URL(request.url);
    let requestPath;
    try {
      requestPath = decodeURIComponent(url.pathname);
    } catch {
      return notFound();
    }

    // Reject anything that could escape the root directory.
    if (requestPath.includes("..")) return notFound();

    // Candidate files: the requested file, or a directory's index.html.
    // exists() returns false for directories and missing files, so it
    // doubles as an "is file" check.
    for (const candidate of [
      ROOT + requestPath,
      ROOT + requestPath + "/index.html",
    ]) {
      const file = Bun.file(candidate);
      if (await file.exists()) {
        return new Response(file, {
          headers: { "content-type": file.type },
        });
      }
    }
    return notFound();
  },
});

console.log(`Serving ${ROOT} on http://localhost:${PORT}`);
