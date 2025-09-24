import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert messages into plain text (ignore fileUrl/fileName, just describe)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizedMessages = messages.map((m: any) => {
      let content = m.content || "";
      if (m.fileName) {
        content += `\n\n[User uploaded a file: ${m.fileName}]`;
      }
      return { role: m.role, content };
    });

    const updatedMessages = [
      {
        role: "system",
        content:
          "You are a helpful assistant. Always respond in one paragraph of 4–6 sentences.",
      },
      ...sanitizedMessages,
    ];

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: updatedMessages,
    });

    return NextResponse.json(completion.choices[0].message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
