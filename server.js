import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;
const port = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.map': 'application/json; charset=utf-8'
};

const routeFiles = {
  '/login/': '/login/index.html',
  '/login': '/login/index.html',
  '/signup/': '/signup/index.html',
  '/signup': '/signup/index.html',
  '/compare/': '/compare/index.html',
  '/compare': '/compare/index.html',
  '/financial-analysis/': '/financial-analysis/index.html',
  '/financial-analysis': '/financial-analysis/index.html',
  '/dashboard/': '/dashboard/index.html',
  '/dashboard': '/dashboard/index.html',
  '/onboarding/': '/onboarding/index.html',
  '/onboarding': '/onboarding/index.html'
};

function send(res, status, contentType, body) {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(body);
}

function routeToFile(requestPath) {
  const decoded = decodeURIComponent(requestPath);

  if (routeFiles[decoded]) {
    return path.resolve(root, routeFiles[decoded]);
  }

  if (decoded === '/' || decoded === '') {
    return path.resolve(root, 'index.html');
  }

  if (decoded.includes('/../') || decoded.startsWith('/..')) {
    return null;
  }

  const candidate = path.resolve(root, '.' + decoded);
  if (candidate.startsWith(root)) {
    return candidate;
  }

  return null;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = requestUrl.pathname;

  if (pathname.endsWith('/') && pathname !== '/') {
    const target = path.resolve(root, '.' + pathname, 'index.html');
    if (fs.existsSync(target)) {
      pathname = pathname + 'index.html';
    }
  }

  const filePath = routeToFile(pathname);

  if (!filePath || !filePath.startsWith(root)) {
    return send(res, 403, 'application/json; charset=utf-8', '{"error":"Forbidden"}');
  }

  if (!fs.existsSync(filePath)) {
    return send(res, 404, 'application/json; charset=utf-8', '{"error":"Not found"}');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      return send(res, 500, 'application/json; charset=utf-8', '{"error":"Internal server error"}');
    }

    send(res, 200, mimeType, content);
  });
});

server.listen(port, () => {
  console.log(`Static FinPath server running at http://127.0.0.1:${port}`);
});
