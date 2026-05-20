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
    if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });

    await connectDB();

    const account = await Account.findById(accountId);
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // This month transactions
    const thisMonthTx = await Transaction.find({
      userId,
      accountId,
      date: { $gte: startOfMonth },
    });

    // Last month transactions
    const lastMonthTx = await Transaction.find({
      userId,
      accountId,
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Recent transactions
    const recentTx = await Transaction.find({ userId, accountId })
      .sort({ date: -1 })
      .limit(5);

    // Calculate this month
    const monthlyIncome = thisMonthTx
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpense = thisMonthTx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySaved = monthlyIncome - monthlyExpense;

    // Calculate last month
    const lastMonthIncome = lastMonthTx
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpense = lastMonthTx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    thisMonthTx
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryBreakdown[t.category] =
          (categoryBreakdown[t.category] || 0) + t.amount;
      });

    return NextResponse.json({
      account,
      stats: {
        balance: account.balance,
        monthlyIncome,
        monthlyExpense,
        monthlySaved,
        lastMonthIncome,
        lastMonthExpense,
      },
      recentTransactions: recentTx,
      categoryBreakdown,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
