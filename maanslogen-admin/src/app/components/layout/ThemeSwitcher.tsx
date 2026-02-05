"use client";

import { useCallback, useEffect, useState } from "react";

const THEMES = [
  { id: "", label: "Standard" },
  { id: "dark", label: "Mørk" },
  { id: "liquidglass", label: "Liquid Glass" },
  { id: "darkliquidglass", label: "Dark Liquid Glass" },
] as const;

const STORAGE_KEY = "maanslogen-admin-theme";

export function ThemeSwitcher() {
  const [theme, setThemeState] = useState<string>("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const initial = (stored as string) ?? "";
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const setTheme = useCallback((id: string) => {
    setThemeState(id);
    document.documentElement.setAttribute("data-theme", id);
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted text-xs font-medium">Tema</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="rounded-theme border-theme bg-elevated text-foreground shadow-theme-sm border px-2 py-1.5 text-sm focus:ring-2 focus:ring-[rgb(var(--color-accent))]"
        aria-label="Vælg tema"
      >
        {THEMES.map((t) => (
          <option key={t.id || "default"} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
