// const { createServer } = require('http');
// const WebSocketServer = require('ws').Server;
// const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req, res) => {
//     handle(req, res);
//   });

//   const wss = new WebSocketServer({ server });

//   wss.on('connection', (ws) => {
//     console.log('Client connected');
    
//     ws.on('message', (message) => {
//       console.log('Received:', message);
//       // Echo received message back to client for testing
//       ws.send(`Echo: ${message}`);
//     });

//     ws.on('close', (code, reason) => {
//       console.log(`Connection closed: ${code} - ${reason}`);
//     });

//     ws.on('error', (error) => {
//       console.error('WebSocket error:', error);
//     });
//   });

//   server.listen(3000, (err) => {
//     if (err) throw err;
//     console.log('> Ready on http://localhost:3000');
//   });
// });
