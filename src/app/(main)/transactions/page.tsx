"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { useThemeMount } from "@/hooks/useThemeMount";
import {
  Plus, Search, Filter, ArrowUpRight, ArrowDownRight,
  ReceiptText, Trash2, Loader2, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportTransactionsPDF } from "@/lib/exportPDF";
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

export default function TransactionsPage() {
  const { selectedAccount } = useAccount();
  const router = useRouter();
  const { isLight } = useThemeMount();
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: "", amount: "", type: "expense",
    category: "food", date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!selectedAccount) { router.push("/accounts"); return; }
    fetchTransactions();
  }, [selectedAccount]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/transactions?accountId=${selectedAccount?._id}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.description || !form.amount) return;
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          accountId: selectedAccount?._id,
        }),
      });
      const data = await res.json();
      setTransactions([data, ...transactions]);
      setForm({
        description: "", amount: "", type: "expense",
        category: "food", date: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPDF = () => {
    exportTransactionsPDF(filtered, selectedAccount?.name || "Account");
  };

  const filtered = transactions.filter((tx) => {
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || tx.type === filterType;
    const matchCategory = filterCategory === "all" || tx.category === filterCategory;
    return matchSearch && matchType && matchCategory;
  });

  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const card = isLight
    ? "rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden"
    : "rounded-2xl border border-white/5 bg-white/3 overflow-hidden";
  const inputCls = isLight
    ? "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
    : "bg-white/5 border-white/10 text-white placeholder:text-white/20";
  const selectCls = isLight
    ? "bg-gray-50 border-gray-200 text-gray-900"
    : "bg-white/5 border-white/10 text-white";
  const dialogBg = isLight
    ? "bg-white border-gray-200 text-gray-900"
    : "bg-[#0d1530] border-white/10 text-white";
  const rowHover = isLight ? "hover:bg-gray-50" : "hover:bg-white/3";
  const divider = isLight ? "border-gray-100" : "border-white/5";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${text}`}>Transactions</h1>
          <p className={`text-sm ${muted}`}>
            {selectedAccount?.name} · {selectedAccount?.type}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className={`border ${
              isLight
                ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                : "border-white/10 text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Link href="/transactions/scan">
            <Button
              variant="outline"
              className={`border ${
                isLight
                  ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                  : "border-white/10 text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <ReceiptText className="w-4 h-4 mr-2" />
              Scan Receipt
            </Button>
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className={dialogBg}>
              <DialogHeader>
                <DialogTitle className={text}>Add Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className={`text-xs mb-1.5 block ${muted}`}>Description</label>
                  <Input
                    placeholder="e.g. Swiggy Order"
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
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm({ ...form, type: v })}
                    >
                      <SelectTrigger className={selectCls}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={dialogBg}>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={`text-xs mb-1.5 block ${muted}`}>Category</label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => setForm({ ...form, category: v })}
                    >
                      <SelectTrigger className={selectCls}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={dialogBg}>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className={`text-xs mb-1.5 block ${muted}`}>Date</label>
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
                  Add Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-9 ${inputCls}`}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className={`w-36 ${selectCls}`}>
            <Filter className="w-3 h-3 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={dialogBg}>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className={`w-40 ${selectCls}`}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className={dialogBg}>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className={card}>
        <div
          className={`grid grid-cols-[1fr,auto,auto,auto] gap-4 px-6 py-3 border-b ${divider} ${muted} text-xs uppercase tracking-wider`}
        >
          <span>Transaction</span>
          <span>Category</span>
          <span>Date</span>
          <span>Amount</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-16 ${muted}`}>
            <ReceiptText className="w-10 h-10 mb-3" />
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx._id}
              className={`grid grid-cols-[1fr,auto,auto,auto] gap-4 px-6 py-4 border-b ${divider} last:border-0 ${rowHover} transition-all items-center group`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === "income" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  {tx.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div>
                  <div className={`text-sm font-medium ${text}`}>{tx.description}</div>
                  <div className={`text-xs capitalize ${muted}`}>{tx.type}</div>
                </div>
              </div>
              <Badge className={`text-xs capitalize ${CATEGORY_COLORS[tx.category]}`}>
                {tx.category}
              </Badge>
              <span className={`text-sm ${muted}`}>
                {new Date(tx.date).toLocaleDateString("en-IN")}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(tx._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          {
            label: "Total Income",
            value: filtered
              .filter((t) => t.type === "income")
              .reduce((a, t) => a + t.amount, 0),
            color: "text-green-500",
          },
          {
            label: "Total Expenses",
            value: filtered
              .filter((t) => t.type === "expense")
              .reduce((a, t) => a + t.amount, 0),
            color: "text-red-500",
          },
          {
            label: "Net Balance",
            value: filtered.reduce(
              (a, t) => a + (t.type === "income" ? t.amount : -t.amount),
              0
            ),
            color: "text-blue-500",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={
              isLight
                ? "rounded-2xl border border-black/8 bg-white shadow-sm p-4 text-center"
                : "rounded-2xl border border-white/5 bg-white/3 p-4 text-center"
            }
          >
            <div className={`text-xs mb-2 ${muted}`}>{s.label}</div>
            <div className={`text-xl font-bold ${s.color}`}>
              ₹{Math.abs(s.value).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
