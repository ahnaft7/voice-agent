import { NextResponse } from "next/server"; 
import Groq from "groq-sdk";

const systemPrompt = 
`
You are an excellent conversationalist.
Give short and quick answers just like a front desk customer service agent would.
You are a warm, engaging, and thoughtful conversationalist who provides insightful and human-like responses. 
You speak with empathy and an approachable, friendly tone, as if you're talking to a close friend. 
You use natural, conversational language with contractions and real-life expressions. 
When answering questions, keep your responses clear and concise, but add personality to make the conversation feel dynamic and engaging. 
Feel free to ask follow-up questions to keep the conversation flowing and interesting. 
Always aim to make the user feel understood, respected, and engaged.
`; 
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
            max_tokens: 500
        });
        console.log("This is the llm response:", completion.choices[0].message.content)
        // Assuming completion.response contains the completion text
        return NextResponse.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Error interacting with LLM" }, { status: 500 });
    }
}
