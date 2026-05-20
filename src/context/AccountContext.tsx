"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrencySymbol } from "@/lib/currencies";

interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  currencySymbol: string;
  color: string;
  icon: string;
  isDefault: boolean;
}

interface AccountContextType {
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account) => void;
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  currencySymbol: string;
}

const AccountContext = createContext<AccountContextType>({
  selectedAccount: null,
  setSelectedAccount: () => {},
  accounts: [],
  setAccounts: () => {},
  currencySymbol: "₹",
});

export function AccountProvider({ children }: { children: ReactNode }) {
  const [selectedAccount, setSelectedAccountState] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedAccount");
    if (saved) setSelectedAccountState(JSON.parse(saved));
  }, []);

  const setSelectedAccount = (account: Account) => {
    setSelectedAccountState(account);
    localStorage.setItem("selectedAccount", JSON.stringify(account));
  };

  const currencySymbol = selectedAccount?.currencySymbol ||
    getCurrencySymbol(selectedAccount?.currency || "INR");

  return (
    <AccountContext.Provider value={{
      selectedAccount, setSelectedAccount,
      accounts, setAccounts, currencySymbol,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export const useAccount = () => useContext(AccountContext);
