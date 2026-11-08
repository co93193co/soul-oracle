import http from 'http';

// 建立 3003 端口代理伺服器，將 localhost:3003/ 映射至 V4 冥想點數版 (1分1點、3分3點、5分5點，時間不限最高10點)
const server = http.createServer((req, res) => {
  let targetPath = req.url === '/' ? '/v4' : req.url;

  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: 'localhost:3000',
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('伺服器連線中，請稍候重試：' + err.message);
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(3003, () => {
  console.log('V4 冥想點數版全新伺服器已啟動在獨立網址：http://localhost:3003');
});
