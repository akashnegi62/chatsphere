"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import copy from "copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#1e1e1e] rounded-lg overflow-hidden">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 rounded bg-[#2d2d2d] hover:bg-[#3a3a3a] text-gray-300"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      {/* Code block */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.85rem",
          background: "transparent",
          maxWidth: "50%",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
