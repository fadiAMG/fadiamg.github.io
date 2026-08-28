"use client";

import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Switch colour theme"
      className="inline-flex min-h-11 items-center border border-hair px-3 font-mono text-[10px] font-light text-dim uppercase transition-colors hover:border-ink2 hover:text-ink2"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
