import Link from "next/link";
import { TrendingUp, CheckCircle2, ArrowRight, Zap, Shield, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Perfect for getting started with personal finance tracking.",
    color: "border-white/10",
    btnClass: "bg-white/10 text-white hover:bg-white/20",
    badge: null,
    features: [
      "1 account",
      "Up to 50 transactions/month",
      "Basic budget tracking",
      "Spending insights",
      "AI chatbot (10 msgs/day)",
      "Export to PDF",
      "Mobile friendly",
    ],
  },
  {
    name: "Pro",
    price: "₹299",
    period: "per month",
    desc: "For power users who want the full FinSight AI experience.",
    color: "border-blue-500/50",
    btnClass: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90",
    badge: "Most Popular",
    features: [
      "Unlimited accounts",
      "Unlimited transactions",
      "AI Receipt Scanner",
      "Advanced insights & charts",
      "Unlimited AI chatbot",
      "Budget alerts via email",
      "Recurring transactions",
      "Spending limits",
      "Multi-currency support",
      "Monthly AI reports",
      "Priority support",
    ],
  },
  {
    name: "Family",
    price: "₹599",
    period: "per month",
    desc: "Share FinSight AI with up to 5 family members.",
    color: "border-purple-500/30",
    btnClass: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90",
    badge: "Best Value",
    features: [
      "Everything in Pro",
      "Up to 5 family members",
      "Shared family dashboard",
      "Individual accounts per member",
      "Family spending reports",
      "Combined net worth tracker",
      "Dedicated support",
    ],
  },
];

const faqs = [
  {
    q: "Is the free plan really free forever?",
    a: "Yes! Our free plan has no time limit. You can use FinSight AI forever at no cost with the free tier features.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. You can cancel your Pro or Family subscription at any time with no cancellation fees.",
  },
  {
    q: "Is my financial data secure?",
    a: "We use bank-grade encryption and ArcJet security. Your data is never sold to third parties.",
  },
  {
    q: "Do you support UPI or Indian payment methods?",
    a: "Yes! We accept UPI, credit/debit cards, and net banking for Indian users.",
  },
];

export default function PricingPage() {
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
          <Link href="/pricing" className="text-white">Pricing</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
        </div>
        <Link href="/sign-up" className="px-4 py-2 rounded-lg bg-white text-[#070d1f] text-sm font-semibold hover:bg-white/90 transition-all">
          Get started free
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-20 pb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-medium mb-6">
          <Zap className="w-3 h-3" />
          Simple, transparent pricing
        </div>
        <h1 className="text-5xl font-bold mb-6">
          Start free,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            upgrade when ready
          </span>
        </h1>
        <p className="text-white/50 text-lg">
          No hidden fees. No credit card required. Cancel anytime.
        </p>
      </section>

      {/* Plans */}
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={"rounded-2xl border p-6 relative " + plan.color + (plan.badge === "Most Popular" ? " bg-blue-500/5" : " bg-white/3")}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/40 text-sm">/{plan.period}</span>
                </div>
                <p className="text-white/40 text-sm">{plan.desc}</p>
              </div>
              <Link href="/sign-up" className={"block text-center py-3 rounded-xl font-semibold text-sm mb-6 transition-all " + plan.btnClass}>
                Get started
              </Link>
              <ul className="space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="px-8 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/3 p-6">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
          Free forever plan
        </div>
        <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-white/40 mb-8">No credit card needed. Set up in 2 minutes.</p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all text-lg">
          Create free account <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="px-8 py-8 border-t border-white/5 text-center text-white/20 text-sm">
        © 2026 FinSight AI. Built with Next.js, Gemini & ❤️
      </footer>
    </main>
  );
}
