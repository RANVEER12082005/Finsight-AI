import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";
import Budget from "@/models/Budget";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    await connectDB();
    const query: any = { userId };
    if (accountId) query.accountId = accountId;

    const transactions = await Transaction.find(query).sort({ date: -1 }).limit(50);
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const transaction = await Transaction.create({ ...body, userId });

    // Update account balance
    const balanceChange = body.type === "income" ? body.amount : -body.amount;
    await Account.findByIdAndUpdate(body.accountId, {
      $inc: { balance: balanceChange },
    });

    // Update budget spent if expense
    if (body.type === "expense") {
      const now = new Date();
      await Budget.findOneAndUpdate(
        {
          userId,
          accountId: body.accountId,
          category: body.category,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
        { $inc: { spent: body.amount } }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connectDB();
    const tx = await Transaction.findOne({ _id: id, userId });
    if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Reverse balance
    const balanceChange = tx.type === "income" ? -tx.amount : tx.amount;
    await Account.findByIdAndUpdate(tx.accountId, {
      $inc: { balance: balanceChange },
    });

    // Reverse budget spent
    if (tx.type === "expense") {
      const now = new Date();
      await Budget.findOneAndUpdate(
        {
          userId,
          accountId: tx.accountId,
          category: tx.category,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
        { $inc: { spent: -tx.amount } }
      );
    }

    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
