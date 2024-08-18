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

const { createServer } = require('http');
const next = require('next');
const WebSocket = require('ws');
const Groq = require('groq-sdk');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const groq = new Groq({ apiKey: "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" });

const WS_PORT = 3001;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const wss = new WebSocket.Server({ server }); //Change to WS_PORT for local testing, and server for deployment

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    ws.send('Hello server');
    let audioBuffer = Buffer.alloc(0);
    let isProcessing = false;

    ws.on('message', async (message) => {
      console.log('Received message:', message);
      audioBuffer = Buffer.concat([audioBuffer, message]);

      const COOLDOWN_PERIOD = 500; // 500ms cooldown
      let lastProcessTime = 0;

      if (audioBuffer.length >= 16000 && !isProcessing && Date.now() - lastProcessTime > COOLDOWN_PERIOD) { // Adjust this value as needed
        isProcessing = true;
        try {
          const tempFilePath = path.join(__dirname, `temp-audio-${Date.now()}.webm`);
          await fsp.writeFile(tempFilePath, audioBuffer);

          const readStream = fs.createReadStream(tempFilePath);

          const data = await groq.audio.transcriptions.create({
            file: readStream,
            model: "whisper-large-v3",
            response_format: "json",
          });

          await fsp.unlink(tempFilePath);

          if (data.text.trim()) {
            ws.send(JSON.stringify({ type: 'transcription', text: data.text }));

            const completion = await groq.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content: "You are an excellent conversationalist..."
                },
                {
                  role: "user",
                  content: data.text
                },
              ],
              model: "llama3-8b-8192",
              max_tokens: 500
            });

            ws.send(JSON.stringify({ type: 'llmResponse', response: completion.choices[0].message.content }));
          }

          // Reset audio buffer
          audioBuffer = Buffer.alloc(0);
        } catch (error) {
          console.error('Error processing audio:', error);
          console.error('Audio buffer size:', audioBuffer.length);
          console.error('Audio buffer type:', typeof audioBuffer);
          ws.send(JSON.stringify({ type: 'error', message: error.message }));
        } finally {
          isProcessing = false;
        }
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log(`> WebSocket server running on ws://localhost:${PORT}`); //Change to WS_PORT for local testing, and PORT for deployment
  });
});