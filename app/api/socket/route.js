// import { Server } from 'ws';
// import Groq from "groq-sdk";
// import fs from "fs";

// // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export default function handler(req, res) {
//   if (res.socket.server.wss) {
//     console.log("WebSocket server is already running");
//     res.end();
//     return;
//   }

//   const wss = new Server({ server: res.socket.server });
//   res.socket.server.wss = wss;

//   wss.on('connection', function connection(ws) {
//     console.log("New WebSocket connection");

//     ws.on('message', async function message(data) {
//       // Assuming the data is audio in base64 format
//       console.log('received audio data');

//       // STT Process
//       const audioBuffer = Buffer.from(data, "base64");
//       const filePath = "tmp/input.wav";

//       try {
//         fs.writeFileSync(filePath, audioBuffer);
//         const readStream = fs.createReadStream(filePath);
//         const transcription = await groq.audio.transcriptions.create({
//           file: readStream,
//           model: "whisper-large-v3",
//           response_format: "json",
//         });

//         fs.unlinkSync(filePath); // Clean up the file

//         const userText = transcription.text;
//         console.log("Transcribed text:", userText);

//         // LLM Process
//         const completion = await groq.chat.completions.create({
//           messages: [
//             {
//               role: "system",
//               content: systemPrompt,
//             },
//             {
//               role: "user",
//               content: userText,
//             },
//           ],
//           model: "llama3-8b-8192",
//         });

//         const llmResponse = completion.choices[0].message.content;
//         console.log("LLM Response:", llmResponse);

//         // Send the transcription and LLM response back to the client
//         ws.send(JSON.stringify({ transcription: userText, llmResponse }));

//       } catch (error) {
//         console.error("Error processing audio or LLM:", error);
//         ws.send(JSON.stringify({ error: "Error processing the request" }));
//       }
//     });

//     ws.on('close', () => {
//       console.log("WebSocket connection closed");
//     });
//   });

//   res.end();
// }
