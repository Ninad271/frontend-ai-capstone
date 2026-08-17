/**
 * Minimal static file server for local development.
 * Serves the app at http://localhost:3000 with /settings route support.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const ROUTES = {
  "/": "/index.html",
  "/settings": "/settings/index.html",
};

function resolveFilePath(urlPath) {
  const normalized = urlPath.split("?")[0].replace(/\/$/, "") || "/";
  const routeTarget = ROUTES[normalized];

  if (routeTarget) {
    return path.join(ROOT, routeTarget);
  }

  const filePath = path.join(ROOT, normalized);

  if (!filePath.startsWith(ROOT)) {
    return null;
  }

  return filePath;
}

function sendFile(response, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not Found" : "Internal Server Error");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const filePath = resolveFilePath(request.url || "/");

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  sendFile(response, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Settings page: http://localhost:${PORT}/settings`);
});
