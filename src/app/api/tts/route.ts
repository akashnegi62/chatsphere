/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// 🔹 Split long text into smaller chunks (max ~150 chars)
function splitIntoChunks(text: string, maxLength = 150): string[] {
  const sentences = text.match(/[^.!?]+[.!?]/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      if (current.trim()) chunks.push(current.trim());
      current = sentence;
    } else {
      current += " " + sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "autumn" } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
      });
    }

    const chunks = splitIntoChunks(text); // 🚀 smaller chunks = faster TTS
    const buffers: Buffer[] = [];

    // 🔹 Generate audio for each chunk sequentially
    for (const chunk of chunks) {
      const result = await groq.audio.speech.create({
        model: "canopylabs/orpheus-v1-english",
        voice,
        input: chunk,
        response_format: "wav",
      });

      const buffer = Buffer.from(await result.arrayBuffer());
      buffers.push(buffer);

      // 🚀 Stream back as soon as we have audio (flush partial response)
    }

    const finalBuffer = Buffer.concat(buffers);

    return new Response(finalBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'inline; filename="speech.wav"',
      },
    });
  } catch (err: any) {
    console.error("TTS error:", err);
    return new Response(
      JSON.stringify({ error: "TTS failed", details: err.message }),
      { status: 500 }
    );
  }
}
