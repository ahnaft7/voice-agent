import { NextResponse } from "next/server"; 
import Groq from "groq-sdk";

const systemPrompt = "You are an excellent conversationalist"; 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        const { text } = await req.json(); // Extract text from the request body
        console.log("Text was received in POST", { text });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: text
                },
            ],
            model: "llama3-8b-8192", // or another appropriate Groq model
        });
        console.log("This is the llm response:", completion.response)
        // Assuming completion.response contains the completion text
        return NextResponse.json({ response: completion.response });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Error interacting with LLM" }, { status: 500 });
    }
}


// import Groq from 'groq-sdk';

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { text } = req.body;
//     try {
//       const response = await groq.chat.completions.create({
//         prompt: text,
//         messages: [
//             {
//                 role: 'system',
//                 content: systemPrompt
//             },
//             {
//                 role: 'user',
//                 content: userPrompt
//             }
//         ],
//         model: 'llama3-8b-8192',
//         response_format: { type: 'json_object' },
//       });
//       res.status(200).json({ response: response.text });
//     } catch (error) {
//       res.status(500).json({ error: 'Error interacting with LLM' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }