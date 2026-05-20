import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Budget from "@/models/Budget";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    await connectDB();
    const now = new Date();
    const budgets = await Budget.find({
      userId,
      accountId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const now = new Date();

    const existing = await Budget.findOne({
      userId,
      accountId: body.accountId,
      category: body.category,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    if (existing) {
      existing.amount = body.amount;
      await existing.save();
      return NextResponse.json(existing);
    }

    const budget = await Budget.create({
      ...body,
      userId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      spent: 0,
    });
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connectDB();
    await Budget.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
