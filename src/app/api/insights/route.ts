import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");
    if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });

    await connectDB();

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const allTx = await Transaction.find({
      userId, accountId,
      date: { $gte: sixMonthsAgo },
    }).sort({ date: 1 });

    const monthlyMap: Record<string, { income: number; expense: number }> = {};
    allTx.forEach((tx) => {
      const d = new Date(tx.date);
      const key = d.toLocaleString("en-IN", { month: "short" });
      if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
      if (tx.type === "income") monthlyMap[key].income += tx.amount;
      else monthlyMap[key].expense += tx.amount;
    });

    const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({ month, ...data }));
    const savingsData = monthlyData.map((m) => ({ month: m.month, savings: m.income - m.expense }));

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthTx = allTx.filter((tx) => new Date(tx.date) >= startOfMonth);

    const categoryMap: Record<string, number> = {};
    thisMonthTx.filter((tx) => tx.type === "expense").forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
      name, value,
      color: ({
        food: "#f97316", transport: "#3b82f6", shopping: "#a855f7",
        entertainment: "#ec4899", health: "#22c55e", education: "#eab308",
        bills: "#ef4444", salary: "#10b981", investment: "#06b6d4", other: "#6b7280",
      } as Record<string, string>)[name] || "#6b7280",
    }));

    const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
    const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0);
    const months = monthlyData.length || 1;
    const avgIncome = Math.round(totalIncome / months);
    const avgExpense = Math.round(totalExpense / months);
    const avgSavings = avgIncome - avgExpense;
    const savingsRate = avgIncome > 0 ? Math.round((avgSavings / avgIncome) * 100) : 0;

    const aiTips = [];
    const topCategory = Object.entries(categoryMap).sort((a: any, b: any) => b[1] - a[1])[0];

    if (topCategory) {
      aiTips.push({
        icon: "🛍️",
        title: `Highest spend: ${topCategory[0]}`,
        desc: `You spent ₹${Number(topCategory[1]).toLocaleString()} on ${topCategory[0]} this month. Consider if this aligns with your goals.`,
        type: "warning",
      });
    }

    if (savingsRate > 20) {
      aiTips.push({
        icon: "🎯",
        title: "Great savings rate!",
        desc: `You're saving ${savingsRate}% of your income. That's above the recommended 20% — keep it up!`,
        type: "success",
      });
    } else if (savingsRate > 0) {
      aiTips.push({
        icon: "💡",
        title: "Boost your savings",
        desc: `Your savings rate is ${savingsRate}%. Try to reach 20% by reducing non-essential expenses.`,
        type: "tip",
      });
    }

    if (avgIncome > 0) {
      aiTips.push({
        icon: "📈",
        title: "Monthly average",
        desc: `Your average monthly income is ₹${avgIncome.toLocaleString()} and expenses are ₹${avgExpense.toLocaleString()}.`,
        type: "success",
      });
    }

    if (aiTips.length === 0) {
      aiTips.push({
        icon: "💡",
        title: "Start tracking!",
        desc: "Add some transactions to get personalized AI financial tips based on your spending patterns.",
        type: "tip",
      });
    }

    return NextResponse.json({
      monthlyData, categoryData, savingsData,
      stats: { avgIncome, avgExpense, avgSavings, savingsRate },
      aiTips,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}
