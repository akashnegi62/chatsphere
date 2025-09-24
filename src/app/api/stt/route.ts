/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo", // Groq Whisper model
      response_format: "verbose_json", // can also use "json" or "text"
      timestamp_granularities: ["word", "segment"], // optional
      language: "en", // optional
      temperature: 0.0, // optional
    });

    return NextResponse.json(transcription);
  } catch (err: any) {
    console.error("❌ STT error:", err);
    return NextResponse.json(
      { error: "STT failed", details: err.message },
      { status: 500 }
    );
  }
}
