import http from 'http';

// 建立 3001 端口代理伺服器，將 localhost:3001/ 映射至 V2 新功能版
const server = http.createServer((req, res) => {
  let targetPath = req.url === '/' ? '/v2' : req.url;

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

server.listen(3001, () => {
  console.log('V2 新功能版已成功啟動在獨立網址：http://localhost:3001');
});
