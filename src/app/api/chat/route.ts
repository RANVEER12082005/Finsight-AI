import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages, financialContext } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const systemPrompt = `You are FinSight AI, a personal financial assistant. You help users understand their finances, give budgeting advice, and answer money-related questions.

Here is the user's current financial context:
${financialContext}

Guidelines:
- Be concise, friendly and helpful
- Use ₹ for Indian Rupees
- Give specific actionable advice based on their data
- Keep responses under 150 words
- Use bullet points when listing multiple items`;

    const chatHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "I'm FinSight AI, your personal financial assistant. I have access to your financial data and I'm ready to help!" }] },
        ...chatHistory,
      ],
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
