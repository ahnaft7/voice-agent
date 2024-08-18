"use client";
import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "../utils/blobToBase64";
import { createMediaStream } from "../utils/createMediaStream";

export const useRecordVoice = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const chunks = useRef([]);

  const startRecording = () => {
    if (mediaRecorder && !recording) {
      chunks.current = []; // Clear previous chunks
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const getText = async (base64data) => {
    try {
      const sttResponse = await fetch("/api/stt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64data,
        }),
      }).then((res) => res.json());
      const { text } = sttResponse;
      setText(text);

      console.log("This is the spoken text", text);

      // Send the transcribed text to the Groq LLM API
      const llmResponse = await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());

      setResponse(llmResponse.response); // Update state with LLM response
      
      // Send the LLM response to the TTS API
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: llmResponse.response }),
        });
      
        // Check if the response is OK before parsing
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      
        const ttsResponse = await response.json();
        const { audioUrl } = ttsResponse;
        console.log("Audio URL:", audioUrl);
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
      

      // need to set the audio URL somewhere in your state to use it
      // setAudioUrl(audioUrl); 

    } catch (error) {
      console.error("Error processing audio or interacting with APIs:", error);
    }
  };

  const initialMediaRecorder = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      console.log("Blob created:", audioBlob);
      blobToBase64(audioBlob, (base64data) => {
        getText(base64data);
      });
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);

  return { recording, startRecording, stopRecording, text, response };
};
