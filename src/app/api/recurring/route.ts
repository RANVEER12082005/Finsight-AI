import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    await connectDB();
    const recurring = await Transaction.find({
      userId,
      accountId,
      isRecurring: true,
    }).sort({ createdAt: -1 });

    return NextResponse.json(recurring);
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

    const nextDate = getNextDate(new Date(), body.recurringInterval);

    const transaction = await Transaction.create({
      ...body,
      userId,
      isRecurring: true,
      nextRecurringDate: nextDate,
    });

    // Update account balance
    const balanceChange = body.type === "income" ? body.amount : -body.amount;
    await Account.findByIdAndUpdate(body.accountId, {
      $inc: { balance: balanceChange },
    });

    return NextResponse.json(transaction);
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
    await Transaction.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

function getNextDate(from: Date, interval: string): Date {
  const d = new Date(from);
  switch (interval) {
    case "daily": d.setDate(d.getDate() + 1); break;
    case "weekly": d.setDate(d.getDate() + 7); break;
    case "monthly": d.setMonth(d.getMonth() + 1); break;
    case "yearly": d.setFullYear(d.getFullYear() + 1); break;
  }
  return d;
}
