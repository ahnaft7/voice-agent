import { NextResponse } from "next/server";
import fs from "fs";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  const body = await req.json();
  const base64Audio = body.audio;
  const audio = Buffer.from(base64Audio, "base64");
  const filePath = "tmp/input.wav";

  try {
    fs.writeFileSync(filePath, audio);
    const readStream = fs.createReadStream(filePath);
    const data = await groq.audio.transcriptions.create({
        file: readStream,
        model: "whisper-large-v3",
        prompt: "Specify context or spelling", // Optional
        response_format: "json", // Optional
        temperature: 0.0, // Optional
    });
    // Remove the file after use
    fs.unlinkSync(filePath);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
}