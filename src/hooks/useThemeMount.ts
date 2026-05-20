"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function useThemeMount() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme,
    setTheme,
    mounted,
    isLight: mounted ? theme === "light" : true,
  };
}
