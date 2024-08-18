"use client";
import { useRecordVoice } from "../hooks/useRecordVoice"; // Adjust path as needed
import { IconMicrophone } from "@/app/components/IconMicrophone";

const Microphone = () => {
  const { recording, startRecording, stopRecording, text } = useRecordVoice();

  const handleClick = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={handleClick}
        className={`relative border-none bg-transparent w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${recording ? 'bg-red-600' : 'bg-green-600'}`}
      >
        <IconMicrophone 
            className={`w-6 h-6`} 
            style={{ 
                transform: recording ? 'rotate(360deg)' : 'none',
                transition: 'transform 1s linear',
                animation: recording ? 'spin 1s linear infinite' : 'none'
            }} 
        />
        {recording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
          </div>
        )}
      </button>
      <p className="mt-2 text-black">{text}</p>
    </div>
  );
};

export { Microphone };

