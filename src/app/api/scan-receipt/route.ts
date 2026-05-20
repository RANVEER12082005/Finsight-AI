import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("receipt") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `Analyze this receipt image and extract the following information in JSON format only. No explanation, just JSON:
    {
      "description": "short description of what was purchased",
      "amount": total amount as number only,
      "category": one of: food, transport, shopping, entertainment, health, education, bills, salary, investment, other,
      "date": date in YYYY-MM-DD format if visible, otherwise today,
      "merchant": merchant or store name,
      "items": ["list", "of", "items", "purchased"]
    }`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse receipt" }, { status: 400 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Receipt scan error:", error);
    return NextResponse.json({ error: "Failed to scan receipt" }, { status: 500 });
  }
}
