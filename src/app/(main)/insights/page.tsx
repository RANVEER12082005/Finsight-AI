"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { useThemeMount } from "@/hooks/useThemeMount";
import { ArrowUpRight, ArrowDownRight, BrainCircuit, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-3 text-xs">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: ₹{Number(p.value).toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InsightsPage() {
  const { selectedAccount } = useAccount();
  const router = useRouter();
  const { isLight } = useThemeMount();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedAccount) { router.push("/accounts"); return; }
    fetchInsights();
  }, [selectedAccount]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/insights?accountId=${selectedAccount?._id}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data) return null;

  const { monthlyData, categoryData, savingsData, stats, aiTips } = data;

  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const card = isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6" : "rounded-2xl border border-white/5 bg-white/3 p-6";
  const gridColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
  const tickColor = isLight ? "#94a3b8" : "rgba(255,255,255,0.3)";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-1 ${text}`}>Insights</h1>
        <p className={`text-sm ${muted}`}>{selectedAccount?.name} · AI-powered analysis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Avg Monthly Income", value: `₹${stats.avgIncome.toLocaleString()}`, up: true },
          { label: "Avg Monthly Spend", value: `₹${stats.avgExpense.toLocaleString()}`, up: false },
          { label: "Avg Monthly Savings", value: `₹${stats.avgSavings.toLocaleString()}`, up: true },
          { label: "Savings Rate", value: `${stats.savingsRate}%`, up: stats.savingsRate > 0 },
        ].map((s, i) => (
          <div key={i} className={isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-5" : "rounded-2xl border border-white/5 bg-white/3 p-5"}>
            <div className={`text-xs mb-3 ${muted}`}>{s.label}</div>
            <div className={`text-xl font-bold mb-2 ${text}`}>{s.value}</div>
            <div className={`flex items-center gap-1 text-xs ${s.up ? "text-green-500" : "text-red-500"}`}>
              {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              this month
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className={card}>
          <h2 className={`font-semibold mb-1 ${text}`}>Income vs Expenses</h2>
          <p className={`text-xs mb-6 ${muted}`}>Last 6 months</p>
          {monthlyData.length === 0 ? (
            <div className={`flex items-center justify-center h-48 text-sm ${muted}`}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4,4,0,0]} />
                <Bar dataKey="expense" name="Expense" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={card}>
          <h2 className={`font-semibold mb-1 ${text}`}>Spending by Category</h2>
          <p className={`text-xs mb-6 ${muted}`}>This month's breakdown</p>
          {categoryData.length === 0 ? (
            <div className={`flex items-center justify-center h-48 text-sm ${muted}`}>No spending data yet</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}>
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.4} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.map((cat: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                      <span className={`capitalize ${muted}`}>{cat.name}</span>
                    </div>
                    <span className={muted}>₹{cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Savings Trend */}
      <div className={`${card} mb-6`}>
        <h2 className={`font-semibold mb-1 ${text}`}>Savings Trend</h2>
        <p className={`text-xs mb-6 ${muted}`}>Monthly savings over last 6 months</p>
        {savingsData.length === 0 ? (
          <div className={`flex items-center justify-center h-40 text-sm ${muted}`}>No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={savingsData}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="savings" name="Savings" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* AI Tips */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit className="w-5 h-5 text-blue-500" />
          <h2 className={`font-semibold ${text}`}>AI Financial Tips</h2>
          <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full ml-2">Personalized</span>
        </div>
        {aiTips.length === 0 ? (
          <div className={`text-center py-8 text-sm ${muted}`}>Add transactions to get AI tips</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {aiTips.map((tip: any, i: number) => (
              <div key={i} className={`rounded-xl p-4 border ${
                tip.type === "warning" ? (isLight ? "border-orange-200 bg-orange-50" : "border-orange-500/20 bg-orange-500/10") :
                tip.type === "success" ? (isLight ? "border-green-200 bg-green-50" : "border-green-500/20 bg-green-500/10") :
                isLight ? "border-blue-200 bg-blue-50" : "border-blue-500/20 bg-blue-500/10"
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{tip.icon}</span>
                  <div>
                    <h3 className={`text-sm font-medium mb-1 ${text}`}>{tip.title}</h3>
                    <p className={`text-xs leading-relaxed ${muted}`}>{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
