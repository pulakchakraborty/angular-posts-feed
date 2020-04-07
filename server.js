const http = require('http');   // import http

const server = http.createServer((req, res) => {
  res.end('Node server response');
});

server.listen(process.env.PORT || 3000);
