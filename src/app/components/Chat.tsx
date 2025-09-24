"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Sidebar from "./Sidebar";
import { motion } from "motion/react";
import {
  Plus,
  SendHorizontal,
  Mic,
  X,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Loader2,
} from "lucide-react";

import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
  fileUrl?: string;
  fileName?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

declare global {
  interface Window {
    audio?: HTMLAudioElement;
  }
}

// CodeBlock component
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#1e1e1e] rounded-md my-3 overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, padding: "1em", fontSize: "0.9rem" }}
        wrapLines={true}
        showLineNumbers={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// Renders text with code blocks
function renderMessageContent(content: string) {
  const regex = /```([\w-]+)?\s*\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fullMatch, lang, code] = match;
    const start = match.index;

    if (start > lastIndex) {
      parts.push(
        <p key={lastIndex} className="mb-2 whitespace-pre-wrap">
          {content.slice(lastIndex, start)}
        </p>
      );
    }

    parts.push(
      <CodeBlock
        key={start}
        code={code.trim()}
        language={lang || "plaintext"}
      />
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(
      <p key={lastIndex} className="mt-0 whitespace-pre-wrap">
        {content.slice(lastIndex)}
      </p>
    );
  }

  return parts;
}

export default function ChatSection() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<
    { email: string; name?: string } | undefined
  >(undefined);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    fileUrl: string;
    fileName: string;
  } | null>(null);
  const [reactions, setReactions] = useState<
    Record<number, { like?: boolean; dislike?: boolean; copied?: boolean }>
  >({});

  const [loadingTTS, setLoadingTTS] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  // Function to auto resize textarea
  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return;

    const userMessage: Message = {
      role: "user",
      content: message.trim(),
      fileUrl: selectedFile?.fileUrl,
      fileName: selectedFile?.fileName,
    };

    const updatedMessages: Message[] = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage("");
    setSelectedFile(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (data?.content) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.content,
        };

        const newMessages: Message[] = [...updatedMessages, assistantMessage];
        setMessages(newMessages);

        if (selectedChatId) {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === selectedChatId
                ? { ...chat, messages: newMessages }
                : chat
            )
          );
        } else {
          const newChat: Chat = {
            id: Date.now().toString(),
            title: newMessages[0].content.slice(0, 20),
            messages: newMessages,
          };
          setChats((prev) => [newChat, ...prev]);
          setSelectedChatId(newChat.id);
        }
      }
    } catch (err) {
      console.error("Error calling API:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, selectedChatId]);

  // fetch current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/"); // redirect if not logged in
        return;
      }

      setUser({
        email: user.email!,
        name: user.user_metadata.name,
      });
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handlePush = () => {
    if (!user) {
      router.push("/auth");
    } else {
      router.push("/voice");
    }
  };

  return (
    <div className="min-h-screen md:h-screen lg:h-screen w-full flex flex-col md:flex-row bg-[#202120] text-gray-100">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        setChats={setChats}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        setMessages={setMessages}
        setMessage={setMessage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto px-4 py-20 md:px-12 lg:px-24 lg:py-20 xl:px-80 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`group relative flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[90%] sm:max-w-[70%] lg:text-md text-lg ${
                  m.role === "user"
                    ? "bg-[#313130] text-white rounded-br-none"
                    : "text-gray-200"
                }`}
              >
                {/* Render text & code */}
                {m.content && <div>{renderMessageContent(m.content)}</div>}

                {/* File Preview */}
                {m.fileUrl && (
                  <div className="mt-2">
                    {m.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <Image
                        src={m.fileUrl}
                        alt={m.fileName}
                        height={200}
                        width={200}
                        className="rounded-lg max-h-48 object-cover"
                      />
                    ) : (
                      <a
                        href={m.fileUrl}
                        download={m.fileName}
                        className="underline text-sm text-gray-200 hover:text-white"
                      >
                        {m.fileName}
                      </a>
                    )}
                  </div>
                )}

                {/* Assistant Actions */}
                {m.role === "assistant" && (
                  <div className="flex items-center space-x-3 mt-4 text-gray-400">
                    {/* Copy */}
                    <button
                      onClick={() => {
                        copy(m.content || "");
                        setReactions((prev) => ({
                          ...prev,
                          [i]: { ...(prev[i] || {}), copied: true },
                        }));

                        setTimeout(() => {
                          setReactions((prev) => ({
                            ...prev,
                            [i]: { ...(prev[i] || {}), copied: false },
                          }));
                        }, 2000);
                      }}
                      className="hover:text-white"
                      title="Copy"
                    >
                      {reactions[i]?.copied ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Copy className="w-4 h-4 hover:text-white" />
                      )}
                    </button>

                    {/* Like */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      animate={
                        reactions[i]?.like
                          ? { rotate: [0, -15, 15, -10, 10, 0] }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      onClick={() =>
                        setReactions((prev) => ({
                          ...prev,
                          [i]: {
                            ...prev[i],
                            like: !prev[i]?.like,
                            dislike: false,
                          },
                        }))
                      }
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${
                          reactions[i]?.like ? "text-white" : "hover:text-white"
                        }`}
                      />
                    </motion.button>

                    {/* Dislike */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      animate={
                        reactions[i]?.dislike
                          ? { rotate: [0, 15, -15, 10, -10, 0] }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      onClick={() =>
                        setReactions((prev) => ({
                          ...prev,
                          [i]: {
                            ...prev[i],
                            dislike: !prev[i]?.dislike,
                            like: false,
                          },
                        }))
                      }
                    >
                      <ThumbsDown
                        className={`w-4 h-4 ${
                          reactions[i]?.dislike
                            ? "text-white"
                            : "hover:text-white"
                        }`}
                      />
                    </motion.button>

                    {/* Speak */}
                    <button
                      onClick={async () => {
                        if (window.audio && !window.audio.paused) {
                          window.audio.pause();
                          window.audio.currentTime = 0;
                          setIsSpeaking(false);
                          return;
                        }

                        try {
                          setLoadingTTS(true);
                          const res = await fetch("/api/speak", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text: m.content }),
                          });

                          if (!res.ok) {
                            toast.error("Out of Token Limit");
                            throw new Error("TTS request failed");
                          }

                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const audio = new Audio(url);
                          window.audio = audio;

                          setLoadingTTS(false);
                          setIsSpeaking(true);
                          audio.play();

                          audio.onended = () => {
                            setIsSpeaking(false);
                            URL.revokeObjectURL(url);
                          };
                        } catch (err) {
                          console.error("TTS error:", err);
                          setLoadingTTS(false);
                          setIsSpeaking(false);
                        }
                      }}
                    >
                      {loadingTTS ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Volume2
                          className={`w-4 h-4 hover:text-white ${
                            isSpeaking ? "text-white" : "text-gray-400"
                          }`}
                        />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-500 text-sm animate-pulse">
              AI is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div
          className={`w-full sm:w-[90%] md:w-[600px] max-w-full transition-all duration-500 px-4 sm:px-0 ${
            messages.length === 0
              ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : "absolute bottom-5 left-1/2 -translate-x-1/2"
          }`}
        >
          {messages.length === 0 && (
            <h1 className="text-4xl lg:text-5xl text-center mb-10 mr-10 whitespace-nowrap">
              ✨ What&apos;s new, {user?.name?.split(" ")[0] ?? "User"}
            </h1>
          )}
          {selectedFile && (
            <div className="mb-2 flex items-center space-x-2 bg-[#303030] p-2 rounded-lg">
              {selectedFile.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <Image
                  src={selectedFile.fileUrl}
                  alt={selectedFile.fileName}
                  height={60}
                  width={60}
                  className="rounded-md object-cover"
                />
              ) : (
                <span className="text-sm truncate">
                  {selectedFile.fileName}
                </span>
              )}
              <button
                className="text-red-400 hover:text-red-600"
                onClick={() => setSelectedFile(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="bg-[#31312e] border border-[#353430] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3 shadow-lg">
            <label className="p-2 rounded-lg hover:bg-[#181818] cursor-pointer">
              <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-gray-300" />
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    const file = e.target.files[0];
                    const fileUrl = URL.createObjectURL(file);
                    setSelectedFile({ fileUrl, fileName: file.name });
                  }
                }}
                className="hidden"
              />
            </label>

            <textarea
              ref={textareaRef}
              placeholder="How can I help you today?"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                resizeTextarea();
              }}
              // Only send message on Enter without Shift
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
                // No need to handle Shift+Enter. Textarea handles it by default.
              }}
              rows={1}
              style={{
                minHeight: "42px",
                maxHeight: "300px",
                overflowY: "auto",
                resize: "none",
              }}
              className="flex-1 bg-transparent resize-none outline-none text-gray-200 placeholder-[#8f8c85] text-lg lg:text-md pt-2 lg:pt-2"
            />

            <div className="flex gap-3 lg:gap-2 lg:bg-[#181818] rounded-2xl lg:px-4 lg:py-1">
              <button
                onClick={handlePush}
                className="p-1 rounded-lg hover:bg-[#30302e] disabled:opacity-50"
              >
                <Mic className="w-5 h-5 lg:w-5 lg:h-5 text-white" />
              </button>

              <button
                onClick={handleSend}
                disabled={loading}
                className="p-1 rounded-lg hover:bg-[#30302e] disabled:opacity-50"
              >
                <SendHorizontal className="w-5 h-5 lg:w-5 lg:h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
