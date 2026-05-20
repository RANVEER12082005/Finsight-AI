"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useThemeMount } from "@/hooks/useThemeMount";
import {
  Upload, ReceiptText, Loader2, CheckCircle2, ArrowLeft, Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const CATEGORIES = [
  "food", "transport", "shopping", "entertainment",
  "health", "education", "bills", "salary", "investment", "other",
];

export default function ScanReceiptPage() {
  const router = useRouter();
  const { isLight } = useThemeMount();
  
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
    merchant: "",
    items: [] as string[],
  });

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setScanned(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    try {
      const formData = new FormData();
      formData.append("receipt", file);
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm({
        description: data.description || "",
        amount: String(data.amount || ""),
        category: data.category || "other",
        date: data.date || new Date().toISOString().split("T")[0],
        merchant: data.merchant || "",
        items: data.items || [],
      });
      setScanned(true);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  // Theme classes
  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const subtext = isLight ? "text-gray-500" : "text-white/60";
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
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/transactions"
          className={`transition-colors ${isLight ? "text-gray-400 hover:text-gray-900" : "text-white/40 hover:text-white"}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${text}`}>AI Receipt Scanner</h1>
          <p className={`text-sm ${muted}`}>
            Upload a receipt and Gemini will extract all details
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all mb-6 group ${
          isLight
            ? "border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50"
            : "border-white/10 bg-white/3 hover:border-blue-500/40 hover:bg-blue-500/5"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={preview}
              alt="Receipt"
              className="max-h-48 rounded-xl object-contain shadow-md"
            />
            <p className={`text-sm ${muted}`}>{file?.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              isLight ? "bg-blue-100" : "bg-blue-500/10"
            }`}>
              <Camera className={`w-8 h-8 ${isLight ? "text-blue-400" : "text-blue-400"}`} />
            </div>
            <div>
              <p className={`font-medium ${isLight ? "text-gray-700" : "text-white/60"}`}>
                Drop receipt here or click to upload
              </p>
              <p className={`text-sm mt-1 ${muted}`}>Supports JPG, PNG, WEBP</p>
            </div>
          </div>
        )}
      </div>

      {/* Scan Button */}
      {file && !scanned && (
        <Button
          onClick={handleScan}
          disabled={scanning}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90 mb-6 h-12"
        >
          {scanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning with Gemini AI...
            </>
          ) : (
            <>
              <ReceiptText className="w-4 h-4 mr-2" />
              Scan Receipt
            </>
          )}
        </Button>
      )}

      {/* Scanned Result */}
      {scanned && (
        <div className={`rounded-2xl border p-6 space-y-4 ${
          isLight
            ? "border-green-200 bg-green-50"
            : "border-green-500/20 bg-green-500/5"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-green-600">Receipt Scanned Successfully!</h2>
          </div>

          {/* Items detected */}
          {form.items.length > 0 && (
            <div className={`rounded-xl p-3 mb-2 ${isLight ? "bg-white border border-gray-100" : "bg-white/5"}`}>
              <p className={`text-xs mb-2 ${muted}`}>Items detected:</p>
              <div className="flex flex-wrap gap-2">
                {form.items.map((item, i) => (
                  <span key={i} className={`text-xs px-2 py-1 rounded-lg ${
                    isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-white/60"
                  }`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={`text-xs mb-1.5 block ${muted}`}>Merchant</label>
            <Input
              value={form.merchant}
              onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={`text-xs mb-1.5 block ${muted}`}>Description</label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-xs mb-1.5 block ${muted}`}>Amount (₹)</label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className={inputCls}
              />
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
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90 h-12"
            onClick={() => router.push("/transactions")}
          >
            <Upload className="w-4 h-4 mr-2" />
            Add to Transactions
          </Button>
        </div>
      )}
    </div>
  );
}
