"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { useThemeMount } from "@/hooks/useThemeMount";
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank,
  ArrowUpRight, ArrowDownRight, ReceiptText, Plus,
  BrainCircuit, MessageSquareText, Loader2,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-orange-400", transport: "bg-blue-400", shopping: "bg-purple-400",
  entertainment: "bg-pink-400", health: "bg-green-400", education: "bg-yellow-400",
  bills: "bg-red-400", salary: "bg-emerald-400", investment: "bg-cyan-400", other: "bg-gray-400",
};

const quickActions = [
  { icon: Plus, label: "Add Transaction", href: "/transactions", color: "from-blue-500 to-cyan-500" },
  { icon: ReceiptText, label: "Scan Receipt", href: "/transactions/scan", color: "from-purple-500 to-pink-500" },
  { icon: PiggyBank, label: "Set Budget", href: "/budgets", color: "from-green-500 to-emerald-500" },
  { icon: MessageSquareText, label: "Ask AI", href: "/chat", color: "from-orange-500 to-yellow-500" },
];

export default function DashboardPage() {
  const { selectedAccount, currencySymbol } = useAccount();
  const router = useRouter();
  const { isLight } = useThemeMount();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!selectedAccount) { router.push("/accounts"); return; }
    fetchDashboard();
  }, [selectedAccount]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard?accountId=" + selectedAccount?._id);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return "+0%";
    const change = ((current - previous) / previous) * 100;
    return (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
  };

  const fmt = (amount: number) => currencySymbol + amount.toLocaleString();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentTransactions, categoryBreakdown } = data;

  const statCards = [
    {
      label: "Total Balance",
      value: fmt(stats.balance),
      change: "+0%",
      positive: true,
      icon: Wallet,
      color: "blue",
    },
    {
      label: "Monthly Income",
      value: fmt(stats.monthlyIncome),
      change: calcChange(stats.monthlyIncome, stats.lastMonthIncome),
      positive: stats.monthlyIncome >= stats.lastMonthIncome,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Monthly Spend",
      value: fmt(stats.monthlyExpense),
      change: calcChange(stats.monthlyExpense, stats.lastMonthExpense),
      positive: stats.monthlyExpense <= stats.lastMonthExpense,
      icon: TrendingDown,
      color: "orange",
    },
    {
      label: "Saved This Month",
      value: fmt(stats.monthlySaved),
      change: "+0%",
      positive: stats.monthlySaved >= 0,
      icon: PiggyBank,
      color: "cyan",
    },
  ];

  const topCategories = Object.entries(categoryBreakdown)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 4);
  const maxCategoryAmount = (topCategories[0]?.[1] as number) || 1;

  const card = isLight
    ? "rounded-2xl border border-black/8 bg-white shadow-sm p-5 hover:shadow-md transition-all"
    : "rounded-2xl border border-white/5 bg-white/3 p-5 hover:border-white/10 transition-all";
  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const subtext = isLight ? "text-gray-500" : "text-white/50";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={"text-2xl font-bold mb-1 " + text}>Dashboard</h1>
          <p className={"text-sm " + muted}>
            {selectedAccount?.name} · {selectedAccount?.type} account
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-500 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Live data · {selectedAccount?.currency}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className={card}>
            <div className="flex items-center justify-between mb-4">
              <span className={"text-xs " + muted}>{stat.label}</span>
              <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + (
                stat.color === "blue" ? "bg-blue-500/20 text-blue-500" :
                stat.color === "green" ? "bg-green-500/20 text-green-500" :
                stat.color === "orange" ? "bg-orange-500/20 text-orange-500" :
                "bg-cyan-500/20 text-cyan-500"
              )}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className={"text-2xl font-bold mb-2 " + text}>{stat.value}</div>
            <div className={"flex items-center gap-1 text-xs " + (stat.positive ? "text-green-500" : "text-red-500")}>
              {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className={"font-semibold text-sm uppercase tracking-wider mb-4 " + muted}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className={"rounded-2xl border p-4 transition-all group flex items-center gap-3 " + (
                isLight
                  ? "bg-white border-black/8 hover:shadow-md shadow-sm"
                  : "border-white/5 bg-white/3 hover:border-white/10 hover:bg-white/5"
              )}
            >
              <div className={"w-9 h-9 rounded-xl bg-gradient-to-br " + action.color + " flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <span className={"text-sm font-medium transition-colors " + (
                isLight ? "text-gray-600 group-hover:text-gray-900" : "text-white/70 group-hover:text-white"
              )}>
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className={isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6" : "rounded-2xl border border-white/5 bg-white/3 p-6"}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={"font-semibold " + text}>Recent Transactions</h2>
            <Link href="/transactions" className="text-blue-500 text-xs hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {recentTransactions.length === 0 ? (
            <div className={"text-center py-8 " + muted}>
              <ReceiptText className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No transactions yet</p>
              <Link href="/transactions" className="text-blue-500 text-xs mt-1 hover:underline block">
                Add your first transaction
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx: any, i: number) => (
                <div key={i} className={"flex items-center justify-between py-2 border-b last:border-0 " + (isLight ? "border-gray-100" : "border-white/5")}>
                  <div className="flex items-center gap-3">
                    <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + (tx.type === "income" ? "bg-green-500/20" : "bg-red-500/20")}>
                      {tx.type === "income"
                        ? <ArrowUpRight className="w-4 h-4 text-green-500" />
                        : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                    </div>
                    <div>
                      <div className={"text-sm font-medium " + text}>{tx.description}</div>
                      <div className={"text-xs capitalize " + muted}>{tx.category}</div>
                    </div>
                  </div>
                  <div className={"text-sm font-semibold " + (tx.type === "income" ? "text-green-500" : "text-red-500")}>
                    {tx.type === "income" ? "+" : "-"}{currencySymbol}{tx.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Spending by Category */}
          <div className={isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6" : "rounded-2xl border border-white/5 bg-white/3 p-6"}>
            <h2 className={"font-semibold mb-4 " + text}>Spending by Category</h2>
            {topCategories.length === 0 ? (
              <div className={"text-center py-8 text-sm " + muted}>No spending data yet</div>
            ) : (
              <div className="space-y-3">
                {topCategories.map(([category, amount]: any, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={"capitalize " + subtext}>{category}</span>
                      <span className={muted}>{currencySymbol}{amount.toLocaleString()}</span>
                    </div>
                    <div className={"h-1.5 rounded-full overflow-hidden " + (isLight ? "bg-gray-100" : "bg-white/5")}>
                      <div
                        className={"h-full rounded-full " + (CATEGORY_COLORS[category] || "bg-gray-400")}
                        style={{ width: ((amount / maxCategoryAmount) * 100) + "%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Tip */}
          <Link
            href="/chat"
            className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 flex items-start gap-3 hover:border-blue-500/40 transition-all group block"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-500 mb-1">Ask AI about your finances</div>
              <p className={"text-xs leading-relaxed " + subtext}>
                Chat with FinSight AI to get personalized tips based on your real spending data.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
