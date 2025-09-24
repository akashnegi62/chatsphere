"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, X, LogOut, VolumeX, Volume1 } from "lucide-react";
import { motion } from "framer-motion";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VoiceChat() {
  const [token, setToken] = useState<string>();
  const [userText, setUserText] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();
  // Add a new state for incoming audio
  const [isIncomingMuted, setIsIncomingMuted] = useState(false);

  // Toggle function
  const toggleIncomingMute = () => {
    setIsIncomingMuted((prev) => {
      const newState = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newState;
      }
      toast(newState ? "Incoming voice muted" : "Incoming voice unmuted");
      return newState;
    });
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `/api/token?room=airoom&username=user-${Date.now()}`
      );
      const data = await res.json();
      setToken(data.token);
    })();
  }, []);

  const handleAudioUpload = async (blob: Blob) => {
    try {
      // Step 1: STT
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");
      const sttRes = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });
      if (!sttRes.ok) throw new Error("STT failed");
      const { text } = await sttRes.json();
      setUserText(text);
      console.log("STT result:", text);

      // Step 2: Groq LLM
      const aiRes = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!aiRes.ok) throw new Error("Groq LLM failed");
      const { reply } = await aiRes.json();
      setAiReply(reply);
      console.log("Groq LLM result:", reply);

      // Step 3: Groq TTS
      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reply }),
      });

      if (!ttsRes.ok) {
        toast.error("Out of Token Limit");
        throw new Error("TTS failed");
      }

      const audioBuffer = await ttsRes.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (err) {
      console.error("Pipeline error:", err);
    } finally {
      setIsRecording(false);
    }
    console.log("Pipeline complete");
  };

  const recordAndSend = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        handleAudioUpload(blob);
        chunks = [];
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 9000); // record for 9 seconds
    } catch (err) {
      console.error("Recording error:", err);
      toast.error("Microphone access denied");
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#202120] text-white relative">
      {/* Main circle */}
      <motion.div
        animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: [1, 1.03, 1] }}
        transition={{
          duration: isRecording ? 0.8 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`rounded-full w-40 h-40 shadow-2xl ${
          isRecording
            ? "bg-gradient-to-b from-white to-blue-400"
            : "bg-gradient-to-b from-blue-200 to-blue-500"
        }`}
      />

      {/* Bottom controls */}
      <div className="absolute bottom-16 flex flex-col items-center space-y-6">
        <p className="text-sm text-neutral-400">
          Advanced Voice is now ChatSphere voice
        </p>
        <div className="flex space-x-8">
          <button
            onClick={recordAndSend}
            disabled={isRecording}
            className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 transition shadow-lg disabled:opacity-50"
          >
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setIsRecording(false)}
            className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 transition shadow-lg"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex space-x-4">
            {/* Mute buttons */}

            <button
              onClick={toggleIncomingMute}
              className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 transition shadow-lg"
            >
              {isIncomingMuted ? <VolumeX /> : <Volume1 />}
            </button>
          </div>
        </div>
      </div>

      {/* Settings icon (top-right) */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-800 transition"
      >
        <LogOut />
      </button>

      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />

      {/* Debug (optional, hidden by default) */}
      <div className="hidden absolute bottom-4 text-xs text-gray-400 text-center space-y-1">
        {userText && <p>User said: {userText}</p>}
        {aiReply && <p>AI replied: {aiReply}</p>}
      </div>

      {/* LiveKit background connection */}
      <LiveKitRoom
        className="hidden"
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        video={false}
        audio={true}
      />
    </div>
  );
}
