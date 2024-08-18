// File: /api/text-to-speech/route.js
import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('json?')
    console.log(request)
    try {
        const { llmresponse } = await request.json();
        console.log("LLM response received for TTS:", llmresponse);

        const synthesizer = await pipeline('text-to-speech', 'Xenova/mms-tts-eng');
        const output = await synthesizer(text);

        const wav = new wavefile.WaveFile();
        wav.fromScratch(1, output.sampling_rate, '32f', output.audio);

        const filePath = path.join(process.cwd(), 'public', 'out.wav');
        fs.writeFileSync(filePath, wav.toBuffer());
        console.log('File saved:', filePath);

        return NextResponse.json({ audioUrl: '/out.wav' });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Error generating speech" }, { status: 500 });
    }
}
