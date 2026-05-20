import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { AccountProvider } from "@/context/AccountContext";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinSight AI — Your Money, Finally Thinking For Itself",
  description:
    "AI-powered finance management. Scan receipts, track budgets, get insights, and chat with your personal CFO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="finsight-theme"
          >
            <AccountProvider>
              {children}
              <Toaster />
            </AccountProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
