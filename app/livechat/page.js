// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRecordVoice } from "../hooks/useRecordVoice";

// export default function LiveChat() {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const { recording, startRecording, stopRecording, chunks } = useRecordVoice();

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:3000"); // Ensure this matches the server port

//     ws.onopen = () => {
//       console.log("Connected to WebSocket");
//     };

//     ws.onmessage = (message) => {
//       try {
//         const data = JSON.parse(message.data);
//         setMessages((prevMessages) => [...prevMessages, data]);
//         console.log('Message received:', data);
//       } catch (error) {
//         console.error('Error parsing message:', error);
//       }
//     };

//     ws.onclose = () => {
//       console.log("WebSocket connection closed");
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     setSocket(ws);

//     return () => {
//       ws.close();
//     };
//   }, []);

//   const handleStart = () => {
//     startRecording();
//   };

//   const handleStop = () => {
//     stopRecording();

//     const audioBlob = new Blob(chunks.current, { type: 'audio/wav' });
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64Audio = reader.result.split(',')[1]; // Strip the base64 prefix
//       if (socket) {
//         try {
//           socket.send(base64Audio); // Send audio data to WebSocket server
//         } catch (error) {
//           console.error('Error sending message:', error);
//         }
//       }
//     };
//     reader.readAsDataURL(audioBlob);
//   };

//   const playAudio = (base64Audio) => {
//     const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
//     audio.play();
//   };

//   return (
//     <div className="live-chat">
//       <button onMouseDown={handleStart} onMouseUp={handleStop}>
//         {recording ? 'Recording...' : 'Press to Speak'}
//       </button>
//       <div className="messages">
//         {messages.map((msg, index) => (
//           <p key={index}>{msg.transcription}: {msg.llmResponse}</p>
//         ))}
//       </div>
//     </div>
//   );
// }
