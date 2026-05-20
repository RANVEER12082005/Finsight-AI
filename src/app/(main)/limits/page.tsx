"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { useThemeMount } from "@/hooks/useThemeMount";
import {
  Plus, Trash2, Bell, Loader2,
  AlertTriangle, CheckCircle2, ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "food","transport","shopping","entertainment",
  "health","education","bills","salary","investment","other",
];

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-orange-500/20 text-orange-500",
  transport: "bg-blue-500/20 text-blue-500",
  shopping: "bg-purple-500/20 text-purple-500",
  entertainment: "bg-pink-500/20 text-pink-500",
  health: "bg-green-500/20 text-green-500",
  education: "bg-yellow-500/20 text-yellow-600",
  bills: "bg-red-500/20 text-red-500",
  salary: "bg-emerald-500/20 text-emerald-500",
  investment: "bg-cyan-500/20 text-cyan-500",
  other: "bg-gray-500/20 text-gray-500",
};

const CATEGORY_BAR: Record<string, string> = {
  food: "bg-orange-400", transport: "bg-blue-400", shopping: "bg-purple-400",
  entertainment: "bg-pink-400", health: "bg-green-400", education: "bg-yellow-400",
  bills: "bg-red-400", salary: "bg-emerald-400", investment: "bg-cyan-400", other: "bg-gray-400",
};

export default function SpendingLimitsPage() {
  const { selectedAccount, currencySymbol } = useAccount();
  const router = useRouter();
  const { isLight } = useThemeMount();
  
  const [limits, setLimits] = useState<any[]>([]);
  const [spending, setSpending] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: "food",
    limitAmount: "",
    period: "monthly",
    notifyAt: "80",
  });

  useEffect(() => {
    if (!selectedAccount) { router.push("/accounts"); return; }
    fetchData();
  }, [selectedAccount]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [limitsRes, txRes] = await Promise.all([
        fetch("/api/spending-limits?accountId=" + selectedAccount?._id),
        fetch("/api/transactions?accountId=" + selectedAccount?._id),
      ]);
      const limitsData = await limitsRes.json();
      const txData = await txRes.json();
      setLimits(limitsData);

      // Calculate current spending per category this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlySpending: Record<string, number> = {};
      txData
        .filter((tx: any) => tx.type === "expense" && new Date(tx.date) >= startOfMonth)
        .forEach((tx: any) => {
          monthlySpending[tx.category] = (monthlySpending[tx.category] || 0) + tx.amount;
        });
      setSpending(monthlySpending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.limitAmount) return;
    try {
      const res = await fetch("/api/spending-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          limitAmount: Number(form.limitAmount),
          notifyAt: Number(form.notifyAt),
          accountId: selectedAccount?._id,
        }),
      });
      const data = await res.json();
      setLimits((prev) => {
        const exists = prev.find((l) => l._id === data._id);
        if (exists) return prev.map((l) => l._id === data._id ? data : l);
        return [data, ...prev];
      });
      setForm({ category: "food", limitAmount: "", period: "monthly", notifyAt: "80" });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/spending-limits?id=" + id, { method: "DELETE" });
      setLimits(limits.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Count alerts
  const alerts = limits.filter((l) => {
    const spent = spending[l.category] || 0;
    const percent = (spent / l.limitAmount) * 100;
    return percent >= l.notifyAt;
  });

  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const card = isLight
    ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6"
    : "rounded-2xl border border-white/5 bg-white/3 p-6";
  const inputCls = isLight
    ? "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
    : "bg-white/5 border-white/10 text-white placeholder:text-white/20";
  const selectCls = isLight
    ? "bg-gray-50 border-gray-200 text-gray-900"
    : "bg-white/5 border-white/10 text-white";
  const dialogBg = isLight
    ? "bg-white border-gray-200 text-gray-900"
    : "bg-[#0d1530] border-white/10 text-white";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={"text-2xl font-bold mb-1 " + text}>Spending Limits</h1>
          <p className={"text-sm " + muted}>
            {selectedAccount?.name} · Set alerts before you overspend
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Limit
            </Button>
          </DialogTrigger>
          <DialogContent className={dialogBg}>
            <DialogHeader>
              <DialogTitle className={text}>Set Spending Limit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className={"text-xs mb-1.5 block " + muted}>Category</label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                  <SelectContent className={dialogBg}>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={"text-xs mb-1.5 block " + muted}>
                    Limit Amount ({currencySymbol})
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={form.limitAmount}
                    onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={"text-xs mb-1.5 block " + muted}>Period</label>
                  <Select
                    value={form.period}
                    onValueChange={(v) => setForm({ ...form, period: v })}
                  >
                    <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                    <SelectContent className={dialogBg}>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className={"text-xs mb-1.5 block " + muted}>
                  Alert me when I reach (%)
                </label>
                <Select
                  value={form.notifyAt}
                  onValueChange={(v) => setForm({ ...form, notifyAt: v })}
                >
                  <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                  <SelectContent className={dialogBg}>
                    <SelectItem value="50">50% — Early warning</SelectItem>
                    <SelectItem value="70">70% — Caution</SelectItem>
                    <SelectItem value="80">80% — Recommended</SelectItem>
                    <SelectItem value="90">90% — Last warning</SelectItem>
                    <SelectItem value="100">100% — Limit reached</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90"
              >
                Set Spending Limit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-orange-500 text-sm mb-1">
              {alerts.length} Spending Limit{alerts.length > 1 ? "s" : ""} Triggered!
            </div>
            <p className={"text-xs " + muted}>
              You have reached your alert threshold for:{" "}
              <span className="text-orange-500 font-medium">
                {alerts.map((a) => a.category).join(", ")}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Active Limits",
            value: limits.length.toString(),
            color: "text-blue-500",
            icon: <ShieldAlert className="w-4 h-4" />,
            bg: "bg-blue-500/20 text-blue-500",
          },
          {
            label: "Alerts Triggered",
            value: alerts.length.toString(),
            color: "text-orange-500",
            icon: <Bell className="w-4 h-4" />,
            bg: "bg-orange-500/20 text-orange-500",
          },
          {
            label: "All Clear",
            value: (limits.length - alerts.length).toString(),
            color: "text-green-500",
            icon: <CheckCircle2 className="w-4 h-4" />,
            bg: "bg-green-500/20 text-green-500",
          },
        ].map((s, i) => (
          <div key={i} className={isLight
            ? "rounded-2xl border border-black/8 bg-white shadow-sm p-5"
            : "rounded-2xl border border-white/5 bg-white/3 p-5"
          }>
            <div className="flex items-center justify-between mb-3">
              <span className={"text-xs " + muted}>{s.label}</span>
              <div className={"w-7 h-7 rounded-lg flex items-center justify-center " + s.bg}>
                {s.icon}
              </div>
            </div>
            <div className={"text-3xl font-bold " + s.color}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Limits List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : limits.length === 0 ? (
        <div className={"flex flex-col items-center justify-center py-20 " + muted}>
          <Bell className="w-12 h-12 mb-3" />
          <p className="text-sm">No spending limits set yet</p>
          <p className="text-xs mt-1">Add limits to get alerted before you overspend</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {limits.map((limit) => {
            const spent = spending[limit.category] || 0;
            const percent = limit.limitAmount > 0
              ? Math.round((spent / limit.limitAmount) * 100)
              : 0;
            const isTriggered = percent >= limit.notifyAt;
            const isOver = percent >= 100;

            return (
              <div
                key={limit._id}
                className={"transition-all group " + (
                  isOver
                    ? isLight
                      ? "rounded-2xl border border-red-200 bg-red-50 p-6"
                      : "rounded-2xl border border-red-500/20 bg-red-500/5 p-6"
                    : isTriggered
                    ? isLight
                      ? "rounded-2xl border border-orange-200 bg-orange-50 p-6"
                      : "rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6"
                    : card
                )}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={"w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold uppercase " + CATEGORY_COLORS[limit.category]}>
                      {limit.category.slice(0, 2)}
                    </div>
                    <div>
                      <div className={"font-medium capitalize " + text}>{limit.category}</div>
                      <div className={"text-xs capitalize " + muted}>{limit.period} limit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOver && (
                      <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full font-medium">
                        🚨 Over limit!
                      </span>
                    )}
                    {isTriggered && !isOver && (
                      <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full font-medium">
                        ⚠️ Alert!
                      </span>
                    )}
                    {!isTriggered && (
                      <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">
                        ✅ On track
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(limit._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={muted}>
                      {currencySymbol}{spent.toLocaleString()} spent
                    </span>
                    <span className={muted}>
                      {currencySymbol}{limit.limitAmount.toLocaleString()} limit
                    </span>
                  </div>
                  <div className={"h-2.5 rounded-full overflow-hidden " + (isLight ? "bg-gray-100" : "bg-white/5")}>
                    <div
                      className={"h-full rounded-full transition-all " + (
                        isOver ? "bg-red-500" :
                        isTriggered ? "bg-orange-400" :
                        CATEGORY_BAR[limit.category] || "bg-blue-400"
                      )}
                      style={{ width: Math.min(percent, 100) + "%" }}
                    />
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex justify-between items-center">
                  <span className={"text-xs font-medium " + (
                    isOver ? "text-red-500" :
                    isTriggered ? "text-orange-500" :
                    muted
                  )}>
                    {percent}% used · Alert at {limit.notifyAt}%
                  </span>
                  <span className={"text-xs font-medium " + (
                    limit.limitAmount - spent >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {currencySymbol}{Math.abs(limit.limitAmount - spent).toLocaleString()}{" "}
                    {limit.limitAmount - spent >= 0 ? "remaining" : "over"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
