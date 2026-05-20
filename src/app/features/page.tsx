import Link from "next/link";
import {
  ReceiptText, BrainCircuit, BellRing, MessageSquareText,
  RefreshCcw, ShieldCheck, Zap, TrendingUp, ArrowRight,
  BarChart3, Wallet, Globe, FileDown,
} from "lucide-react";

const features = [
  {
    icon: <ReceiptText className="w-6 h-6" />,
    title: "AI Receipt Scanner",
    desc: "Snap a receipt and our Gemini AI instantly extracts every line item, merchant name, date, and category. No manual entry ever again.",
    color: "from-blue-500 to-cyan-500",
    badge: "Most Popular",
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "Smart Financial Insights",
    desc: "AI-generated monthly reports with personalized saving tips based on your actual spending patterns. Know exactly where your money goes.",
    color: "from-purple-500 to-pink-500",
    badge: "AI Powered",
  },
  {
    icon: <BellRing className="w-6 h-6" />,
    title: "Budget Alerts",
    desc: "Get notified the moment you cross 80% of any spending limit. Never overspend again with real-time budget tracking.",
    color: "from-orange-500 to-yellow-500",
    badge: "Real-time",
  },
  {
    icon: <MessageSquareText className="w-6 h-6" />,
    title: "Finance Chatbot",
    desc: "Chat with your personal AI financial advisor. Ask anything — from budget advice to investment tips — and get real answers.",
    color: "from-green-500 to-emerald-500",
    badge: "RAG Powered",
  },
  {
    icon: <RefreshCcw className="w-6 h-6" />,
    title: "Recurring Transactions",
    desc: "Set it once and forget it. FinSight AI automatically tracks your EMIs, subscriptions, and salary credits every month.",
    color: "from-cyan-500 to-blue-500",
    badge: "Automated",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Bank-grade Security",
    desc: "ArcJet-powered bot detection, rate limiting, and email verification. Your financial data is always protected.",
    color: "from-red-500 to-pink-500",
    badge: "Secure",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multi-Currency Support",
    desc: "Track finances in 12+ currencies including INR, USD, EUR, GBP, AED and even Bitcoin. Perfect for global users.",
    color: "from-indigo-500 to-purple-500",
    badge: "Global",
  },
  {
    icon: <FileDown className="w-6 h-6" />,
    title: "PDF Export",
    desc: "Export beautiful branded PDF reports of your transactions with income/expense summaries and category breakdowns.",
    color: "from-teal-500 to-cyan-500",
    badge: "Reports",
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "Multi-Account Management",
    desc: "Manage savings, current, credit, investment and cash accounts all in one place. Switch between accounts instantly.",
    color: "from-amber-500 to-orange-500",
    badge: "Flexible",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#070d1f] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#070d1f]/80">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">FinSight AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="/features" className="text-white">Features</Link>
          <Link href="/about-insights" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
        </div>
        <Link href="/sign-up" className="px-4 py-2 rounded-lg bg-white text-[#070d1f] text-sm font-semibold hover:bg-white/90 transition-all">
          Get started free
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-20 pb-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          9 powerful features
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Every feature your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            wallet wished
          </span>{" "}
          it had
        </h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          FinSight AI combines cutting-edge AI with intuitive design to give you complete control over your finances.
        </p>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/3 p-6 hover:border-white/10 hover:bg-white/5 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + f.color + " flex items-center justify-center group-hover:scale-110 transition-transform"}>
                  {f.icon}
                </div>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {f.badge}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to take control?</h2>
        <p className="text-white/40 mb-8">Join thousands managing their finances smarter with AI.</p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all text-lg">
          Start for free <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="px-8 py-8 border-t border-white/5 text-center text-white/20 text-sm">
        © 2026 FinSight AI. Built with Next.js, Gemini & ❤️
      </footer>
    </main>
  );
}
