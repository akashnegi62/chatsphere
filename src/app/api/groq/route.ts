import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // Call Groq LLM
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Keep answers very short (max 1-2 sentences).",
        },
        { role: "user", content: text },
      ],
    });

    // Extract reply and make it one line
    let reply =
      completion.choices[0]?.message?.content || "Sorry, I couldn’t answer.";
    reply = reply.replace(/\s+/g, " ").trim(); // collapse multiple spaces/newlines

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Groq API Error:", err);
    return NextResponse.json({ error: "Groq request failed" }, { status: 500 });
  }
}
