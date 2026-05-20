"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/context/AccountContext";
import { CURRENCIES } from "@/lib/currencies";
import {
  Plus, Wallet, TrendingUp, CreditCard,
  PiggyBank, Banknote, Trash2, ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const ACCOUNT_TYPES = ["savings", "current", "credit", "investment", "cash"];

const ACCOUNT_COLORS = [
  { name: "blue", class: "from-blue-500 to-cyan-500" },
  { name: "purple", class: "from-purple-500 to-pink-500" },
  { name: "green", class: "from-green-500 to-emerald-500" },
  { name: "orange", class: "from-orange-500 to-yellow-500" },
  { name: "red", class: "from-red-500 to-pink-500" },
];

const getColorClass = (color: string) =>
  ACCOUNT_COLORS.find((c) => c.name === color)?.class || "from-blue-500 to-cyan-500";

const getIcon = (type: string) => {
  switch (type) {
    case "savings": return <PiggyBank className="w-6 h-6 text-white" />;
    case "current": return <Wallet className="w-6 h-6 text-white" />;
    case "credit": return <CreditCard className="w-6 h-6 text-white" />;
    case "investment": return <TrendingUp className="w-6 h-6 text-white" />;
    case "cash": return <Banknote className="w-6 h-6 text-white" />;
    default: return <Wallet className="w-6 h-6 text-white" />;
  }
};

export default function AccountsPage() {
  const router = useRouter();
  const { selectedAccount, setSelectedAccount, accounts, setAccounts } = useAccount();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "savings", balance: "",
    color: "blue", currency: "INR",
  });

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.balance) return;
    try {
      const currency = CURRENCIES.find((c) => c.code === form.currency);
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          balance: Number(form.balance),
          color: form.color,
          currency: form.currency,
          currencySymbol: currency?.symbol || "₹",
        }),
      });
      const data = await res.json();
      setAccounts([data, ...accounts]);
      setForm({ name: "", type: "savings", balance: "", color: "blue", currency: "INR" });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
      setAccounts(accounts.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (account: any) => {
    setSelectedAccount(account);
    router.push("/dashboard");
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === form.currency);

  return (
    <div className="min-h-screen bg-[#070d1f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">FinSight AI</span>
        </div>
        <div className="text-white/40 text-sm">Select an account to continue</div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Your Accounts</h1>
          <p className="text-white/40 text-sm">
            {accounts.length} account{accounts.length !== 1 ? "s" : ""} across multiple currencies
          </p>
        </div>

        {/* Accounts List */}
        {loading ? (
          <div className="text-center text-white/30 py-20">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 mb-2">No accounts yet</p>
            <p className="text-white/20 text-sm">Create your first account to get started</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {accounts.map((account: any) => {
              const currency = CURRENCIES.find((c) => c.code === account.currency);
              return (
                <div
                  key={account._id}
                  onClick={() => handleSelect(account)}
                  className={`rounded-2xl border p-5 cursor-pointer transition-all group flex items-center gap-4 ${
                    selectedAccount?._id === account._id
                      ? "border-blue-500/40 bg-blue-500/10"
                      : "border-white/5 bg-white/3 hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClass(account.color)} flex items-center justify-center shrink-0`}>
                    {getIcon(account.type)}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{account.name}</h3>
                      {account.isDefault && (
                        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-white/40 text-sm capitalize">{account.type}</p>
                      <span className="text-white/20">·</span>
                      <span className="text-white/40 text-sm">
                        {currency?.flag} {account.currency}
                      </span>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {account.currencySymbol}{account.balance.toLocaleString()}
                    </div>
                    <div className="text-white/30 text-xs">Available</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-2">
                    {selectedAccount?._id === account._id ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                    )}
                    <button
                      onClick={(e) => handleDelete(account._id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400 ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Account */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90 h-12 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d1530] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Account Name</label>
                <Input
                  placeholder="e.g. HDFC Savings"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Account Type</label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1530] border-white/10 text-white">
                      {ACCOUNT_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Currency</label>
                  <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1530] border-white/10 text-white max-h-48">
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">
                  Current Balance ({selectedCurrency?.symbol}{selectedCurrency?.code})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    {selectedCurrency?.symbol}
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={form.balance}
                    onChange={(e) => setForm({ ...form, balance: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 pl-8"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Color</label>
                <div className="flex items-center gap-3">
                  {ACCOUNT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setForm({ ...form, color: c.name })}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.class} transition-all ${
                        form.color === c.name
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d1530] scale-110"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Button
                onClick={handleCreate}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90"
              >
                Create Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
