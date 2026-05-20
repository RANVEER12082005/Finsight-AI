"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { useThemeMount } from "@/hooks/useThemeMount";
import { Plus, Trash2, PiggyBank, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
  { name: "food", color: "bg-orange-400", light: "bg-orange-500/20 text-orange-500" },
  { name: "transport", color: "bg-blue-400", light: "bg-blue-500/20 text-blue-500" },
  { name: "shopping", color: "bg-purple-400", light: "bg-purple-500/20 text-purple-500" },
  { name: "entertainment", color: "bg-pink-400", light: "bg-pink-500/20 text-pink-500" },
  { name: "health", color: "bg-green-400", light: "bg-green-500/20 text-green-500" },
  { name: "education", color: "bg-yellow-400", light: "bg-yellow-500/20 text-yellow-600" },
  { name: "bills", color: "bg-red-400", light: "bg-red-500/20 text-red-500" },
  { name: "investment", color: "bg-cyan-400", light: "bg-cyan-500/20 text-cyan-500" },
  { name: "other", color: "bg-gray-400", light: "bg-gray-500/20 text-gray-500" },
];

export default function BudgetsPage() {
  const { selectedAccount } = useAccount();
  const router = useRouter();
  const { isLight } = useThemeMount();
  
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "food", amount: "" });

  useEffect(() => {
    if (!selectedAccount) { router.push("/accounts"); return; }
    fetchBudgets();
  }, [selectedAccount]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/budgets?accountId=${selectedAccount?._id}`);
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.amount) return;
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: form.category, amount: Number(form.amount), accountId: selectedAccount?._id }),
      });
      const data = await res.json();
      setBudgets((prev) => {
        const exists = prev.find((b) => b._id === data._id);
        if (exists) return prev.map((b) => b._id === data._id ? data : b);
        return [data, ...prev];
      });
      setForm({ category: "food", amount: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/budgets?id=${id}`, { method: "DELETE" });
      setBudgets(budgets.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalBudget = budgets.reduce((a, b) => a + b.amount, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);

  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const card = isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6" : "rounded-2xl border border-white/5 bg-white/3 p-6";
  const inputCls = isLight ? "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" : "bg-white/5 border-white/10 text-white placeholder:text-white/20";
  const selectCls = isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white";
  const dialogBg = isLight ? "bg-white border-gray-200 text-gray-900" : "bg-[#0d1530] border-white/10 text-white";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${text}`}>Budgets</h1>
          <p className={`text-sm ${muted}`}>{selectedAccount?.name} · May 2026</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent className={dialogBg}>
            <DialogHeader><DialogTitle className={text}>Set Monthly Budget</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className={`text-xs mb-1.5 block ${muted}`}>Category</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                  <SelectContent className={dialogBg}>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name} className="capitalize">{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`text-xs mb-1.5 block ${muted}`}>Monthly Limit (₹)</label>
                <Input type="number" placeholder="e.g. 5000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} />
              </div>
              <Button onClick={handleAdd} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
                Save Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Budget", value: `₹${totalBudget.toLocaleString()}`, color: "text-blue-500" },
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, color: "text-orange-500" },
          { label: "Remaining", value: `₹${(totalBudget - totalSpent).toLocaleString()}`, color: totalBudget - totalSpent >= 0 ? "text-green-500" : "text-red-500" },
        ].map((s, i) => (
          <div key={i} className={isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-5 text-center" : "rounded-2xl border border-white/5 bg-white/3 p-5 text-center"}>
            <div className={`text-xs mb-2 ${muted}`}>{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className={`${card} mb-6`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${text}`}>Overall Budget Usage</span>
          <span className={`text-xs ${muted}`}>{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</span>
        </div>
        <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className={`h-2 ${isLight ? "bg-gray-100" : "bg-white/10"}`} />
        <div className={`flex justify-between text-xs mt-2 ${muted}`}>
          <span>₹{totalSpent.toLocaleString()} spent</span>
          <span>₹{totalBudget.toLocaleString()} total</span>
        </div>
      </div>

      {/* Budget Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : budgets.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 ${muted}`}>
          <PiggyBank className="w-12 h-12 mb-3" />
          <p className="text-sm">No budgets set yet</p>
          <p className="text-xs mt-1">Click "Set Budget" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const percent = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0;
            const catInfo = CATEGORIES.find((c) => c.name === budget.category);
            const isOver = percent >= 100;
            const isWarning = percent >= 80 && percent < 100;
            return (
              <div key={budget._id} className={`${isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6" : "rounded-2xl border border-white/5 bg-white/3 p-6"} hover:shadow-md transition-all group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold uppercase ${catInfo?.light}`}>
                      {budget.category.slice(0, 2)}
                    </div>
                    <div>
                      <div className={`font-medium capitalize ${text}`}>{budget.category}</div>
                      <div className={`text-xs ${muted}`}>Monthly limit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isOver && <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Over budget!</span>}
                    {isWarning && <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">80% used</span>}
                    <button onClick={() => handleDelete(budget._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className={`flex justify-between text-sm mb-2`}>
                    <span className={muted}>₹{budget.spent.toLocaleString()} spent</span>
                    <span className={muted}>₹{budget.amount.toLocaleString()} limit</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-gray-100" : "bg-white/5"}`}>
                    <div
                      className={`h-full rounded-full transition-all ${isOver ? "bg-red-400" : isWarning ? "bg-orange-400" : catInfo?.color}`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${isOver ? "text-red-500" : isWarning ? "text-orange-500" : muted}`}>{percent}% used</span>
                  <span className={`text-xs font-medium ${budget.amount - budget.spent >= 0 ? "text-green-500" : "text-red-500"}`}>
                    ₹{Math.abs(budget.amount - budget.spent).toLocaleString()} {budget.amount - budget.spent >= 0 ? "remaining" : "over"}
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
