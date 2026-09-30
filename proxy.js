// Proxy local para o Assistente IA
// Execute com: node proxy.js
// Mantém a chave de API segura no servidor, evitando bloqueio CORS do browser.

const http = require("http");
const https = require("https");

const PORT = 3001;
const API_KEY = "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";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/chat") {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, { "Content-Type": "application/json" });
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: { message: err.message } }));
    });

    proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`✓ Proxy IA rodando em http://localhost:${PORT}`);
  console.log(`  Mantenha este terminal aberto enquanto usar o chat.`);
});
