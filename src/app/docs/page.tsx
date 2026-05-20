import Link from "next/link";
import {
  TrendingUp, BookOpen, Code2, Zap, Shield,
  ReceiptText, BrainCircuit, ArrowRight,
  Terminal, FileText, Settings, ChevronRight,
} from "lucide-react";

const sections = [
  {
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    title: "Getting Started",
    desc: "Set up your FinSight AI account in under 2 minutes.",
    items: ["Create your account", "Add your first account", "Add a transaction", "Set your first budget"],
  },
  {
    icon: <ReceiptText className="w-5 h-5 text-blue-400" />,
    title: "AI Receipt Scanner",
    desc: "Learn how to scan receipts with Gemini AI.",
    items: ["Uploading a receipt", "Supported formats", "Editing scanned data", "Adding to transactions"],
  },
  {
    icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
    title: "AI Chatbot",
    desc: "Get the most out of your personal finance assistant.",
    items: ["Asking about budgets", "Getting saving tips", "Understanding insights", "Best questions to ask"],
  },
  {
    icon: <Settings className="w-5 h-5 text-green-400" />,
    title: "Account Settings",
    desc: "Customize FinSight AI to your preferences.",
    items: ["Managing accounts", "Currency settings", "Theme preferences", "Notification settings"],
  },
  {
    icon: <FileText className="w-5 h-5 text-orange-400" />,
    title: "Reports & Export",
    desc: "Export and share your financial data.",
    items: ["Exporting PDF reports", "Transaction history", "Monthly summaries", "Category reports"],
  },
  {
    icon: <Shield className="w-5 h-5 text-red-400" />,
    title: "Security & Privacy",
    desc: "Understand how we keep your data safe.",
    items: ["Data encryption", "Authentication", "Privacy policy", "Data deletion"],
  },
];

const quickstart = [
  { step: "1", title: "Sign up", desc: "Create your free account with email or Google." },
  { step: "2", title: "Add account", desc: "Create a savings, current, or investment account." },
  { step: "3", title: "Add transactions", desc: "Manually add or scan receipts with AI." },
  { step: "4", title: "Set budgets", desc: "Set monthly limits per spending category." },
  { step: "5", title: "Get insights", desc: "View AI-powered charts and financial tips." },
];

export default function DocsPage() {
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
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/about-insights" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/docs" className="text-white">Docs</Link>
        </div>
        <Link href="/sign-up" className="px-4 py-2 rounded-lg bg-white text-[#070d1f] text-sm font-semibold hover:bg-white/90 transition-all">
          Get started free
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-20 pb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
          <BookOpen className="w-3 h-3" />
          Documentation
        </div>
        <h1 className="text-5xl font-bold mb-6">
          Everything you need to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            know
          </span>
        </h1>
        <p className="text-white/50 text-lg">
          Comprehensive guides, tutorials, and references for FinSight AI.
        </p>
        {/* Search bar */}
        <div className="mt-8 relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 text-sm"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xs bg-white/5 px-2 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </section>

      {/* Quick Start */}
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-blue-400" />
          Quick Start Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {quickstart.map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/3 p-4 relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm mb-3">
                {s.step}
              </div>
              <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Docs Sections */}
      <section className="px-8 py-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/3 p-6 hover:border-white/10 transition-all group cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                  <p className="text-white/30 text-xs">{section.desc}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer group/item">
                    <ChevronRight className="w-3 h-3 text-white/20 group-hover/item:text-blue-400 transition-colors" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Help Banner */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-white/40 text-sm">
              Our AI chatbot inside the app can answer any questions about your finances.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all whitespace-nowrap"
          >
            Try FinSight AI <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="px-8 py-8 border-t border-white/5 text-center text-white/20 text-sm">
        © 2026 FinSight AI. Built with Next.js, Gemini & ❤️
      </footer>
    </main>
  );
}
