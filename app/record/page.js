import { Microphone } from "@/app/components/Microphone";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Voice Chat
        </h1>
        <p className="text-lg text-gray-600">
          Click the microphone to start recording your voice.
        </p>
      </div>
      <Microphone />
    </main>
  );
}
