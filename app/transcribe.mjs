import fs from "fs";
import Groq from "groq-sdk";
// import dotenv from "dotenv";

// // Manually load environment variables from the .env.local file
// dotenv.config({ path: 'C:\Users\ahnaf\HeadstarterProjects\voice-agent\.env.local' });

console.log(process.env.GROQ_API_KEY)
const groq = new Groq({ apiKey: "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" });


async function main() {
  try {
    const translation = await groq.audio.translations.create({
      file: fs.createReadStream("sample1.flac"),
      model: "whisper-large-v3",
      prompt: "Specify context or spelling", // Optional
      response_format: "json", // Optional
      temperature: 0.0, // Optional
    });
    console.log(translation.text);
  } catch (error) {
    console.error("Error during transcription:", error);
  }
}

main();
