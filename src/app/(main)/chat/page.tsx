"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquareText, Send, Loader2, BrainCircuit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeMount } from "@/hooks/useThemeMount";
import { useAccount } from "@/context/AccountContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "How can I reduce my expenses?",
  "Am I saving enough this month?",
  "Which category am I overspending in?",
  "Give me a savings plan for next month",
  "How is my financial health?",
];

export default function ChatPage() {
  const { isLight } = useThemeMount();
  const { selectedAccount } = useAccount();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm FinSight AI, your personal financial assistant 👋\n\nI have access to your financial data and can help you with budgeting advice, spending analysis, and money tips. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          financialContext: `Account: ${selectedAccount?.name}, Type: ${selectedAccount?.type}, Balance: ₹${selectedAccount?.balance}`,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const bubbleBg = isLight ? "bg-white border border-gray-100 shadow-sm text-gray-700" : "bg-white/5 border border-white/5 text-white/80";
  const inputCls = isLight ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm" : "bg-white/5 border-white/10 text-white placeholder:text-white/20";
  const quickBtn = isLight ? "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-blue-300 hover:bg-blue-50 bg-white shadow-sm" : "border-white/10 text-white/50 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5";

  return (
    <div className="flex flex-col h-screen p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${text}`}>Finance Chatbot</h1>
          <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
            ● Online
          </span>
        </div>
        <p className={`text-sm ml-12 ${muted}`}>
          Powered by Gemini AI · Knows your financial data
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.role === "assistant"
                ? "bg-gradient-to-br from-blue-500 to-cyan-400"
                : isLight ? "bg-gray-100" : "bg-white/10"
            }`}>
              {msg.role === "assistant" ? (
                <BrainCircuit className="w-4 h-4 text-white" />
              ) : (
                <User className={`w-4 h-4 ${isLight ? "text-gray-500" : "text-white/60"}`} />
              )}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "assistant"
                ? bubbleBg
                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <div className={`rounded-2xl px-4 py-3 ${isLight ? "bg-white border border-gray-100 shadow-sm" : "bg-white/5 border border-white/5"}`}>
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${quickBtn}`}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about your finances..."
          className={`flex-1 h-12 rounded-xl ${inputCls}`}
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90 h-12 w-12 p-0 rounded-xl"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
