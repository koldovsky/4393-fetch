import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import querystring from 'querystring';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const PUBLIC_ROOT = path.join(__dirname);
const MESSAGES_FILE = path.join(__dirname, 'data', 'chat_messages.txt');

// Ensure data folder and messages file exist
try {
  fs.mkdirSync(path.dirname(MESSAGES_FILE), { recursive: true });
} catch (e) {}
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, '');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMessagesHtml(messages) {
  // messages is array of {username, message, time}
  const items = messages
    .slice(-200) // keep last 200 messages
    .map((m) => {
      const time = new Date(m.time).toLocaleTimeString();
      return `
<div class="chat__messages" id="chat-messages">
  ${messages
    .map(
      (mm) => `
  <div class="chat__message">
    <div>
      <span class="chat__user">${escapeHtml(mm.username)}</span>
      <span class="chat__time">${escapeHtml(new Date(mm.time).toLocaleString())}</span>
    </div>
    <div class="chat__text">${escapeHtml(mm.message)}</div>
  </div>`
    )
    .join('')}
</div>`;
    })
    .join('');
  // The above double-mapping duplicates container; simplify: build container once
  const html = `
<div class="chat__messages" id="chat-messages">
${messages
  .slice(-200)
  .map(
    (mm) => `  <div class="chat__message">
    <div>
      <span class="chat__user">${escapeHtml(mm.username)}</span>
      <span class="chat__time">${escapeHtml(new Date(mm.time).toLocaleString())}</span>
    </div>
    <div class="chat__text">${escapeHtml(mm.message)}</div>
  </div>`
  )
  .join('\n')}
</div>`;
  return html;
}

async function readMessages() {
  try {
    const raw = await fs.promises.readFile(MESSAGES_FILE, 'utf8');
    if (!raw.trim()) return [];
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  } catch (e) {
    return [];
  }
}

async function appendMessage(obj) {
  const line = JSON.stringify(obj) + '\n';
  await fs.promises.appendFile(MESSAGES_FILE, line, 'utf8');
}

function serveStatic(req, res, pathname) {
  // map root to index.html
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(PUBLIC_ROOT, pathname);
  // prevent directory traversal
  if (!filePath.startsWith(PUBLIC_ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    const type = mime[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // GET messages for htmx polling
  if (req.method === 'GET' && pathname === '/api/chat/messages') {
    const messages = await readMessages();
    const html = renderMessagesHtml(messages);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // POST send message
  if (req.method === 'POST' && pathname === '/api/chat/send') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      const parsed = querystring.parse(body);
      const username = (parsed.username || 'Anonymous').toString().slice(0, 100);
      const message = (parsed.message || '').toString().slice(0, 1000);
      const payload = {
        username: username,
        message: message,
        time: new Date().toISOString(),
      };
      await appendMessage(payload);
      const messages = await readMessages();
      const html = renderMessagesHtml(messages);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    return;
  }

  // Serve other static files
  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
