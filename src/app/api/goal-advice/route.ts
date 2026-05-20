import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { goal, monthlyIncome, monthlyExpense } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const daysLeft = Math.max(0, Math.ceil(
      (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ));
    const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
    const remaining = goal.targetAmount - goal.savedAmount;
    const monthlyNeeded = Math.ceil(remaining / monthsLeft);
    const monthlySavings = monthlyIncome - monthlyExpense;

    const prompt = `You are a financial advisor. Analyze this savings goal and give advice in exactly 3 short bullet points (max 15 words each). Be specific and actionable.

Goal: ${goal.title}
Target: ₹${goal.targetAmount.toLocaleString()}
Saved so far: ₹${goal.savedAmount.toLocaleString()}
Remaining: ₹${remaining.toLocaleString()}
Deadline: ${new Date(goal.deadline).toLocaleDateString()}
Months left: ${monthsLeft}
Monthly amount needed: ₹${monthlyNeeded.toLocaleString()}
User's monthly income: ₹${monthlyIncome.toLocaleString()}
User's monthly expenses: ₹${monthlyExpense.toLocaleString()}
User's monthly savings capacity: ₹${monthlySavings.toLocaleString()}

Give 3 bullet points of advice. Format: just the 3 points, one per line, starting with a relevant emoji.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({
      advice: text,
      monthlyNeeded,
      monthsLeft,
      daysLeft,
      isOnTrack: monthlySavings >= monthlyNeeded,
    });
  } catch (error) {
    console.error("Goal advice error:", error);
    return NextResponse.json({ error: "Failed to get advice" }, { status: 500 });
  }
}
