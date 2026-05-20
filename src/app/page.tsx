"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ReceiptText, BrainCircuit, BellRing, MessageSquareText,
  RefreshCcw, ArrowRight, TrendingUp, ShieldCheck, Zap,
  Star, ChevronDown,
} from "lucide-react";

// ── Fixed particles (no Math.random to avoid hydration mismatch)
const PARTICLES = [
  { id: 0, delay: 0, x: 10, y: 20 }, { id: 1, delay: 0.5, x: 25, y: 60 },
  { id: 2, delay: 1, x: 40, y: 10 }, { id: 3, delay: 1.5, x: 55, y: 80 },
  { id: 4, delay: 2, x: 70, y: 30 }, { id: 5, delay: 0.3, x: 85, y: 70 },
  { id: 6, delay: 0.8, x: 15, y: 45 }, { id: 7, delay: 1.2, x: 30, y: 90 },
  { id: 8, delay: 1.7, x: 60, y: 15 }, { id: 9, delay: 2.2, x: 75, y: 55 },
  { id: 10, delay: 0.6, x: 90, y: 40 }, { id: 11, delay: 1.1, x: 5, y: 75 },
  { id: 12, delay: 1.9, x: 45, y: 50 }, { id: 13, delay: 0.4, x: 80, y: 85 },
  { id: 14, delay: 2.4, x: 20, y: 35 }, { id: 15, delay: 0.9, x: 50, y: 65 },
  { id: 16, delay: 1.6, x: 65, y: 25 }, { id: 17, delay: 2.1, x: 35, y: 95 },
  { id: 18, delay: 0.2, x: 95, y: 10 }, { id: 19, delay: 1.3, x: 8, y: 55 },
];

const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer", text: "FinSight AI completely changed how I manage money. The AI receipt scanner saves me hours every month!", avatar: "PS" },
  { name: "Rahul Gupta", role: "Entrepreneur", text: "The multi-account support and spending insights are incredible. Best finance app I've ever used.", avatar: "RG" },
  { name: "Anita Patel", role: "Doctor", text: "Finally an app that understands Indian finances. The budget alerts have saved me from overspending so many times.", avatar: "AP" },
];

function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#070d1f] text-white overflow-x-hidden">
      {/* Particles — only render after mount to avoid hydration mismatch */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-1 h-1 rounded-full bg-blue-400/30"
              style={{ left: p.x + "%", top: p.y + "%" }}
              animate={{ y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 4 + p.delay, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={"flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 " + (navScrolled ? "bg-[#070d1f]/95 shadow-lg shadow-black/20" : "bg-[#070d1f]/80")}
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"
          >
            <TrendingUp className="w-4 h-4 text-white" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight">FinSight AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          {[["Features", "/features"], ["Insights", "/about-insights"], ["Pricing", "/pricing"], ["Docs", "/docs"]].map(([label, href]) => (
            <Link key={label} href={href} className="hover:text-white transition-colors relative group">
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/sign-up" className="px-4 py-2 rounded-lg bg-white text-[#070d1f] text-sm font-semibold hover:bg-white/90 transition-all">
            Get started free
          </Link>
        </motion.div>
      </motion.nav>

      {/* Hero */}
      <section className="relative px-8 pt-24 pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/8 rounded-full blur-[140px] pointer-events-none"
        />

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6"
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-blue-400"
              />
              AI-powered finance intelligence
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Your money,{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
              >
                finally
              </motion.span>
              <br />
              thinking for itself.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/50 text-lg leading-relaxed mb-8 max-w-md"
            >
              FinSight AI uses AI to scan receipts, predict spending, alert on budgets, and chat like a personal CFO — all in one beautifully simple dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/sign-up" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2">
                  Start for free <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/features" className="px-6 py-3 rounded-xl border border-white/10 text-white/70 font-medium hover:border-white/30 hover:text-white transition-all">
                  See features
                </Link>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 mt-8"
            >
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((l, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 border-2 border-[#070d1f] flex items-center justify-center text-xs font-bold text-white">
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/40">
                <span className="text-white font-semibold">2,400+</span> users tracking finances
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 text-sm">Total balance</span>
                <span className="text-white/30 text-xs">May 2026</span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-bold text-white mb-1"
              >
                ₹1,24,850
              </motion.div>
              <div className="text-white/40 text-sm mb-6">Across 3 accounts</div>

              <div className="flex items-end gap-1.5 h-16 mb-6">
                {[40, 55, 35, 70, 45, 80, 60, 75, 50, 90, 65, 85].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    style={{ originY: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.05 }}
                    className="flex-1 rounded-sm"
                    style={{
                      height: h + "%",
                      background: i >= 10
                        ? "linear-gradient(to top, #3b82f6, #06b6d4)"
                        : "rgba(255,255,255,0.1)",
                    } as React.CSSProperties}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="rounded-xl bg-white/5 p-4">
                  <div className="text-white/40 text-xs mb-1">Monthly spend</div>
                  <div className="text-white font-bold text-xl">₹32,410</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="rounded-xl bg-white/5 p-4">
                  <div className="text-white/40 text-xs mb-1">Saved this month</div>
                  <div className="text-cyan-400 font-bold text-xl">₹9,200</div>
                  <div className="text-green-400 text-xs mt-1">✓ On track</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.1 }}
              className="absolute -top-4 -right-4 bg-green-500/20 border border-green-500/30 rounded-xl px-3 py-2 text-green-400 text-xs font-medium backdrop-blur-md"
            >
              +₹9,200 saved 🎯
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.1 }}
              className="absolute -bottom-4 -left-4 bg-blue-500/20 border border-blue-500/30 rounded-xl px-3 py-2 text-blue-400 text-xs font-medium backdrop-blur-md"
            >
              🤖 AI scanned 3 receipts
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-white/20 text-xs">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="px-8 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">What FinSight AI Does</div>
          <h2 className="text-3xl md:text-4xl font-bold">Every feature your wallet wished it had</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: <ReceiptText className="w-5 h-5" />, title: "AI Receipt Scanner", desc: "Snap a receipt — Gemini extracts every line item instantly.", color: "blue" },
            { icon: <BrainCircuit className="w-5 h-5" />, title: "Smart Insights", desc: "AI-generated monthly reports with personalized saving tips.", color: "purple" },
            { icon: <BellRing className="w-5 h-5" />, title: "Budget Alerts", desc: "Auto-notified the moment you cross 80% of any limit.", color: "orange" },
            { icon: <MessageSquareText className="w-5 h-5" />, title: "Finance Chatbot", desc: "RAG-powered assistant — ask anything, get real answers.", color: "cyan" },
            { icon: <RefreshCcw className="w-5 h-5" />, title: "Recurring Transactions", desc: "Set it once — FinSight AI handles your EMIs silently.", color: "green" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-2xl border border-white/5 bg-white/3 p-5 hover:border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-4 " + (
                f.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                f.color === "purple" ? "bg-purple-500/20 text-purple-400" :
                f.color === "orange" ? "bg-orange-500/20 text-orange-400" :
                f.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                "bg-green-500/20 text-green-400"
              )}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="px-8 py-16 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: 2400000, suffix: "+", label: "Transactions tracked", prefix: "" },
            { value: 98, suffix: ".7%", label: "Receipt scan accuracy", prefix: "" },
            { value: 0, suffix: "", label: "Hidden fees, ever", prefix: "₹" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, type: "spring" }}
            >
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-white/40 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">What users say</div>
          <h2 className="text-3xl font-bold">Loved by thousands</h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
            >
              <div className="flex items-center justify-center gap-0.5 mb-4">
                {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-white/70 text-lg leading-relaxed mb-6 italic">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{testimonials[activeTestimonial].name}</div>
                  <div className="text-white/40 text-xs">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={"h-2 rounded-full transition-all " + (i === activeTestimonial ? "bg-blue-400 w-6" : "bg-white/20 w-2")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="px-8 py-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <ShieldCheck className="w-5 h-5 text-green-400" />, title: "Bank-grade security", desc: "ArcJet powered bot detection, rate limiting, and email verification." },
            { icon: <Zap className="w-5 h-5 text-yellow-400" />, title: "Lightning fast", desc: "Background jobs keep the main app fast and responsive." },
            { icon: <BrainCircuit className="w-5 h-5 text-blue-400" />, title: "Powered by Gemini", desc: "Google's Gemini AI for receipt scanning and financial insights." },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-white/3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">{s.icon}</div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 text-center relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6"
          >
            Free forever plan
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Take control of your finances today.</h2>
          <p className="text-white/40 text-lg mb-10">Join thousands using AI to spend smarter, save more, and stress less.</p>
          <div className="flex items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/sign-up" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all text-lg flex items-center gap-2">
                Create free account <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/pricing" className="px-8 py-4 rounded-xl border border-white/10 text-white/70 font-medium hover:border-white/30 hover:text-white transition-all text-lg">
                See pricing
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">FinSight AI</span>
          </div>
          <div className="flex items-center gap-6 text-white/30 text-xs">
            {[["Features", "/features"], ["Pricing", "/pricing"], ["Docs", "/docs"], ["Sign Up", "/sign-up"]].map(([label, href]) => (
              <Link key={label} href={href} className="hover:text-white/60 transition-colors">{label}</Link>
            ))}
          </div>
          <p className="text-white/20 text-xs">© 2026 FinSight AI. Built with ❤️</p>
        </div>
      </footer>
    </main>
  );
}
