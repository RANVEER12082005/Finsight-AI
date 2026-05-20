"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { useThemeMount } from "@/hooks/useThemeMount";
import {
  Plus, Trash2, Target, Loader2, Sparkles,
  CheckCircle2, PauseCircle, PlayCircle,
  Calendar, TrendingUp, Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const GOAL_CATEGORIES = [
  { value: "emergency", emoji: "🆘", label: "Emergency Fund" },
  { value: "travel", emoji: "✈️", label: "Travel" },
  { value: "education", emoji: "🎓", label: "Education" },
  { value: "home", emoji: "🏠", label: "Home" },
  { value: "vehicle", emoji: "🚗", label: "Vehicle" },
  { value: "wedding", emoji: "💍", label: "Wedding" },
  { value: "retirement", emoji: "👴", label: "Retirement" },
  { value: "gadget", emoji: "📱", label: "Gadget" },
  { value: "other", emoji: "🎯", label: "Other" },
];

const GOAL_COLORS = [
  { name: "blue", class: "from-blue-500 to-cyan-500" },
  { name: "purple", class: "from-purple-500 to-pink-500" },
  { name: "green", class: "from-green-500 to-emerald-500" },
  { name: "orange", class: "from-orange-500 to-yellow-500" },
  { name: "red", class: "from-red-500 to-pink-500" },
];

const getColorClass = (color: string) =>
  GOAL_COLORS.find((c) => c.name === color)?.class || "from-blue-500 to-cyan-500";

export default function GoalsPage() {
  const { selectedAccount, currencySymbol } = useAccount();
  const router = useRouter();
  const { isLight } = useThemeMount();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [addMoneyGoal, setAddMoneyGoal] = useState<any>(null);
  const [addAmount, setAddAmount] = useState("");
  const [aiAdvice, setAiAdvice] = useState<Record<string, any>>({});
  const [loadingAdvice, setLoadingAdvice] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
    category: "other",
    color: "blue",
  });

  useEffect(() => {
    if (!selectedAccount) { router.push("/accounts"); return; }
    fetchGoals();
  }, [selectedAccount]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/goals?accountId=" + selectedAccount?._id);
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.targetAmount || !form.deadline) return;
    try {
      const cat = GOAL_CATEGORIES.find((c) => c.value === form.category);
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          targetAmount: Number(form.targetAmount),
          savedAmount: Number(form.savedAmount) || 0,
          accountId: selectedAccount?._id,
          emoji: cat?.emoji || "🎯",
        }),
      });
      const data = await res.json();
      setGoals([data, ...goals]);
      setForm({ title: "", description: "", targetAmount: "", savedAmount: "", deadline: "", category: "other", color: "blue" });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || !addMoneyGoal) return;
    try {
      const newSaved = addMoneyGoal.savedAmount + Number(addAmount);
      const status = newSaved >= addMoneyGoal.targetAmount ? "completed" : addMoneyGoal.status;
      const res = await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: addMoneyGoal._id, savedAmount: newSaved, status }),
      });
      const updated = await res.json();
      setGoals(goals.map((g) => g._id === updated._id ? updated : g));
      setAddMoneyGoal(null);
      setAddAmount("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (goal: any) => {
    const newStatus = goal.status === "active" ? "paused" : "active";
    try {
      const res = await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: goal._id, status: newStatus }),
      });
      const updated = await res.json();
      setGoals(goals.map((g) => g._id === updated._id ? updated : g));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/goals?id=" + id, { method: "DELETE" });
      setGoals(goals.filter((g) => g._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getAIAdvice = async (goal: any) => {
    setLoadingAdvice(goal._id);
    try {
      const res = await fetch("/api/goal-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          monthlyIncome: 45000,
          monthlyExpense: 32000,
        }),
      });
      const data = await res.json();
      setAiAdvice((prev) => ({ ...prev, [goal._id]: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdvice(null);
    }
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const completedGoals = goals.filter((g) => g.status === "completed").length;

  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const card = isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6" : "rounded-2xl border border-white/5 bg-white/3 p-6";
  const inputCls = isLight ? "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" : "bg-white/5 border-white/10 text-white placeholder:text-white/20";
  const selectCls = isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white";
  const dialogBg = isLight ? "bg-white border-gray-200 text-gray-900" : "bg-[#0d1530] border-white/10 text-white";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={"text-2xl font-bold mb-1 " + text}>Savings Goals</h1>
          <p className={"text-sm " + muted}>{selectedAccount?.name} · AI-powered goal tracking</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className={dialogBg}>
            <DialogHeader>
              <DialogTitle className={text}>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className={"text-xs mb-1.5 block " + muted}>Goal Title</label>
                <Input placeholder="e.g. Europe Trip 2027" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={"text-xs mb-1.5 block " + muted}>Description (optional)</label>
                <Input placeholder="e.g. 2 weeks trip to Europe" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={"text-xs mb-1.5 block " + muted}>Target Amount ({currencySymbol})</label>
                  <Input type="number" placeholder="100000" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={"text-xs mb-1.5 block " + muted}>Already Saved ({currencySymbol})</label>
                  <Input type="number" placeholder="0" value={form.savedAmount} onChange={(e) => setForm({ ...form, savedAmount: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={"text-xs mb-1.5 block " + muted}>Category</label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
                    <SelectContent className={dialogBg}>
                      {GOAL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={"text-xs mb-1.5 block " + muted}>Target Date</label>
                  <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={"text-xs mb-1.5 block " + muted}>Color</label>
                <div className="flex items-center gap-3">
                  {GOAL_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setForm({ ...form, color: c.name })}
                      className={"w-8 h-8 rounded-lg bg-gradient-to-br " + c.class + " transition-all " + (
                        form.color === c.name
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d1530] scale-110"
                          : "opacity-60 hover:opacity-100"
                      )}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
                Create Goal 🎯
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Target", value: currencySymbol + totalTarget.toLocaleString(), color: "text-blue-500" },
          { label: "Total Saved", value: currencySymbol + totalSaved.toLocaleString(), color: "text-green-500" },
          { label: "Goals Completed", value: completedGoals + " / " + goals.length, color: "text-purple-500" },
        ].map((s, i) => (
          <div key={i} className={isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-5 text-center" : "rounded-2xl border border-white/5 bg-white/3 p-5 text-center"}>
            <div className={"text-xs mb-2 " + muted}>{s.label}</div>
            <div className={"text-2xl font-bold " + s.color}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : goals.length === 0 ? (
        <div className={"flex flex-col items-center justify-center py-20 " + muted}>
          <Target className="w-12 h-12 mb-3" />
          <p className="text-sm">No savings goals yet</p>
          <p className="text-xs mt-1">Create a goal to start saving smarter with AI</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percent = goal.targetAmount > 0
              ? Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100)
              : 0;
            const daysLeft = Math.max(0, Math.ceil(
              (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            ));
            const isCompleted = goal.status === "completed" || percent >= 100;
            const advice = aiAdvice[goal._id];

            return (
              <div key={goal._id} className={card + " group"}>
                {/* Top */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + getColorClass(goal.color) + " flex items-center justify-center text-2xl"}>
                      {goal.emoji}
                    </div>
                    <div>
                      <h3 className={"font-semibold " + text}>{goal.title}</h3>
                      {goal.description && (
                        <p className={"text-xs " + muted}>{goal.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleStatus(goal)}
                      className={"p-1.5 rounded-lg transition-colors " + (isLight ? "hover:bg-gray-100 text-gray-400" : "hover:bg-white/10 text-white/40")}
                    >
                      {goal.status === "active"
                        ? <PauseCircle className="w-4 h-4" />
                        : <PlayCircle className="w-4 h-4 text-green-500" />
                      }
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className={"p-1.5 rounded-lg transition-colors " + (isLight ? "hover:bg-red-50 text-gray-400 hover:text-red-500" : "hover:bg-red-500/10 text-white/40 hover:text-red-400")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={"font-semibold " + text}>
                      {currencySymbol}{goal.savedAmount.toLocaleString()}
                    </span>
                    <span className={muted}>
                      of {currencySymbol}{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className={"h-3 rounded-full overflow-hidden " + (isLight ? "bg-gray-100" : "bg-white/5")}>
                    <div
                      className={"h-full rounded-full bg-gradient-to-r transition-all " + getColorClass(goal.color)}
                      style={{ width: percent + "%" }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className={"text-xs font-medium " + (isCompleted ? "text-green-500" : "text-blue-500")}>
                      {percent}% {isCompleted ? "🎉 Complete!" : "saved"}
                    </span>
                    <span className={"text-xs " + muted}>
                      {isCompleted ? "Goal reached!" : currencySymbol + (goal.targetAmount - goal.savedAmount).toLocaleString() + " to go"}
                    </span>
                  </div>
                </div>

                {/* Info Row */}
                <div className={"flex items-center justify-between py-3 border-t " + (isLight ? "border-gray-100" : "border-white/5")}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className={"w-3.5 h-3.5 " + muted} />
                      <span className={"text-xs " + muted}>
                        {isCompleted ? "Completed! 🎊" : daysLeft + " days left"}
                      </span>
                    </div>
                    <div className={"flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs " + (
                      goal.status === "completed" ? "bg-green-500/10 text-green-500" :
                      goal.status === "paused" ? "bg-orange-500/10 text-orange-500" :
                      "bg-blue-500/10 text-blue-500"
                    )}>
                      {goal.status === "completed" ? "✅ Done" :
                       goal.status === "paused" ? "⏸ Paused" : "▶️ Active"}
                    </div>
                  </div>
                </div>

                {/* Add Money Button */}
                {!isCompleted && (
                  <Button
                    onClick={() => setAddMoneyGoal(goal)}
                    className={"w-full mt-3 text-sm font-medium bg-gradient-to-r " + getColorClass(goal.color) + " text-white border-0 hover:opacity-90 h-9"}
                  >
                    + Add Money
                  </Button>
                )}

                {/* AI Advice */}
                <button
                  onClick={() => getAIAdvice(goal)}
                  className={"w-full mt-2 text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-all " + (
                    isLight
                      ? "bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100"
                      : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20"
                  )}
                >
                  {loadingAdvice === goal._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {loadingAdvice === goal._id ? "Getting AI advice..." : "Get AI advice"}
                </button>

                {/* AI Advice Result */}
                {advice && (
                  <div className={"mt-3 rounded-xl p-3 " + (
                    isLight ? "bg-purple-50 border border-purple-100" : "bg-purple-500/10 border border-purple-500/20"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-xs font-semibold text-purple-500">AI Advice</span>
                      <span className={"text-xs ml-auto " + (advice.isOnTrack ? "text-green-500" : "text-orange-500")}>
                        {advice.isOnTrack ? "✅ On track" : "⚠️ Need to save more"}
                      </span>
                    </div>
                    <div className={"text-xs leading-relaxed whitespace-pre-line " + muted}>
                      {advice.advice}
                    </div>
                    <div className={"mt-2 pt-2 border-t text-xs flex gap-4 " + (isLight ? "border-purple-100" : "border-purple-500/20")}>
                      <span className={muted}>
                        Save <span className="text-blue-500 font-semibold">{currencySymbol}{advice.monthlyNeeded?.toLocaleString()}/mo</span>
                      </span>
                      <span className={muted}>
                        <span className="text-purple-500 font-semibold">{advice.monthsLeft} months</span> left
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Money Dialog */}
      <Dialog open={!!addMoneyGoal} onOpenChange={() => setAddMoneyGoal(null)}>
        <DialogContent className={dialogBg}>
          <DialogHeader>
            <DialogTitle className={text}>
              Add Money to "{addMoneyGoal?.title}"
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className={"rounded-xl p-4 " + (isLight ? "bg-gray-50" : "bg-white/5")}>
              <div className="flex justify-between text-sm mb-2">
                <span className={muted}>Current savings</span>
                <span className={text}>{currencySymbol}{addMoneyGoal?.savedAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={muted}>Target</span>
                <span className={text}>{currencySymbol}{addMoneyGoal?.targetAmount?.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <label className={"text-xs mb-1.5 block " + muted}>Amount to add ({currencySymbol})</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className={inputCls}
                autoFocus
              />
            </div>
            <Button
              onClick={handleAddMoney}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90"
            >
              Add {addAmount ? currencySymbol + Number(addAmount).toLocaleString() : "Money"} 💰
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
