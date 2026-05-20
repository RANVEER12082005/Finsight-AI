"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { useThemeMount } from "@/hooks/useThemeMount";
import {
  Plus, Trash2, RefreshCcw, Loader2,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  "food","transport","shopping","entertainment",
  "health","education","bills","salary","investment","other",
];

const INTERVAL_LABELS: Record<string, string> = {
  daily: "Every Day",
  weekly: "Every Week",
  monthly: "Every Month",
  yearly: "Every Year",
};

const INTERVAL_COLORS: Record<string, string> = {
  daily: "bg-red-500/20 text-red-500",
  weekly: "bg-orange-500/20 text-orange-500",
  monthly: "bg-blue-500/20 text-blue-500",
  yearly: "bg-purple-500/20 text-purple-500",
};

export default function RecurringPage() {
  const { selectedAccount } = useAccount();
  const router = useRouter();
  const { isLight } = useThemeMount();
  
  const [recurring, setRecurring] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: "", amount: "", type: "expense",
    category: "bills", recurringInterval: "monthly",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!selectedAccount) { router.push("/accounts"); return; }
    fetchRecurring();
  }, [selectedAccount]);

  const fetchRecurring = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/recurring?accountId=${selectedAccount?._id}`);
      const data = await res.json();
      setRecurring(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.description || !form.amount) return;
    try {
      const res = await fetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          accountId: selectedAccount?._id,
        }),
      });
      const data = await res.json();
      setRecurring([data, ...recurring]);
      setForm({
        description: "", amount: "", type: "expense",
        category: "bills", recurringInterval: "monthly",
        date: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/recurring?id=${id}`, { method: "DELETE" });
      setRecurring(recurring.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalMonthly = recurring
    .filter((r) => r.recurringInterval === "monthly" && r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalIncome = recurring
    .filter((r) => r.recurringInterval === "monthly" && r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);

  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const card = isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6" : "rounded-2xl border border-white/5 bg-white/3 p-6";
  const inputCls = isLight ? "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" : "bg-white/5 border-white/10 text-white placeholder:text-white/20";
  const selectCls = isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white";
  const dialogBg = isLight ? "bg-white border-gray-200 text-gray-900" : "bg-[#0d1530] border-white/10 text-white";
  const rowHover = isLight ? "hover:bg-gray-50" : "hover:bg-white/3";
  const divider = isLight ? "border-gray-100" : "border-white/5";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${text}`}>Recurring Transactions</h1>
          <p className={`text-sm ${muted}`}>
            {selectedAccount?.name} · Auto EMIs & subscriptions
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Recurring
            </Button>
          </DialogTrigger>
          <DialogContent className={dialogBg}>
            <DialogHeader>
              <DialogTitle className={text}>Add Recurring Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className={`text-xs mb-1.5 block ${muted}`}>Description</label>
                <Input
                  placeholder="e.g. Netflix Subscription"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={`text-xs mb-1.5 block ${muted}`}>Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs mb-1.5 block ${muted}`}>Type</label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                    <SelectContent className={dialogBg}>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={`text-xs mb-1.5 block ${muted}`}>Category</label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                    <SelectContent className={dialogBg}>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className={`text-xs mb-1.5 block ${muted}`}>Repeat Every</label>
                <Select value={form.recurringInterval} onValueChange={(v) => setForm({ ...form, recurringInterval: v })}>
                  <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                  <SelectContent className={dialogBg}>
                    <SelectItem value="daily">Every Day</SelectItem>
                    <SelectItem value="weekly">Every Week</SelectItem>
                    <SelectItem value="monthly">Every Month</SelectItem>
                    <SelectItem value="yearly">Every Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`text-xs mb-1.5 block ${muted}`}>Start Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputCls}
                />
              </div>
              <Button
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90"
              >
                Add Recurring Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Monthly Expenses", value: `₹${totalMonthly.toLocaleString()}`, color: "text-red-500" },
          { label: "Monthly Income", value: `₹${totalIncome.toLocaleString()}`, color: "text-green-500" },
          { label: "Total Recurring", value: `${recurring.length} items`, color: "text-blue-500" },
        ].map((s, i) => (
          <div key={i} className={isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-5 text-center" : "rounded-2xl border border-white/5 bg-white/3 p-5 text-center"}>
            <div className={`text-xs mb-2 ${muted}`}>{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recurring List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : recurring.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 ${muted}`}>
          <RefreshCcw className="w-12 h-12 mb-3" />
          <p className="text-sm">No recurring transactions yet</p>
          <p className="text-xs mt-1">Add your EMIs, subscriptions and salary</p>
        </div>
      ) : (
        <div className={isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden" : "rounded-2xl border border-white/5 bg-white/3 overflow-hidden"}>
          <div className={`grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 px-6 py-3 border-b ${divider} ${muted} text-xs uppercase tracking-wider`}>
            <span>Description</span>
            <span>Category</span>
            <span>Interval</span>
            <span>Next Date</span>
            <span>Amount</span>
          </div>
          {recurring.map((item) => (
            <div
              key={item._id}
              className={`grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 px-6 py-4 border-b ${divider} last:border-0 ${rowHover} transition-all items-center group`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.type === "income" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                  {item.type === "income"
                    ? <ArrowUpRight className="w-4 h-4 text-green-500" />
                    : <ArrowDownRight className="w-4 h-4 text-red-500" />
                  }
                </div>
                <div>
                  <div className={`text-sm font-medium ${text}`}>{item.description}</div>
                  <div className={`text-xs ${muted}`}>Recurring</div>
                </div>
              </div>
              <Badge className="text-xs capitalize bg-gray-500/20 text-gray-500">
                {item.category}
              </Badge>
              <Badge className={`text-xs ${INTERVAL_COLORS[item.recurringInterval]}`}>
                {INTERVAL_LABELS[item.recurringInterval]}
              </Badge>
              <span className={`text-sm ${muted}`}>
                {item.nextRecurringDate
                  ? new Date(item.nextRecurringDate).toLocaleDateString("en-IN")
                  : "—"}
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${item.type === "income" ? "text-green-500" : "text-red-500"}`}>
                  {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
