"use client";

import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "@/context/AccountContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  TrendingUp, LayoutDashboard, ArrowLeftRight, PiggyBank,
  BrainCircuit, MessageSquareText, LogOut, ChevronRight,
  Wallet, Sun, Moon, RefreshCcw, ShieldAlert, Settings,Target,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { href: "/budgets", icon: PiggyBank, label: "Budgets" },
  { href: "/insights", icon: BrainCircuit, label: "Insights" },
  { href: "/chat", icon: MessageSquareText, label: "AI Chat" },
  { href: "/recurring", icon: RefreshCcw, label: "Recurring" },
  { href: "/limits", icon: ShieldAlert, label: "Spend Limits" },
  { href: "/goals", icon: Target, label: "Goals" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { selectedAccount } = useAccount();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme("light");
    return () => setTheme("dark");
  }, []);

  const handleSignOut = async () => {
    setTheme("dark");
    await signOut();
    router.push("/");
  };

  // Prevent hydration mismatch — render neutral until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex">
        <aside className="w-64 border-r border-black/6 flex flex-col fixed h-full z-40 bg-white" />
        <main className="flex-1 ml-64 min-h-screen bg-[#f0f4ff]">{children}</main>
      </div>
    );
  }

  const isLight = theme === "light";

  return (
    <div className={"min-h-screen flex transition-colors duration-300 " + (isLight ? "bg-[#f0f4ff]" : "bg-[#070d1f]")}>
      {/* Sidebar */}
      <aside className={"w-64 border-r flex flex-col fixed h-full z-40 transition-colors duration-300 " + (
        isLight ? "bg-white border-black/6 shadow-sm" : "bg-[#070d1f] border-white/5"
      )}>
        {/* Logo */}
        <div className={"flex items-center gap-2 px-6 py-5 border-b " + (isLight ? "border-black/6" : "border-white/5")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className={"font-bold text-lg tracking-tight " + (isLight ? "text-gray-900" : "text-white")}>
            FinSight AI
          </span>
        </div>

        {/* Selected Account */}
        {selectedAccount && (
          <Link
            href="/accounts"
            className={"mx-3 mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all group " + (
              isLight
                ? "bg-blue-50 border-blue-100 hover:bg-blue-100"
                : "bg-white/5 border-white/5 hover:border-white/10"
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={"text-xs font-medium truncate " + (isLight ? "text-gray-800" : "text-white")}>
                {selectedAccount.name}
              </div>
              <div className={"text-xs capitalize " + (isLight ? "text-gray-400" : "text-white/30")}>
                {selectedAccount.type} · {selectedAccount.currency}
              </div>
            </div>
            <ChevronRight className={"w-3 h-3 shrink-0 " + (isLight ? "text-gray-300" : "text-white/20")} />
          </Link>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group " + (
                  isActive
                    ? isLight
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "bg-blue-500/15 text-white border border-blue-500/20"
                    : isLight
                    ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={"w-4 h-4 transition-colors " + (
                  isActive ? "text-blue-500" :
                  isLight ? "group-hover:text-blue-500" : "group-hover:text-blue-400"
                )} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className={"px-4 py-4 border-t space-y-3 " + (isLight ? "border-black/6" : "border-white/5")}>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all " + (
              isLight
                ? "bg-gray-50 text-gray-600 hover:bg-gray-100"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            )}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {isLight ? "Dark Mode" : "Light Mode"}
          </button>

          {/* AI Status */}
          <div className={"flex items-center gap-2 px-3 py-2 rounded-xl border " + (
            isLight ? "bg-green-50 border-green-100" : "bg-white/3 border-white/5"
          )}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className={"text-xs " + (isLight ? "text-green-600" : "text-white/40")}>
              Gemini AI Connected
            </span>
          </div>

          {/* User */}
          <div className={"flex items-center gap-3 px-3 py-2 rounded-xl border " + (
            isLight ? "bg-gray-50 border-gray-100" : "bg-white/3 border-white/5"
          )}>
            <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
            <div className="flex-1 min-w-0">
              <div className={"text-xs font-medium truncate " + (isLight ? "text-gray-800" : "text-white")}>
                {user?.firstName} {user?.lastName}
              </div>
              <div className={"text-xs truncate " + (isLight ? "text-gray-400" : "text-white/30")}>
                {user?.emailAddresses[0]?.emailAddress}
              </div>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group " + (
              isLight
                ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
                : "text-white/40 hover:text-red-400 hover:bg-red-500/10"
            )}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={"flex-1 ml-64 min-h-screen transition-colors duration-300 " + (
        isLight ? "bg-[#f0f4ff]" : "bg-[#070d1f]"
      )}>
        {children}
      </main>
    </div>
  );
}
