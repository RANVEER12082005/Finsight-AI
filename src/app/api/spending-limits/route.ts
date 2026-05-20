import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose, { Schema } from "mongoose";

const SpendingLimitSchema = new Schema({
  userId: { type: String, required: true },
  accountId: { type: String, required: true },
  category: { type: String, required: true },
  limitAmount: { type: Number, required: true },
  period: { type: String, enum: ["daily", "weekly", "monthly"], default: "monthly" },
  notifyAt: { type: Number, default: 80 },
  createdAt: { type: Date, default: Date.now },
});

const SpendingLimit = mongoose.models.SpendingLimit ||
  mongoose.model("SpendingLimit", SpendingLimitSchema);

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    await connectDB();
    const limits = await SpendingLimit.find({ userId, accountId });
    return NextResponse.json(limits);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const existing = await SpendingLimit.findOne({
      userId,
      accountId: body.accountId,
      category: body.category,
      period: body.period,
    });

    if (existing) {
      existing.limitAmount = body.limitAmount;
      existing.notifyAt = body.notifyAt;
      await existing.save();
      return NextResponse.json(existing);
    }

    const limit = await SpendingLimit.create({ ...body, userId });
    return NextResponse.json(limit);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connectDB();
    await SpendingLimit.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
