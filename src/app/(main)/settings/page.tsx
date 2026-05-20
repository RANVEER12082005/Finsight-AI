"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useThemeMount } from "@/hooks/useThemeMount";
import { useAccount } from "@/context/AccountContext";
import {
  User, Mail, Shield, Bell, Palette,
  ChevronRight, LogOut, Trash2, CheckCircle2,
  Moon, Sun, Wallet, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { isLight, setTheme } = useThemeMount();
  const { selectedAccount, accounts } = useAccount();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    monthlyReport: true,
    recurringReminders: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    setTheme("dark");
    await signOut();
    router.push("/");
  };

  const text = isLight ? "text-gray-900" : "text-white";
  const muted = isLight ? "text-gray-400" : "text-white/40";
  const card = isLight ? "rounded-2xl border border-black/8 bg-white shadow-sm p-6" : "rounded-2xl border border-white/5 bg-white/3 p-6";
  const inputCls = isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white";
  const rowCls = isLight
    ? "flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
    : "flex items-center justify-between py-3 border-b border-white/5 last:border-0";

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className={"text-2xl font-bold mb-1 " + text}>Settings</h1>
        <p className={"text-sm " + muted}>Manage your account preferences and profile</p>
      </div>

      {/* Profile Card */}
      <div className={card + " mb-6"}>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-4 h-4 text-blue-500" />
          <h2 className={"font-semibold " + text}>Profile</h2>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div>
            <div className={"font-semibold " + text}>{user?.firstName} {user?.lastName}</div>
            <div className={"text-sm " + muted}>{user?.emailAddresses[0]?.emailAddress}</div>
            <div className="text-xs text-blue-500 mt-1">
              Member since {new Date(user?.createdAt || "").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={"text-xs mb-1.5 block " + muted}>First Name</label>
            <Input defaultValue={user?.firstName || ""} className={inputCls} readOnly />
          </div>
          <div>
            <label className={"text-xs mb-1.5 block " + muted}>Last Name</label>
            <Input defaultValue={user?.lastName || ""} className={inputCls} readOnly />
          </div>
        </div>
        <div className="mb-4">
          <label className={"text-xs mb-1.5 block " + muted}>Email Address</label>
          <div className="relative">
            <Mail className={"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " + muted} />
            <Input defaultValue={user?.emailAddresses[0]?.emailAddress || ""} className={"pl-9 " + inputCls} readOnly />
          </div>
        </div>
        <Button
          onClick={() => openUserProfile()}
          variant="outline"
          className={"border " + (isLight ? "border-gray-200 text-gray-600 hover:bg-gray-50" : "border-white/10 text-white/50 hover:text-white hover:bg-white/5")}
        >
          <User className="w-4 h-4 mr-2" />
          Edit Profile
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </div>

      {/* Accounts Summary */}
      <div className={card + " mb-6"}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-500" />
            <h2 className={"font-semibold " + text}>Your Accounts</h2>
          </div>
          <button onClick={() => router.push("/accounts")} className="text-blue-500 text-xs hover:underline flex items-center gap-1">
            Manage <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {accounts.length === 0 ? (
            <p className={"text-sm " + muted}>No accounts yet</p>
          ) : (
            accounts.map((acc: any) => (
              <div key={acc._id} className={"flex items-center justify-between p-3 rounded-xl " + (
                selectedAccount?._id === acc._id
                  ? isLight ? "bg-blue-50 border border-blue-100" : "bg-blue-500/10 border border-blue-500/20"
                  : isLight ? "bg-gray-50" : "bg-white/3"
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className={"text-sm font-medium " + text}>{acc.name}</div>
                    <div className={"text-xs capitalize " + muted}>{acc.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={"text-sm font-semibold " + text}>{acc.currencySymbol}{acc.balance.toLocaleString()}</div>
                  {selectedAccount?._id === acc._id && <div className="text-xs text-blue-500">Active</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appearance */}
      <div className={card + " mb-6"}>
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-4 h-4 text-blue-500" />
          <h2 className={"font-semibold " + text}>Appearance</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTheme("light")}
            className={"p-4 rounded-xl border-2 transition-all flex items-center gap-3 " + (
              isLight ? "border-blue-500 bg-blue-50" : "border-white/10 hover:border-white/20"
            )}
          >
            <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + (isLight ? "bg-blue-500" : "bg-white/10")}>
              <Sun className={"w-4 h-4 " + (isLight ? "text-white" : "text-white/50")} />
            </div>
            <div className="text-left">
              <div className={"text-sm font-medium " + text}>Light Mode</div>
              <div className={"text-xs " + muted}>Clean & bright</div>
            </div>
            {isLight && <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto" />}
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={"p-4 rounded-xl border-2 transition-all flex items-center gap-3 " + (
              !isLight ? "border-blue-500 bg-blue-500/10" : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + (!isLight ? "bg-blue-500" : "bg-gray-100")}>
              <Moon className={"w-4 h-4 " + (!isLight ? "text-white" : "text-gray-400")} />
            </div>
            <div className="text-left">
              <div className={"text-sm font-medium " + text}>Dark Mode</div>
              <div className={"text-xs " + muted}>Easy on eyes</div>
            </div>
            {!isLight && <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto" />}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className={card + " mb-6"}>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-4 h-4 text-blue-500" />
          <h2 className={"font-semibold " + text}>Notifications</h2>
        </div>
        <div className="space-y-0">
          {[
            { key: "budgetAlerts", label: "Budget Alerts", desc: "Get notified when you hit 80% of any budget" },
            { key: "monthlyReport", label: "Monthly Report", desc: "Receive your monthly financial summary" },
            { key: "recurringReminders", label: "Recurring Reminders", desc: "Get reminded before recurring transactions" },
          ].map((item) => (
            <div key={item.key} className={rowCls}>
              <div>
                <div className={"text-sm font-medium " + text}>{item.label}</div>
                <div className={"text-xs " + muted}>{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={"relative w-11 h-6 rounded-full transition-colors " + (
                  notifications[item.key as keyof typeof notifications] ? "bg-blue-500" : isLight ? "bg-gray-200" : "bg-white/20"
                )}
              >
                <div className={"absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform " + (
                  notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          ))}
        </div>
        <Button onClick={handleSave} className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
          {saved ? <><CheckCircle2 className="w-4 h-4 mr-2" />Saved!</> : "Save Preferences"}
        </Button>
      </div>

      {/* Security */}
      <div className={card + " mb-6"}>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-4 h-4 text-blue-500" />
          <h2 className={"font-semibold " + text}>Security</h2>
        </div>
        <div className="space-y-0">
          {[
            { label: "Two-Factor Authentication", desc: "Add an extra layer of security", action: "Configure" },
            { label: "Active Sessions", desc: "Manage your login sessions", action: "View" },
            { label: "Connected Accounts", desc: "Google and other providers", action: "Manage" },
          ].map((item, i) => (
            <div key={i} className={rowCls}>
              <div>
                <div className={"text-sm font-medium " + text}>{item.label}</div>
                <div className={"text-xs " + muted}>{item.desc}</div>
              </div>
              <button
                onClick={() => openUserProfile()}
                className="flex items-center gap-1 text-blue-500 text-xs hover:underline"
              >
                {item.action}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className={"rounded-2xl border p-6 " + (isLight ? "border-red-100 bg-red-50" : "border-red-500/20 bg-red-500/5")}>
        <h2 className="font-semibold text-red-500 mb-4 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </h2>
        <div className={"flex items-center justify-between py-3 border-b " + (isLight ? "border-red-100" : "border-red-500/10")}>
          <div>
            <div className={"text-sm font-medium " + text}>Sign Out</div>
            <div className={"text-xs " + muted}>Sign out from all devices</div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <div className={"text-sm font-medium " + text}>Delete Account</div>
            <div className={"text-xs " + muted}>Permanently delete your account and all data</div>
          </div>
          <Button
            variant="outline"
            className="border-red-200 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => openUserProfile()}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
